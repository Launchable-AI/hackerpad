// HACKERPAD - Hackerpunk Canvas Application
// =============================================

class HackerPad {
  constructor() {
    // Canvas setup
    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.container = document.getElementById('canvas-container');

    // State
    this.objects = [];
    this.selectedObjects = [];
    this.currentTool = 'select';
    this.isDrawing = false;
    this.isPanning = false;
    this.isDragging = false;
    this.isResizing = false;

    // Transform state
    this.scale = 1;
    this.offsetX = 0;
    this.offsetY = 0;
    this.minScale = 0.1;
    this.maxScale = 5;

    // Drawing state
    this.currentPath = [];
    this.startX = 0;
    this.startY = 0;
    this.lastX = 0;
    this.lastY = 0;

    // History for undo/redo
    this.history = [];
    this.historyIndex = -1;
    this.maxHistory = 50;

    // Properties
    this.strokeColor = '#00ff9d';
    this.fillColor = '#0a0a0f';
    this.fillEnabled = false;
    this.strokeWidth = 2;
    this.fontSize = 24;
    this.opacity = 100;

    // Object ID counter
    this.objectIdCounter = 0;

    // Initialize
    this.init();
  }

  init() {
    this.setupCanvas();
    this.bindEvents();
    this.bindToolbar();
    this.bindProperties();
    this.bindKeyboard();
    this.saveState();
    this.render();

    console.log('%c[HACKERPAD] System initialized', 'color: #00ff9d');
  }

