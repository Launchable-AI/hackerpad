# HACKERPAD

A cyberpunk-themed canvas drawing application built with vanilla JavaScript. No frameworks, no dependencies - just pure HTML, CSS, and JS.

![HACKERPAD Screenshot](public/screenshot.png)

## Features

### Drawing Tools
- **Select (S)** - Select and manipulate objects
- **Pan (H)** - Pan around the canvas
- **Draw (D)** - Freehand drawing
- **Line (L)** - Draw straight lines
- **Rectangle (R)** - Draw rectangles
- **Ellipse (E)** - Draw ellipses
- **Text (T)** - Add text with multiline support
- **Image (I)** - Import images
- **Connect (C)** - Create connectors between objects

### Interface
- **Right-click radial menu** - Quick tool access with a HUD-style circular menu
- **Properties panel** - Adjust stroke, fill, opacity, and font size
- **Color palette** - Save up to 10 colors for quick access (persisted to localStorage)
- **Component tree** - View and manage all objects on the canvas
- **Zoom controls** - Zoom in/out with mouse wheel or buttons

### Text Editing
- Double-click text to edit in place
- **Enter** - Confirm text and switch to select tool
- **Shift+Enter** - Add new line
- **Escape** - Cancel editing
- Resize text by dragging corner handles

### Projects
- Save/load projects to localStorage
- Export/import projects as JSON files
- Projects persist across browser sessions

### Keyboard Shortcuts
| Key | Action |
|-----|--------|
| S | Select tool |
| H | Pan tool |
| D | Draw tool |
| L | Line tool |
| R | Rectangle tool |
| E | Ellipse tool |
| T | Text tool |
| I | Image tool |
| C | Connect tool |
| Ctrl+Z | Undo |
| Ctrl+Y | Redo |
| Delete/Backspace | Delete selected |
| Escape | Deselect all |

## Getting Started

Just open `public/index.html` in a browser, or serve it with any static file server:

```bash
# Using Python
python -m http.server 8000 --directory public

# Using Node.js
npx serve public

# Using PHP
php -S localhost:8000 -t public
```

## Tech Stack

- Vanilla JavaScript (ES6+)
- HTML5 Canvas
- CSS3 with custom properties
- localStorage for persistence
- No external dependencies

## License

MIT

---

Built by [Launchable AI](https://launchable.ai)
