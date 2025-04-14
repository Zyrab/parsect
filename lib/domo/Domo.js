class Domo {
  constructor(el = "div", ns = null) {
    this.ns = ns;
    this.element = this.el(el);
  }
  initApp() {
    this.app = document.getElementById("app");
    this.app = app;
    return this;
  }
  el(el) {
    try {
      return this.ns
        ? document.createElementNS(this.ns, el)
        : document.createElement(el);
    } catch (error) {
      console.error(`Error creating element: ${el}`, error);
      return null;
    }
  }

  id(id) {
    if (id) this.element.id = id;
    return this;
  }

  val(value) {
    if (value !== undefined) this.element.value = value;
    return this;
  }

  txt(text) {
    if (text !== undefined) this.element.textContent = text;
    return this;
  }

  cls(classes) {
    if (classes) {
      this.element.classList.add(...classes.split(" ").filter(Boolean));
    }
    return this;
  }
  rmvCls(classes) {
    if (classes) {
      this.element.classList.remove(...classes.split(" ").filter(Boolean));
    }
    return this;
  }
  attr(attributes = {}) {
    Object.entries(attributes).forEach(([key, value]) => {
      if (!key.startsWith("on") && value != null) {
        this.element.setAttribute(key, value);
      }
    });
    return this;
  }

  css(styles = {}) {
    Object.assign(this.element.style, styles);
    return this;
  }

  on(events = {}) {
    Object.entries(events).forEach(([event, value]) => {
      if (typeof value === "function") {
        this.element.addEventListener(event, value);
      } else if (value && typeof value.callback === "function") {
        this.element.addEventListener(event, value.callback, value.options);
      }
    });
    return this;
  }

  chld(children = []) {
    const flattenedChildren = children.flat();
    flattenedChildren.forEach((child) => {
      if (child instanceof Node) {
        this.element.appendChild(child);
      } else if (typeof child === "string" || typeof child === "number") {
        this.element.appendChild(document.createTextNode(child));
      } else {
        console.warn("Skipping invalid child:", child);
      }
    });
    return this;
  }
  clear() {
    this.element.replaceChildren();
    return this;
  }
  replace(child, newChild) {
    child.replaceWith(newChild);
    if (child === this.element) this.element = newChild;
    return this;
  }

  build() {
    return this.element;
  }
}

export default Domo;
