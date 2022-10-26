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
  [],
  (_) =>
    `<div>
      <test-component name="Ben" age="99"></test-component>
      <test-component name="Bob" age="98"></test-component>
      <test-component name="Mel" age="101"></test-component>
    </div>`
);

const mount = document.querySelector("#mount");
if (mount) {
  mount.innerHTML = `<parent-component></parent-component>`;
}

// const c = document.querySelector("#update-me");
// c?.setAttribute("name", "Bob");
