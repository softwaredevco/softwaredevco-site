"use strict";


const projectModal =
  document.getElementById("projectModal");

const projectModalOpenButtons =
  document.querySelectorAll(
    "[data-project-modal-open]"
  );

const projectModalCloseButtons =
  document.querySelectorAll(
    "[data-project-modal-close]"
  );


let projectModalPreviousFocus = null;


/* ============================================================
   GET FOCUSABLE ELEMENTS
   ============================================================ */

function getProjectModalFocusableElements() {
  if (!projectModal) {
    return [];
  }

  return Array.from(
    projectModal.querySelectorAll(
      [
        "a[href]",
        "button:not([disabled])",
        "input:not([disabled])",
        "select:not([disabled])",
        "textarea:not([disabled])",
        '[tabindex]:not([tabindex="-1"])'
      ].join(",")
    )
  );
}


/* ============================================================
   OPEN MODAL
   ============================================================ */

function openProjectModal(event) {
  if (event) {
    event.preventDefault();
  }

  if (!projectModal) {
    return;
  }

  projectModalPreviousFocus =
    document.activeElement;

  projectModal.classList.add("is-open");

  projectModal.setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.classList.add(
    "project-modal-open"
  );

  const focusableElements =
    getProjectModalFocusableElements();

  window.requestAnimationFrame(() => {
    focusableElements[0]?.focus();
  });
}


/* ============================================================
   CLOSE MODAL
   ============================================================ */

function closeProjectModal() {
  if (!projectModal) {
    return;
  }

  projectModal.classList.remove("is-open");

  projectModal.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.classList.remove(
    "project-modal-open"
  );

  if (
    projectModalPreviousFocus instanceof
    HTMLElement
  ) {
    projectModalPreviousFocus.focus();
  }
}


/* ============================================================
   RESTORE MODAL WHEN RETURNING WITH BROWSER HISTORY
   ============================================================ */

function restoreProjectModalFromHistory() {
  if (!projectModal) {
    return;
  }

  /*
    When contact.html calls history.back(), browsers normally
    restore the homepage from the back-forward cache.

    The popup was open when the visitor left the homepage, so
    this confirms that it remains open when the cached page is
    restored. No loader animation is replayed.
  */

  if (
    projectModal.classList.contains("is-open")
  ) {
    projectModal.setAttribute(
      "aria-hidden",
      "false"
    );

    document.body.classList.add(
      "project-modal-open"
    );
  }
}


/* ============================================================
   KEYBOARD HANDLING
   ============================================================ */

function handleProjectModalKeyboard(event) {
  if (
    !projectModal ||
    !projectModal.classList.contains("is-open")
  ) {
    return;
  }

  if (event.key === "Escape") {
    closeProjectModal();
    return;
  }

  if (event.key !== "Tab") {
    return;
  }

  const focusableElements =
    getProjectModalFocusableElements();

  if (focusableElements.length === 0) {
    event.preventDefault();
    return;
  }

  const firstElement =
    focusableElements[0];

  const lastElement =
    focusableElements[
      focusableElements.length - 1
    ];

  if (
    event.shiftKey &&
    document.activeElement === firstElement
  ) {
    event.preventDefault();
    lastElement.focus();
    return;
  }

  if (
    !event.shiftKey &&
    document.activeElement === lastElement
  ) {
    event.preventDefault();
    firstElement.focus();
  }
}


/* ============================================================
   EVENT LISTENERS
   ============================================================ */

projectModalOpenButtons.forEach((button) => {
  button.addEventListener(
    "click",
    openProjectModal
  );
});


projectModalCloseButtons.forEach((button) => {
  button.addEventListener(
    "click",
    closeProjectModal
  );
});


document.addEventListener(
  "keydown",
  handleProjectModalKeyboard
);


/*
  The pageshow event also runs when a browser restores the
  homepage from its back-forward cache.
*/

window.addEventListener(
  "pageshow",
  restoreProjectModalFromHistory
);