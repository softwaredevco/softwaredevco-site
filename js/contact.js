"use strict";

const contactForm =
  document.getElementById("contactForm");

const contactMessage =
  document.getElementById("message");

const contactMessageCount =
  document.getElementById("messageCount");

const contactFormStatus =
  document.getElementById("contactFormStatus");

const contactConfirmation =
  document.getElementById("contactConfirmation");

const contactConfirmationCloseButtons =
  document.querySelectorAll(
    "[data-contact-confirmation-close]"
  );

const contactBack =
  document.getElementById("contactBack");


function updateContactMessageCount() {
  if (
    !contactMessage ||
    !contactMessageCount
  ) {
    return;
  }

  contactMessageCount.textContent =
    `${contactMessage.value.length} / 2000`;
}


function showContactStatus(message) {
  if (!contactFormStatus) {
    return;
  }

  contactFormStatus.textContent =
    message;

  contactFormStatus.hidden =
    false;
}


function clearContactStatus() {
  if (!contactFormStatus) {
    return;
  }

  contactFormStatus.textContent =
    "";

  contactFormStatus.hidden =
    true;
}


function openContactConfirmation() {
  if (!contactConfirmation) {
    return;
  }

  contactConfirmation.classList.add(
    "is-open"
  );

  contactConfirmation.setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.classList.add(
    "contact-confirmation-open"
  );

  const confirmationButton =
    contactConfirmation.querySelector(
      ".contact-confirmation-button"
    );

  window.requestAnimationFrame(() => {
    confirmationButton?.focus();
  });
}


function closeContactConfirmation() {
  if (!contactConfirmation) {
    return;
  }

  contactConfirmation.classList.remove(
    "is-open"
  );

  contactConfirmation.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.classList.remove(
    "contact-confirmation-open"
  );
}


async function submitContactForm(event) {
  event.preventDefault();

  if (
    !contactForm ||
    !contactForm.checkValidity()
  ) {
    contactForm?.reportValidity();
    return;
  }

  const submitButton =
    contactForm.querySelector(
      'button[type="submit"]'
    );

  const originalButtonContent =
    submitButton?.innerHTML;

  clearContactStatus();

  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent =
      "Sending Enquiry…";
  }

  try {
    const formData =
      new FormData(contactForm);

    const payload =
      Object.fromEntries(
        formData.entries()
      );

    const response =
      await fetch(
        "https://formsubmit.co/ajax/contact@softwaredevco.co.uk",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            "Accept":
              "application/json"
          },

          body:
            JSON.stringify(payload)
        }
      );

    const result =
      await response.json();

    if (
      !response.ok ||
      result.success === "false"
    ) {
      throw new Error(
        result.message ||
        "The enquiry could not be sent."
      );
    }

    contactForm.reset();

    updateContactMessageCount();

    openContactConfirmation();
  } catch (error) {
    showContactStatus(
      "We couldn’t send your enquiry just now. Please try again, or email contact@softwaredevco.co.uk."
    );

    console.error(
      "SoftwareDevCo contact submission failed:",
      error
    );
  } finally {
    if (submitButton) {
      submitButton.disabled = false;

      if (originalButtonContent) {
        submitButton.innerHTML =
          originalButtonContent;
      }
    }
  }
}


contactMessage?.addEventListener(
  "input",
  updateContactMessageCount
);


contactForm?.addEventListener(
  "submit",
  submitContactForm
);


contactConfirmationCloseButtons.forEach(
  (button) => {
    button.addEventListener(
      "click",
      closeContactConfirmation
    );
  }
);


document.addEventListener(
  "keydown",
  (event) => {
    if (
      event.key === "Escape" &&
      contactConfirmation?.classList.contains(
        "is-open"
      )
    ) {
      closeContactConfirmation();
    }
  }
);


contactBack?.addEventListener(
  "click",
  (event) => {
    if (
      window.history.length > 1
    ) {
      event.preventDefault();

      window.history.back();
    }
  }
);


updateContactMessageCount();