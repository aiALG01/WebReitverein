/* ==========================================================================
   ALEWING — main.js
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
     4. Hero-Choreografie (Startseite) — GSAP + ScrollTrigger
        #hero-scroll-container wird für die Dauer des Scrollwegs gepinnt.
        Eine Timeline (Scroll-Fortschritt 0–1) steuert:
        1) 0.00–0.06  Standbild blendet weich aus, das Video übernimmt
        2) 0.00–0.85  Video läuft framegenau mit (currentTime = f(progress))
        3) 0.00–0.32  linker Einstiegstext blendet aus
        4) 0.05–0.95  Header blendet lang gezogen von Dunkelblau (transparent
                      über dem Video) zu Cream, Schrift von Cream zu Navy
        5) 0.50–0.85  Video zoomt heran (scale 1.25, y: -5%) — MacBook-Rand
                      und Tastatur verlassen den Viewport, übrig bleibt der
                      Laptop-Bildschirm als Vollbild
        6) 0.56–0.64  Bildschirm blendet zu vollständigem Schwarz ein und
                      hält diesen Zustand kurz (bis 0.68), bevor überhaupt
                      etwas anderes passiert
        7) 0.68–0.82  erst danach hellt der bereits vollständig schwarze
                      Bildschirm zu Cream auf
        8) 0.84–0.98  erst wenn Cream feststeht, fahren Headline und Text
                      (bereits in Navy) gestaffelt von unten nach oben ein
        Kein Fade am Ende: die Bühne entpinnt sich nach Fortschritt 1 ganz
        normal und wird von der nächsten Sektion weggescrollt wie jeder
        andere Seitenabschnitt auch — kein künstliches Verschwinden.
     ------------------------------------------------------------------------ */
  var heroContainer = document.getElementById("hero-scroll-container");

  if (
    heroContainer &&
    !prefersReducedMotion &&
    typeof gsap !== "undefined" &&
    typeof ScrollTrigger !== "undefined"
  ) {
    gsap.registerPlugin(ScrollTrigger);

    var heroVideo = document.getElementById("hero-video");
    var heroFallback = document.getElementById("hero-fallback-image");
    var heroIntroCopy = heroContainer.querySelector(".hero-intro-copy");
    var heroIntroSub = heroContainer.querySelector(".hero-intro-sub");
    var heroOverlay = heroContainer.querySelector(".laptop-screen-overlay");
    var heroKicker = heroContainer.querySelector(".hero-kicker");
    var heroCue = heroContainer.querySelector(".hero-cue");
    var triggerHeadline = heroOverlay.querySelector(".trigger-headline");
    var triggerText = heroOverlay.querySelector(".trigger-text");
    var videoScrub = { t: 0 };

    var siteHeader = document.querySelector(".site-header");
    var headerTextEls = document.querySelectorAll(
      ".site-header .brand, .site-header .nav-list a, .site-header .nav-cta, .site-header .nav-toggle .bar"
    );
    var headerCta = document.querySelector(".site-header .nav-cta");

    var rootStyle = getComputedStyle(document.documentElement);
    var colorNavy = rootStyle.getPropertyValue("--color-navy").trim();
    var colorCream = rootStyle.getPropertyValue("--color-cream").trim();
    var colorTan = rootStyle.getPropertyValue("--color-tan").trim();

    /* Safari (v.a. iOS) rendert per currentTime geseekte Frames erst,
       nachdem der Decoder einmal per play()/pause() „aufgewärmt" wurde —
       sonst bleibt das Bild beim Scrubben auf dem ersten Frame stehen. */
    var warmUpVideoDecoder = function () {
      var playAttempt = heroVideo.play();
      if (playAttempt && playAttempt.then) {
        playAttempt.then(function () { heroVideo.pause(); }).catch(function () {});
      } else {
        heroVideo.pause();
      }
    };
    if (heroVideo.readyState >= 1) {
      warmUpVideoDecoder();
    } else {
      heroVideo.addEventListener("loadedmetadata", warmUpVideoDecoder, { once: true });
    }

    var heroTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: heroContainer,
        start: "top top",
        end: "+=300%",
        scrub: 1,
        pin: true,
        anticipatePin: 1
      }
    });

    heroTimeline
      /* 1) Standbild weich ausblenden, sobald gescrollt wird */
      .to(heroFallback, { opacity: 0, duration: 0.06, ease: "none" }, 0)
      /* 2) Video framegenau über den Scroll-Fortschritt steuern */
      .to(videoScrub, {
        t: 1,
        duration: 0.85,
        ease: "none",
        onUpdate: function () {
          if (heroVideo.duration) {
            heroVideo.currentTime = videoScrub.t * heroVideo.duration;
          }
        }
      }, 0)
      /* 3) linker Einstiegstext im ersten Drittel ausfaden */
      .to([heroIntroCopy, heroIntroSub], { opacity: 0, y: "-1rem", duration: 0.32, ease: "none" }, 0)
      .to([heroKicker, heroCue], { opacity: 0, duration: 0.12, ease: "none" }, 0)
      /* 4) Header lang gezogen von Dunkelblau (transparent) zu Cream —
         bewusst früh gestartet und über fast die ganze Timeline gedehnt,
         statt abrupt am Scroll-Anfang umzuschalten */
      .fromTo(siteHeader,
        { backgroundColor: "rgba(7, 39, 104, 0)" },
        { backgroundColor: colorCream, duration: 0.9, ease: "none" },
        0.05)
      .to(headerTextEls, { color: colorNavy, duration: 0.9, ease: "none" }, 0.05)
      .to(headerCta, { borderColor: colorTan, duration: 0.9, ease: "none" }, 0.05)
      /* 5) ab der Hälfte heranzoomen, bis nur der Laptop-Bildschirm bleibt */
      .to(heroVideo, { scale: 1.25, y: "-5%", duration: 0.35, ease: "power1.inOut" }, 0.5)
      /* 6) Bildschirm blendet zu vollständigem Schwarz ein und hält diesen
         Zustand kurz — erst wenn er wirklich komplett schwarz ist (nicht
         währenddessen), beginnt Schritt 7 */
      .to(heroOverlay, { opacity: 1, duration: 0.08, ease: "none" }, 0.56)
      /* 7) erst auf vollständig schwarzem Grund hellt der Bildschirm zu
         Cream auf */
      .to(heroOverlay, { backgroundColor: colorCream, duration: 0.14, ease: "none" }, 0.68)
      /* 8) erst jetzt, auf bereits cremefarbenem Grund, fahren Headline und Text
         gestaffelt von unten hoch — direkt in Navy, kein Farbwechsel mehr
         am Text nötig, weil der Untergrund schon feststeht */
      .set([triggerHeadline, triggerText], { color: colorNavy }, 0.82)
      .to(triggerHeadline, { opacity: 1, y: 0, duration: 0.08, ease: "power2.out" }, 0.84)
      .to(triggerText, { opacity: 1, y: 0, duration: 0.08, ease: "power2.out" }, 0.9);
    /* Kein Opacity-Fade am Ende: die Bühne bleibt bis Fortschritt 1 sichtbar
       und wird danach ganz regulär von der nächsten Sektion weggescrollt —
       kein Ausfaden, sondern derselbe Effekt wie bei jedem anderen
       Seitenabschnitt. */
  }

  /* ------------------------------------------------------------------------
     5. JS-Fallback für den Lesebalken, falls animation-timeline fehlt
     ------------------------------------------------------------------------ */
  if (!supportsScrollTimeline && !prefersReducedMotion) {
    var progressBar = document.querySelector(".scroll-progress");
    var fallbackTicking = false;

    var renderFallbacks = function () {
      fallbackTicking = false;

      if (progressBar) {
        var doc = document.documentElement;
        var max = doc.scrollHeight - window.innerHeight;
        progressBar.style.transform =
          "scaleX(" + (max > 0 ? window.scrollY / max : 0).toFixed(4) + ")";
      }
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
