"use strict";

const loader = document.getElementById("loader");

const LOADER_DURATION = 3600;

window.addEventListener("load", () => {
  window.setTimeout(() => {
    document.body.classList.remove("is-loading");
    document.body.classList.add("is-ready");

    if (loader) {
      loader.classList.add("loader-complete");
    }
  }, LOADER_DURATION);
});

if (loader) {
  loader.addEventListener("transitionend", (event) => {
    if (
      event.propertyName === "opacity" &&
      loader.classList.contains("loader-complete")
    ) {
      loader.remove();
    }
  });
}