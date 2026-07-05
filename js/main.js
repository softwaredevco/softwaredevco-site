/* ============================================================
   SoftwareDevCo — loader + hero
   The logo charges bottom-to-top in sync with a progress
   counter, pulses at 100%, then the loader lifts away and
   the hero content staggers in.
   ============================================================ */

(function () {
  "use strict";

  var loader = document.getElementById("loader");
  var logoFill = document.getElementById("logoFill");
  var chargeLight = document.getElementById("chargeLight");
  var countEl = document.getElementById("loadingCount");
  var logoBox = document.querySelector(".logo-loader");

  var reducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- config ----------
  var MIN_DURATION = 2400;  // loader always plays at least this long (ms)
  var HOLD_AT_FULL = 650;   // pause on the fully-charged logo before reveal

  var pageLoaded = document.readyState === "complete";
  window.addEventListener("load", function () {
    pageLoaded = true;
  });

  if (reducedMotion) {
    // Skip the show entirely for users who prefer reduced motion
    setCharge(100);
    finish(0);
    return;
  }

  // ---------- charge animation ----------
  var start = performance.now();

  // easeInOutCubic — slow start, confident middle, gentle landing
  function ease(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function setCharge(pct) {
    var top = 100 - pct;

    // Reveal the bright logo from the bottom up
    logoFill.style.clipPath = "inset(" + top + "% 0 0 0)";

    // The light line rides the charge level
    chargeLight.style.bottom = pct + "%";
    chargeLight.style.opacity = pct > 1 && pct < 99 ? "1" : "0";

    // Under-glow grows with charge
    if (logoBox) logoBox.style.setProperty("--charge", (pct / 100).toFixed(3));

    // Counter
    countEl.textContent = String(Math.round(pct)).padStart(2, "0");
  }

  function tick(now) {
    var t = Math.min((now - start) / MIN_DURATION, 1);
    var target = ease(t) * 100;

    // Never claim 100% until the page has actually finished loading
    if (!pageLoaded) target = Math.min(target, 92);

    setCharge(target);

    if (target >= 100) {
      onFullyCharged();
    } else {
      requestAnimationFrame(tick);
    }
  }

  requestAnimationFrame(tick);

  // ---------- fully charged ----------
  function onFullyCharged() {
    countEl.textContent = "100";
    loader.classList.add("is-charged"); // bright pulse
    finish(HOLD_AT_FULL);
  }

  function finish(delay) {
    setTimeout(function () {
      loader.classList.add("is-done");     // panel wipes up
      document.body.classList.remove("is-loading");
      document.body.classList.add("is-ready"); // nav + hero stagger in

      // Remove the loader from the page once its exit finishes
      setTimeout(function () {
        loader.classList.add("is-hidden");
      }, 1000);

      startRotator();
    }, delay);
  }

  // ---------- headline word rotator ----------
  function startRotator() {
    var words = document.querySelectorAll("#rotator .rotator-word");
    if (words.length < 2 || reducedMotion) return;

    var index = 0;
    setInterval(function () {
      words[index].classList.remove("is-active");
      index = (index + 1) % words.length;
      words[index].classList.add("is-active");
    }, 3200);
  }
})();