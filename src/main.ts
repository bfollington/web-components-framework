import { createComponent } from "./createComponent";
import { createTemplatedComponent } from "./createTemplatedComponent";

createTemplatedComponent(
  "numeric-value",
  ["value"],
  `<code><slot name="value"></slot></code>`
);

createTemplatedComponent(
  "test-component",
  ["name", "age"],
  `<div>
      <slot name="name"></slot>
      (<numeric-value>
        <span slot="value"><slot name="age"></slot></span>
      </numeric-value>)
    </div>`
);

createComponent(
  "parent-component",
  ["base-age"],
  (props) =>
    `<div>
      <test-component>
        <span slot="name">Ben</span>
        <span slot="age">${parseInt(props["base-age"]) - 1}</span> ">
      </test-component>
      <test-component>
        <span slot="name">Bob</span>
        <span slot="age">${parseInt(props["base-age"]) - 2}</span> ">
      </test-component>
      <test-component>
        <span slot="name">Mel</span>
        <span slot="age">${parseInt(props["base-age"]) + 2}</span> ">
      </test-component>
      <button id="add-button">+</button>
    </div>`,
  (s: ShadowRoot) => {
    const onClick = () => incrementAge();
    const button = s.querySelector("#add-button");

    button?.addEventListener("click", onClick);

    return () => {
      button?.removeEventListener("click", onClick);
    };
  }
);

// Simulating some kind of external state / effects changing
// attributes on the root node

let baseAge = 100;
let started = false;
function incrementAge() {
  baseAge++;
  render();
}

function render() {
  const mount = document.querySelector("#mount");
  if (!mount) throw new Error("missing mountpoint");
  if (started) {
    mount
      ?.querySelector("parent-component")
      ?.setAttribute("base-age", baseAge.toString());
  } else {
    mount.innerHTML = `<parent-component base-age="${baseAge}"></parent-component>`;
  }

  started = true;
}

render();
