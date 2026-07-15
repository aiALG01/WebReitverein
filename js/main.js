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
        Vier Phasen entlang des Scroll-Fortschritts (0–1):
        A) 0.00–0.16  Clip als kleine Karte rechts, Text links (Kicker + h1)
        B) 0.16–0.34  Karte wächst per FLIP-Transform zur Vollbild-Bühne,
                      der Text blendet im selben Takt aus
        C) 0.00–0.82  Clip läuft frame-genau mit (currentTime = f(progress),
                      läuft technisch über A–C hinweg): Blick in die Kamera →
                      Blick auf den Laptop → Kamera schwenkt in die
                      Ich-Perspektive auf den Bildschirm
        D) 0.82–1.00  Bildschirm-Reveal (echter Screenshot der Startseite,
                      an der Bildschirm-Position im letzten Video-Frame
                      platziert) blendet ein und wächst per FLIP-Transform
                      zur Vollbild-Ansicht — der Laptop-Blick wird zur
                      echten Webseite, die direkt darunter weitergeht
     ------------------------------------------------------------------------ */
  var hero = document.querySelector("[data-hero]");
  var heroStage = hero && hero.querySelector(".hero-stage");
  var heroVideoEl = heroStage && heroStage.querySelector(".hero-video");

  if (heroVideoEl) {
    heroVideoEl.pause();
  }

  if (hero && !prefersReducedMotion) {
    var heroIntroCopy = hero.querySelector(".hero-intro-copy");
    var heroFrame = hero.querySelector(".hero-video-frame");
    var heroReveal = hero.querySelector(".hero-screen-reveal");
    var heroSilk = hero.querySelector(".hero-silk");
    var heroCue = hero.querySelector(".hero-cue");
    var heroKicker = hero.querySelector(".hero-kicker");
    var heroTicking = false;
    var heroVideoReady = false;

    var FRAME_GROW_START = 0.16;
    var FRAME_GROW_END = 0.34;
    var VIDEO_END = 0.82;
    var REVEAL_START = 0.82;

    var clamp01 = function (v) {
      return Math.min(1, Math.max(0, v));
    };

    /* FLIP-Basiswerte: Rect der kleinen Karte bzw. des Bildschirm-
       Ausschnitts im Ruhezustand (ohne Transform) — einmalig gemessen,
       bei Resize erneuert. */
    var frameBaseRect = null;
    var revealBaseRect = null;

    var measureBaseRects = function () {
      if (heroFrame) {
        heroFrame.style.transform = "none";
        frameBaseRect = heroFrame.getBoundingClientRect();
      }
      if (heroReveal) {
        heroReveal.style.transform = "none";
        revealBaseRect = heroReveal.getBoundingClientRect();
      }
    };

    var applyFlip = function (el, base, t) {
      if (!el || !base || t <= 0) {
        if (el) el.style.transform = "none";
        return;
      }
      var vw = window.innerWidth;
      var vh = window.innerHeight;
      var scaleX = 1 + (vw / base.width - 1) * t;
      var scaleY = 1 + (vh / base.height - 1) * t;
      var dx = (vw / 2 - (base.left + base.width / 2)) * t;
      var dy = (vh / 2 - (base.top + base.height / 2)) * t;
      el.style.transform =
        "translate(" + dx.toFixed(1) + "px," + dy.toFixed(1) + "px) scale(" +
        scaleX.toFixed(4) + "," + scaleY.toFixed(4) + ")";
    };

    var renderHero = function () {
      heroTicking = false;

      var total = hero.offsetHeight - window.innerHeight;
      if (total <= 0) return;
      var progress = clamp01(-hero.getBoundingClientRect().top / total);

      /* Video läuft frame-genau über den gesamten Erzählabschnitt
         (Phasen A–C), unabhängig davon, wie groß die Karte gerade ist */
      if (heroVideoEl && heroVideoReady && heroVideoEl.duration) {
        var videoProgress = clamp01(progress / VIDEO_END);
        heroVideoEl.currentTime = videoProgress * heroVideoEl.duration;
      }

      /* Phase B: Karte wächst zur Vollbild-Bühne, Text blendet im selben
         Takt aus */
      var growT = clamp01((progress - FRAME_GROW_START) / (FRAME_GROW_END - FRAME_GROW_START));
      applyFlip(heroFrame, frameBaseRect, growT);
      if (heroFrame) {
        heroFrame.style.borderRadius = (1.25 * (1 - growT)).toFixed(3) + "rem";
      }
      if (heroIntroCopy) {
        var introOpacity = 1 - growT;
        heroIntroCopy.style.opacity = introOpacity.toFixed(3);
        heroIntroCopy.style.transform = "translateX(" + (-(1 - introOpacity) * 1.5).toFixed(2) + "rem)";
      }

      /* Phase D: Bildschirm-Reveal blendet ein und wächst zur Vollbild-
         Ansicht — der Laptop-Blick im Video wird zur echten Webseite */
      var revealFade = clamp01((progress - REVEAL_START) / 0.06);
      var revealGrow = clamp01((progress - REVEAL_START) / (1 - REVEAL_START));
      if (heroReveal) {
        heroReveal.style.opacity = revealFade.toFixed(3);
        heroReveal.style.borderRadius = (0.4 * (1 - revealGrow)).toFixed(3) + "rem";
        applyFlip(heroReveal, revealBaseRect, revealGrow);
      }

      /* Seide zoomt kaum merklich — Ruhe statt Effekthascherei (Fallback,
         falls kein Video lädt) */
      if (heroSilk) {
        heroSilk.style.transform = "scale(" + (1 + progress * 0.12).toFixed(4) + ")";
      }

      if (heroCue) {
        heroCue.style.opacity = clamp01(1 - progress * 6).toFixed(3);
      }

      if (heroKicker) {
        heroKicker.style.opacity = clamp01(1 - progress * 3).toFixed(3);
      }
    };

    var requestHeroFrame = function () {
      if (!heroTicking) {
        heroTicking = true;
        window.requestAnimationFrame(renderHero);
      }
    };

    measureBaseRects();

    if (heroVideoEl) {
      var markHeroVideoLoaded = function () {
        if (heroVideoReady) return;
        heroVideoReady = true;
        heroStage.classList.add("has-video");
        /* iOS Safari rendert geseekte Frames erst, nachdem der Decoder
           einmal per play()/pause() „aufgewärmt" wurde — sonst bleibt das
           Bild beim Scrubben auf dem allerersten Frame stehen. */
        var playAttempt = heroVideoEl.play();
        if (playAttempt && playAttempt.then) {
          playAttempt.then(function () { heroVideoEl.pause(); }).catch(function () {});
        } else {
          heroVideoEl.pause();
        }
        requestHeroFrame();
      };
      heroVideoEl.addEventListener("loadedmetadata", markHeroVideoLoaded);
      heroVideoEl.addEventListener("error", function () {
        heroStage.classList.remove("has-video");
      });
      if (heroVideoEl.readyState >= 1) markHeroVideoLoaded();
    }

    window.addEventListener("scroll", requestHeroFrame, { passive: true });
    window.addEventListener("resize", function () {
      measureBaseRects();
      requestHeroFrame();
    });
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