  setupCanvas() {
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  resizeCanvas() {
    const rect = this.container.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
    this.render();
  }

  // ============================================
  // COORDINATE TRANSFORMATIONS
  // ============================================

  screenToCanvas(x, y) {
    return {
      x: (x - this.offsetX) / this.scale,
      y: (y - this.offsetY) / this.scale
    };
  }

  canvasToScreen(x, y) {
    return {
      x: x * this.scale + this.offsetX,
      y: y * this.scale + this.offsetY
    };
  }

  // ============================================
  // EVENT BINDINGS
  // ============================================

  bindEvents() {
    // Mouse events
    this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
    this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
    this.canvas.addEventListener('mouseup', (e) => this.onMouseUp(e));
    this.canvas.addEventListener('mouseleave', (e) => this.onMouseUp(e));

    // Wheel for zoom
    this.canvas.addEventListener('wheel', (e) => this.onWheel(e), { passive: false });

    // Text input
    const textInput = document.getElementById('text-input');
    textInput.addEventListener('blur', () => this.finalizeText());
    textInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        textInput.style.display = 'none';
        textInput.value = '';
      }
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.finalizeText();
      }
    });

    // Image input
    document.getElementById('imageInput').addEventListener('change', (e) => this.handleImageUpload(e));
    document.getElementById('loadInput').addEventListener('change', (e) => this.handleLoad(e));
  }

  bindToolbar() {
    // Tool buttons
    document.querySelectorAll('.tool-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentTool = btn.dataset.tool;
        this.updateStatus();

        if (this.currentTool === 'image') {
          document.getElementById('imageInput').click();
        }
      });
    });

    // Action buttons
    document.getElementById('undoBtn').addEventListener('click', () => this.undo());
    document.getElementById('redoBtn').addEventListener('click', () => this.redo());
    document.getElementById('clearBtn').addEventListener('click', () => this.clearAll());
    document.getElementById('saveBtn').addEventListener('click', () => this.save());
    document.getElementById('loadBtn').addEventListener('click', () => {
      document.getElementById('loadInput').click();
    });

    // Zoom buttons
    document.getElementById('zoomIn').addEventListener('click', () => this.zoom(1.2));
    document.getElementById('zoomOut').addEventListener('click', () => this.zoom(0.8));
    document.getElementById('zoomReset').addEventListener('click', () => this.resetZoom());
  }

  bindProperties() {
    document.getElementById('strokeColor').addEventListener('input', (e) => {
      this.strokeColor = e.target.value;
      this.updateSelectedObjects('strokeColor', this.strokeColor);
    });

    document.getElementById('fillColor').addEventListener('input', (e) => {
      this.fillColor = e.target.value;
      this.updateSelectedObjects('fillColor', this.fillColor);
    });

    document.getElementById('fillEnabled').addEventListener('change', (e) => {
      this.fillEnabled = e.target.checked;
      this.updateSelectedObjects('fillEnabled', this.fillEnabled);
    });

    document.getElementById('strokeWidth').addEventListener('input', (e) => {
      this.strokeWidth = parseInt(e.target.value) || 2;
      this.updateSelectedObjects('strokeWidth', this.strokeWidth);
    });

    document.getElementById('fontSize').addEventListener('input', (e) => {
      this.fontSize = parseInt(e.target.value) || 24;
      this.updateSelectedObjects('fontSize', this.fontSize);
    });

    document.getElementById('opacity').addEventListener('input', (e) => {
      this.opacity = parseInt(e.target.value);
      this.updateSelectedObjects('opacity', this.opacity);
    });
  }

  bindKeyboard() {
    document.addEventListener('keydown', (e) => {
      // Don't intercept if typing in text input
      if (e.target.id === 'text-input') return;

      // Tool shortcuts
      if (!e.ctrlKey && !e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'v': this.selectTool('select'); break;
          case 'h': this.selectTool('pan'); break;
          case 'd': this.selectTool('draw'); break;
          case 'l': this.selectTool('line'); break;
          case 'r': this.selectTool('rect'); break;
          case 'e': this.selectTool('ellipse'); break;
          case 't': this.selectTool('text'); break;
          case 'i': this.selectTool('image'); break;
          case 'delete':
          case 'backspace':
            this.deleteSelected();
            break;
          case 'escape':
            this.deselectAll();
            break;
        }
      }

      // Ctrl/Cmd shortcuts
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'z':
            e.preventDefault();
            if (e.shiftKey) {
              this.redo();
            } else {
              this.undo();
            }
            break;
          case 'y':
            e.preventDefault();
            this.redo();
            break;
          case 's':
            e.preventDefault();
            this.save();
            break;
          case 'a':
            e.preventDefault();
            this.selectAll();
            break;
        }
      }
    });
  }

  selectTool(tool) {
    document.querySelectorAll('.tool-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tool === tool);
    });
    this.currentTool = tool;
    this.updateStatus();

    if (tool === 'image') {
      document.getElementById('imageInput').click();
    }
  }

  // ============================================
  // MOUSE HANDLERS
  // ============================================

  onMouseDown(e) {
    const rect = this.canvas.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    const { x, y } = this.screenToCanvas(screenX, screenY);

    this.startX = x;
    this.startY = y;
    this.lastX = screenX;
    this.lastY = screenY;

    // Auto-switch to drag mode when clicking on an image
    if (this.currentTool !== 'select' && this.currentTool !== 'pan') {
      const clickedObject = this.findObjectAt(x, y);
      if (clickedObject && clickedObject.type === 'image') {
        this.selectTool('select');
        this.handleSelectDown(x, y, e);
        return;
      }
    }

    switch (this.currentTool) {
      case 'select':
        this.handleSelectDown(x, y, e);
        break;
      case 'pan':
        this.isPanning = true;
        this.canvas.style.cursor = 'grabbing';
        break;
      case 'draw':
        this.isDrawing = true;
        this.currentPath = [{ x, y }];
        break;
      case 'line':
      case 'rect':
      case 'ellipse':
        this.isDrawing = true;
        break;
      case 'text':
        this.showTextInput(screenX, screenY, x, y);
        break;
    }
  }

  onMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    const { x, y } = this.screenToCanvas(screenX, screenY);

    // Update coordinates display
    document.getElementById('mouseX').textContent = `X: ${Math.round(x)}`;
    document.getElementById('mouseY').textContent = `Y: ${Math.round(y)}`;

    if (this.isPanning) {
      const dx = screenX - this.lastX;
      const dy = screenY - this.lastY;
      this.offsetX += dx;
      this.offsetY += dy;
      this.lastX = screenX;
      this.lastY = screenY;
      this.render();
      return;
    }

    if (this.isDragging && this.selectedObjects.length > 0) {
      const dx = x - this.startX;
      const dy = y - this.startY;

      this.selectedObjects.forEach(obj => {
        obj.x = (obj._dragStartX || obj.x) + dx;
        obj.y = (obj._dragStartY || obj.y) + dy;
      });

      this.render();
      return;
    }

    if (this.isDrawing) {
      switch (this.currentTool) {
        case 'draw':
          this.currentPath.push({ x, y });
          break;
      }
      this.render();
      this.drawPreview(x, y);
    }
  }

  onMouseUp(e) {
    const rect = this.canvas.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    const { x, y } = this.screenToCanvas(screenX, screenY);

    if (this.isPanning) {
      this.isPanning = false;
      this.canvas.style.cursor = 'crosshair';
      return;
    }

    if (this.isDragging) {
      this.isDragging = false;
      this.selectedObjects.forEach(obj => {
        delete obj._dragStartX;
        delete obj._dragStartY;
      });
      this.saveState();
      this.render();
      return;
    }

    if (this.isDrawing) {
      this.isDrawing = false;

      switch (this.currentTool) {
        case 'draw':
          if (this.currentPath.length > 1) {
            this.addObject({
              type: 'path',
              points: [...this.currentPath],
              strokeColor: this.strokeColor,
              strokeWidth: this.strokeWidth,
              opacity: this.opacity
            });
          }
          this.currentPath = [];
          break;

        case 'line':
          if (Math.abs(x - this.startX) > 2 || Math.abs(y - this.startY) > 2) {
            this.addObject({
              type: 'line',
              x: this.startX,
              y: this.startY,
              x2: x,
              y2: y,
              strokeColor: this.strokeColor,
              strokeWidth: this.strokeWidth,
              opacity: this.opacity
            });
          }
          break;

        case 'rect':
          const rw = x - this.startX;
          const rh = y - this.startY;
          if (Math.abs(rw) > 2 && Math.abs(rh) > 2) {
            this.addObject({
              type: 'rect',
              x: rw > 0 ? this.startX : x,
              y: rh > 0 ? this.startY : y,
              width: Math.abs(rw),
              height: Math.abs(rh),
              strokeColor: this.strokeColor,
              fillColor: this.fillColor,
              fillEnabled: this.fillEnabled,
              strokeWidth: this.strokeWidth,
              opacity: this.opacity
            });
          }
          break;

        case 'ellipse':
          const ew = x - this.startX;
          const eh = y - this.startY;
          if (Math.abs(ew) > 2 && Math.abs(eh) > 2) {
            this.addObject({
              type: 'ellipse',
              x: this.startX + ew / 2,
              y: this.startY + eh / 2,
              radiusX: Math.abs(ew / 2),
              radiusY: Math.abs(eh / 2),
              strokeColor: this.strokeColor,
              fillColor: this.fillColor,
              fillEnabled: this.fillEnabled,
              strokeWidth: this.strokeWidth,
              opacity: this.opacity
            });
          }
          break;
      }

      this.render();
    }
  }

  onWheel(e) {
    e.preventDefault();

    const rect = this.canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.min(Math.max(this.scale * zoomFactor, this.minScale), this.maxScale);

    // Zoom towards mouse position
    const scaleDiff = newScale / this.scale;
    this.offsetX = mouseX - (mouseX - this.offsetX) * scaleDiff;
    this.offsetY = mouseY - (mouseY - this.offsetY) * scaleDiff;
    this.scale = newScale;

    this.updateZoomDisplay();
    this.render();
  }

  // ============================================
  // SELECTION
  // ============================================

  handleSelectDown(x, y, e) {
    const clickedObject = this.findObjectAt(x, y);

    if (clickedObject) {
      if (!e.shiftKey && !this.selectedObjects.includes(clickedObject)) {
        this.deselectAll();
      }

      if (!this.selectedObjects.includes(clickedObject)) {
        this.selectedObjects.push(clickedObject);
      }

      // Start dragging
      this.isDragging = true;
      this.selectedObjects.forEach(obj => {
        obj._dragStartX = obj.x;
        obj._dragStartY = obj.y;
      });
    } else {
      if (!e.shiftKey) {
        this.deselectAll();
      }
    }

    this.updateStatus();
    this.updateLayers();
    this.render();
  }

  findObjectAt(x, y) {
    // Search from top to bottom (last added = top)
    for (let i = this.objects.length - 1; i >= 0; i--) {
      const obj = this.objects[i];
      if (this.isPointInObject(x, y, obj)) {
        return obj;
      }
    }
    return null;
  }

  isPointInObject(x, y, obj) {
    const margin = 10 / this.scale;

    switch (obj.type) {
      case 'rect':
        return x >= obj.x - margin && x <= obj.x + obj.width + margin &&
               y >= obj.y - margin && y <= obj.y + obj.height + margin;

      case 'ellipse':
        const dx = (x - obj.x) / obj.radiusX;
        const dy = (y - obj.y) / obj.radiusY;
        return (dx * dx + dy * dy) <= 1.5;

      case 'line':
        return this.pointToLineDistance(x, y, obj.x, obj.y, obj.x2, obj.y2) < margin;

      case 'path':
        for (let i = 1; i < obj.points.length; i++) {
          const p1 = obj.points[i - 1];
          const p2 = obj.points[i];
          if (this.pointToLineDistance(x, y, p1.x, p1.y, p2.x, p2.y) < margin) {
            return true;
          }
        }
        return false;

      case 'text':
        const textWidth = obj.text.length * obj.fontSize * 0.6;
        const textHeight = obj.fontSize;
        return x >= obj.x - margin && x <= obj.x + textWidth + margin &&
               y >= obj.y - textHeight - margin && y <= obj.y + margin;

      case 'image':
        return x >= obj.x - margin && x <= obj.x + obj.width + margin &&
               y >= obj.y - margin && y <= obj.y + obj.height + margin;

      default:
        return false;
    }
  }

  pointToLineDistance(px, py, x1, y1, x2, y2) {
    const A = px - x1;
    const B = py - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = lenSq !== 0 ? dot / lenSq : -1;

    let xx, yy;
    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }

    return Math.sqrt((px - xx) ** 2 + (py - yy) ** 2);
  }

  selectAll() {
    this.selectedObjects = [...this.objects];
    this.updateStatus();
    this.updateLayers();
    this.render();
  }

  deselectAll() {
    this.selectedObjects = [];
    this.updateStatus();
    this.updateLayers();
    this.render();
  }

  deleteSelected() {
    if (this.selectedObjects.length === 0) return;

    this.objects = this.objects.filter(obj => !this.selectedObjects.includes(obj));
    this.selectedObjects = [];
    this.saveState();
    this.updateStatus();
    this.updateLayers();
    this.render();
  }

  updateSelectedObjects(property, value) {
    this.selectedObjects.forEach(obj => {
      obj[property] = value;
    });
    if (this.selectedObjects.length > 0) {
      this.saveState();
    }
    this.render();
  }

  // ============================================
  // OBJECT MANAGEMENT
  // ============================================

  addObject(obj) {
    obj.id = ++this.objectIdCounter;
    this.objects.push(obj);
    this.saveState();
    this.updateStatus();
    this.updateLayers();
  }

  // ============================================
  // TEXT TOOL
  // ============================================

  showTextInput(screenX, screenY, canvasX, canvasY) {
    const textInput = document.getElementById('text-input');
    const containerRect = this.container.getBoundingClientRect();

    textInput.style.display = 'block';
    textInput.style.left = (screenX) + 'px';
    textInput.style.top = (screenY) + 'px';
    textInput.style.fontSize = (this.fontSize * this.scale) + 'px';
    textInput.style.color = this.strokeColor;
    textInput.value = '';
    textInput.dataset.canvasX = canvasX;
    textInput.dataset.canvasY = canvasY;

    // Small delay to ensure focus works
    setTimeout(() => textInput.focus(), 10);
  }

  finalizeText() {
    const textInput = document.getElementById('text-input');
    const text = textInput.value.trim();

    if (text) {
      this.addObject({
        type: 'text',
        x: parseFloat(textInput.dataset.canvasX),
        y: parseFloat(textInput.dataset.canvasY),
        text: text,
        fontSize: this.fontSize,
        strokeColor: this.strokeColor,
        opacity: this.opacity
      });
      this.render();
    }

    textInput.style.display = 'none';
    textInput.value = '';
  }

  // ============================================
  // IMAGE HANDLING (Browser-based, no server upload)
  // ============================================

  handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      console.error('Invalid file type');
      return;
    }

    // Limit file size (10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('Image too large. Max size: 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      this.loadImage(event.target.result);
    };
    reader.readAsDataURL(file);

    e.target.value = '';
  }

  loadImage(dataUrl) {
    const img = new Image();
    img.onload = () => {
      // Calculate position (center of visible canvas)
      const centerX = (this.canvas.width / 2 - this.offsetX) / this.scale;
      const centerY = (this.canvas.height / 2 - this.offsetY) / this.scale;

      // Scale image if too large
      let width = img.width;
      let height = img.height;
      const maxSize = 400;

      if (width > maxSize || height > maxSize) {
        const ratio = Math.min(maxSize / width, maxSize / height);
        width *= ratio;
        height *= ratio;
      }

      this.addObject({
        type: 'image',
        x: centerX - width / 2,
        y: centerY - height / 2,
        width: width,
        height: height,
        src: dataUrl,
        imageElement: img,
        opacity: this.opacity
      });

      this.render();
    };
    img.src = dataUrl;
  }

  // ============================================
  // RENDERING
  // ============================================

  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.save();
    ctx.translate(this.offsetX, this.offsetY);
    ctx.scale(this.scale, this.scale);

    // Draw all objects
    this.objects.forEach(obj => this.drawObject(obj));

    // Draw selection indicators
    this.selectedObjects.forEach(obj => this.drawSelectionIndicator(obj));

    ctx.restore();
  }

  drawObject(obj) {
    const ctx = this.ctx;
    ctx.save();
    ctx.globalAlpha = (obj.opacity || 100) / 100;

    switch (obj.type) {
      case 'path':
        this.drawPath(obj);
        break;
      case 'line':
        this.drawLine(obj);
        break;
      case 'rect':
        this.drawRect(obj);
        break;
      case 'ellipse':
        this.drawEllipse(obj);
        break;
      case 'text':
        this.drawText(obj);
        break;
      case 'image':
        this.drawImage(obj);
        break;
    }

    ctx.restore();
  }

  drawPath(obj) {
    const ctx = this.ctx;
    if (obj.points.length < 2) return;

    ctx.beginPath();
    ctx.moveTo(obj.points[0].x, obj.points[0].y);

    for (let i = 1; i < obj.points.length; i++) {
      ctx.lineTo(obj.points[i].x, obj.points[i].y);
    }

    ctx.strokeStyle = obj.strokeColor;
    ctx.lineWidth = obj.strokeWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  }

  drawLine(obj) {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.moveTo(obj.x, obj.y);
    ctx.lineTo(obj.x2, obj.y2);
    ctx.strokeStyle = obj.strokeColor;
    ctx.lineWidth = obj.strokeWidth;
    ctx.lineCap = 'round';
    ctx.stroke();
  }

  drawRect(obj) {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.rect(obj.x, obj.y, obj.width, obj.height);

    if (obj.fillEnabled) {
      ctx.fillStyle = obj.fillColor;
      ctx.fill();
    }

    ctx.strokeStyle = obj.strokeColor;
    ctx.lineWidth = obj.strokeWidth;
    ctx.stroke();
  }

  drawEllipse(obj) {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.ellipse(obj.x, obj.y, obj.radiusX, obj.radiusY, 0, 0, Math.PI * 2);

    if (obj.fillEnabled) {
      ctx.fillStyle = obj.fillColor;
      ctx.fill();
    }

    ctx.strokeStyle = obj.strokeColor;
    ctx.lineWidth = obj.strokeWidth;
    ctx.stroke();
  }

  drawText(obj) {
    const ctx = this.ctx;
    ctx.font = `${obj.fontSize}px 'Share Tech Mono', monospace`;
    ctx.fillStyle = obj.strokeColor;
    ctx.textBaseline = 'top';

    // Draw with slight glow effect
    ctx.shadowColor = obj.strokeColor;
    ctx.shadowBlur = 4;
    ctx.fillText(obj.text, obj.x, obj.y);
    ctx.shadowBlur = 0;
  }

  drawImage(obj) {
    const ctx = this.ctx;
    if (obj.imageElement) {
      ctx.drawImage(obj.imageElement, obj.x, obj.y, obj.width, obj.height);
    }
  }

  drawSelectionIndicator(obj) {
    const ctx = this.ctx;
    ctx.save();

    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 2 / this.scale;
    ctx.setLineDash([5 / this.scale, 5 / this.scale]);

    const bounds = this.getObjectBounds(obj);
    const padding = 5 / this.scale;

    ctx.strokeRect(
      bounds.x - padding,
      bounds.y - padding,
      bounds.width + padding * 2,
      bounds.height + padding * 2
    );

    // Draw resize handles
    ctx.setLineDash([]);
    ctx.fillStyle = '#00ff9d';
    const handleSize = 8 / this.scale;

    const handles = [
      { x: bounds.x - padding, y: bounds.y - padding },
      { x: bounds.x + bounds.width + padding, y: bounds.y - padding },
      { x: bounds.x - padding, y: bounds.y + bounds.height + padding },
      { x: bounds.x + bounds.width + padding, y: bounds.y + bounds.height + padding }
    ];

    handles.forEach(h => {
      ctx.fillRect(h.x - handleSize / 2, h.y - handleSize / 2, handleSize, handleSize);
    });

    ctx.restore();
  }

  getObjectBounds(obj) {
    switch (obj.type) {
      case 'rect':
        return { x: obj.x, y: obj.y, width: obj.width, height: obj.height };

      case 'ellipse':
        return {
          x: obj.x - obj.radiusX,
          y: obj.y - obj.radiusY,
          width: obj.radiusX * 2,
          height: obj.radiusY * 2
        };

      case 'line':
        return {
          x: Math.min(obj.x, obj.x2),
          y: Math.min(obj.y, obj.y2),
          width: Math.abs(obj.x2 - obj.x),
          height: Math.abs(obj.y2 - obj.y)
        };

      case 'path':
        if (obj.points.length === 0) return { x: 0, y: 0, width: 0, height: 0 };
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        obj.points.forEach(p => {
          minX = Math.min(minX, p.x);
          minY = Math.min(minY, p.y);
          maxX = Math.max(maxX, p.x);
          maxY = Math.max(maxY, p.y);
        });
        return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };

      case 'text':
        const textWidth = obj.text.length * obj.fontSize * 0.6;
        return { x: obj.x, y: obj.y, width: textWidth, height: obj.fontSize };

      case 'image':
        return { x: obj.x, y: obj.y, width: obj.width, height: obj.height };

      default:
        return { x: obj.x || 0, y: obj.y || 0, width: 100, height: 100 };
    }
  }

  drawPreview(x, y) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(this.offsetX, this.offsetY);
    ctx.scale(this.scale, this.scale);

    ctx.strokeStyle = this.strokeColor;
    ctx.lineWidth = this.strokeWidth;
    ctx.setLineDash([5, 5]);
    ctx.globalAlpha = 0.6;

    switch (this.currentTool) {
      case 'draw':
        if (this.currentPath.length > 1) {
          ctx.beginPath();
          ctx.moveTo(this.currentPath[0].x, this.currentPath[0].y);
          for (let i = 1; i < this.currentPath.length; i++) {
            ctx.lineTo(this.currentPath[i].x, this.currentPath[i].y);
          }
          ctx.stroke();
        }
        break;

      case 'line':
        ctx.beginPath();
        ctx.moveTo(this.startX, this.startY);
        ctx.lineTo(x, y);
        ctx.stroke();
        break;

      case 'rect':
        ctx.strokeRect(this.startX, this.startY, x - this.startX, y - this.startY);
        break;

      case 'ellipse':
        const rx = Math.abs(x - this.startX) / 2;
        const ry = Math.abs(y - this.startY) / 2;
        const cx = this.startX + (x - this.startX) / 2;
        const cy = this.startY + (y - this.startY) / 2;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        ctx.stroke();
        break;
    }

    ctx.restore();
  }

  // ============================================
  // ZOOM
  // ============================================

  zoom(factor) {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;

    const newScale = Math.min(Math.max(this.scale * factor, this.minScale), this.maxScale);
    const scaleDiff = newScale / this.scale;

    this.offsetX = centerX - (centerX - this.offsetX) * scaleDiff;
    this.offsetY = centerY - (centerY - this.offsetY) * scaleDiff;
    this.scale = newScale;

    this.updateZoomDisplay();
    this.render();
  }

  resetZoom() {
    this.scale = 1;
    this.offsetX = 0;
    this.offsetY = 0;
    this.updateZoomDisplay();
    this.render();
  }

  updateZoomDisplay() {
    document.getElementById('zoomLevel').textContent = Math.round(this.scale * 100) + '%';
  }

  // ============================================
  // HISTORY (UNDO/REDO)
  // ============================================

  saveState() {
    // Remove any future states if we're not at the end
    this.history = this.history.slice(0, this.historyIndex + 1);

    // Clone objects (excluding image elements)
    const state = this.objects.map(obj => {
      const clone = { ...obj };
      if (clone.type === 'image') {
        delete clone.imageElement;
      }
      if (clone.type === 'path') {
        clone.points = [...obj.points];
      }
      return clone;
    });

    this.history.push(JSON.stringify(state));
    this.historyIndex++;

    // Limit history size
    if (this.history.length > this.maxHistory) {
      this.history.shift();
      this.historyIndex--;
    }
  }

  undo() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      this.restoreState();
    }
  }

  redo() {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      this.restoreState();
    }
  }

  restoreState() {
    const state = JSON.parse(this.history[this.historyIndex]);

    // Restore objects and reload images
    this.objects = state.map(obj => {
      if (obj.type === 'image' && obj.src) {
        const img = new Image();
        img.src = obj.src;
        obj.imageElement = img;
      }
      return obj;
    });

    this.selectedObjects = [];
    this.updateStatus();
    this.updateLayers();
    this.render();
  }

  // ============================================
  // SAVE/LOAD
  // ============================================

  save() {
    const data = {
      version: '1.0',
      objects: this.objects.map(obj => {
        const clone = { ...obj };
        if (clone.type === 'image') {
          delete clone.imageElement;
        }
        return clone;
      })
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hackerpad-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    console.log('%c[SAVE] Canvas exported successfully', 'color: #00ff9d');
  }

  handleLoad(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        this.loadData(data);
      } catch (err) {
        console.error('Failed to load file:', err);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  loadData(data) {
    if (!data.objects) return;

    this.objects = data.objects.map(obj => {
      if (obj.type === 'image' && obj.src) {
        const img = new Image();
        img.onload = () => this.render();
        img.src = obj.src;
        obj.imageElement = img;
      }
      return obj;
    });

    this.selectedObjects = [];
    this.saveState();
    this.updateStatus();
    this.updateLayers();
    this.render();

    console.log('%c[LOAD] Canvas loaded successfully', 'color: #00ff9d');
  }

  clearAll() {
    if (this.objects.length === 0) return;

    if (confirm('⚠ CLEAR ALL OBJECTS?')) {
      this.objects = [];
      this.selectedObjects = [];
      this.saveState();
      this.updateStatus();
      this.updateLayers();
      this.render();
    }
  }

  // ============================================
  // UI UPDATES
  // ============================================

  updateStatus() {
    document.getElementById('status-tool').textContent = `TOOL: ${this.currentTool.toUpperCase()}`;
    document.getElementById('status-objects').textContent = `OBJECTS: ${this.objects.length}`;
    document.getElementById('status-selected').textContent = `SELECTED: ${this.selectedObjects.length}`;
  }

  updateLayers() {
    const layersList = document.getElementById('layers-list');
    layersList.innerHTML = '';

    const icons = {
      path: '✎',
      line: '╱',
      rect: '▢',
      ellipse: '◯',
      text: 'A',
      image: '⌼'
    };

    [...this.objects].reverse().forEach((obj, index) => {
      const item = document.createElement('div');
      item.className = 'layer-item';
      if (this.selectedObjects.includes(obj)) {
        item.classList.add('selected');
      }

      item.innerHTML = `
        <span class="layer-icon">${icons[obj.type] || '?'}</span>
        <span class="layer-name">${obj.type.toUpperCase()} ${obj.id}</span>
      `;

      item.addEventListener('click', (e) => {
        if (!e.shiftKey) {
          this.deselectAll();
        }
        if (!this.selectedObjects.includes(obj)) {
          this.selectedObjects.push(obj);
        }
        this.updateStatus();
        this.updateLayers();
        this.render();
      });

      layersList.appendChild(item);
    });
  }
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
  window.app = new HackerPad();
});
