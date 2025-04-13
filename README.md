# Parsect

**Parsect** is a utility for converting SVGs into structured, optimized `Path2D` instructions for the HTML5 Canvas API.

It reads raw SVG markup, parses all shapes and styles, and produces a JSON representation that can be rendered with full visual fidelity using Canvas. This tool is meant to be fast, understandable, and composable—useful for rendering, optimizing, or building editors (like [SVecter](https://github.com/Zyrab/SVecter)).

---

## ✨ What It Does

- Parses SVG strings or files into structured JSON
- Supports common shape types: `path`, `rect`, `circle`, `line`, `ellipse`, `polygon`, `polyline`
- Handles styles like `fill`, `stroke`, `opacity`, gradients (linear)
- Converts each shape into Canvas-friendly `Path2D` commands
- Includes a debug view for visualizing shapes individually

---

## 🧠 Why I Built It

I wanted to use SVG art in a canvas-based game but I needed full control over how things are drawn, styled, optimized, and eventually _edited_.  
SVG is great, but canvas is faster for interactive environments.

So instead of relying on black-box libraries, I wrote my own parser:  
**Transparent, hackable, and focused on devs who want to understand their drawing pipeline.**

---

## 📦 Installation

_Coming soon: NPM package_

For now, clone or copy the repo:

```bash
git clone https://github.com/Zyrab/Parsect.git
```

🚀 Usage

```js
import { parseSVG, toPath2D, drawShape } from "./parsect/index.js";

// Your raw SVG string
const raw = `<svg viewBox="...">...</svg>`;

// Step 1: Parse it
const { paths, viewbox } = parseSVG(raw);

// Step 2: convert and cache paths and stylings
const shape = toPath2D({ path, viewbox });

// step 3: in canvas u can draw using
drawShape(ctx, shape);
```

🧪 Example
Coming soon: A full demo repo with live visual rendering and dev tools.
Until then, check out the /examples folder for sample input and output.

🗂 Project Structure
bash
Copy code
/parsect
├── parser/ # SVG -> JSON converter
├── renderer/ # JSON -> Canvas Path2D
├── debug/ # Utilities to visualize each shape separately
└── utils/ # Style parsing, gradient handling, etc.
🔮 Roadmap
Add <g> group + transform support

Improve gradient fidelity + edge cases

Optimize merging logic for large SVGs

Create web-based visual inspector

Publish to NPM

🛠 Built With
JavaScript (vanilla)

Canvas API

Passion for visuals and structured chaos

🙋‍♂️ Who Made This?
Hi, I’m Zura.
I build tools, engines, and educational stuff—sometimes for kids, sometimes for devs like you.
This project is part of a larger effort to build SVecter: a 2D canvas engine with SVG editing support.

Check out:

🌐 zyrab.dev

📚 Blogs

🐛 Unusual Bugs

📬 Contributing
Pull requests are welcome. If you find bugs, weird edge cases, or have ideas to improve the structure or API, feel free to open an issue or PR.
Keep it clean. Keep it composable. Keep it fun.
