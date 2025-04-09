# Parsect

**Parsect** is a utility for converting SVGs into structured, optimized `Path2D` instructions for the HTML5 Canvas API.

It reads raw SVG markup, parses all shapes and styles, and produces a JSON representation that can be rendered with full visual fidelity using Canvas. This tool is meant to be fast, understandable, and composable—useful for rendering, optimizing, or building editors (like [SVecter](https://github.com/Zyrab/SVecter)).

---

## ✨ What It Does

- Parses SVG strings or files into structured JSON
- Supports common shape types: `path`, `rect`, `circle`, `line`, `ellipse`, `polygon`, `polyline`
- Handles styles like `fill`, `stroke`, `opacity`, gradients (linear/radial)
- Converts each shape into Canvas-friendly `Path2D` commands
- Includes a debug view for visualizing shapes individually
- Allows grouping and merging of similar shapes (e.g. same fill/stroke) to reduce draw calls

---

## 🧠 Why I Built It

I wanted to use SVG art in a canvas-based game but I needed full control over how things are drawn, styled, optimized, and eventually *edited*.  
SVG is great, but canvas is faster for interactive environments.

So instead of relying on black-box libraries, I wrote my own parser:  
**Transparent, hackable, and focused on devs who want to understand their drawing pipeline.**

---

## 📦 Installation

_Coming soon: NPM package_

For now, clone or copy the repo:

```bash
git clone https://github.com/Zyrab/Parsect.git
