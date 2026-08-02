"use strict";

const mobileMenuToggle =
    document.getElementById("mobileMenuToggle");

const mobileMenu =
    document.getElementById("mobileMenu");

const mobileMenuCloseLinks =
    document.querySelectorAll("[data-mobile-menu-close]");

function openMobileMenu() {

    if (!mobileMenu || !mobileMenuToggle) {
        return;
    }

    mobileMenu.classList.add("is-open");
    mobileMenuToggle.classList.add("is-active");

    mobileMenu.setAttribute("aria-hidden", "false");

    mobileMenuToggle.setAttribute(
        "aria-expanded",
        "true"
    );

    document.body.classList.add(
        "mobile-menu-open"
    );

}

function closeMobileMenu() {

    if (!mobileMenu || !mobileMenuToggle) {
        return;
    }

    mobileMenu.classList.remove("is-open");
    mobileMenuToggle.classList.remove("is-active");

    mobileMenu.setAttribute("aria-hidden", "true");

    mobileMenuToggle.setAttribute(
        "aria-expanded",
        "false"
    );

    document.body.classList.remove(
        "mobile-menu-open"
    );

}

mobileMenuToggle?.addEventListener(
    "click",
    () => {

        if (
            mobileMenu.classList.contains("is-open")
        ) {

            closeMobileMenu();

        } else {

            openMobileMenu();

        }

    }
);

mobileMenuCloseLinks.forEach(link => {

    link.addEventListener(
        "click",
        closeMobileMenu
    );

});

window.addEventListener(
    "resize",
    () => {

        if (
            window.innerWidth > 800 &&
            mobileMenu.classList.contains("is-open")
        ) {

            closeMobileMenu();

        }

    }
);

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            mobileMenu.classList.contains("is-open")
        ) {

            closeMobileMenu();

        }

    }
);