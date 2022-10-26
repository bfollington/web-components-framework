import { createComponent } from "./functional";

createComponent(
  "numeric-value",
  ["value"],
  ({ value }) => `<code>${value}</code>`
);

createComponent(
  "test-component",
  ["name", "age"],
  ({ name, age }) =>
    `<div>
      ${name}
      (<numeric-value value="${age}"></numeric-value>)
    </div>`
);

createComponent(
  "parent-component",
  ["base-age"],
  (props) =>
    `<div>
      <test-component
        name="Ben" 
        age="${parseInt(props["base-age"]) - 2}">
      </test-component>
      <test-component
        name="Bob"
        age="${parseInt(props["base-age"]) - 1}">
      </test-component>
      <test-component
        name="Mel"
        age="${parseInt(props["base-age"]) + 1}">
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
