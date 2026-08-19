const CONFIG = {
  groom: "Фаргат",
  bride: "Гулина",
  // Дата и время никаха (год-месяц-день T часы:минуты:секунды):
  dateISO: "2026-08-19T12:00:00",
  // Подпись в финале:
  signature: "С любовью от Нурислама и Алины",
};

(function () {
  "use strict";

  const isTouch = window.matchMedia("(hover: none)").matches;


  const target = new Date(CONFIG.dateISO);
  document.getElementById("groomName").textContent = CONFIG.groom;
  document.getElementById("brideName").textContent = CONFIG.bride;
  document.getElementById("heroDate").textContent = target.toLocaleDateString("ru-RU", {
    day: "numeric", month: "long", year: "numeric",
  });
  document.title = `${CONFIG.groom} & ${CONFIG.bride} — Никах`;
  const signEl = document.querySelector(".finale-sign");
  if (signEl && CONFIG.signature) signEl.textContent = CONFIG.signature;


  const preloader = document.getElementById("preloader");
  const hidePreloader = () => {
    setTimeout(() => {
      preloader.classList.add("done");
      revealVisible(true);
    }, 2100);
  };
  if (document.readyState === "complete") hidePreloader();
  else window.addEventListener("load", hidePreloader);
  setTimeout(hidePreloader, 5000); // страховка


  const starsBg = document.querySelector(".stars-bg");
  if (starsBg) {
    const frag = document.createDocumentFragment();
    for (let i = 0; i < 90; i++) {
      const s = document.createElement("i");
      s.style.left = Math.random() * 100 + "%";
      s.style.top = Math.random() * 100 + "%";
      s.style.setProperty("--tw", 2 + Math.random() * 4 + "s");
      s.style.setProperty("--twd", Math.random() * 4 + "s");
      if (Math.random() > 0.85) { s.style.width = s.style.height = "3px"; }
      frag.appendChild(s);
    }
    starsBg.appendChild(frag);
  }


  const revealEls = [...document.querySelectorAll(".reveal")];
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const siblings = [...e.target.parentElement.querySelectorAll(".reveal")];
          e.target.style.setProperty("--d", Math.max(0, siblings.indexOf(e.target)) * 0.12 + "s");
          e.target.classList.add("in");
          observer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.18 }
  );
  revealEls.forEach((el) => observer.observe(el));
  function revealVisible(instant) {
    revealEls.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < innerHeight && r.bottom > 0) el.classList.add("in");
    });
  }


  const floats = [...document.querySelectorAll(".float")];
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = scrollY;
      floats.forEach((f, i) => {
        const speed = [0.25, -0.18, 0.32, -0.28][i % 4];
        f.style.transform = `translateY(${y * speed}px)`;
      });
      ticking = false;
    });
  }, { passive: true });

  
  const dots = [...document.querySelectorAll("#dots button")];
  const sections = dots.map((b) => document.getElementById(b.dataset.target));

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          dots.forEach((b) => b.classList.toggle("active", b.dataset.target === e.target.id));
        }
      });
    },
    { threshold: 0.5 }
  );
  sections.forEach((s) => s && sectionObserver.observe(s));


  const curtain = document.getElementById("curtain");
  const curtainWord = curtain.querySelector(".curtain-word");
  let transitioning = false;

  function goToSection(id, label) {
    if (transitioning) return;
    const el = document.getElementById(id);
    if (!el) return;
    transitioning = true;
    curtainWord.textContent = label || "";
    curtain.classList.remove("out");
    curtain.classList.add("in");
    setTimeout(() => {
      el.scrollIntoView({ behavior: "auto", block: "start" });
      revealVisible();
      curtain.classList.remove("in");
      curtain.classList.add("out");
      setTimeout(() => { curtain.classList.remove("out"); transitioning = false; }, 600);
    }, 580);
  }

  dots.forEach((b) =>
    b.addEventListener("click", () => goToSection(b.dataset.target, b.querySelector("span").textContent))
  );
  document.getElementById("toTop").addEventListener("click", () => goToSection("hero", "Начало"));

  /* ---------- Обратный отсчёт до никаха ---------- */
  const cd = {
    d: document.getElementById("cd-d"),
    h: document.getElementById("cd-h"),
    m: document.getElementById("cd-m"),
    s: document.getElementById("cd-s"),
  };
  const cdBox = document.getElementById("countdown");
  const cdDone = document.getElementById("cdDone");

  function tick() {
    const diff = target - new Date();
    if (diff <= 0) {
      cdBox.hidden = true;
      cdDone.hidden = false;
      cdDone.classList.add("in");
      clearInterval(timer);
      return;
    }
    cd.d.textContent = Math.floor(diff / 864e5);
    cd.h.textContent = String(Math.floor(diff / 36e5) % 24).padStart(2, "0");
    cd.m.textContent = String(Math.floor(diff / 6e4) % 60).padStart(2, "0");
    cd.s.textContent = String(Math.floor(diff / 1e3) % 60).padStart(2, "0");
  }
  const timer = setInterval(tick, 1000);
  tick();


  if (!isTouch) {
    document.querySelectorAll(".tilt").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `rotateY(${px * 12}deg) rotateX(${-py * 12}deg) translateY(-4px)`;
        card.style.setProperty("--gx", ((px + 0.5) * 100) + "%");
        card.style.setProperty("--gy", ((py + 0.5) * 100) + "%");
      });
      card.addEventListener("mouseleave", () => {
        card.style.transition = "transform 0.6s cubic-bezier(0.22,1,0.36,1)";
        card.style.transform = "";
        setTimeout(() => (card.style.transition = ""), 600);
      });
    });
  }


  if (!isTouch) {
    const canvas = document.getElementById("sparkles");
    const ctx = canvas.getContext("2d");
    let W, H;
    const resize = () => { W = canvas.width = innerWidth; H = canvas.height = innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const particles = [];
    let mx = -100, my = -100;

    window.addEventListener("mousemove", (e) => {
      mx = e.clientX; my = e.clientY;
      for (let i = 0; i < 2; i++) {
        particles.push({
          x: mx + (Math.random() - 0.5) * 10,
          y: my + (Math.random() - 0.5) * 10,
          vx: (Math.random() - 0.5) * 0.9,
          vy: Math.random() * 0.9 + 0.3,
          life: 1,
          size: Math.random() * 2.2 + 0.6,
          star: Math.random() > 0.7,
        });
      }
    });

    function drawStar(x, y, r) {
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const ang = (i * Math.PI) / 4;
        const rad = i % 2 === 0 ? r : r * 0.4;
        ctx.lineTo(x + Math.cos(ang) * rad, y + Math.sin(ang) * rad);
      }
      ctx.closePath();
      ctx.fill();
    }

    (function loop() {
      ctx.clearRect(0, 0, W, H);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy; p.life -= 0.016;
        if (p.life <= 0) { particles.splice(i, 1); continue; }
        ctx.fillStyle = `rgba(240, 217, 140, ${p.life * 0.85})`;
        if (p.star) drawStar(p.x, p.y, p.size * 2.2 * p.life);
        else { ctx.beginPath(); ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2); ctx.fill(); }
      }
      if (particles.length > 300) particles.splice(0, particles.length - 300);
      requestAnimationFrame(loop);
    })();
  }
})();
