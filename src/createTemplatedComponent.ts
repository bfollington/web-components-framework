export function createTemplateComponent(
  tag: string,
  props: string[],
  template: string,
  effects?: (e: ShadowRoot) => () => void
) {
  // Only register component once
  if (customElements.get(tag)) {
    console.log("already registered", tag);
    return;
  }

  document.body.insertAdjacentHTML(
    "afterbegin",
    `<template id="${tag}">${template}</template>`
  );
  const templateElement = document.createElement("template");
  templateElement.id = tag;
  templateElement.innerHTML = template;
  document.body.insertAdjacentElement("afterbegin", templateElement);

  class InnerComponent extends HTMLElement {
    _state: { [key: string]: string } = {};

    static observedAttributes = props;
    private _listening: boolean = false;
    private _cleanup?: () => void;

    constructor() {
      super();

      this.attachShadow({ mode: "open" });
    }

    attributeChangedCallback(name: string, oldVal: string, newVal: string) {
      // skip pointless render
      if (oldVal === newVal) return;

      this._state[name] = newVal;

      // don't render until we've had our intial render
      if (this._listening) {
        console.log("attribute changed", name);
        this.render();
      }
    }

    render() {
      if (this._cleanup) {
        this._cleanup();
      }

      const shadow = this.shadowRoot;
      if (shadow) {
        shadow.innerHTML = ``;
        shadow.appendChild(templateElement.content.cloneNode(true));

        if (effects) {
          // effects returns a cleanup fn
          // inspired by useEffect in React
          this._cleanup = effects(shadow);
        }
      }
      console.log("render");
    }

    connectedCallback() {
      console.log("connected");
      this._listening = true;
      this.render();
    }

    disconnectedCallback() {
      if (this._cleanup) {
        this._cleanup();
      }

      console.log("disconnected");
      this._listening = false;
    }
  }

  customElements.define(tag, InnerComponent);
}
