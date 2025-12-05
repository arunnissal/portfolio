// assets/script.js

// Fade-in effect for body
window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  // ------- Navbar active state -------
  const page = body.dataset.page;
  const navLinks = document.querySelectorAll(".nav-links a.nav-link, .nav-links a.nav-cta");

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (page === "home" && href.includes("index.html")) {
      link.classList.add("active");
    } else if (page === "projects" && href.includes("projects.html")) {
      link.classList.add("active");
    } else if (page === "about" && href.includes("about.html")) {
      link.classList.add("active");
    } else if (page === "contact" && href.includes("contact.html")) {
      link.classList.add("active");
    }
  });

  // Navbar scroll glow
  const navbar = document.querySelector(".navbar");
  function handleScroll() {
    if (!navbar) return;
    if (window.scrollY > 12) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }
  handleScroll();
  window.addEventListener("scroll", handleScroll);

  // ------- Reveal animation on scroll -------
  const reveals = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );
  reveals.forEach((el) => revealObserver.observe(el));

  // ------- Next-level contact form (EmailJS) -------
  const form = document.getElementById("contact-form");
  const submitBtn = document.getElementById("contact-submit");
  const statusEl = document.getElementById("form-status");
  const toastEl = document.getElementById("toast");

  if (form && typeof emailjs !== "undefined") {
    // Init EmailJS with your public key
    emailjs.init("RKmqmsTQ5Z-NwcSeb");

    const fieldErrors = {
      name: document.querySelector('.field-error[data-for="name"]'),
      email: document.querySelector('.field-error[data-for="email"]'),
      message: document.querySelector('.field-error[data-for="message"]'),
    };

    function showToast(message, type = "success") {
      if (!toastEl) return;
      toastEl.textContent = message;
      toastEl.className = `toast toast-${type} toast-visible`;
      setTimeout(() => {
        toastEl.classList.remove("toast-visible");
      }, 3500);
    }

    function validateForm() {
      let valid = true;

      const nameInput = document.getElementById("name");
      const emailInput = document.getElementById("email");
      const messageInput = document.getElementById("message");

      // Reset errors
      Object.values(fieldErrors).forEach((el) => {
        if (el) el.textContent = "";
      });
      [nameInput, emailInput, messageInput].forEach((el) => {
        el.classList.remove("input-error");
      });

      // Name
      if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
        fieldErrors.name.textContent = "Please enter at least 2 characters.";
        nameInput.classList.add("input-error");
        valid = false;
      }

      // Email simple check
      const emailVal = emailInput.value.trim();
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailVal || !emailPattern.test(emailVal)) {
        fieldErrors.email.textContent = "Please enter a valid email address.";
        emailInput.classList.add("input-error");
        valid = false;
      }

      // Message
      if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
        fieldErrors.message.textContent = "Message should be at least 10 characters.";
        messageInput.classList.add("input-error");
        valid = false;
      }

      if (!valid && statusEl) {
        statusEl.classList.add("error-msg", "shake");
        statusEl.textContent = "Please fix the highlighted fields.";
        setTimeout(() => statusEl.classList.remove("shake"), 450);
      }

      return valid;
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (!statusEl) return;

      statusEl.className = "";
      statusEl.style.opacity = "1";
      statusEl.textContent = "";

      if (!validateForm()) return;

      // Sending state
      statusEl.classList.add("loading-msg");
      statusEl.textContent = "Sending your message...";
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";
      }

      try {
        // 🔥 Using your NEW template id here
        await emailjs.sendForm("service_yhipdig", "template_84gd1v5", form);

        // Success
        statusEl.classList.remove("loading-msg");
        statusEl.classList.add("success-msg");
        statusEl.textContent = "✔ Message delivered successfully!";
        form.reset();
        showToast("Message sent! I’ll get back to you soon.", "success");

        setTimeout(() => {
          statusEl.style.opacity = "0";
        }, 4000);
      } catch (err) {
        console.error("EmailJS error:", err);
        statusEl.classList.remove("loading-msg");
        statusEl.classList.add("error-msg", "shake");
        statusEl.textContent = "❌ Something went wrong — please try again.";
        showToast("Failed to send message. Try again.", "error");
        setTimeout(() => statusEl.classList.remove("shake"), 450);
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "Send message";
        }
      }
    });
  }
});
