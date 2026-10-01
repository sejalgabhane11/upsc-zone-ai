const navbar = document.getElementById("navbar");
const progressBar = document.getElementById("progressBar");
const navLinks = document.getElementById("navLinks");
const menuToggle = document.getElementById("menuToggle");
const loginBtn = document.getElementById("loginBtn");
const loginModal = document.getElementById("loginModal");
const modalClose = document.getElementById("modalClose");
const modalBackdrop = document.querySelector("#loginModal .modal-backdrop");
const demoLogin = document.getElementById("demoLogin");
const ctaButton = document.getElementById("ctaButton");
const toast = document.getElementById("toast");
const onboardingModal = document.getElementById("onboardingModal");
const onboardingClose = document.getElementById("onboardingClose");
const onboardingBackdrop = document.querySelector("#onboardingModal .modal-backdrop");
const continueGoal = document.getElementById("continueGoal");
const goalCards = document.querySelectorAll(".goal-card");
const dashboardDate = document.getElementById("dashboardDate");

window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 10);
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = `${max ? (window.scrollY / max) * 100 : 0}%`;
});

menuToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", open);
});
document.querySelectorAll(".nav-links a").forEach(a => a.addEventListener("click", () => navLinks.classList.remove("open")));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

function lockBody() { document.body.style.overflow = "hidden"; }
function unlockBody() { document.body.style.overflow = ""; }

function openModal() {
  loginModal.classList.add("open");
  loginModal.setAttribute("aria-hidden", "false");
  lockBody();
  setTimeout(() => loginModal.querySelector("input")?.focus(), 50);
}
function closeModal() {
  loginModal.classList.remove("open");
  loginModal.setAttribute("aria-hidden", "true");
  unlockBody();
}
loginBtn.addEventListener("click", openModal);
modalClose.addEventListener("click", closeModal);
modalBackdrop.addEventListener("click", closeModal);

let selectedGoal = "";
function openOnboarding() {
  onboardingModal.classList.add("open");
  onboardingModal.setAttribute("aria-hidden", "false");
  lockBody();
  setTimeout(() => onboardingClose.focus(), 50);
}
function closeOnboarding() {
  onboardingModal.classList.remove("open");
  onboardingModal.setAttribute("aria-hidden", "true");
  unlockBody();
}
document.querySelectorAll("[data-onboarding]").forEach(el => {
  el.addEventListener("click", e => {
    e.preventDefault();
    openOnboarding();
  });
});
onboardingClose.addEventListener("click", closeOnboarding);
onboardingBackdrop.addEventListener("click", closeOnboarding);

goalCards.forEach(card => {
  card.addEventListener("click", () => {
    goalCards.forEach(c => c.classList.remove("selected"));
    card.classList.add("selected");
    selectedGoal = card.dataset.goal;
    continueGoal.disabled = false;
    continueGoal.textContent = `Continue with ${selectedGoal} →`;
  });
});

continueGoal.addEventListener("click", () => {
  if (!selectedGoal) return;
  closeOnboarding();
  showToast(`Demo plan ready for ${selectedGoal}`, "Explore the platform sections to preview your personalized journey.");
});

function showToast(title = "Welcome to UPSC ZONE AI", message = "This is a UI prototype — connect your backend to enable accounts.") {
  toast.querySelector("b").textContent = title;
  toast.querySelector("small").textContent = message;
  toast.classList.add("show");
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => toast.classList.remove("show"), 4200);
}
demoLogin.addEventListener("click", () => {
  closeModal();
  showToast();
});

// Keep the footer/demo links interactive without navigating to a blank page.
document.querySelectorAll('a[href="#"]').forEach(a => {
  a.addEventListener("click", e => {
    e.preventDefault();
    showToast();
  });
});

document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    closeModal();
    closeOnboarding();
  }
});

// Use the visitor's local date so the dashboard never shows a stale weekday.
function updateDashboardDate() {
  if (!dashboardDate) return;
  const now = new Date();
  const weekday = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(now);
  const day = String(now.getDate()).padStart(2, "0");
  const month = new Intl.DateTimeFormat("en-US", { month: "short" }).format(now).toUpperCase();
  const year = now.getFullYear();
  dashboardDate.textContent = `${weekday.toUpperCase()}, ${day} ${month} ${year}`;
}
updateDashboardDate();

// Subtle cursor lighting on desktop only.
const glow = document.querySelector(".cursor-glow");
if (window.matchMedia("(pointer: fine)").matches) {
  window.addEventListener("pointermove", e => {
    glow.style.left = `${e.clientX}px`;
    glow.style.top = `${e.clientY}px`;
  });
}

// Dashboard micro-animation: readiness score gently changes to feel alive.
const score = document.querySelector(".metric-card.accent strong");
let scoreValue = 78;
setInterval(() => {
  if (!score) return;
  scoreValue = scoreValue === 78 ? 79 : 78;
  score.innerHTML = `${scoreValue}<span>/100</span>`;
}, 2600);
