"use strict";

const loader = document.getElementById("loader");
const loaderLogo = document.getElementById("loaderLogo");
const loaderFill = document.querySelector(".loader-fill");
const navLogo = document.getElementById("navLogo");

const LOGO_MOVE_DURATION = 650;
const LOADER_FADE_DURATION = 300;

let transitionStarted = false;

function revealWebsite() {
  document.body.classList.remove("is-loading");
  document.body.classList.add("is-ready");

  navLogo?.classList.add("has-arrived");
  loader?.classList.add("loader-complete");

  window.setTimeout(() => {
    loader?.remove();
  }, LOADER_FADE_DURATION);
}

function moveLogoToNavigation() {
  if (transitionStarted) {
    return;
  }

  transitionStarted = true;

  const navLogoImage = navLogo?.querySelector("img");

  if (!loaderLogo || !navLogoImage) {
    revealWebsite();
    return;
  }

  const targetRect = navLogoImage.getBoundingClientRect();

  if (targetRect.width === 0 || targetRect.height === 0) {
    revealWebsite();
    return;
  }

  const targetCentreX =
    targetRect.left + targetRect.width / 2;

  const targetCentreY =
    targetRect.top + targetRect.height / 2;

  loaderLogo.classList.add("is-moving");

  /*
   * Read the current layout so the browser recognises the
   * centred position as the starting point.
   */
  loaderLogo.getBoundingClientRect();

  /*
   * Set the destination immediately when charging finishes.
   */
  loaderLogo.style.top = `${targetCentreY}px`;
  loaderLogo.style.left = `${targetCentreX}px`;
  loaderLogo.style.width = `${targetRect.width}px`;
  loaderLogo.style.transform = "translate(-50%, -50%)";

  window.setTimeout(
    revealWebsite,
    LOGO_MOVE_DURATION
  );
}

function startLoaderSequence() {
  if (!loaderFill) {
    moveLogoToNavigation();
    return;
  }

  loaderFill.addEventListener(
    "animationend",
    (event) => {
      if (event.animationName === "chargeLogoBottomToTop") {
        moveLogoToNavigation();
      }
    },
    { once: true }
  );
}

window.addEventListener("load", startLoaderSequence);

/* Safety fallback */
window.setTimeout(() => {
  if (
    document.body.classList.contains("is-loading") &&
    !transitionStarted
  ) {
    moveLogoToNavigation();
  }
}, 4000);