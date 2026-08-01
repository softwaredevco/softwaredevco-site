"use strict";


/* ============================================================
   ELEMENTS
   ============================================================ */

const loader = document.getElementById("loader");
const loaderLogo = document.getElementById("loaderLogo");
const navLogo = document.getElementById("navLogo");


/* ============================================================
   ANIMATION TIMINGS
   These timings match the loader.css animations.
   ============================================================ */

const LOGO_CHARGE_DURATION = 4000;
const CHARGED_LOGO_PAUSE = 50;
const LOGO_MOVE_DURATION = 650;
const LOADER_FADE_DURATION = 250;


/* ============================================================
   ACCESSIBILITY
   ============================================================ */

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
);


/* ============================================================
   REVEAL WEBSITE
   ============================================================ */

function revealWebsite() {
  document.body.classList.remove("is-loading");
  document.body.classList.add("is-ready");

  if (navLogo) {
    navLogo.classList.add("has-arrived");
  }

  if (loader) {
    loader.classList.add("loader-complete");
  }

  window.setTimeout(() => {
    if (loader && loader.parentNode) {
      loader.remove();
    }
  }, LOADER_FADE_DURATION);
}


/* ============================================================
   MOVE LOADER LOGO INTO THE NAVIGATION
   ============================================================ */

function moveLogoToNavigation() {
  if (!loader || !loaderLogo || !navLogo) {
    revealWebsite();
    return;
  }

  const navLogoImage = navLogo.querySelector("img");

  if (!navLogoImage) {
    revealWebsite();
    return;
  }

  /*
    Measure the final navigation logo position.

    The navigation logo remains hidden visually, but it still occupies
    its correct position in the document, allowing accurate measurement.
  */

  const targetRect = navLogoImage.getBoundingClientRect();

  if (
    targetRect.width === 0 ||
    targetRect.height === 0
  ) {
    revealWebsite();
    return;
  }

  const targetCentreX =
    targetRect.left + targetRect.width / 2;

  const targetCentreY =
    targetRect.top + targetRect.height / 2;


  /*
    Remove the entrance animation before starting the movement.
    This prevents the entrance keyframes from overriding the new
    top, left and width values.
  */

  loaderLogo.classList.add("is-moving");

  /*
    Force the browser to apply the class before setting the new
    destination values.
  */

  void loaderLogo.offsetWidth;


  /*
    Move the centre of the loading logo to the centre of the
    navigation logo and resize it to exactly the same width.
  */

  window.requestAnimationFrame(() => {
    loaderLogo.style.top = `${targetCentreY}px`;
    loaderLogo.style.left = `${targetCentreX}px`;
    loaderLogo.style.width = `${targetRect.width}px`;

    loaderLogo.style.transform =
      "translate(-50%, -50%) scale(1)";
  });


  /*
    When the travelling logo reaches the header:

    1. Show the real navigation logo.
    2. Reveal the navigation links and hero.
    3. Fade the loader away.
  */

  window.setTimeout(() => {
    revealWebsite();
  }, LOGO_MOVE_DURATION);
}


/* ============================================================
   START LOADER SEQUENCE
   ============================================================ */

function startLoaderSequence() {
  if (prefersReducedMotion.matches) {
    window.setTimeout(revealWebsite, 150);
    return;
  }

  const movementStart =
    LOGO_CHARGE_DURATION + CHARGED_LOGO_PAUSE;

  window.setTimeout(
    moveLogoToNavigation,
    movementStart
  );
}


/* ============================================================
   PAGE LOAD
   ============================================================ */

window.addEventListener("load", startLoaderSequence);


/* ============================================================
   SAFETY FALLBACK

   If an unexpected browser issue prevents the normal sequence,
   never leave the visitor permanently trapped on the loader.
   ============================================================ */

window.setTimeout(() => {
  if (
    document.body.classList.contains("is-loading")
  ) {
    revealWebsite();
  }
}, 8500);