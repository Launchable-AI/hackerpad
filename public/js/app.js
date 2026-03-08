// HACKERPAD - Hackerpunk Canvas Application
// =============================================

// Theme color map for canvas-rendered elements
const THEME_COLORS = {
  dark: {
    selectionStroke: '#00ffff',
    selectionHandle: '#00ff9d',
    marqueeStroke: '#00ffff',
    marqueeFill: 'rgba(0, 255, 255, 0.08)',
    connectorHighlight: '#00ff9d',
    enteredGroupStroke: '#ff6b00',
    lockIcon: '#ff6b00',
    defaultStroke: '#00ff9d',
    defaultFill: '#0a0a0f',
    defaultGroupFill: '#1a1a2e',
  },
  light: {
    selectionStroke: '#0088aa',
    selectionHandle: '#00995e',
    marqueeStroke: '#0088aa',
    marqueeFill: 'rgba(0, 136, 170, 0.1)',
    connectorHighlight: '#00995e',
    enteredGroupStroke: '#cc5500',
    lockIcon: '#cc5500',
    defaultStroke: '#1a1a2a',
    defaultFill: '#f0f0f5',
    defaultGroupFill: '#e0e0ea',
  }
};

// Pre-built shape library
const SHAPE_LIBRARY = {
  'arrow-right': {
    name: 'Arrow Right', icon: '→', category: 'Arrows',
    defaultWidth: 120, defaultHeight: 60,
    draw(ctx, x, y, w, h) {
      const shaft = h * 0.3;
      ctx.beginPath();
      ctx.moveTo(x, y + (h - shaft) / 2);
      ctx.lineTo(x + w * 0.6, y + (h - shaft) / 2);
      ctx.lineTo(x + w * 0.6, y);
      ctx.lineTo(x + w, y + h / 2);
      ctx.lineTo(x + w * 0.6, y + h);
      ctx.lineTo(x + w * 0.6, y + (h + shaft) / 2);
      ctx.lineTo(x, y + (h + shaft) / 2);
      ctx.closePath();
    }
  },
  'arrow-left': {
    name: 'Arrow Left', icon: '←', category: 'Arrows',
    defaultWidth: 120, defaultHeight: 60,
    draw(ctx, x, y, w, h) {
      const shaft = h * 0.3;
      ctx.beginPath();
      ctx.moveTo(x + w, y + (h - shaft) / 2);
      ctx.lineTo(x + w * 0.4, y + (h - shaft) / 2);
      ctx.lineTo(x + w * 0.4, y);
      ctx.lineTo(x, y + h / 2);
      ctx.lineTo(x + w * 0.4, y + h);
      ctx.lineTo(x + w * 0.4, y + (h + shaft) / 2);
      ctx.lineTo(x + w, y + (h + shaft) / 2);
      ctx.closePath();
    }
  },
  'arrow-bidirectional': {
    name: 'Bidirectional Arrow', icon: '↔', category: 'Arrows',
    defaultWidth: 140, defaultHeight: 60,
    draw(ctx, x, y, w, h) {
      const shaft = h * 0.3;
      const head = w * 0.25;
      ctx.beginPath();
      ctx.moveTo(x, y + h / 2);
      ctx.lineTo(x + head, y);
      ctx.lineTo(x + head, y + (h - shaft) / 2);
      ctx.lineTo(x + w - head, y + (h - shaft) / 2);
      ctx.lineTo(x + w - head, y);
      ctx.lineTo(x + w, y + h / 2);
      ctx.lineTo(x + w - head, y + h);
      ctx.lineTo(x + w - head, y + (h + shaft) / 2);
      ctx.lineTo(x + head, y + (h + shaft) / 2);
      ctx.lineTo(x + head, y + h);
      ctx.closePath();
    }
  },
  'database': {
    name: 'Database', icon: '⛁', category: 'Infrastructure',
    defaultWidth: 80, defaultHeight: 100,
    draw(ctx, x, y, w, h) {
      const ry = h * 0.12;
      // Bottom ellipse
      ctx.beginPath();
      ctx.ellipse(x + w / 2, y + h - ry, w / 2, ry, 0, 0, Math.PI * 2);
      ctx.moveTo(x + w, y + h - ry);
      ctx.lineTo(x + w, y + ry);
      ctx.ellipse(x + w / 2, y + ry, w / 2, ry, 0, 0, Math.PI, true);
      ctx.lineTo(x, y + h - ry);
      // Top ellipse
      ctx.moveTo(x + w, y + ry);
      ctx.ellipse(x + w / 2, y + ry, w / 2, ry, 0, 0, Math.PI * 2);
    }
  },
  'server': {
    name: 'Server', icon: '▦', category: 'Infrastructure',
    defaultWidth: 80, defaultHeight: 110,
    draw(ctx, x, y, w, h) {
      const slotH = h / 3;
      const r = 4;
      for (let i = 0; i < 3; i++) {
        const sy = y + i * slotH;
        ctx.moveTo(x + r, sy);
        ctx.arcTo(x + w, sy, x + w, sy + slotH, r);
        ctx.arcTo(x + w, sy + slotH, x, sy + slotH, r);
        ctx.arcTo(x, sy + slotH, x, sy, r);
        ctx.arcTo(x, sy, x + w, sy, r);
        // Drive indicators
        ctx.moveTo(x + w - 16, sy + slotH / 2 - 3);
        ctx.arc(x + w - 13, sy + slotH / 2, 3, 0, Math.PI * 2);
      }
    }
  },
  'cloud': {
    name: 'Cloud', icon: '☁', category: 'Infrastructure',
    defaultWidth: 120, defaultHeight: 80,
    draw(ctx, x, y, w, h) {
      ctx.beginPath();
      ctx.moveTo(x + w * 0.25, y + h * 0.65);
      ctx.arc(x + w * 0.25, y + h * 0.52, w * 0.18, Math.PI * 0.7, Math.PI * 1.9);
      ctx.arc(x + w * 0.42, y + h * 0.28, w * 0.2, Math.PI * 1.1, Math.PI * 1.85);
      ctx.arc(x + w * 0.65, y + h * 0.25, w * 0.2, Math.PI * 1.2, Math.PI * 0.1);
      ctx.arc(x + w * 0.78, y + h * 0.45, w * 0.17, Math.PI * 1.5, Math.PI * 0.4);
      ctx.lineTo(x + w * 0.25, y + h * 0.65);
      ctx.closePath();
    }
  },
  'terminal': {
    name: 'Terminal', icon: '>_', category: 'Development',
    defaultWidth: 120, defaultHeight: 90,
    draw(ctx, x, y, w, h) {
      const r = 6;
      // Outer rounded rect
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, r);
      // Title bar line
      ctx.moveTo(x, y + h * 0.22);
      ctx.lineTo(x + w, y + h * 0.22);
      // Prompt chevron >_
      ctx.moveTo(x + w * 0.12, y + h * 0.42);
      ctx.lineTo(x + w * 0.28, y + h * 0.55);
      ctx.lineTo(x + w * 0.12, y + h * 0.68);
      // Cursor line
      ctx.moveTo(x + w * 0.35, y + h * 0.68);
      ctx.lineTo(x + w * 0.55, y + h * 0.68);
    }
  },
  'code-brackets': {
    name: 'Code', icon: '{ }', category: 'Development',
    defaultWidth: 100, defaultHeight: 90,
    draw(ctx, x, y, w, h) {
      const r = 6;
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, r);
      // Left bracket {
      ctx.moveTo(x + w * 0.35, y + h * 0.2);
      ctx.quadraticCurveTo(x + w * 0.25, y + h * 0.2, x + w * 0.25, y + h * 0.35);
      ctx.quadraticCurveTo(x + w * 0.25, y + h * 0.45, x + w * 0.18, y + h * 0.5);
      ctx.quadraticCurveTo(x + w * 0.25, y + h * 0.55, x + w * 0.25, y + h * 0.65);
      ctx.quadraticCurveTo(x + w * 0.25, y + h * 0.8, x + w * 0.35, y + h * 0.8);
      // Right bracket }
      ctx.moveTo(x + w * 0.65, y + h * 0.2);
      ctx.quadraticCurveTo(x + w * 0.75, y + h * 0.2, x + w * 0.75, y + h * 0.35);
      ctx.quadraticCurveTo(x + w * 0.75, y + h * 0.45, x + w * 0.82, y + h * 0.5);
      ctx.quadraticCurveTo(x + w * 0.75, y + h * 0.55, x + w * 0.75, y + h * 0.65);
      ctx.quadraticCurveTo(x + w * 0.75, y + h * 0.8, x + w * 0.65, y + h * 0.8);
    }
  },
  'api-box': {
    name: 'API', icon: '⬡', category: 'Development',
    defaultWidth: 100, defaultHeight: 70,
    draw(ctx, x, y, w, h) {
      const r = 6;
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, r);
      // Connection dots on sides
      ctx.moveTo(x - 5, y + h / 2);
      ctx.arc(x, y + h / 2, 5, 0, Math.PI * 2);
      ctx.moveTo(x + w + 5, y + h / 2);
      ctx.arc(x + w, y + h / 2, 5, 0, Math.PI * 2);
    }
  },
  'laptop': {
    name: 'Laptop', icon: '💻', category: 'Devices',
    defaultWidth: 120, defaultHeight: 90,
    draw(ctx, x, y, w, h) {
      const screenH = h * 0.7;
      const r = 4;
      // Screen
      ctx.beginPath();
      ctx.roundRect(x + w * 0.1, y, w * 0.8, screenH, r);
      // Base
      ctx.moveTo(x, y + screenH);
      ctx.lineTo(x + w, y + screenH);
      ctx.lineTo(x + w * 0.95, y + h);
      ctx.lineTo(x + w * 0.05, y + h);
      ctx.closePath();
    }
  },
  'monitor': {
    name: 'Monitor', icon: '🖥', category: 'Devices',
    defaultWidth: 110, defaultHeight: 100,
    draw(ctx, x, y, w, h) {
      const screenH = h * 0.68;
      const r = 4;
      // Screen
      ctx.beginPath();
      ctx.roundRect(x, y, w, screenH, r);
      // Stand
      ctx.moveTo(x + w * 0.38, y + screenH);
      ctx.lineTo(x + w * 0.62, y + screenH);
      ctx.lineTo(x + w * 0.62, y + h * 0.88);
      ctx.lineTo(x + w * 0.38, y + h * 0.88);
      ctx.closePath();
      // Base
      ctx.moveTo(x + w * 0.25, y + h * 0.88);
      ctx.lineTo(x + w * 0.75, y + h * 0.88);
      ctx.lineTo(x + w * 0.75, y + h);
      ctx.lineTo(x + w * 0.25, y + h);
      ctx.closePath();
    }
  },
  'diamond': {
    name: 'Decision', icon: '◇', category: 'Flowchart',
    defaultWidth: 100, defaultHeight: 100,
    draw(ctx, x, y, w, h) {
      ctx.beginPath();
      ctx.moveTo(x + w / 2, y);
      ctx.lineTo(x + w, y + h / 2);
      ctx.lineTo(x + w / 2, y + h);
      ctx.lineTo(x, y + h / 2);
      ctx.closePath();
    }
  },
  'hexagon': {
    name: 'Hexagon', icon: '⬡', category: 'Flowchart',
    defaultWidth: 110, defaultHeight: 100,
    draw(ctx, x, y, w, h) {
      const inset = w * 0.25;
      ctx.beginPath();
      ctx.moveTo(x + inset, y);
      ctx.lineTo(x + w - inset, y);
      ctx.lineTo(x + w, y + h / 2);
      ctx.lineTo(x + w - inset, y + h);
      ctx.lineTo(x + inset, y + h);
      ctx.lineTo(x, y + h / 2);
      ctx.closePath();
    }
  },
  'parallelogram': {
    name: 'I/O', icon: '▱', category: 'Flowchart',
    defaultWidth: 120, defaultHeight: 70,
    draw(ctx, x, y, w, h) {
      const skew = w * 0.2;
      ctx.beginPath();
      ctx.moveTo(x + skew, y);
      ctx.lineTo(x + w, y);
      ctx.lineTo(x + w - skew, y + h);
      ctx.lineTo(x, y + h);
      ctx.closePath();
    }
  }
};

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

    // Color palette (10 slots)
    this.colorPalette = this.loadColorPalette();
    this.paletteTarget = 'stroke'; // 'stroke' or 'fill'

    // Object ID counter
    this.objectIdCounter = 0;

    // Connector state
    this.connectingFrom = null;  // Source object when drawing connector
    this.connectingPreview = null;  // Preview endpoint while dragging

    // Text editing state
    this.editingTextObject = null;  // Text object currently being edited

    // Resize state
    this.isResizing = false;
    this.resizeHandle = null;  // 'nw', 'ne', 'sw', 'se'
    this.resizeObject = null;
    this.resizeStart = null;  // Starting dimensions

    // Internal clipboard for copy/paste of canvas objects
    this.copiedObjects = [];

    // Group editing state
    this.enteredGroup = null;  // Currently "entered" group for editing children

    // Marquee selection state
    this.isMarqueeSelecting = false;
    this.marqueeStart = null;
    this.marqueeCurrent = null;

    // Shape tool state
    this.pendingShapeType = null;
    this.shapePanelVisible = false;

    // Initialize
    this.init();
  }

  // ============================================
  // THEME
  // ============================================

  getThemeColor(key) {
    const theme = document.documentElement.getAttribute('data-theme') || 'dark';
    return THEME_COLORS[theme]?.[key] ?? THEME_COLORS.dark[key];
  }

  initTheme() {
    this.currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';

    // Update default colors to match theme
    this.strokeColor = this.getThemeColor('defaultStroke');
    this.fillColor = this.getThemeColor('defaultFill');
    document.getElementById('strokeColor').value = this.strokeColor;
    document.getElementById('fillColor').value = this.fillColor;

    // Update toggle button icon
    this.updateThemeToggleIcon();

    // Listen for system preference changes (only if user hasn't manually overridden)
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
      if (!localStorage.getItem('hackerpad-theme')) {
        this.setTheme(e.matches ? 'light' : 'dark');
      }
    });
  }

  setTheme(theme) {
    this.currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);

    // Update default colors for new objects
    this.strokeColor = this.getThemeColor('defaultStroke');
    this.fillColor = this.getThemeColor('defaultFill');
    document.getElementById('strokeColor').value = this.strokeColor;
    document.getElementById('fillColor').value = this.fillColor;

    this.updateThemeToggleIcon();
    this.render();
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('hackerpad-theme', newTheme);
    this.setTheme(newTheme);
  }

  updateThemeToggleIcon() {
    const btn = document.getElementById('themeToggleBtn');
    if (btn) {
      btn.textContent = this.currentTheme === 'dark' ? '\u2600' : '\u263D';
      btn.title = this.currentTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
    }
  }

  init() {
    this.initTheme();
    this.setupCanvas();
    this.bindEvents();
    this.bindToolbar();
    this.bindProperties();
    this.bindKeyboard();
    this.bindProjectsDialog();
    this.bindRadialMenu();
    this.bindColorPalette();
    this.bindShapesPanel();
    this.saveState();
    this.render();
    this.initEmbeddedMode();

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
    this.canvas.addEventListener('dblclick', (e) => this.onDoubleClick(e));

    // Prevent middle-click default (auto-scroll)
    this.canvas.addEventListener('auxclick', (e) => {
      if (e.button === 1) e.preventDefault();
    });

    // Wheel for zoom
    this.canvas.addEventListener('wheel', (e) => this.onWheel(e), { passive: false });

    // Clipboard paste
    document.addEventListener('paste', (e) => this.onPaste(e));

    // Text input
    const textInput = document.getElementById('text-input');
    textInput.addEventListener('blur', () => this.finalizeText());
    textInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        textInput.style.display = 'none';
        textInput.value = '';
        textInput.classList.remove('editing-existing');
        this.editingTextObject = null;
        this.render();  // Re-render to show the original text
      }
      // Enter confirms and switches to select tool, Shift+Enter adds newline
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.finalizeText();
        this.selectTool('select');
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
        this.selectTool(btn.dataset.tool);
      });
    });

    // Action buttons
    document.getElementById('undoBtn').addEventListener('click', () => this.undo());
    document.getElementById('redoBtn').addEventListener('click', () => this.redo());
    document.getElementById('clearBtn').addEventListener('click', () => this.clearAll());
    document.getElementById('projectsBtn').addEventListener('click', () => this.showProjectsDialog());
    document.getElementById('saveBtn').addEventListener('click', () => this.save());
    document.getElementById('loadBtn').addEventListener('click', () => {
      document.getElementById('loadInput').click();
    });
    document.getElementById('themeToggleBtn').addEventListener('click', () => this.toggleTheme());

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
      // Don't intercept if typing in any input field
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      // Tool shortcuts
      if (!e.ctrlKey && !e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 's': this.selectTool('select'); break;
          case 'h': this.selectTool('pan'); break;
          case 'd': this.selectTool('draw'); break;
          case 'l': this.selectTool('line'); break;
          case 'r': this.selectTool('rect'); break;
          case 'e': this.selectTool('ellipse'); break;
          case 't': this.selectTool('text'); break;
          case 'i': this.selectTool('image'); break;
          case 'c': this.selectTool('connect'); break;
          case 'p': this.selectTool('shape'); break;
          case 'delete':
          case 'backspace':
            this.deleteSelected();
            break;
          case 'escape':
            if (this.isMarqueeSelecting) {
              this.isMarqueeSelecting = false;
              this.marqueeStart = null;
              this.marqueeCurrent = null;
              this.render();
              break;
            }
            if (this.pendingShapeType) {
              this.pendingShapeType = null;
              this.selectTool('select');
              break;
            }
            if (this.enteredGroup) {
              this.enteredGroup = null;
            }
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
          case 'c':
            this.copySelected();
            break;
          case 'd':
            e.preventDefault();
            this.duplicateSelected();
            break;
          case 'g':
            e.preventDefault();
            if (e.shiftKey) {
              this.ungroupSelected();
            } else {
              this.groupSelected();
            }
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

    // Shape tool: show panel if no pending shape, hide if switching away
    if (tool === 'shape') {
      if (!this.pendingShapeType) {
        this.showShapesPanel();
      }
    } else {
      this.hideShapesPanel();
      this.pendingShapeType = null;
    }

    // Set crosshair cursor when shape is pending
    if (tool === 'shape' && this.pendingShapeType) {
      this.canvas.style.cursor = 'crosshair';
    }
  }

  // ============================================
  // MOUSE HANDLERS
  // ============================================

  onMouseDown(e) {
    // Finalize any active text input before handling canvas click
    const textInput = document.getElementById('text-input');
    if (textInput.style.display === 'block') {
      this.finalizeText();
      // If clicking elsewhere (not creating new text), stop here
      if (this.currentTool !== 'text') {
        return;
      }
    }

    const rect = this.canvas.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    const { x, y } = this.screenToCanvas(screenX, screenY);

    this.startX = x;
    this.startY = y;
    this.lastX = screenX;
    this.lastY = screenY;

    // Middle mouse button always pans
    if (e.button === 1) {
      e.preventDefault();
      this.isPanning = true;
      this.canvas.style.cursor = 'grabbing';
      return;
    }

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
      case 'connect':
        this.handleConnectDown(x, y);
        break;
      case 'shape':
        if (this.pendingShapeType) {
          this.placeShape(x, y);
        } else {
          this.showShapesPanel();
        }
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

    // Update cursor for resize handles
    if (this.currentTool === 'select' && !this.isDragging && !this.isResizing && !this.isPanning && !this.isMarqueeSelecting) {
      const handleHit = this.findResizeHandle(x, y);
      if (handleHit) {
        const cursors = {
          'nw': 'nwse-resize',
          'se': 'nwse-resize',
          'ne': 'nesw-resize',
          'sw': 'nesw-resize'
        };
        this.canvas.style.cursor = cursors[handleHit.handle];
      } else if (this.findObjectAt(x, y)) {
        this.canvas.style.cursor = 'move';
      } else {
        this.canvas.style.cursor = 'crosshair';
      }
    }

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

    if (this.isResizing && this.resizeObject) {
      this.handleResize(x, y);
      return;
    }

    if (this.isDragging && this.selectedObjects.length > 0) {
      const dx = x - this.startX;
      const dy = y - this.startY;

      this.selectedObjects.forEach(obj => this.applyDrag(obj, dx, dy));

      this.render();
      return;
    }

    if (this.isMarqueeSelecting) {
      this.marqueeCurrent = { x, y };
      this.render();
      this.drawMarqueeRect();
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

    // Connector preview
    if (this.connectingFrom) {
      this.connectingPreview = { x, y };
      this.render();
      this.drawConnectorPreview(x, y);
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

    // Finalize connector
    if (this.connectingFrom) {
      this.handleConnectUp(x, y);
      return;
    }

    // Finalize resize
    if (this.isResizing) {
      this.finalizeResize();
      return;
    }

    if (this.isDragging) {
      this.isDragging = false;
      this.selectedObjects.forEach(obj => this.cleanupDrag(obj));
      this.saveState();
      this.render();
      return;
    }

    if (this.isMarqueeSelecting) {
      this.finalizeMarqueeSelection(e);
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

  onDoubleClick(e) {
    const rect = this.canvas.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    const { x, y } = this.screenToCanvas(screenX, screenY);

    const clickedObject = this.findObjectAt(x, y);
    if (!clickedObject) return;

    // Double-click on a group or a child of a selected group: enter the group
    // (locked groups cannot be entered)
    if (this.enteredGroup === null) {
      if (clickedObject.type === 'group' && !clickedObject.locked) {
        this.enteredGroup = clickedObject;
        this.selectedObjects = [];
        this.updateLayers();
        this.render();
        return;
      }
      const parentGroup = this.findGroupForObject(clickedObject);
      if (parentGroup && !parentGroup.locked && this.selectedObjects.includes(parentGroup)) {
        this.enteredGroup = parentGroup;
        this.selectedObjects = [clickedObject];
        this.updateLayers();
        this.render();
        return;
      }
    }

    // If inside a group or no group context, allow text editing
    if (clickedObject.type === 'text') {
      this.editTextObject(clickedObject, screenX, screenY);
    }
  }

  // ============================================
  // CLIPBOARD
  // ============================================

  copySelected() {
    if (this.selectedObjects.length === 0) return;

    // Collect all objects to copy, including children of groups
    const objectsToCopy = [];
    const seenIds = new Set();

    this.selectedObjects.forEach(obj => {
      if (seenIds.has(obj.id)) return;

      if (obj.type === 'group') {
        // Add children first so IDs can be remapped during paste
        const children = this.getGroupChildren(obj);
        children.forEach(child => {
          if (!seenIds.has(child.id)) {
            objectsToCopy.push(child);
            seenIds.add(child.id);
          }
        });
      }

      objectsToCopy.push(obj);
      seenIds.add(obj.id);
    });

    this.copiedObjects = objectsToCopy.map(obj => this.cloneObject(obj));
  }

  cloneObject(obj) {
    const clone = {};
    for (const key of Object.keys(obj)) {
      if (key === 'imageElement') continue; // skip DOM element, recreate on paste
      if (key.startsWith('_')) continue;    // skip temp drag state
      const val = obj[key];
      if (Array.isArray(val)) {
        clone[key] = val.map(item =>
          typeof item === 'object' && item !== null ? { ...item } : item
        );
      } else {
        clone[key] = val;
      }
    }
    return clone;
  }

  pasteObjects() {
    if (this.copiedObjects.length === 0) return;

    const PASTE_OFFSET = 20;
    const pasted = [];
    const idMap = new Map();

    // First pass: paste non-group objects and build old→new ID map
    this.copiedObjects.forEach(source => {
      if (source.type === 'group') return;

      const obj = { ...source };
      const oldId = obj.id;

      // Offset so paste is visually distinct from original
      if (obj.type === 'path' && Array.isArray(obj.points)) {
        obj.points = source.points.map(p => ({ x: p.x + PASTE_OFFSET, y: p.y + PASTE_OFFSET }));
      } else if (obj.type === 'line') {
        obj.x += PASTE_OFFSET;
        obj.y += PASTE_OFFSET;
        obj.x2 += PASTE_OFFSET;
        obj.y2 += PASTE_OFFSET;
      } else if (obj.x !== undefined) {
        obj.x += PASTE_OFFSET;
        obj.y += PASTE_OFFSET;
      }

      // Recreate Image element for image objects
      if (obj.type === 'image' && obj.src) {
        const img = new Image();
        img.src = obj.src;
        obj.imageElement = img;
      }

      this.addObject(obj);
      idMap.set(oldId, obj.id);
      pasted.push(obj);
    });

    // Second pass: paste groups with remapped children, inserted before their children
    this.copiedObjects.forEach(source => {
      if (source.type !== 'group') return;

      const obj = { ...source };
      obj.children = source.children
        .map(childId => idMap.get(childId))
        .filter(id => id !== undefined);

      if (obj.children.length === 0) return;

      // Insert group before its first child
      const firstChildIndex = Math.min(
        ...obj.children.map(id => this.objects.findIndex(o => o.id === id))
      );

      obj.id = ++this.objectIdCounter;
      this.objects.splice(firstChildIndex, 0, obj);
      pasted.push(obj);
    });

    // Select only top-level pasted objects (not children of groups)
    const childIds = new Set();
    pasted.forEach(obj => {
      if (obj.type === 'group') {
        obj.children.forEach(id => childIds.add(id));
      }
    });
    this.selectedObjects = pasted.filter(obj => !childIds.has(obj.id));
    this.copiedObjects = pasted.map(obj => this.cloneObject(obj));
    this.saveState();
    this.updateStatus();
    this.updateLayers();
    this.render();
  }

  duplicateSelected() {
    if (this.selectedObjects.length === 0) return;
    this.copySelected();
    this.pasteObjects();
  }

  onPaste(e) {
    // Don't handle paste if typing in an input field
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    // Check system clipboard for images first
    const items = e.clipboardData && e.clipboardData.items;
    if (items) {
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          e.preventDefault();
          const blob = item.getAsFile();
          if (!blob) continue;

          const reader = new FileReader();
          reader.onload = (event) => {
            this.loadImage(event.target.result);
          };
          reader.readAsDataURL(blob);
          return;
        }
      }
    }

    // Fall back to internal clipboard for canvas objects
    if (this.copiedObjects.length > 0) {
      e.preventDefault();
      this.pasteObjects();
    }
  }

  // ============================================
  // SELECTION
  // ============================================

  handleSelectDown(x, y, e) {
    // Check if clicking on a resize handle of a selected object
    const handleHit = this.findResizeHandle(x, y);
    if (handleHit) {
      this.isResizing = true;
      this.resizeHandle = handleHit.handle;
      this.resizeObject = handleHit.object;

      const obj = handleHit.object;
      const bounds = this.getObjectBounds(obj);

      if (obj.type === 'group') {
        this.resizeStart = {
          x: bounds.x,
          y: bounds.y,
          width: bounds.width,
          height: bounds.height,
          mouseX: x,
          mouseY: y,
          childStarts: this.getGroupChildren(obj).map(child => ({
            id: child.id,
            type: child.type,
            x: child.x,
            y: child.y,
            width: child.width,
            height: child.height,
            radiusX: child.radiusX,
            radiusY: child.radiusY,
            x2: child.x2,
            y2: child.y2,
            fontSize: child.fontSize,
            points: child.type === 'path' ? child.points.map(p => ({...p})) : undefined,
          }))
        };
      } else {
        this.resizeStart = {
          x: obj.x,
          y: obj.y,
          width: bounds.width,
          height: bounds.height,
          mouseX: x,
          mouseY: y,
          fontSize: obj.fontSize || null
        };
      }
      return;
    }

    const clickedObject = this.findObjectAt(x, y);

    if (clickedObject) {
      let objectToSelect = clickedObject;

      // If clicked a child of a group, select the group instead (unless entered)
      if (clickedObject.type !== 'group') {
        const parentGroup = this.findGroupForObject(clickedObject);
        if (parentGroup && parentGroup !== this.enteredGroup) {
          objectToSelect = parentGroup;
        }
      }

      // If entered a group and clicking outside it, exit the group
      if (this.enteredGroup) {
        const isChildOfEntered = this.enteredGroup.children.includes(clickedObject.id);
        const isTheGroup = clickedObject === this.enteredGroup;
        if (!isChildOfEntered && !isTheGroup) {
          this.enteredGroup = null;
          // Re-evaluate: the clicked object might be in another group
          if (clickedObject.type !== 'group') {
            const parentGroup = this.findGroupForObject(clickedObject);
            if (parentGroup) {
              objectToSelect = parentGroup;
            }
          }
        }
      }

      if (!e.shiftKey && !this.selectedObjects.includes(objectToSelect)) {
        this.selectedObjects = [];
      }

      if (!this.selectedObjects.includes(objectToSelect)) {
        this.selectedObjects.push(objectToSelect);
      }

      // Start dragging
      this.isDragging = true;
      this.selectedObjects.forEach(obj => this.setupDragStart(obj));
    } else {
      if (!e.shiftKey) {
        this.selectedObjects = [];
        this.enteredGroup = null;
      }
      // Start marquee selection
      this.isMarqueeSelecting = true;
      this.marqueeStart = { x, y };
      this.marqueeCurrent = { x, y };
    }

    this.updateStatus();
    this.updateLayers();
    this.render();
  }

  findResizeHandle(x, y) {
    const handleSize = 12 / this.scale;  // Slightly larger hit area

    for (const obj of this.selectedObjects) {
      // Only allow resize on objects with width/height
      if (!this.isResizable(obj)) continue;

      const bounds = this.getObjectBounds(obj);
      const padding = 5 / this.scale;

      const handles = {
        'nw': { x: bounds.x - padding, y: bounds.y - padding },
        'ne': { x: bounds.x + bounds.width + padding, y: bounds.y - padding },
        'sw': { x: bounds.x - padding, y: bounds.y + bounds.height + padding },
        'se': { x: bounds.x + bounds.width + padding, y: bounds.y + bounds.height + padding }
      };

      for (const [handle, pos] of Object.entries(handles)) {
        if (Math.abs(x - pos.x) < handleSize / 2 && Math.abs(y - pos.y) < handleSize / 2) {
          return { handle, object: obj };
        }
      }
    }
    return null;
  }

  isResizable(obj) {
    return ['rect', 'image', 'ellipse', 'text', 'group', 'shape'].includes(obj.type);
  }

  handleResize(x, y) {
    const obj = this.resizeObject;
    const start = this.resizeStart;
    const dx = x - start.mouseX;
    const dy = y - start.mouseY;
    const minSize = 20;

    // Handle different object types
    if (obj.type === 'group') {
      this.handleGroupResize(dx, dy);
    } else if (obj.type === 'ellipse') {
      this.handleEllipseResize(dx, dy);
    } else if (obj.type === 'text') {
      this.handleTextResize(dx, dy);
    } else {
      // rect, image, shape
      switch (this.resizeHandle) {
        case 'se':
          obj.width = Math.max(minSize, start.width + dx);
          obj.height = Math.max(minSize, start.height + dy);
          break;
        case 'sw':
          const newWidthSW = Math.max(minSize, start.width - dx);
          obj.x = start.x + (start.width - newWidthSW);
          obj.width = newWidthSW;
          obj.height = Math.max(minSize, start.height + dy);
          break;
        case 'ne':
          obj.width = Math.max(minSize, start.width + dx);
          const newHeightNE = Math.max(minSize, start.height - dy);
          obj.y = start.y + (start.height - newHeightNE);
          obj.height = newHeightNE;
          break;
        case 'nw':
          const newWidthNW = Math.max(minSize, start.width - dx);
          const newHeightNW = Math.max(minSize, start.height - dy);
          obj.x = start.x + (start.width - newWidthNW);
          obj.y = start.y + (start.height - newHeightNW);
          obj.width = newWidthNW;
          obj.height = newHeightNW;
          break;
      }
    }

    this.render();
  }

  handleEllipseResize(dx, dy) {
    const obj = this.resizeObject;
    const start = this.resizeStart;
    const minRadius = 10;

    // For ellipse, start.width/height are actually radiusX*2 and radiusY*2
    // And start.x/y are the center
    const startRadiusX = start.width / 2;
    const startRadiusY = start.height / 2;

    switch (this.resizeHandle) {
      case 'se':
        obj.radiusX = Math.max(minRadius, startRadiusX + dx / 2);
        obj.radiusY = Math.max(minRadius, startRadiusY + dy / 2);
        break;
      case 'sw':
        obj.radiusX = Math.max(minRadius, startRadiusX - dx / 2);
        obj.radiusY = Math.max(minRadius, startRadiusY + dy / 2);
        break;
      case 'ne':
        obj.radiusX = Math.max(minRadius, startRadiusX + dx / 2);
        obj.radiusY = Math.max(minRadius, startRadiusY - dy / 2);
        break;
      case 'nw':
        obj.radiusX = Math.max(minRadius, startRadiusX - dx / 2);
        obj.radiusY = Math.max(minRadius, startRadiusY - dy / 2);
        break;
    }
  }

  handleTextResize(dx, dy) {
    const obj = this.resizeObject;
    const start = this.resizeStart;
    const minFontSize = 8;
    const maxFontSize = 200;

    // Calculate scale factor based on the corner being dragged
    // Use the larger of dx or dy for proportional scaling
    let scale;
    switch (this.resizeHandle) {
      case 'se':
        scale = Math.max(1 + dx / start.width, 1 + dy / start.height);
        break;
      case 'sw':
        scale = Math.max(1 - dx / start.width, 1 + dy / start.height);
        break;
      case 'ne':
        scale = Math.max(1 + dx / start.width, 1 - dy / start.height);
        break;
      case 'nw':
        scale = Math.max(1 - dx / start.width, 1 - dy / start.height);
        break;
    }

    // Apply scale to fontSize
    const newFontSize = Math.round(start.fontSize * scale);
    obj.fontSize = Math.max(minFontSize, Math.min(maxFontSize, newFontSize));

    // Update the font size input in the properties panel
    document.getElementById('fontSize').value = obj.fontSize;
    this.fontSize = obj.fontSize;
  }

  handleGroupResize(dx, dy) {
    const obj = this.resizeObject;
    const start = this.resizeStart;
    const padding = obj.padding || 10;

    let newWidth, newHeight, newX, newY;
    switch (this.resizeHandle) {
      case 'se':
        newWidth = Math.max(60, start.width + dx);
        newHeight = Math.max(60, start.height + dy);
        newX = start.x;
        newY = start.y;
        break;
      case 'sw':
        newWidth = Math.max(60, start.width - dx);
        newHeight = Math.max(60, start.height + dy);
        newX = start.x + (start.width - newWidth);
        newY = start.y;
        break;
      case 'ne':
        newWidth = Math.max(60, start.width + dx);
        newHeight = Math.max(60, start.height - dy);
        newX = start.x;
        newY = start.y + (start.height - newHeight);
        break;
      case 'nw':
        newWidth = Math.max(60, start.width - dx);
        newHeight = Math.max(60, start.height - dy);
        newX = start.x + (start.width - newWidth);
        newY = start.y + (start.height - newHeight);
        break;
    }

    const oldContentW = start.width - padding * 2;
    const oldContentH = start.height - padding * 2;
    const newContentW = newWidth - padding * 2;
    const newContentH = newHeight - padding * 2;

    if (oldContentW <= 0 || oldContentH <= 0) return;

    const scaleX = newContentW / oldContentW;
    const scaleY = newContentH / oldContentH;
    const originX = start.x + padding;
    const originY = start.y + padding;
    const newOriginX = newX + padding;
    const newOriginY = newY + padding;

    const children = this.getGroupChildren(obj);
    start.childStarts.forEach(cs => {
      const child = children.find(c => c.id === cs.id);
      if (!child) return;

      switch (child.type) {
        case 'rect':
        case 'image':
        case 'shape':
          child.x = newOriginX + (cs.x - originX) * scaleX;
          child.y = newOriginY + (cs.y - originY) * scaleY;
          child.width = cs.width * scaleX;
          child.height = cs.height * scaleY;
          break;
        case 'ellipse':
          child.x = newOriginX + (cs.x - originX) * scaleX;
          child.y = newOriginY + (cs.y - originY) * scaleY;
          child.radiusX = cs.radiusX * scaleX;
          child.radiusY = cs.radiusY * scaleY;
          break;
        case 'text':
          child.x = newOriginX + (cs.x - originX) * scaleX;
          child.y = newOriginY + (cs.y - originY) * scaleY;
          child.fontSize = Math.max(8, Math.round(cs.fontSize * Math.min(scaleX, scaleY)));
          break;
        case 'line':
          child.x = newOriginX + (cs.x - originX) * scaleX;
          child.y = newOriginY + (cs.y - originY) * scaleY;
          child.x2 = newOriginX + (cs.x2 - originX) * scaleX;
          child.y2 = newOriginY + (cs.y2 - originY) * scaleY;
          break;
        case 'path':
          if (cs.points) {
            child.points = cs.points.map(p => ({
              x: newOriginX + (p.x - originX) * scaleX,
              y: newOriginY + (p.y - originY) * scaleY
            }));
          }
          break;
      }
    });
  }

  finalizeResize() {
    this.isResizing = false;
    this.resizeHandle = null;
    this.resizeObject = null;
    this.resizeStart = null;
    this.saveState();
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
        const lines = obj.text.split('\n');
        const maxLineLength = Math.max(...lines.map(l => l.length));
        const textWidth = maxLineLength * obj.fontSize * 0.6;
        const lineHeight = obj.fontSize * 1.2;
        const textHeight = lines.length * lineHeight;
        return x >= obj.x - margin && x <= obj.x + textWidth + margin &&
               y >= obj.y - margin && y <= obj.y + textHeight + margin;

      case 'image':
        return x >= obj.x - margin && x <= obj.x + obj.width + margin &&
               y >= obj.y - margin && y <= obj.y + obj.height + margin;

      case 'shape':
        return x >= obj.x - margin && x <= obj.x + obj.width + margin &&
               y >= obj.y - margin && y <= obj.y + obj.height + margin;

      case 'group': {
        const groupBounds = this.getObjectBounds(obj);
        return x >= groupBounds.x - margin && x <= groupBounds.x + groupBounds.width + margin &&
               y >= groupBounds.y - margin && y <= groupBounds.y + groupBounds.height + margin;
      }

      case 'connector': {
        // Check if point is near the connector line
        const connFrom = this.objects.find(o => o.id === obj.fromId);
        const connTo = this.objects.find(o => o.id === obj.toId);
        if (!connFrom || !connTo) return false;

        const fromBounds = this.getObjectBounds(connFrom);
        const toBounds = this.getObjectBounds(connTo);
        const anchors = this.calculateConnectorAnchors(fromBounds, toBounds);

        return this.pointToLineDistance(x, y, anchors.from.x, anchors.from.y, anchors.to.x, anchors.to.y) < margin;
      }

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

  // ============================================
  // GROUP HELPERS
  // ============================================

  getGroupChildren(group) {
    return group.children.map(id => this.objects.find(o => o.id === id)).filter(Boolean);
  }

  findGroupForObject(obj) {
    return this.objects.find(g => g.type === 'group' && g.children.includes(obj.id));
  }

  setupDragStart(obj) {
    obj._dragStartX = obj.x;
    obj._dragStartY = obj.y;
    if (obj.type === 'path') {
      obj._dragStartPoints = obj.points.map(p => ({ x: p.x, y: p.y }));
    }
    if (obj.type === 'line') {
      obj._dragStartX2 = obj.x2;
      obj._dragStartY2 = obj.y2;
    }
    if (obj.type === 'group') {
      this.getGroupChildren(obj).forEach(child => this.setupDragStart(child));
    }
  }

  applyDrag(obj, dx, dy) {
    if (obj.type === 'path' && obj._dragStartPoints) {
      obj.points = obj._dragStartPoints.map(p => ({ x: p.x + dx, y: p.y + dy }));
    } else if (obj.type === 'line') {
      obj.x = (obj._dragStartX ?? obj.x) + dx;
      obj.y = (obj._dragStartY ?? obj.y) + dy;
      obj.x2 = (obj._dragStartX2 ?? obj.x2) + dx;
      obj.y2 = (obj._dragStartY2 ?? obj.y2) + dy;
    } else if (obj.type === 'group') {
      this.getGroupChildren(obj).forEach(child => this.applyDrag(child, dx, dy));
    } else {
      obj.x = (obj._dragStartX ?? obj.x) + dx;
      obj.y = (obj._dragStartY ?? obj.y) + dy;
    }
  }

  cleanupDrag(obj) {
    delete obj._dragStartX;
    delete obj._dragStartY;
    delete obj._dragStartPoints;
    delete obj._dragStartX2;
    delete obj._dragStartY2;
    if (obj.type === 'group') {
      this.getGroupChildren(obj).forEach(child => this.cleanupDrag(child));
    }
  }

  selectAll() {
    // Skip children that belong to groups (select the group instead)
    const childIds = new Set();
    this.objects.forEach(obj => {
      if (obj.type === 'group') {
        obj.children.forEach(id => childIds.add(id));
      }
    });
    this.selectedObjects = this.objects.filter(obj => !childIds.has(obj.id));
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

  // ============================================
  // MARQUEE SELECTION
  // ============================================

  drawMarqueeRect() {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(this.offsetX, this.offsetY);
    ctx.scale(this.scale, this.scale);

    const x1 = Math.min(this.marqueeStart.x, this.marqueeCurrent.x);
    const y1 = Math.min(this.marqueeStart.y, this.marqueeCurrent.y);
    const w = Math.abs(this.marqueeCurrent.x - this.marqueeStart.x);
    const h = Math.abs(this.marqueeCurrent.y - this.marqueeStart.y);

    ctx.fillStyle = this.getThemeColor('marqueeFill');
    ctx.fillRect(x1, y1, w, h);

    ctx.strokeStyle = this.getThemeColor('marqueeStroke');
    ctx.lineWidth = 1.5 / this.scale;
    ctx.setLineDash([6 / this.scale, 4 / this.scale]);
    ctx.strokeRect(x1, y1, w, h);

    ctx.restore();
  }

  finalizeMarqueeSelection(e) {
    const start = this.marqueeStart;
    const end = this.marqueeCurrent;

    this.isMarqueeSelecting = false;
    this.marqueeStart = null;
    this.marqueeCurrent = null;

    if (!start || !end) { this.render(); return; }

    // Only select if drag was > 5px to prevent accidental selection on click
    const dragDist = Math.sqrt((end.x - start.x) ** 2 + (end.y - start.y) ** 2);
    if (dragDist < 5) { this.render(); return; }

    const selRect = {
      x: Math.min(start.x, end.x),
      y: Math.min(start.y, end.y),
      width: Math.abs(end.x - start.x),
      height: Math.abs(end.y - start.y)
    };

    const found = this.findObjectsInRect(selRect);

    if (e.shiftKey) {
      // Append to existing selection
      found.forEach(obj => {
        if (!this.selectedObjects.includes(obj)) {
          this.selectedObjects.push(obj);
        }
      });
    } else {
      this.selectedObjects = found;
    }

    this.updateStatus();
    this.updateLayers();
    this.render();
  }

  findObjectsInRect(selRect) {
    const result = [];
    const childIds = new Set();
    this.objects.forEach(obj => {
      if (obj.type === 'group') obj.children.forEach(id => childIds.add(id));
    });

    for (const obj of this.objects) {
      // Skip group children - select the parent group instead
      if (childIds.has(obj.id)) continue;

      const bounds = this.getObjectBounds(obj);
      // AABB intersection test
      if (bounds.x < selRect.x + selRect.width &&
          bounds.x + bounds.width > selRect.x &&
          bounds.y < selRect.y + selRect.height &&
          bounds.y + bounds.height > selRect.y) {
        result.push(obj);
      }
    }
    return result;
  }

  deleteSelected() {
    if (this.selectedObjects.length === 0) return;

    // Collect all IDs to delete, including children of groups
    const deletedIds = new Set();
    this.selectedObjects.forEach(obj => {
      deletedIds.add(obj.id);
      if (obj.type === 'group') {
        obj.children.forEach(id => deletedIds.add(id));
      }
    });

    // Also remove any group that loses a child
    this.objects.forEach(obj => {
      if (obj.type === 'group' && !deletedIds.has(obj.id)) {
        if (obj.children.some(id => deletedIds.has(id))) {
          // Remove children from the group that are being deleted
          obj.children = obj.children.filter(id => !deletedIds.has(id));
          // If group has < 2 children, dissolve it
          if (obj.children.length < 2) {
            deletedIds.add(obj.id);
          }
        }
      }
    });

    // Remove deleted objects
    this.objects = this.objects.filter(obj => !deletedIds.has(obj.id));

    // Also remove any connectors that reference deleted objects
    this.objects = this.objects.filter(obj => {
      if (obj.type === 'connector') {
        return !deletedIds.has(obj.fromId) && !deletedIds.has(obj.toId);
      }
      return true;
    });

    this.selectedObjects = [];
    if (this.enteredGroup && deletedIds.has(this.enteredGroup.id)) {
      this.enteredGroup = null;
    }
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
  // GROUPING
  // ============================================

  groupSelected() {
    if (this.selectedObjects.length < 2) return;

    // Don't allow grouping if any selected object is already in a group
    if (this.selectedObjects.some(obj => this.findGroupForObject(obj))) return;

    // Don't allow nesting groups
    if (this.selectedObjects.some(obj => obj.type === 'group')) return;

    // Filter out connectors
    const groupable = this.selectedObjects.filter(obj => obj.type !== 'connector');
    if (groupable.length < 2) return;

    const childIds = groupable.map(obj => obj.id);

    // Find the earliest position of children in the objects array
    const firstChildIndex = Math.min(
      ...childIds.map(id => this.objects.findIndex(o => o.id === id))
    );

    const group = {
      type: 'group',
      id: ++this.objectIdCounter,
      children: childIds,
      fillColor: this.getThemeColor('defaultGroupFill'),
      fillEnabled: true,
      opacity: 100,
      padding: 10,
      locked: false
    };

    // Insert group before its first child so background draws behind
    this.objects.splice(firstChildIndex, 0, group);

    this.selectedObjects = [group];
    this.saveState();
    this.updateStatus();
    this.updateLayers();
    this.render();
  }

  ungroupSelected() {
    const groups = this.selectedObjects.filter(obj => obj.type === 'group' && !obj.locked);
    if (groups.length === 0) return;

    const newSelection = [];
    groups.forEach(group => {
      const children = this.getGroupChildren(group);
      newSelection.push(...children);
      this.objects = this.objects.filter(obj => obj !== group);
    });

    // Keep any non-group or locked-group selections
    const remaining = this.selectedObjects.filter(obj => obj.type !== 'group' || obj.locked);
    this.selectedObjects = [...remaining, ...newSelection];
    this.enteredGroup = null;
    this.saveState();
    this.updateStatus();
    this.updateLayers();
    this.render();
  }

  toggleGroupLock() {
    const groups = this.selectedObjects.filter(obj => obj.type === 'group');
    if (groups.length === 0) return;

    groups.forEach(group => {
      group.locked = !group.locked;
    });

    // Exit entered group if it just got locked
    if (this.enteredGroup && this.enteredGroup.locked) {
      this.enteredGroup = null;
    }

    this.saveState();
    this.updateLayers();
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

    textInput.style.display = 'block';
    textInput.style.left = (screenX) + 'px';
    textInput.style.top = (screenY) + 'px';
    textInput.style.fontSize = (this.fontSize * this.scale) + 'px';
    textInput.style.color = this.strokeColor;
    textInput.value = '';
    textInput.dataset.canvasX = canvasX;
    textInput.dataset.canvasY = canvasY;
    this.editingTextObject = null;

    // Small delay to ensure focus works
    setTimeout(() => textInput.focus(), 10);
  }

  editTextObject(obj, screenX, screenY) {
    const textInput = document.getElementById('text-input');

    // Position the input at the text object's location
    const screenPos = this.canvasToScreen(obj.x, obj.y);

    textInput.style.display = 'block';
    textInput.style.left = screenPos.x + 'px';
    textInput.style.top = screenPos.y + 'px';
    textInput.style.fontSize = (obj.fontSize * this.scale) + 'px';
    textInput.style.color = obj.strokeColor;
    textInput.value = obj.text;
    textInput.dataset.canvasX = obj.x;
    textInput.dataset.canvasY = obj.y;

    // Add editing class for in-place styling
    textInput.classList.add('editing-existing');

    // Store reference to the object being edited
    this.editingTextObject = obj;

    // Re-render to hide the original text on canvas
    this.render();

    // Small delay to ensure focus works, then position cursor at end
    setTimeout(() => {
      textInput.focus();
      // Move cursor to end instead of selecting all
      textInput.selectionStart = textInput.selectionEnd = textInput.value.length;
    }, 10);
  }

  finalizeText() {
    const textInput = document.getElementById('text-input');
    const text = textInput.value.trim();

    if (this.editingTextObject) {
      // Update existing text object
      if (text) {
        this.editingTextObject.text = text;
        this.saveState();
      } else {
        // If text is empty, delete the object
        this.objects = this.objects.filter(obj => obj !== this.editingTextObject);
        this.selectedObjects = this.selectedObjects.filter(obj => obj !== this.editingTextObject);
        this.saveState();
      }
      this.editingTextObject = null;
      this.updateLayers();
      this.render();
    } else if (text) {
      // Create new text object
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
    textInput.classList.remove('editing-existing');
  }

  // ============================================
  // CONNECTOR TOOL
  // ============================================

  handleConnectDown(x, y) {
    // Find object under cursor to start connection
    const sourceObj = this.findObjectAt(x, y);
    if (sourceObj && sourceObj.type !== 'connector') {
      this.connectingFrom = sourceObj;
      this.connectingPreview = { x, y };
    }
  }

  handleConnectUp(x, y) {
    if (!this.connectingFrom) return;

    // Find target object
    const targetObj = this.findObjectAt(x, y);

    if (targetObj && targetObj !== this.connectingFrom && targetObj.type !== 'connector') {
      // Create connector between two objects
      this.addObject({
        type: 'connector',
        fromId: this.connectingFrom.id,
        toId: targetObj.id,
        strokeColor: this.strokeColor,
        strokeWidth: this.strokeWidth,
        opacity: this.opacity
      });
    }

    // Reset connector state
    this.connectingFrom = null;
    this.connectingPreview = null;
    this.render();
  }

  drawConnectorPreview(toX, toY) {
    if (!this.connectingFrom) return;

    const ctx = this.ctx;
    ctx.save();
    ctx.translate(this.offsetX, this.offsetY);
    ctx.scale(this.scale, this.scale);

    // Get source object center
    const fromBounds = this.getObjectBounds(this.connectingFrom);
    const fromCenter = {
      x: fromBounds.x + fromBounds.width / 2,
      y: fromBounds.y + fromBounds.height / 2
    };

    // Check if hovering over a valid target
    const targetObj = this.findObjectAt(toX, toY);
    let toPoint = { x: toX, y: toY };

    if (targetObj && targetObj !== this.connectingFrom && targetObj.type !== 'connector') {
      // Snap to target center
      const toBounds = this.getObjectBounds(targetObj);
      toPoint = {
        x: toBounds.x + toBounds.width / 2,
        y: toBounds.y + toBounds.height / 2
      };

      // Highlight target
      ctx.strokeStyle = this.getThemeColor('connectorHighlight');
      ctx.lineWidth = 2 / this.scale;
      ctx.setLineDash([5 / this.scale, 5 / this.scale]);
      ctx.strokeRect(toBounds.x - 5, toBounds.y - 5, toBounds.width + 10, toBounds.height + 10);
      ctx.setLineDash([]);
    }

    // Calculate smart anchor points
    const anchors = this.calculateConnectorAnchors(fromBounds, { x: toPoint.x, y: toPoint.y, width: 0, height: 0 });

    // Draw preview line with arrow
    ctx.strokeStyle = this.strokeColor;
    ctx.lineWidth = this.strokeWidth;
    ctx.globalAlpha = 0.6;
    ctx.setLineDash([5, 5]);

    this.drawArrowLine(ctx, anchors.from.x, anchors.from.y, toPoint.x, toPoint.y);

    ctx.restore();
  }

  calculateConnectorAnchors(fromBounds, toBounds) {
    // Calculate center points
    const fromCenter = {
      x: fromBounds.x + fromBounds.width / 2,
      y: fromBounds.y + fromBounds.height / 2
    };
    const toCenter = {
      x: toBounds.x + toBounds.width / 2,
      y: toBounds.y + toBounds.height / 2
    };

    // Determine best exit/entry points based on relative positions
    const dx = toCenter.x - fromCenter.x;
    const dy = toCenter.y - fromCenter.y;

    let fromAnchor, toAnchor;

    // From anchor - exit point on source object
    if (Math.abs(dx) > Math.abs(dy)) {
      // Horizontal connection
      if (dx > 0) {
        fromAnchor = { x: fromBounds.x + fromBounds.width, y: fromCenter.y }; // Right
        toAnchor = { x: toBounds.x, y: toCenter.y }; // Left
      } else {
        fromAnchor = { x: fromBounds.x, y: fromCenter.y }; // Left
        toAnchor = { x: toBounds.x + toBounds.width, y: toCenter.y }; // Right
      }
    } else {
      // Vertical connection
      if (dy > 0) {
        fromAnchor = { x: fromCenter.x, y: fromBounds.y + fromBounds.height }; // Bottom
        toAnchor = { x: toCenter.x, y: toBounds.y }; // Top
      } else {
        fromAnchor = { x: fromCenter.x, y: fromBounds.y }; // Top
        toAnchor = { x: toCenter.x, y: toBounds.y + toBounds.height }; // Bottom
      }
    }

    return { from: fromAnchor, to: toAnchor };
  }

  drawArrowLine(ctx, x1, y1, x2, y2) {
    const headLength = 12;
    const angle = Math.atan2(y2 - y1, x2 - x1);

    // Draw line
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // Draw arrowhead
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(
      x2 - headLength * Math.cos(angle - Math.PI / 6),
      y2 - headLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.moveTo(x2, y2);
    ctx.lineTo(
      x2 - headLength * Math.cos(angle + Math.PI / 6),
      y2 - headLength * Math.sin(angle + Math.PI / 6)
    );
    ctx.stroke();
  }

  drawConnector(obj) {
    // Find connected objects
    const fromObj = this.objects.find(o => o.id === obj.fromId);
    const toObj = this.objects.find(o => o.id === obj.toId);

    if (!fromObj || !toObj) {
      // Connected object was deleted - draw as orphaned
      return;
    }

    const ctx = this.ctx;
    const fromBounds = this.getObjectBounds(fromObj);
    const toBounds = this.getObjectBounds(toObj);

    // Calculate smart anchor points
    const anchors = this.calculateConnectorAnchors(fromBounds, toBounds);

    ctx.strokeStyle = obj.strokeColor;
    ctx.lineWidth = obj.strokeWidth;
    ctx.lineCap = 'round';

    this.drawArrowLine(ctx, anchors.from.x, anchors.from.y, anchors.to.x, anchors.to.y);
  }

  // ============================================
  // SHAPE TOOL
  // ============================================

  drawShape(obj) {
    const shapeDef = SHAPE_LIBRARY[obj.shapeType];
    if (!shapeDef) return;

    const ctx = this.ctx;
    ctx.beginPath();
    shapeDef.draw(ctx, obj.x, obj.y, obj.width, obj.height);

    if (obj.fillEnabled) {
      ctx.fillStyle = obj.fillColor;
      ctx.fill();
    }

    ctx.strokeStyle = obj.strokeColor;
    ctx.lineWidth = obj.strokeWidth;
    ctx.stroke();
  }

  placeShape(canvasX, canvasY) {
    const shapeType = this.pendingShapeType;
    if (!shapeType) return;

    const shapeDef = SHAPE_LIBRARY[shapeType];
    if (!shapeDef) return;

    const w = shapeDef.defaultWidth;
    const h = shapeDef.defaultHeight;

    const obj = {
      type: 'shape',
      shapeType: shapeType,
      x: canvasX - w / 2,
      y: canvasY - h / 2,
      width: w,
      height: h,
      strokeColor: this.strokeColor,
      fillColor: this.fillColor,
      fillEnabled: this.fillEnabled,
      strokeWidth: this.strokeWidth,
      opacity: this.opacity
    };

    this.addObject(obj);
    this.pendingShapeType = null;

    // Auto-switch to select tool with the new shape selected
    this.selectTool('select');
    this.selectedObjects = [obj];
    this.updateStatus();
    this.updateLayers();
    this.render();
  }

  showShapesPanel() {
    const panel = document.getElementById('shapes-panel');
    if (panel) {
      panel.classList.add('visible');
      this.shapePanelVisible = true;
    }
  }

  hideShapesPanel() {
    const panel = document.getElementById('shapes-panel');
    if (panel) {
      panel.classList.remove('visible');
      this.shapePanelVisible = false;
    }
  }

  bindShapesPanel() {
    const panel = document.getElementById('shapes-panel');
    if (!panel) return;

    panel.querySelectorAll('.shape-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const shapeType = btn.dataset.shapeType;
        this.pendingShapeType = shapeType;
        this.hideShapesPanel();
        this.canvas.style.cursor = 'crosshair';
      });
    });

    // Close panel when clicking outside
    document.addEventListener('mousedown', (e) => {
      if (this.shapePanelVisible && !panel.contains(e.target)) {
        if (e.target.closest('[data-tool="shape"]')) return;
        this.hideShapesPanel();
      }
    });
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

      this.selectTool('select');
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

    // Draw entered group indicator
    if (this.enteredGroup) {
      this.drawEnteredGroupIndicator(this.enteredGroup);
    }

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
      case 'connector':
        this.drawConnector(obj);
        break;
      case 'group':
        this.drawGroup(obj);
        break;
      case 'shape':
        this.drawShape(obj);
        break;
    }

    ctx.restore();
  }

  drawGroup(obj) {
    const bounds = this.getObjectBounds(obj);
    const ctx = this.ctx;
    const radius = 8;

    if (obj.fillEnabled) {
      ctx.beginPath();
      ctx.roundRect(bounds.x, bounds.y, bounds.width, bounds.height, radius);
      ctx.fillStyle = obj.fillColor;
      ctx.fill();
    }

    // Draw lock indicator
    if (obj.locked) {
      const iconSize = 14;
      const ix = bounds.x + bounds.width - iconSize - 4;
      const iy = bounds.y + 4;
      ctx.save();
      ctx.globalAlpha = 0.5;
      ctx.font = `${iconSize}px sans-serif`;
      ctx.fillStyle = this.getThemeColor('lockIcon');
      ctx.fillText('\u{1F512}', ix, iy + iconSize);
      ctx.restore();
    }
  }

  drawEnteredGroupIndicator(group) {
    const ctx = this.ctx;
    const bounds = this.getObjectBounds(group);
    const padding = 3 / this.scale;

    ctx.save();
    ctx.strokeStyle = this.getThemeColor('enteredGroupStroke');
    ctx.lineWidth = 2 / this.scale;
    ctx.setLineDash([8 / this.scale, 4 / this.scale]);
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.roundRect(
      bounds.x - padding, bounds.y - padding,
      bounds.width + padding * 2, bounds.height + padding * 2, 8
    );
    ctx.stroke();
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
    // Don't draw text that's currently being edited
    if (this.editingTextObject === obj) return;

    const ctx = this.ctx;
    ctx.font = `${obj.fontSize}px 'Share Tech Mono', monospace`;
    ctx.fillStyle = obj.strokeColor;
    ctx.textBaseline = 'top';

    // Draw with slight glow effect
    ctx.shadowColor = obj.strokeColor;
    ctx.shadowBlur = 4;

    // Handle multiline text
    const lines = obj.text.split('\n');
    const lineHeight = obj.fontSize * 1.2;
    lines.forEach((line, index) => {
      ctx.fillText(line, obj.x, obj.y + index * lineHeight);
    });

    ctx.shadowBlur = 0;
  }

  drawImage(obj) {
    const ctx = this.ctx;
    if (obj.imageElement) {
      ctx.drawImage(obj.imageElement, obj.x, obj.y, obj.width, obj.height);
    }
  }

  drawSelectionIndicator(obj) {
    // Don't draw selection indicator for text being edited (textarea has its own border)
    if (this.editingTextObject === obj) return;

    const ctx = this.ctx;
    ctx.save();

    ctx.strokeStyle = this.getThemeColor('selectionStroke');
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
    ctx.fillStyle = this.getThemeColor('selectionHandle');
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
        const textLines = obj.text.split('\n');
        const maxLen = Math.max(...textLines.map(l => l.length));
        const tWidth = maxLen * obj.fontSize * 0.6;
        const tHeight = textLines.length * obj.fontSize * 1.2;
        return { x: obj.x, y: obj.y, width: tWidth, height: tHeight };

      case 'image':
        return { x: obj.x, y: obj.y, width: obj.width, height: obj.height };

      case 'shape':
        return { x: obj.x, y: obj.y, width: obj.width, height: obj.height };

      case 'group': {
        const children = this.getGroupChildren(obj);
        if (children.length === 0) return { x: 0, y: 0, width: 0, height: 0 };
        let gMinX = Infinity, gMinY = Infinity, gMaxX = -Infinity, gMaxY = -Infinity;
        children.forEach(child => {
          const cb = this.getObjectBounds(child);
          gMinX = Math.min(gMinX, cb.x);
          gMinY = Math.min(gMinY, cb.y);
          gMaxX = Math.max(gMaxX, cb.x + cb.width);
          gMaxY = Math.max(gMaxY, cb.y + cb.height);
        });
        const gPad = obj.padding || 10;
        return {
          x: gMinX - gPad,
          y: gMinY - gPad,
          width: (gMaxX - gMinX) + gPad * 2,
          height: (gMaxY - gMinY) + gPad * 2
        };
      }

      case 'connector': {
        // Calculate bounds from connected objects
        const connFromObj = this.objects.find(o => o.id === obj.fromId);
        const connToObj = this.objects.find(o => o.id === obj.toId);
        if (!connFromObj || !connToObj) return { x: 0, y: 0, width: 0, height: 0 };

        const connFromBounds = this.getObjectBounds(connFromObj);
        const connToBounds = this.getObjectBounds(connToObj);
        const connAnchors = this.calculateConnectorAnchors(connFromBounds, connToBounds);

        const connMinX = Math.min(connAnchors.from.x, connAnchors.to.x);
        const connMinY = Math.min(connAnchors.from.y, connAnchors.to.y);
        const connMaxX = Math.max(connAnchors.from.x, connAnchors.to.x);
        const connMaxY = Math.max(connAnchors.from.y, connAnchors.to.y);

        return { x: connMinX, y: connMinY, width: connMaxX - connMinX || 10, height: connMaxY - connMinY || 10 };
      }

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

    // Clone objects (excluding transient DOM references)
    const state = this.objects.map(obj => {
      const clone = { ...obj };
      if (clone.type === 'image') {
        delete clone.imageElement;
      }
      if (clone.type === 'path') {
        clone.points = [...obj.points];
      }
      if (clone.type === 'group') {
        clone.children = [...obj.children];
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

    // Notify parent when embedded
    if (this.embedded && window.parent !== window) {
      window.parent.postMessage({
        type: 'hackerpad:changed',
        objects: state
      }, '*');
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
    this.enteredGroup = null;
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

    // Ensure objectIdCounter is higher than any loaded ID
    const maxId = Math.max(0, ...this.objects.map(o => o.id || 0));
    this.objectIdCounter = Math.max(this.objectIdCounter, maxId);

    this.selectedObjects = [];
    this.enteredGroup = null;
    this.saveState();
    this.updateStatus();
    this.updateLayers();
    this.render();

    console.log('%c[LOAD] Canvas loaded successfully', 'color: #00ff9d');
  }

  clearAll(skipConfirm = false) {
    if (this.objects.length === 0) return;

    if (skipConfirm || confirm('⚠ CLEAR ALL OBJECTS?')) {
      this.objects = [];
      this.selectedObjects = [];
      this.saveState();
      this.updateStatus();
      this.updateLayers();
      this.render();
    }
  }

  // ============================================
  // PROJECTS (localStorage)
  // ============================================

  bindProjectsDialog() {
    const dialog = document.getElementById('projects-dialog');
    const closeBtn = document.getElementById('projectsDialogClose');
    const saveBtn = document.getElementById('projectSaveBtn');
    const nameInput = document.getElementById('projectNameInput');

    closeBtn.addEventListener('click', () => this.hideProjectsDialog());

    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) this.hideProjectsDialog();
    });

    saveBtn.addEventListener('click', () => {
      const name = nameInput.value.trim();
      if (name) {
        this.saveProjectToStorage(name);
        nameInput.value = '';
        this.updateProjectsListUI();
      }
    });

    nameInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        saveBtn.click();
      }
      if (e.key === 'Escape') {
        this.hideProjectsDialog();
      }
    });
  }

  showProjectsDialog() {
    const dialog = document.getElementById('projects-dialog');
    dialog.classList.add('visible');
    this.updateProjectsListUI();
    setTimeout(() => document.getElementById('projectNameInput').focus(), 10);
  }

  hideProjectsDialog() {
    const dialog = document.getElementById('projects-dialog');
    dialog.classList.remove('visible');
  }

  getProjectsFromStorage() {
    try {
      const projects = localStorage.getItem('hackerpad_projects');
      return projects ? JSON.parse(projects) : {};
    } catch (err) {
      console.error('Failed to load projects from storage:', err);
      return {};
    }
  }

  saveProjectToStorage(name) {
    const projects = this.getProjectsFromStorage();

    const projectData = {
      version: '1.0',
      name: name,
      savedAt: Date.now(),
      objects: this.objects.map(obj => {
        const clone = { ...obj };
        if (clone.type === 'image') {
          delete clone.imageElement;
        }
        if (clone.type === 'path') {
          clone.points = [...obj.points];
        }
        if (clone.type === 'group') {
          clone.children = [...obj.children];
        }
        return clone;
      })
    };

    // Use name as key (will overwrite if same name exists)
    projects[name] = projectData;

    try {
      localStorage.setItem('hackerpad_projects', JSON.stringify(projects));
      console.log(`%c[SAVE] Project "${name}" saved to storage`, 'color: #00ff9d');
    } catch (err) {
      if (err.name === 'QuotaExceededError') {
        alert('Storage full! Delete some projects to make room.');
      } else {
        console.error('Failed to save project:', err);
      }
    }
  }

  loadProjectFromStorage(name) {
    const projects = this.getProjectsFromStorage();
    const project = projects[name];

    if (!project) {
      console.error(`Project "${name}" not found`);
      return;
    }

    this.loadData(project);
    this.hideProjectsDialog();
    console.log(`%c[LOAD] Project "${name}" loaded from storage`, 'color: #00ff9d');
  }

  deleteProjectFromStorage(name) {
    if (!confirm(`Delete project "${name}"?`)) return;

    const projects = this.getProjectsFromStorage();
    delete projects[name];

    try {
      localStorage.setItem('hackerpad_projects', JSON.stringify(projects));
      this.updateProjectsListUI();
      console.log(`%c[DELETE] Project "${name}" deleted`, 'color: #ff6b9d');
    } catch (err) {
      console.error('Failed to delete project:', err);
    }
  }

  updateProjectsListUI() {
    const listContainer = document.getElementById('projectsList');
    const projects = this.getProjectsFromStorage();
    const projectNames = Object.keys(projects).sort((a, b) => {
      // Sort by saved date, newest first
      return (projects[b].savedAt || 0) - (projects[a].savedAt || 0);
    });

    listContainer.innerHTML = '';

    projectNames.forEach(name => {
      const project = projects[name];
      const item = document.createElement('div');
      item.className = 'project-item';

      const savedDate = project.savedAt
        ? new Date(project.savedAt).toLocaleString()
        : 'Unknown date';

      const objectCount = project.objects ? project.objects.length : 0;

      item.innerHTML = `
        <div class="project-info">
          <span class="project-name">${name}</span>
          <span class="project-date">${savedDate} · ${objectCount} objects</span>
        </div>
        <div class="project-actions">
          <button class="project-action-btn load-btn" title="Load">▶</button>
          <button class="project-action-btn delete-btn" title="Delete">×</button>
        </div>
      `;

      const loadBtn = item.querySelector('.load-btn');
      const deleteBtn = item.querySelector('.delete-btn');

      loadBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.loadProjectFromStorage(name);
      });

      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.deleteProjectFromStorage(name);
      });

      // Click on item also loads
      item.addEventListener('click', () => {
        this.loadProjectFromStorage(name);
      });

      listContainer.appendChild(item);
    });
  }

  // ============================================
  // RADIAL MENU
  // ============================================

  bindRadialMenu() {
    const menu = document.getElementById('radial-menu');
    const items = menu.querySelectorAll('.radial-item');

    // Position items in a circle
    const radius = 175;
    const startAngle = -90; // Start from top
    const angleStep = 360 / items.length;

    items.forEach((item, index) => {
      const angle = (startAngle + index * angleStep) * (Math.PI / 180);
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      item.style.transform = `translate(${x}px, ${y}px)`;
    });

    // Right-click to show menu
    this.canvas.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.showRadialMenu(e.clientX, e.clientY);
    });

    // Click on item to select tool or trigger action
    items.forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const tool = item.dataset.tool;
        const action = item.dataset.action;
        if (tool) {
          this.selectTool(tool);
        } else if (action) {
          this.handleRadialAction(action);
        }
        this.hideRadialMenu();
      });
    });

    // Click outside to close
    document.addEventListener('mousedown', (e) => {
      if (menu.classList.contains('visible') && !menu.contains(e.target)) {
        this.hideRadialMenu();
      }
    });

    // Escape to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('visible')) {
        this.hideRadialMenu();
      }
    });
  }

  showRadialMenu(x, y) {
    const menu = document.getElementById('radial-menu');
    const items = menu.querySelectorAll('.radial-item');

    // Position menu centered at click location
    const menuWidth = 500;
    const menuHeight = 500;

    // Keep menu within viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let menuX = x - menuWidth / 2;
    let menuY = y - menuHeight / 2;

    // Clamp to viewport
    menuX = Math.max(10, Math.min(menuX, viewportWidth - menuWidth - 10));
    menuY = Math.max(10, Math.min(menuY, viewportHeight - menuHeight - 10));

    menu.style.left = menuX + 'px';
    menu.style.top = menuY + 'px';

    // Update active state for tools
    const hasGroupSelected = this.selectedObjects.some(o => o.type === 'group');
    const groupIsLocked = this.selectedObjects.some(o => o.type === 'group' && o.locked);

    items.forEach(item => {
      if (item.dataset.tool) {
        item.classList.toggle('active', item.dataset.tool === this.currentTool);
      }
      // Update lock button state
      if (item.dataset.action === 'lock-group') {
        item.classList.toggle('active', groupIsLocked);
        item.style.opacity = hasGroupSelected ? '1' : '0.35';
        const iconEl = item.querySelector('.radial-icon');
        const labelEl = item.querySelector('.radial-label');
        if (iconEl) iconEl.textContent = groupIsLocked ? '🔓' : '🔒';
        if (labelEl) labelEl.textContent = groupIsLocked ? 'UNLOCK' : 'LOCK';
      }
    });

    menu.classList.add('visible');
  }

  hideRadialMenu() {
    const menu = document.getElementById('radial-menu');
    menu.classList.remove('visible');
  }

  handleRadialAction(action) {
    switch (action) {
      case 'lock-group':
        this.toggleGroupLock();
        break;
    }
  }

  // ============================================
  // COLOR PALETTE
  // ============================================

  loadColorPalette() {
    try {
      const saved = localStorage.getItem('hackerpad_palette');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (err) {
      console.error('Failed to load color palette:', err);
    }
    // Default cyberpunk color palette
    return [
      '#00ff9d', // Neon green (primary)
      '#00ffff', // Cyan
      '#ff6b9d', // Hot pink
      '#bf00ff', // Purple
      '#ff0040', // Red
      '#ffff00', // Yellow
      '#ff6600', // Orange
      '#00a8ff', // Electric blue
      '#39ff14', // Radioactive green
      '#ffffff', // White
    ];
  }

  saveColorPalette() {
    try {
      localStorage.setItem('hackerpad_palette', JSON.stringify(this.colorPalette));
    } catch (err) {
      console.error('Failed to save color palette:', err);
    }
  }

  bindColorPalette() {
    const palette = document.getElementById('colorPalette');
    const slots = palette.querySelectorAll('.palette-slot');
    const targetBtns = document.querySelectorAll('.palette-target');

    // Initialize slot colors from saved palette
    this.updatePaletteUI();

    // Target toggle (stroke/fill)
    targetBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        targetBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.paletteTarget = btn.dataset.target;
      });
    });

    slots.forEach((slot, index) => {
      // Left click - use color (if slot has color) or save current color (if empty)
      slot.addEventListener('click', (e) => {
        e.preventDefault();
        const currentColor = this.paletteTarget === 'stroke' ? this.strokeColor : this.fillColor;

        if (this.colorPalette[index]) {
          // Use the saved color
          if (this.paletteTarget === 'stroke') {
            this.strokeColor = this.colorPalette[index];
            document.getElementById('strokeColor').value = this.strokeColor;
            this.updateSelectedObjects('strokeColor', this.strokeColor);
          } else {
            this.fillColor = this.colorPalette[index];
            document.getElementById('fillColor').value = this.fillColor;
            this.updateSelectedObjects('fillColor', this.fillColor);
          }
        } else {
          // Save current color to this slot
          this.colorPalette[index] = currentColor;
          this.saveColorPalette();
          this.updatePaletteUI();
        }
      });

      // Right click - save current color to slot (overwrite)
      slot.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        const currentColor = this.paletteTarget === 'stroke' ? this.strokeColor : this.fillColor;
        this.colorPalette[index] = currentColor;
        this.saveColorPalette();
        this.updatePaletteUI();
      });

      // Middle click - clear slot
      slot.addEventListener('auxclick', (e) => {
        if (e.button === 1) {
          e.preventDefault();
          this.colorPalette[index] = null;
          this.saveColorPalette();
          this.updatePaletteUI();
        }
      });
    });
  }

  updatePaletteUI() {
    const slots = document.querySelectorAll('.palette-slot');
    slots.forEach((slot, index) => {
      const color = this.colorPalette[index];
      if (color) {
        slot.style.backgroundColor = color;
        slot.classList.remove('empty');
        slot.title = `${color} - Click: use · Right-click: replace · Middle-click: clear`;
      } else {
        slot.style.backgroundColor = '';
        slot.classList.add('empty');
        slot.title = 'Empty slot - Click or right-click to save current stroke color';
      }
    });
  }

  // ============================================
  // UI UPDATES
  // ============================================

  updateStatus() {
    document.getElementById('status-tool').textContent = `TOOL: ${this.currentTool.toUpperCase()}`;
    document.getElementById('status-objects').textContent = `OBJECTS: ${this.objects.length}`;
    document.getElementById('status-selected').textContent = `SELECTED: ${this.selectedObjects.length}`;
    this.syncPropertiesPanel();
  }

  syncPropertiesPanel() {
    if (this.selectedObjects.length !== 1) return;
    const obj = this.selectedObjects[0];

    // Sync fill color and fill enabled for any object that has them
    if (obj.fillColor !== undefined) {
      document.getElementById('fillColor').value = obj.fillColor;
      this.fillColor = obj.fillColor;
    }
    if (obj.fillEnabled !== undefined) {
      document.getElementById('fillEnabled').checked = obj.fillEnabled;
      this.fillEnabled = obj.fillEnabled;
    }
    if (obj.strokeColor !== undefined) {
      document.getElementById('strokeColor').value = obj.strokeColor;
      this.strokeColor = obj.strokeColor;
    }
    if (obj.strokeWidth !== undefined) {
      document.getElementById('strokeWidth').value = obj.strokeWidth;
      this.strokeWidth = obj.strokeWidth;
    }
    if (obj.fontSize !== undefined) {
      document.getElementById('fontSize').value = obj.fontSize;
      this.fontSize = obj.fontSize;
    }
    if (obj.opacity !== undefined) {
      document.getElementById('opacity').value = obj.opacity;
      this.opacity = obj.opacity;
    }
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
      image: '⌼',
      connector: '→',
      group: '⊞',
      shape: '⬡'
    };

    if (this.objects.length === 0) {
      layersList.innerHTML = '<div class="component-tree-empty">No objects yet</div>';
      return;
    }

    // Build set of child IDs to skip in main loop (shown under their group)
    const childIds = new Set();
    this.objects.forEach(obj => {
      if (obj.type === 'group') {
        obj.children.forEach(id => childIds.add(id));
      }
    });

    const createLayerItem = (obj, isChild) => {
      const item = document.createElement('div');
      item.className = 'layer-item';
      if (isChild) item.classList.add('layer-child');
      if (obj.type === 'group') {
        item.classList.add('group-item');
        if (obj.locked) item.classList.add('locked');
      }
      if (this.selectedObjects.includes(obj)) {
        item.classList.add('selected');
      }

      // Check if object is off-screen
      const bounds = this.getObjectBounds(obj);
      const screenPos = this.canvasToScreen(bounds.x, bounds.y);
      const screenEndPos = this.canvasToScreen(bounds.x + bounds.width, bounds.y + bounds.height);
      const isOffscreen = screenEndPos.x < 0 || screenPos.x > this.canvas.width ||
                          screenEndPos.y < 0 || screenPos.y > this.canvas.height;

      if (isOffscreen) {
        item.classList.add('offscreen');
      }

      // Build details based on object type
      let details = '';
      const posInfo = `X: ${Math.round(bounds.x)}, Y: ${Math.round(bounds.y)}`;
      const sizeInfo = bounds.width && bounds.height ?
        `${Math.round(bounds.width)} × ${Math.round(bounds.height)}` : '';

      switch (obj.type) {
        case 'text': {
          const textPreview = obj.text.length > 20 ? obj.text.substring(0, 20) + '...' : obj.text;
          details = `
            <span class="layer-text">"${textPreview}"</span>
            <span class="layer-pos">${posInfo}</span>
          `;
          break;
        }
        case 'image':
          details = `<span class="layer-pos">${posInfo} · ${sizeInfo}</span>`;
          break;
        case 'connector': {
          const connFromObj = this.objects.find(o => o.id === obj.fromId);
          const connToObj = this.objects.find(o => o.id === obj.toId);
          const fromName = connFromObj ? `${connFromObj.type.toUpperCase()} ${connFromObj.id}` : 'deleted';
          const toName = connToObj ? `${connToObj.type.toUpperCase()} ${connToObj.id}` : 'deleted';
          details = `<span class="layer-pos">${fromName} → ${toName}</span>`;
          break;
        }
        case 'group': {
          const lockLabel = obj.locked ? '🔒' : '';
          details = `<span class="layer-pos">${obj.children.length} children ${lockLabel} · ${sizeInfo}</span>`;
          break;
        }
        default:
          details = `<span class="layer-pos">${posInfo}${sizeInfo ? ' · ' + sizeInfo : ''}</span>`;
      }

      let groupBtns = '';
      if (obj.type === 'group') {
        const lockIcon = obj.locked ? '🔓' : '🔒';
        const lockTitle = obj.locked ? 'Unlock group' : 'Lock group';
        groupBtns = `
          <button class="layer-action-btn lock-btn${obj.locked ? ' locked' : ''}" title="${lockTitle}">${lockIcon}</button>
          <button class="layer-action-btn ungroup-btn" title="Ungroup (Ctrl+Shift+G)"${obj.locked ? ' disabled' : ''}>⊟</button>
        `;
      }

      item.innerHTML = `
        <div class="layer-header">
          <span class="layer-icon">${icons[obj.type] || '?'}</span>
          <span class="layer-name">${obj.type === 'shape' ? (SHAPE_LIBRARY[obj.shapeType]?.name || 'SHAPE').toUpperCase() : obj.type.toUpperCase()} ${obj.id}</span>
          <div class="layer-actions">
            ${groupBtns}
            <button class="layer-action-btn focus-btn" title="Focus on object">◎</button>
            <button class="layer-action-btn delete-btn" title="Delete">×</button>
          </div>
        </div>
        <div class="layer-details">${details}</div>
      `;

      // Click to select and focus
      item.addEventListener('click', (e) => {
        if (e.target.closest('.layer-actions')) return;

        if (e.shiftKey) {
          if (!this.selectedObjects.includes(obj)) {
            this.selectedObjects.push(obj);
          }
          this.updateStatus();
          this.updateLayers();
          this.render();
        } else {
          this.focusOnObject(obj);
        }
      });

      // Focus button
      const focusBtn = item.querySelector('.focus-btn');
      focusBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.focusOnObject(obj);
      });

      // Delete button
      const deleteBtn = item.querySelector('.delete-btn');
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.selectedObjects = [obj];
        this.deleteSelected();
      });

      // Lock button
      const lockBtnEl = item.querySelector('.lock-btn');
      if (lockBtnEl) {
        lockBtnEl.addEventListener('click', (e) => {
          e.stopPropagation();
          this.selectedObjects = [obj];
          this.toggleGroupLock();
        });
      }

      // Ungroup button
      const ungroupBtnEl = item.querySelector('.ungroup-btn');
      if (ungroupBtnEl) {
        ungroupBtnEl.addEventListener('click', (e) => {
          e.stopPropagation();
          this.selectedObjects = [obj];
          this.ungroupSelected();
        });
      }

      return item;
    };

    [...this.objects].reverse().forEach(obj => {
      // Skip children of groups (shown nested under the group)
      if (childIds.has(obj.id)) return;

      const item = createLayerItem(obj, false);
      layersList.appendChild(item);

      // If it's a group, show its children indented below
      if (obj.type === 'group') {
        const children = this.getGroupChildren(obj);
        children.forEach(child => {
          const childItem = createLayerItem(child, true);
          layersList.appendChild(childItem);
        });
      }
    });
  }

  focusOnObject(obj) {
    const bounds = this.getObjectBounds(obj);
    const centerX = bounds.x + bounds.width / 2;
    const centerY = bounds.y + bounds.height / 2;

    // Calculate offset to center the object on screen
    this.offsetX = this.canvas.width / 2 - centerX * this.scale;
    this.offsetY = this.canvas.height / 2 - centerY * this.scale;

    // Select the object
    this.deselectAll();
    this.selectedObjects.push(obj);

    this.updateStatus();
    this.updateLayers();
    this.render();

    // If it's a text object, activate edit mode
    if (obj.type === 'text') {
      const screenPos = this.canvasToScreen(obj.x, obj.y);
      this.editTextObject(obj, screenPos.x, screenPos.y);
    }
  }

  // ============================================
  // EMBEDDED MODE (postMessage API)
  // ============================================

  initEmbeddedMode() {
    const params = new URLSearchParams(window.location.search);
    this.embedded = params.get('embedded') === 'true' || window.parent !== window;

    if (!this.embedded) return;

    document.body.classList.add('embedded');
    this.initPostMessageAPI();

    // Signal readiness to parent
    window.parent.postMessage({ type: 'hackerpad:ready' }, '*');
  }

  initPostMessageAPI() {
    window.addEventListener('message', (e) => {
      const { type, payload } = e.data || {};

      switch (type) {
        case 'hackerpad:load':
          if (payload) {
            // Accept both { objects: [...] } and raw arrays
            const data = Array.isArray(payload)
              ? { objects: payload }
              : payload;
            if (data.objects) {
              this.loadData(data);
            }
          }
          break;

        case 'hackerpad:getObjects': {
          const objects = this.objects.map(obj => {
            const clone = { ...obj };
            if (clone.type === 'image') delete clone.imageElement;
            return clone;
          });
          window.parent.postMessage({
            type: 'hackerpad:objects',
            objects
          }, '*');
          break;
        }

        case 'hackerpad:clear':
          this.clearAll(true);
          break;

        case 'hackerpad:setTheme':
          if (payload) {
            this.setTheme(payload);
          }
          break;
      }
    });
  }
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
  window.app = new HackerPad();
});
