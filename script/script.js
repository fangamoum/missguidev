/* =========================================================
   MISSGUI DEV — JAVASCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {


  emailjs.init({
    publicKey: "AVxrjMkQ8hN1-qkIS"
  });

  /* =========================================================
     ELEMENTS
     ========================================================= */

  const header = document.getElementById("siteHeader");
  const nav = document.getElementById("siteNav");
  const navToggle = document.getElementById("navToggle");
  const toTop = document.getElementById("toTop");
  const form = document.getElementById("applicationForm");
  const formMessage = document.getElementById("formMessage");
  const toast = document.getElementById("toast");
  const year = document.getElementById("year");


  /* =========================================================
     ANNÉE AUTOMATIQUE
     ========================================================= */

  if (year) {
    year.textContent = new Date().getFullYear();
  }


  /* =========================================================
     HEADER AU SCROLL
     ========================================================= */

  function updateHeader() {

    if (!header) return;

    if (window.scrollY > 30) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

    if (toTop) {
      if (window.scrollY > 500) {
        toTop.classList.add("show");
      } else {
        toTop.classList.remove("show");
      }
    }
  }

  window.addEventListener("scroll", updateHeader, {
    passive: true
  });

  updateHeader();


  /* =========================================================
     MENU MOBILE
     ========================================================= */

  if (navToggle && nav) {

    navToggle.addEventListener("click", () => {

      const isOpen = nav.classList.toggle("open");

      navToggle.setAttribute(
        "aria-expanded",
        isOpen ? "true" : "false"
      );

      navToggle.setAttribute(
        "aria-label",
        isOpen
          ? "Fermer le menu"
          : "Ouvrir le menu"
      );
    });


    /* Fermer le menu lorsqu'on clique sur un lien */

    nav.querySelectorAll("a").forEach(link => {

      link.addEventListener("click", () => {

        nav.classList.remove("open");

        navToggle.setAttribute(
          "aria-expanded",
          "false"
        );

        navToggle.setAttribute(
          "aria-label",
          "Ouvrir le menu"
        );
      });

    });
  }


  /* =========================================================
     NAVIGATION ACTIVE
     ========================================================= */

  const navigationLinks =
    document.querySelectorAll(".nav a");

  const sections =
    document.querySelectorAll("main section[id]");

  if (navigationLinks.length && sections.length) {

    const sectionObserver =
      new IntersectionObserver(
        entries => {

          entries.forEach(entry => {

            if (!entry.isIntersecting) return;

            const sectionId =
              entry.target.getAttribute("id");

            navigationLinks.forEach(link => {

              const target =
                link.getAttribute("href");

              link.classList.toggle(
                "active",
                target === `#${sectionId}`
              );

            });

          });

        },
        {
          rootMargin: "-35% 0px -55% 0px"
        }
      );

    sections.forEach(section => {
      sectionObserver.observe(section);
    });
  }


  /* =========================================================
     ANIMATIONS AU DÉFILEMENT
     ========================================================= */

  const revealElements =
    document.querySelectorAll(".reveal");

  if (revealElements.length) {

    const revealObserver =
      new IntersectionObserver(
        entries => {

          entries.forEach(entry => {

            if (!entry.isIntersecting) return;

            entry.target.classList.add("visible");

            revealObserver.unobserve(
              entry.target
            );

          });

        },
        {
          threshold: 0.12
        }
      );

    revealElements.forEach(element => {
      revealObserver.observe(element);
    });
  }


  /* =========================================================
     BOUTON RETOUR EN HAUT
     ========================================================= */

  if (toTop) {

    toTop.addEventListener("click", () => {

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

    });
  }


  /* =========================================================
     TOAST / NOTIFICATION
     ========================================================= */

  function showToast(message) {

    if (!toast) return;

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
    }, 4000);
  }


  /* =========================================================
     FORMULAIRE DE CANDIDATURE
     ========================================================= */

  if (form) {

    form.addEventListener("submit", event => {

      event.preventDefault();


      /* Vérification HTML */

      if (!form.checkValidity()) {

        form.reportValidity();

        if (formMessage) {

          formMessage.textContent =
            "Veuillez compléter correctement tous les champs.";

          formMessage.style.color =
            "#d98d7d";
        }

        return;
      }


      /* Récupération des champs */

      const formData =
        new FormData(form);

      const prenom =
        formData.get("prenom");

      const nom =
        formData.get("nom");

      const email =
        formData.get("email");

      const telephone =
        formData.get("telephone");

      const ville =
        formData.get("ville");

      const age =
        Number(formData.get("age"));

      const motivation =
        formData.get("motivation");


      /* Vérification de l'âge */

      if (age < 16 || age > 45) {

        if (formMessage) {

          formMessage.textContent =
            "Veuillez vérifier l'âge renseigné.";

          formMessage.style.color =
            "#d98d7d";
        }

        return;
      }


      /* Vérification de la motivation */

      if (!motivation || motivation.trim().length < 10) {

        if (formMessage) {

          formMessage.textContent =
            "Veuillez renseigner votre motivation.";

          formMessage.style.color =
            "#d98d7d";
        }

        return;
      }


      /*
       * Pour l'instant, les données sont uniquement
       * récupérées côté navigateur.
       *
       * Plus tard, cette partie pourra être reliée
       * à PHP / MySQL, Laravel ou une API.
       */

      console.log("Nouvelle candidature :");

      console.log({
        prenom,
        nom,
        email,
        telephone,
        ville,
        age,
        motivation
      });


      /* Message de confirmation */

      if (formMessage) {

        formMessage.textContent =
          `Merci ${prenom} ! Votre candidature a bien été enregistrée.`;

        formMessage.style.color =
          "var(--gold)";
      }


      showToast(
        "Votre candidature a été enregistrée."
      );


      /* Réinitialisation du formulaire */

      form.reset();

    });
  }


  /* =========================================================
     MODALS SYSTEM
     ========================================================= */

  (function() {
    // Éléments
    const modalOverlay = document.getElementById('modalOverlay');
    const modalContent = document.getElementById('modalContent');
    const modalClose = document.getElementById('modalClose');
    
    // Contenu des modals
    const modalsData = {
      'candidates-modal': {
        contentId: 'modalCandidates'
      },
      'article-1': {
        contentId: 'modalArticle1'
      },
      'article-2': {
        contentId: 'modalArticle2'
      },
      'article-3': {
        contentId: 'modalArticle3'
      }
    };

    // Ouvrir un modal
    function openModal(modalKey) {
      if (!modalOverlay || !modalContent) return;
      
      const modalData = modalsData[modalKey];
      if (!modalData) return;
      
      // Récupérer le contenu caché
      const contentElement = document.getElementById(modalData.contentId);
      if (!contentElement) return;
      
      // Copier le contenu dans le modal
      modalContent.innerHTML = contentElement.innerHTML;
      
      // Ajouter une classe pour le style
      modalContent.classList.add('modal-loaded');
      
      // Afficher le modal
      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      
      // Focus sur le modal
      if (modalClose) modalClose.focus();
      
      // Re-attacher les événements pour les liens dans le modal
      modalContent.querySelectorAll('a[href="#inscriptions"]').forEach(link => {
        link.addEventListener('click', function(e) {
          closeModal();
          // Laisser le temps au modal de se fermer avant de naviguer
          setTimeout(() => {
            document.getElementById('inscriptions').scrollIntoView({ behavior: 'smooth' });
          }, 400);
        });
      });
    }

    // Fermer le modal (exposée globalement pour les liens internes)
    window.closeModalFromInside = function() {
      closeModal();
    };

    function closeModal() {
      if (!modalOverlay) return;
      
      modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
      
      // Vider le contenu après la transition
      setTimeout(() => {
        if (modalContent) {
          modalContent.innerHTML = '';
          modalContent.classList.remove('modal-loaded');
        }
      }, 400);
    }

    // Fermer avec la touche Escape
    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
        closeModal();
      }
    });

    // Fermer en cliquant sur l'overlay
    if (modalOverlay) {
      modalOverlay.addEventListener('click', function(event) {
        if (event.target === modalOverlay) {
          closeModal();
        }
      });
    }

    // Fermer avec le bouton X
    if (modalClose) {
      modalClose.addEventListener('click', closeModal);
    }

    // =========================================================
    // LIENS POUR "VOIR TOUTES NOS CANDIDATES"
    // =========================================================
    
    document.querySelectorAll('a[href="#candidates-modal"]').forEach(function(link) {
      link.addEventListener('click', function(event) {
        event.preventDefault();
        openModal('candidates-modal');
      });
    });

    // =========================================================
    // LIENS POUR "LIRE L'ARTICLE" ET "TOUTES LES ACTUALITÉS"
    // =========================================================
    
    document.querySelectorAll('a[href="#article-1"]').forEach(function(link) {
      link.addEventListener('click', function(event) {
        event.preventDefault();
        openModal('article-1');
      });
    });

    document.querySelectorAll('a[href="#article-2"]').forEach(function(link) {
      link.addEventListener('click', function(event) {
        event.preventDefault();
        openModal('article-2');
      });
    });

    document.querySelectorAll('a[href="#article-3"]').forEach(function(link) {
      link.addEventListener('click', function(event) {
        event.preventDefault();
        openModal('article-3');
      });
    });

    // Exposer les fonctions globalement
    window.modalSystem = {
      open: openModal,
      close: closeModal
    };

  })();


  /* =========================================================
     FERMETURE DU MENU AVEC LA TOUCHE ESC
     ========================================================= */

  document.addEventListener("keydown", event => {

    if (
      event.key === "Escape" &&
      nav &&
      nav.classList.contains("open")
    ) {

      nav.classList.remove("open");

      if (navToggle) {

        navToggle.setAttribute(
          "aria-expanded",
          "false"
        );

        navToggle.setAttribute(
          "aria-label",
          "Ouvrir le menu"
        );
      }
    }

  });


  /* =========================================================
     FERMETURE DU MENU EN CLIQUANT À L'EXTÉRIEUR
     ========================================================= */

  document.addEventListener("click", event => {

    if (!nav || !navToggle) return;

    const clickedInsideNav =
      nav.contains(event.target);

    const clickedToggle =
      navToggle.contains(event.target);

    if (
      nav.classList.contains("open") &&
      !clickedInsideNav &&
      !clickedToggle
    ) {

      nav.classList.remove("open");

      navToggle.setAttribute(
        "aria-expanded",
        "false"
      );

      navToggle.setAttribute(
        "aria-label",
        "Ouvrir le menu"
      );
    }

  });

});