/* ============================================
   GILDED COLLECTION — interactivity
   ============================================ */

/* ---- CONFIG --------------------------------
   Replace these two values when ready:
   STRIPE_LINK  → your Stripe payment link (https://buy.stripe.com/...)
   PDF_URL      → your PDF file URL (https://.../gilded-collection.pdf)
   Leave as "" and the buttons will show a
   "coming soon" notice instead of breaking.
--------------------------------------------- */
const CONFIG = {
  STRIPE_LINK: "https://buy.stripe.com/4gM7sK7bj6ficwb92ibII04",
  PDF_URL: "",     // e.g. "https://yoursite.com/gilded-collection.pdf"
  PRICE: "13.99",  // displayed price
};

document.addEventListener("DOMContentLoaded", () => {
  /* ---- Price ---- */
  const priceEl = document.getElementById("priceValue");
  if (priceEl) priceEl.textContent = CONFIG.PRICE;

  /* ---- Year ---- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Toast helper ---- */
  const toast = document.getElementById("toast");
  let toastTimer;
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 3200);
  }

  /* ---- Stripe + PDF links ---- */
  document.querySelectorAll("[data-stripe]").forEach((el) => {
    el.setAttribute("href", CONFIG.STRIPE_LINK || "#");
    if (!CONFIG.STRIPE_LINK) el.setAttribute("aria-disabled", "true");
    el.addEventListener("click", (e) => {
      if (!CONFIG.STRIPE_LINK) {
        e.preventDefault();
        showToast("Stripe checkout link coming soon — check back shortly.");
      }
    });
  });

  document.querySelectorAll("[data-pdf]").forEach((el) => {
    el.setAttribute("href", CONFIG.PDF_URL || "#");
    if (CONFIG.PDF_URL) {
      el.setAttribute("download", "");
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener");
    } else {
      el.setAttribute("aria-disabled", "true");
    }
    el.addEventListener("click", (e) => {
      if (!CONFIG.PDF_URL) {
        e.preventDefault();
        showToast("PDF file coming soon — it will be live shortly.");
      }
    });
  });

  /* ---- Sticky nav ---- */
  const nav = document.getElementById("nav");
  const progress = document.querySelector(".scroll-progress");
  function onScroll() {
    const y = window.scrollY;
    if (nav) nav.classList.toggle("scrolled", y > 40);
    if (progress) {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Mobile menu ---- */
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  if (toggle && links) {
    const close = () => {
      links.classList.remove("open");
      toggle.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    };
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
    });
    links.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
  }

  /* ---- Scroll reveal ---- */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("visible"));
  }

  /* ---- Cursor glow ---- */
  const glow = document.querySelector(".cursor-glow");
  if (glow && window.matchMedia("(hover: hover)").matches) {
    let gx = 0, gy = 0, tx = 0, ty = 0;
    document.addEventListener("mousemove", (e) => {
      tx = e.clientX;
      ty = e.clientY;
    });
    (function loop() {
      gx += (tx - gx) * 0.12;
      gy += (ty - gy) * 0.12;
      glow.style.transform = `translate(${gx}px, ${gy}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    })();
  }

  /* ---- Card spotlight hover ---- */
  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", e.clientX - r.left + "px");
      card.style.setProperty("--my", e.clientY - r.top + "px");
    });
  });

  /* ---- Book 3D tilt ---- */
  const book = document.querySelector("[data-tilt]");
  if (book && window.matchMedia("(hover: hover)").matches) {
    const wrap = book.parentElement;
    wrap.addEventListener("mousemove", (e) => {
      const r = wrap.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      book.style.animation = "none";
      book.style.transform = `perspective(1200px) rotateY(${-16 + px * 22}deg) rotateX(${4 - py * 16}deg)`;
    });
    wrap.addEventListener("mouseleave", () => {
      book.style.transform = "perspective(1200px) rotateY(-16deg) rotateX(4deg)";
      book.style.animation = "";
    });
  }

  /* ---- FAQ: close others when one opens ---- */
  const faqItems = document.querySelectorAll(".faq__item");
  faqItems.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (item.open) faqItems.forEach((other) => other !== item && (other.open = false));
    });
  });

  /* ---- Hero parallax on orbs ---- */
  const orbs = document.querySelectorAll(".orb");
  if (orbs.length && window.matchMedia("(hover: hover)").matches) {
    document.querySelector(".hero")?.addEventListener("mousemove", (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 26;
      const y = (e.clientY / window.innerHeight - 0.5) * 26;
      orbs.forEach((orb, i) => {
        const d = i === 0 ? 1 : -1;
        orb.style.translate = `${x * d}px ${y * d}px`;
      });
    });
  }
});
