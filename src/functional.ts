type State = any;
type RenderFn = (a: State) => string;

export interface Component extends HTMLElement {
  state: State;
}

export function createComponent<S extends State>(
  tag: string,
  render: RenderFn
) {
  // Only register component once
  if (customElements.get(tag)) {
    console.log("already registered", tag);
    return;
  }

  class InnerComponent extends HTMLElement {
    _state: { [key: string]: string } = {};

    static observedAttributes = ["name"];

    constructor() {
      super();

      this.attachShadow({ mode: "open" });

      // InnerComponent.observedAttributes.forEach(a => {
      //   this._state[a] = this.getAttribute('a')
      // })
    }

    attributeChangedCallback(name: string, oldVal: string, newVal: string) {
      // skip pointless render
      if (oldVal === newVal) return;

      this._state[name] = newVal;
      if (this.isConnected) {
        console.log("attribute triggered render", name);
        this.render();
      }
    }

    render() {
      const shadow = this.shadowRoot;
      if (shadow) {
        shadow.innerHTML = render(this._state);
      }
      console.log("did render");
    }

    connectedCallback() {
      console.log("connected render");
      this.render();
    }
  }

  customElements.define(tag, InnerComponent);
}
