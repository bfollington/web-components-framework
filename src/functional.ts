type State = any;
type RenderFn = (a: State) => string;

export interface Component extends HTMLElement {
  state: State;
}

export function createComponent(
  tag: string,
  props: string[],
  render: RenderFn
) {
  // Only register component once
  if (customElements.get(tag)) {
    console.log("already registered", tag);
    return;
  }

  class InnerComponent extends HTMLElement {
    _state: { [key: string]: string } = {};

    static observedAttributes = props;
    private _listening: boolean = false;

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
      if (this._listening) {
        console.log("attribute triggered render", name);
        this.render();
      }
    }

    render() {
      const shadow = this.shadowRoot;
      if (shadow) {
        shadow.innerHTML = render(this._state);
      }
      console.log("render");
    }

    connectedCallback() {
      console.log("connected");
      this._listening = true;
      this.render();
    }

    disconnectedCallback() {
      console.log("disconnected");
      this._listening = false;
    }
  }

  customElements.define(tag, InnerComponent);
}
