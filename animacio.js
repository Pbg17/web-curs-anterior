// ============================================================
// INTERACCIONS GENERALS DE LA WEB
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

  // ----------------------------------------------------------
  // Missatge de benvinguda
  // ----------------------------------------------------------

  if (!sessionStorage.getItem("berge_welcome_seen")) {
    const missatge = document.createElement("div");

    missatge.className = "benvinguda";

    missatge.innerHTML = `
      <h2>Benvingut/da!</h2>
      <p>Gràcies per visitar Fotografia Bergé. Gaudeix de la visita.</p>
      <button type="button">Continuar</button>
    `;

    document.body.appendChild(missatge);

    missatge.querySelector("button").addEventListener("click", () => {
      sessionStorage.setItem("berge_welcome_seen", "1");
      missatge.remove();
    });
  }


  // ----------------------------------------------------------
  // Menú mòbil
  // ----------------------------------------------------------

  const toggle = document.getElementById("menu-toggle");

  document.querySelectorAll(".menu-items a").forEach(link => {
    link.addEventListener("click", () => {
      if (toggle) {
        toggle.checked = false;
      }
    });
  });


  // ----------------------------------------------------------
  // Slider de la portada
  // ----------------------------------------------------------

  const slides = [...document.querySelectorAll(".home-slider .slide")];
  const dots = [...document.querySelectorAll(".slider-dot")];
  const prev = document.querySelector(".slider-prev");
  const next = document.querySelector(".slider-next");

  let current = 0;
  let timer;


  function showSlide(index) {
    if (!slides.length) return;

    current = (index + slides.length) % slides.length;

    slides.forEach((slide, i) => {
      slide.classList.toggle("is-active", i === current);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle("is-active", i === current);

      dot.setAttribute(
        "aria-current",
        i === current ? "true" : "false"
      );
    });
  }


  function restartSlider() {
    clearInterval(timer);

    if (slides.length > 1) {
      timer = setInterval(() => {
        showSlide(current + 1);
      }, 5000);
    }
  }


  if (slides.length) {

    prev?.addEventListener("click", () => {
      showSlide(current - 1);
      restartSlider();
    });

    next?.addEventListener("click", () => {
      showSlide(current + 1);
      restartSlider();
    });

    dots.forEach((dot, i) => {
      dot.addEventListener("click", () => {
        showSlide(i);
        restartSlider();
      });
    });

    restartSlider();
  }


  // ----------------------------------------------------------
  // Galeria ampliada
  // ----------------------------------------------------------

  const images = document.querySelectorAll(
    ".galleryImages .item img"
  );

  // Només creem l'overlay si aquesta pàgina té galeria.
  if (images.length) {

    const overlay = document.createElement("div");

    overlay.className = "fons-fosc";

    document.body.appendChild(overlay);


    function closeGallery() {

      document
        .querySelectorAll(".ampliada")
        .forEach(img => {
          img.classList.remove("ampliada");
        });

      overlay.classList.remove("visible");
    }


    images.forEach(img => {

      img.addEventListener("click", () => {

        const full = img.dataset.full;

        if (
          full &&
          img.src !== new URL(full, location.href).href
        ) {

          img.closest(".item")?.classList.add("is-loading");

          const preloader = new Image();


          preloader.onload = () => {

            img.src = full;

            img
              .closest(".item")
              ?.classList.remove("is-loading");

            img.classList.add("ampliada");

            overlay.classList.add("visible");
          };


          preloader.onerror = () => {

            img
              .closest(".item")
              ?.classList.remove("is-loading");
          };


          preloader.src = full;

        } else {

          img.classList.add("ampliada");

          overlay.classList.add("visible");
        }
      });
    });


    overlay.addEventListener("click", closeGallery);


    document.addEventListener("keydown", e => {

      if (e.key === "Escape") {
        closeGallery();
      }

    });
  }

});


// ============================================================
// COOKIES I SERVEIS DE TERCERS
// ============================================================

(function () {

  const KEY = "berge_cookie_consent_v1";

  const banner = document.getElementById("cookie-banner");
  const accept = document.getElementById("cookie-accept");
  const reject = document.getElementById("cookie-reject");


  // ----------------------------------------------------------
  // Carregar Google Maps
  // ----------------------------------------------------------

  function loadMaps() {

    document
      .querySelectorAll(".mapa[data-map-src]")
      .forEach(box => {

        // Si el mapa ja està carregat, no fem res.
        if (box.querySelector("iframe")) {
          return;
        }


        const iframe = document.createElement("iframe");

        iframe.src = box.dataset.mapSrc;

        iframe.title =
          "Ubicació de Fotografia Bergé a Balaguer";

        iframe.loading = "lazy";

        iframe.allowFullscreen = true;

        iframe.referrerPolicy =
          "no-referrer-when-downgrade";


        // Accessibilitat
        iframe.setAttribute(
          "aria-label",
          "Mapa de Google Maps amb la ubicació de Fotografia Bergé"
        );


        box.replaceChildren(iframe);
      });
  }


  // ----------------------------------------------------------
  // Mostrar / ocultar banner
  // ----------------------------------------------------------

  function hideBanner() {

    if (banner) {
      banner.hidden = true;
    }
  }


  function showBanner() {

    if (banner) {
      banner.hidden = false;
    }
  }


  // ----------------------------------------------------------
  // Guardar consentiment
  // ----------------------------------------------------------

  function setConsent(value) {

    localStorage.setItem(KEY, value);

    hideBanner();


    if (value === "accepted") {
      loadMaps();
    }
  }


  // ----------------------------------------------------------
  // Estat actual del consentiment
  // ----------------------------------------------------------

  const consent = localStorage.getItem(KEY);


  if (consent === "accepted") {

    hideBanner();

    loadMaps();

  } else if (consent === "rejected") {

    hideBanner();

  } else {

    showBanner();
  }


  // ----------------------------------------------------------
  // Botons del banner de cookies
  // ----------------------------------------------------------

  accept?.addEventListener("click", () => {
    setConsent("accepted");
  });


  reject?.addEventListener("click", () => {
    setConsent("rejected");
  });


  // ----------------------------------------------------------
  // Botó específic del mapa
  // ----------------------------------------------------------

  document
    .querySelectorAll(".map-consent button")
    .forEach(button => {

      button.addEventListener("click", () => {
        setConsent("accepted");
      });

    });

})();
