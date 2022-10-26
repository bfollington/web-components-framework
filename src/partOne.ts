document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <template id="my-component">
    <style>
      * {
        font-weight: bold;
      }
    </style>

    <span>Hello World</span>
  </template>

  <template id="invalid">
    <span>Invalid</span>
  </template>
  
  <my-component></my-component>
`;

function registerCustomElement(tag: string) {
  const node = document.getElementById(tag) as HTMLTemplateElement;
  const content = node.content;

  customElements.define(
    tag,
    class MyElement extends HTMLElement {
      constructor() {
        super();

        this.attachShadow({ mode: "open" });
        this.shadowRoot?.appendChild(content.cloneNode(true));
      }
    }
  );
}

const tagNameRe = /^[a-z\-]+$/;

function validateCustomElementTagName(tag: string) {
  const parts = tag.split("-");
  return parts.length >= 2 && tagNameRe.test(tag);
}

// tests
function runTests() {
  console.log(validateCustomElementTagName("my-component"));
  console.log(validateCustomElementTagName("my-component-again"));
  console.log(validateCustomElementTagName("my"));
  console.log(validateCustomElementTagName("my component"));
  console.log(validateCustomElementTagName("MY COMPONENT"));
}

function scanForCustomElements() {
  // look for all template tags in the page
  // skipping over invalid declarations without halting
  document.querySelectorAll("template").forEach((e) => {
    const id = e.id;
    if (!validateCustomElementTagName(id)) {
      e.insertAdjacentHTML(
        "afterend",
        `<div style="color: red">failed to register template "${id}"</div>`
      );
      console.error("invalid id on template", id, e);
      return;
    }

    registerCustomElement(id);
  });
}

scanForCustomElements();
