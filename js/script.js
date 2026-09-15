document.addEventListener("DOMContentLoaded", () => {

  // ---- EMAILJS ----
  emailjs.init({
    publicKey: "kTMIDQ17vDXlhv2FE"
  });

  // ---- ÉLÉMENTS ----
  const header = document.getElementById("siteHeader");
  const nav = document.getElementById("siteNav");
  const navToggle = document.getElementById("navToggle");
  const toTop = document.getElementById("toTop");
  const form = document.getElementById("applicationForm");
  const formMessage = document.getElementById("formMessage");
  const toast = document.getElementById("toast");
  const year = document.getElementById("year");

  // ---- ANNÉE ----
  if (year) year.textContent = new Date().getFullYear();

  // ---- HEADER AU SCROLL ----
  function updateHeader() {
    if (!header) return;
    if (window.scrollY > 30) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
    if (toTop) {
      toTop.classList.toggle("show", window.scrollY > 500);
    }
  }
  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();

  // ---- MENU MOBILE ----
  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      navToggle.classList.toggle("active", isOpen);
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      navToggle.setAttribute("aria-label", isOpen ? "Fermer le menu" : "Ouvrir le menu");
    });

    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        navToggle.classList.remove("active");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Ouvrir le menu");
      });
    });
  }

  // ---- NAVIGATION ACTIVE ----
  const navLinks = document.querySelectorAll(".nav a");
  const sections = document.querySelectorAll("main section[id]");
  if (navLinks.length && sections.length) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute("id");
        navLinks.forEach(link => {
          link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
        });
      });
    }, { rootMargin: "-35% 0px -55% 0px" });
    sections.forEach(s => obs.observe(s));
  }

  // ---- REVEAL ----
  document.querySelectorAll(".reveal").forEach(el => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    obs.observe(el);
  });

  // ---- RETOUR EN HAUT ----
  if (toTop) {
    toTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // ---- TOAST ----
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove("show"), 4000);
  }

  // ---- FORMULAIRE ----
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Vérification HTML5 native
    if (!form.checkValidity()) {
      form.reportValidity();
      if (formMessage) {
        formMessage.textContent = "Veuillez compléter correctement tous les champs.";
        formMessage.style.color = "#d98d7d";
      }
      return;
    }

    // Récupération des données
    const data = new FormData(form);
    const prenom = data.get("prenom");
    const nom = data.get("nom");
    const email = data.get("email");
    const telephone = data.get("telephone");
    const ville = data.get("ville");
    const age = Number(data.get("age"));
    const niveauEtude = data.get("niveau_etude");
    const taille = Number(data.get("taille"));
    const motivation = data.get("motivation");

    // Validations personnalisées
    if (age < 16 || age > 45) {
      formMessage.textContent = "Veuillez vérifier l'âge (16-45 ans).";
      formMessage.style.color = "#d98d7d";
      return;
    }
    if (taille < 140 || taille > 220) {
      formMessage.textContent = "Veuillez vérifier la taille (140-220 cm).";
      formMessage.style.color = "#d98d7d";
      return;
    }
    if (!niveauEtude) {
      formMessage.textContent = "Veuillez sélectionner votre niveau d'étude.";
      formMessage.style.color = "#d98d7d";
      return;
    }
    if (!motivation || motivation.trim().length < 10) {
      formMessage.textContent = "Veuillez renseigner votre motivation (10 caractères min).";
      formMessage.style.color = "#d98d7d";
      return;
    }

    // Désactivation du bouton pendant l'envoi
    const submitBtn = form.querySelector(".form-submit");
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = "Envoi en cours...";

    formMessage.textContent = "";
    formMessage.style.color = "var(--gold)";

    try {
      const response = await emailjs.sendForm(
        "service_a9tonx8",
        "template_yfr1ma4",
        form
      );

      console.log("✅ Email envoyé :", response.status, response.text);

      formMessage.textContent = `Merci ${prenom} ! Votre candidature a bien été enregistrée.`;
      formMessage.style.color = "var(--gold)";
      showToast("✅ Candidature envoyée avec succès !");
      form.reset();

    } catch (error) {
      console.error("❌ Erreur EmailJS :", error);

      formMessage.textContent = "Erreur lors de l'envoi. Vérifiez votre connexion et réessayez.";
      formMessage.style.color = "#d98d7d";
      showToast("❌ Échec de l'envoi. Réessayez.");
    } finally {
      // Réactivation du bouton
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });
}

  // ---- MODALS ----
  (function() {
    const overlay = document.getElementById("modalOverlay");
    const content = document.getElementById("modalContent");
    const closeBtn = document.getElementById("modalClose");

    const modals = {
      "candidates-modal": "modalCandidates",
      "article-1": "modalArticle1",
      "article-2": "modalArticle2",
      "article-3": "modalArticle3"
    };

    function openModal(key) {
      if (!overlay || !content) return;
      const src = document.getElementById(modals[key]);
      if (!src) return;
      content.innerHTML = src.innerHTML;
      overlay.classList.add("active");
      document.body.style.overflow = "hidden";
      if (closeBtn) closeBtn.focus();

      // Gestion des liens internes
      content.querySelectorAll('a[href="#inscriptions"]').forEach(link => {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          closeModal();
          setTimeout(() => {
            document.getElementById("inscriptions").scrollIntoView({ behavior: "smooth" });
          }, 400);
        });
      });
    }

    window.closeModalFromInside = function() {
      closeModal();
    };

    function closeModal() {
      if (!overlay) return;
      overlay.classList.remove("active");
      document.body.style.overflow = "";
      setTimeout(() => {
        if (content) content.innerHTML = "";
      }, 400);
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && overlay && overlay.classList.contains("active")) {
        closeModal();
      }
    });

    if (overlay) {
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) closeModal();
      });
    }
    if (closeBtn) {
      closeBtn.addEventListener("click", closeModal);
    }

    // Liaison des liens
    document.querySelectorAll('a[href="#candidates-modal"]').forEach(link => {
      link.addEventListener("click", (e) => { e.preventDefault();
        openModal("candidates-modal"); });
    });
    document.querySelectorAll('a[href="#article-1"]').forEach(link => {
      link.addEventListener("click", (e) => { e.preventDefault();
        openModal("article-1"); });
    });
    document.querySelectorAll('a[href="#article-2"]').forEach(link => {
      link.addEventListener("click", (e) => { e.preventDefault();
        openModal("article-2"); });
    });
    document.querySelectorAll('a[href="#article-3"]').forEach(link => {
      link.addEventListener("click", (e) => { e.preventDefault();
        openModal("article-3"); });
    });
  })();

  // ---- FERMETURE MENU ESC ----
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav && nav.classList.contains("open")) {
      nav.classList.remove("open");
      if (navToggle) {
        navToggle.classList.remove("active");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Ouvrir le menu");
      }
    }
  });

  // ---- FERMETURE MENU CLIC EXTERNE ----
  document.addEventListener("click", (e) => {
    if (!nav || !navToggle) return;
    if (nav.classList.contains("open") && !nav.contains(e.target) && !navToggle.contains(e.target)) {
      nav.classList.remove("open");
      navToggle.classList.remove("active");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Ouvrir le menu");
    }
  });

});