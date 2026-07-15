/* ==========================================================================
   STUDIO GERTH — main.js
   Vanilla JS, kein Build-Step. Progressive Enhancement:
   - IntersectionObserver für Reveal-on-Scroll
   - requestAnimationFrame für Hero-Choreografie & Parallax-Fallback
   - CSS Scroll-Driven Animations werden genutzt, wo der Browser sie kann;
     sonst übernimmt JS (Feature-Detection unten)
   - prefers-reduced-motion deaktiviert alle Bewegungen
   ========================================================================== */
(function () {
  "use strict";

  /* JS ist aktiv — no-js-Fallbacks abschalten */
  document.documentElement.classList.remove("no-js");

  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion) {
    /* Ruhige Alternative: statisches Layout, keine Scroll-Choreografie */
    document.documentElement.classList.add("reduced-motion");
  }

  var supportsScrollTimeline =
    typeof CSS !== "undefined" &&
    CSS.supports &&
    CSS.supports("animation-timeline: scroll()");

  /* ------------------------------------------------------------------------
     1. Header: transparent → Cream mit Schatten nach dem ersten Scrollen
     ------------------------------------------------------------------------ */
  var header = document.querySelector(".site-header");

  function updateHeader() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  }

  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();

  /* ------------------------------------------------------------------------
     2. Mobiles Overlay-Menü
     ------------------------------------------------------------------------ */
  var navToggle = document.querySelector(".nav-toggle");
  var navOverlay = document.querySelector(".nav-overlay");

  function setMenu(open) {
    if (!navToggle || !navOverlay) return;
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute(
      "aria-label",
      open ? "Menü schließen" : "Menü öffnen"
    );
    navOverlay.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-open", open);
  }

  if (navToggle && navOverlay) {
    navToggle.addEventListener("click", function () {
      setMenu(navToggle.getAttribute("aria-expanded") !== "true");
    });

    navOverlay.addEventListener("click", function (event) {
      if (event.target.closest("a")) setMenu(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") setMenu(false);
    });
  }

  /* ------------------------------------------------------------------------
     3. Reveal-on-Scroll per IntersectionObserver
        Elemente tragen data-reveal (up | fade | left | right) und optional
        style="--reveal-delay: 0.15s" für Staffelungen.
     ------------------------------------------------------------------------ */
  var revealTargets = document.querySelectorAll("[data-reveal]");

  if (revealTargets.length && "IntersectionObserver" in window && !prefersReducedMotion) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.15 }
    );

    revealTargets.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    /* Fallback: alles sofort sichtbar */
    revealTargets.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ------------------------------------------------------------------------
     4. Hero-Choreografie (Startseite)
        Die Hero-Sektion ist 340vh hoch, die Bühne klebt im Viewport.
        Der Scroll-Fortschritt (0–1) steuert:
        - drei Statement-Zeilen, die nacheinander ein- und ausblenden
        - die Farbüberblendung Navy → Cream
        - einen sanften Zoom der Seiden-Textur
     ------------------------------------------------------------------------ */
  var hero = document.querySelector("[data-hero]");

  /* Einstiegs-Clip: Verdunkelungs-Overlay nur zuschalten, wenn der Clip
     tatsächlich lädt (siehe .hero-stage.has-video in css/style.css).
     Ohne Videodatei bleibt die reine Seiden-Textur unverändert sichtbar. */
  var heroStage = hero && hero.querySelector(".hero-stage");
  var heroVideoEl = heroStage && heroStage.querySelector(".hero-video");

  if (heroVideoEl) {
    if (prefersReducedMotion) {
      heroVideoEl.pause();
      heroVideoEl.removeAttribute("autoplay");
    } else {
      var markHeroVideoLoaded = function () {
        heroStage.classList.add("has-video");
      };
      heroVideoEl.addEventListener("loadeddata", markHeroVideoLoaded);
      heroVideoEl.addEventListener("error", function () {
        heroStage.classList.remove("has-video");
      });
      if (heroVideoEl.readyState >= 2) markHeroVideoLoaded();
    }
  }

  if (hero && !prefersReducedMotion) {
    var heroLines = hero.querySelectorAll(".hero-line");
    var heroWash = hero.querySelector(".hero-wash");
    var heroSilk = hero.querySelector(".hero-silk");
    var heroCue = hero.querySelector(".hero-cue");
    var heroKicker = hero.querySelector(".hero-kicker");
    var heroTicking = false;

    var clamp01 = function (v) {
      return Math.min(1, Math.max(0, v));
    };

    /* Glockenkurve: Zeile blendet um ihre Phasenmitte ein und wieder aus */
    var lineOpacity = function (progress, center, width) {
      var d = Math.abs(progress - center) / width;
      return clamp01(1 - d * d * 1.6);
    };

    var renderHero = function () {
      heroTicking = false;

      var total = hero.offsetHeight - window.innerHeight;
      if (total <= 0) return;
      var progress = clamp01(-hero.getBoundingClientRect().top / total);

      /* Drei Phasen: Zeile 1 steht beim Laden, Zeile 2 um 0.42,
         die letzte Zeile blendet ab 0.62 ein und bleibt stehen */
      heroLines.forEach(function (line, i) {
        var isLast = i === heroLines.length - 1;
        var opacity;
        var drift;
        if (isLast) {
          opacity = clamp01((progress - 0.62) / 0.2);
          drift = (1 - opacity) * 2.5;
        } else if (i === 0) {
          opacity = progress <= 0.08 ? 1 : clamp01(1 - (progress - 0.08) / 0.16);
          drift = progress * -10;
        } else {
          opacity = lineOpacity(progress, 0.42, 0.17);
          drift = (0.42 - progress) * -14;
        }
        line.style.opacity = opacity.toFixed(3);
        line.style.transform =
          "translateY(" + drift.toFixed(2) + "rem) scale(" +
          (0.985 + opacity * 0.015).toFixed(4) + ")";
      });

      /* Farbüberblendung Navy → Cream im letzten Drittel */
      if (heroWash) {
        heroWash.style.opacity = clamp01((progress - 0.58) / 0.24).toFixed(3);
      }

      /* Seide zoomt kaum merklich — Ruhe statt Effekthascherei */
      if (heroSilk) {
        heroSilk.style.transform = "scale(" + (1 + progress * 0.12).toFixed(4) + ")";
      }

      if (heroCue) {
        heroCue.style.opacity = clamp01(1 - progress * 6).toFixed(3);
      }

      if (heroKicker) {
        heroKicker.style.opacity = clamp01(1 - (progress - 0.5) / 0.15).toFixed(3);
      }
    };

    var requestHeroFrame = function () {
      if (!heroTicking) {
        heroTicking = true;
        window.requestAnimationFrame(renderHero);
      }
    };

    window.addEventListener("scroll", requestHeroFrame, { passive: true });
    window.addEventListener("resize", requestHeroFrame);
    renderHero();
  }

  /* ------------------------------------------------------------------------
     5. JS-Fallbacks für Scroll-Driven Animations
        (Lesebalken & Statement-Parallax, falls animation-timeline fehlt)
     ------------------------------------------------------------------------ */
  if (!supportsScrollTimeline && !prefersReducedMotion) {
    var progressBar = document.querySelector(".scroll-progress");
    var statementBgs = document.querySelectorAll(".statement-bg");
    var fallbackTicking = false;

    var renderFallbacks = function () {
      fallbackTicking = false;

      if (progressBar) {
        var doc = document.documentElement;
        var max = doc.scrollHeight - window.innerHeight;
        progressBar.style.transform =
          "scaleX(" + (max > 0 ? window.scrollY / max : 0).toFixed(4) + ")";
      }

      statementBgs.forEach(function (bg) {
        var section = bg.parentElement;
        var rect = section.getBoundingClientRect();
        var range = window.innerHeight + rect.height;
        var visible = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / range));
        bg.style.transform = "translateY(" + ((visible - 0.5) * 12).toFixed(2) + "%)";
      });
    };

    var requestFallbackFrame = function () {
      if (!fallbackTicking) {
        fallbackTicking = true;
        window.requestAnimationFrame(renderFallbacks);
      }
    };

    window.addEventListener("scroll", requestFallbackFrame, { passive: true });
    window.addEventListener("resize", requestFallbackFrame);
    renderFallbacks();
  }

  /* ------------------------------------------------------------------------
     6. Kontaktformular — Validierung ohne Backend
        HINWEIS ZUR ANBINDUNG: Für den Echtbetrieb einen Formular-Service
        einbinden, z. B. Formspree:
          1. <form action="https://formspree.io/f/DEINE_FORM_ID" method="POST">
          2. Den fetch()-Block unten aktivieren (Kommentar) — fertig.
        Alternativ: eigener Endpoint / Netlify Forms / Web3Forms.
     ------------------------------------------------------------------------ */
  var form = document.querySelector("[data-contact-form]");

  if (form) {
    var statusBox = document.querySelector("[data-form-status]");

    var validators = {
      name: function (value) {
        return value.trim().length >= 2 || "Bitte geben Sie Ihren Namen an.";
      },
      email: function (value) {
        return (
          /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim()) ||
          "Bitte geben Sie eine gültige E-Mail-Adresse an."
        );
      },
      message: function (value) {
        return (
          value.trim().length >= 20 ||
          "Bitte beschreiben Sie Ihr Anliegen in mindestens 20 Zeichen."
        );
      },
      consent: function (_value, field) {
        return (
          field.checked ||
          "Bitte bestätigen Sie die Datenschutzhinweise."
        );
      }
    };

    var validateField = function (field) {
      var check = validators[field.name];
      if (!check) return true;

      var result = check(field.value, field);
      var wrapper = field.closest(".form-field, .form-consent");
      var errorEl = wrapper && wrapper.querySelector(".field-error");

      if (result === true) {
        if (wrapper) wrapper.classList.remove("has-error");
        if (errorEl) errorEl.textContent = "";
        field.removeAttribute("aria-invalid");
        return true;
      }

      if (wrapper) wrapper.classList.add("has-error");
      if (errorEl) errorEl.textContent = result;
      field.setAttribute("aria-invalid", "true");
      return false;
    };

    form.querySelectorAll("input, select, textarea").forEach(function (field) {
      field.addEventListener("blur", function () {
        validateField(field);
      });
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var fields = Array.prototype.slice.call(
        form.querySelectorAll("input, select, textarea")
      );
      var firstInvalid = null;

      fields.forEach(function (field) {
        if (!validateField(field) && !firstInvalid) firstInvalid = field;
      });

      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      /* --- Ohne Backend: Erfolgsmeldung anzeigen -------------------------
         Für den Echtbetrieb diesen Block durch den Versand ersetzen, z. B.:

         fetch(form.action, {
           method: "POST",
           body: new FormData(form),
           headers: { Accept: "application/json" }
         })
           .then(function (res) { ... Erfolg/Fehler anzeigen ... });
      ---------------------------------------------------------------------- */
      form.hidden = true;
      if (statusBox) {
        statusBox.hidden = false;
        statusBox.focus();
      }
    });
  }

  /* ------------------------------------------------------------------------
     7. Laufendes Jahr im Footer
     ------------------------------------------------------------------------ */
  var yearEl = document.querySelector("[data-year]");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
})();
