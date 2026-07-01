// Shared behavior for all TerreDeFrance pages:
// mobile nav toggle, current-page highlighting, header scroll state,
// and scroll-triggered reveal animations.
document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".main-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }

  var currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".main-nav a").forEach(function (link) {
    var linkPage = link.getAttribute("href");
    if (linkPage === currentPage) {
      link.setAttribute("aria-current", "page");
      var parentDropdown = link.closest(".has-dropdown");
      if (parentDropdown) {
        parentDropdown.querySelector(".dropdown-toggle").classList.add("active-parent");
      }
    }
  });

  // Dropdown menu (e.g. "Topics") opens on hover/focus via CSS; keep aria-expanded in sync.
  document.querySelectorAll(".has-dropdown").forEach(function (item) {
    var dropdownToggle = item.querySelector(".dropdown-toggle");
    if (!dropdownToggle) return;

    item.addEventListener("mouseenter", function () {
      dropdownToggle.setAttribute("aria-expanded", "true");
    });
    item.addEventListener("mouseleave", function () {
      dropdownToggle.setAttribute("aria-expanded", "false");
    });
    item.addEventListener("focusin", function () {
      dropdownToggle.setAttribute("aria-expanded", "true");
    });
    item.addEventListener("focusout", function () {
      if (!item.contains(document.activeElement)) {
        dropdownToggle.setAttribute("aria-expanded", "false");
      }
    });
  });

  // Header gains a background/shadow once the page has scrolled a bit.
  var header = document.querySelector(".site-header");
  if (header) {
    var updateHeaderState = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    updateHeaderState();
    window.addEventListener("scroll", updateHeaderState, { passive: true });
  }

  // Fade/slide in key content blocks as they enter the viewport.
  var revealTargets = document.querySelectorAll(
    ".hero, main > section, .card, .callout, blockquote.scripture"
  );

  if (revealTargets.length) {
    revealTargets.forEach(function (el) {
      el.setAttribute("data-reveal", "");
    });

    var prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      revealTargets.forEach(function (el) {
        el.classList.add("is-visible");
      });
    } else {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
      );

      revealTargets.forEach(function (el) {
        observer.observe(el);
      });
    }
  }
});
