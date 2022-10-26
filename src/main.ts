import { Component, createComponent } from "./functional";

createComponent("test-component", ["name"], ({ name }) => `<div>${name}</div>`);

const mount = document.querySelector("#mount");
if (mount) {
  mount.innerHTML = `<test-component id="update-me" name="Ben"></test-component>`;
}

// const c = document.querySelector("#update-me");
// c?.setAttribute("name", "Bob");
