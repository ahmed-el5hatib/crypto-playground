/* Shared site logic: exercises, scoring, toast, reveal animations, card glow */
(function () {
  "use strict";

  /* ---------- Inline SVG icon set (no font/emoji dependency) ---------- */
  const S = 'xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
  const ICONS = {
    logo: `<svg ${S}><circle cx="8" cy="14" r="4.5"/><path d="M11 11 20 2"/><path d="M16 6l3 3"/><path d="M13 9l2.5 2.5"/></svg>`,
    rocket: `<svg ${S}><path d="M5 15c-1.5 1.5-2 5-2 5s3.5-.5 5-2"/><path d="M9 17l-2-2c1-4 4-8 10-11 0 0 .5 8-3 12-1.5 1.7-3.5 2-5 1z"/><circle cx="14.5" cy="9.5" r="1.6"/></svg>`,
    landmark: `<svg ${S}><path d="M3 21h18"/><path d="M5 21v-9"/><path d="M9 21v-9"/><path d="M15 21v-9"/><path d="M19 21v-9"/><path d="M3 12h18"/><path d="M12 3 4 8h16z"/></svg>`,
    lock: `<svg ${S}><rect x="4" y="11" width="16" height="10" rx="2.5"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/><circle cx="12" cy="16" r="1.6"/></svg>`,
    fingerprint: `<svg ${S}><path d="M6 18a8 8 0 0 1 .5-3"/><path d="M4.5 10.5A9 9 0 0 1 21 12c0 3-.7 5.5-1.8 7.5"/><path d="M8 12.5A4.5 4.5 0 0 1 16.5 12c.3 3-.3 5.8-1.6 8"/><path d="M12 12v3c0 2-.5 4-1.4 5.6"/></svg>`,
    key: `<svg ${S}><circle cx="7" cy="15" r="4"/><path d="M10 12 21 1"/><path d="M17 5l3 3"/></svg>`,
    pen: `<svg ${S}><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>`,
    atom: `<svg ${S}><circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none"/><ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/></svg>`,
    burst: `<svg ${S}><path d="M12 2v4"/><path d="M12 18v4"/><path d="M2 12h4"/><path d="M18 12h4"/><path d="M4.9 4.9l2.8 2.8"/><path d="M16.3 16.3l2.8 2.8"/><path d="M19.1 4.9l-2.8 2.8"/><path d="M7.7 16.3l-2.8 2.8"/></svg>`,
    cursor: `<svg ${S}><path d="M4 3l7 17 2.2-7.2L20 10z"/></svg>`,
    trophy: `<svg ${S}><path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 4h10v6a5 5 0 0 1-10 0z"/><path d="M7 6H4a2 2 0 0 0 2 4h1"/><path d="M17 6h3a2 2 0 0 1-2 4h-1"/></svg>`,
    code: `<svg ${S}><path d="M8 6 2 12l6 6"/><path d="M16 6l6 6-6 6"/></svg>`,
    server: `<svg ${S}><rect x="3" y="4" width="18" height="7" rx="2"/><rect x="3" y="13" width="18" height="7" rx="2"/><path d="M7 7.5h.01"/><path d="M7 16.5h.01"/><path d="M3 3l18 18"/></svg>`,
    chat: `<svg ${S}><path d="M21 12a8 8 0 0 1-11.6 7.1L4 21l1.9-5.4A8 8 0 1 1 21 12z"/></svg>`,
    grad: `<svg ${S}><path d="M2 9.5 12 5l10 4.5L12 14z"/><path d="M6 11.5V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-4.5"/><path d="M22 9.5V15"/></svg>`,
    bulb: `<svg ${S}><path d="M9 18h6"/><path d="M10 21h4"/><path d="M12 3a6 6 0 0 0-4 10.5c.8.7 1 1.5 1 2.5h6c0-1 .2-1.8 1-2.5A6 6 0 0 0 12 3z"/></svg>`,
    check: `<svg ${S}><path d="M4 12.5 9.5 18 20 6"/></svg>`
  };
  function renderIcons(root) {
    (root || document).querySelectorAll("[data-icon]").forEach(el => {
      if (ICONS[el.dataset.icon]) el.innerHTML = ICONS[el.dataset.icon];
    });
  }
  renderIcons();

  const SCORE_KEY = "cp_score_v1";
  const SOLVED_KEY = "cp_solved_v1";

  function getSolved() {
    try { return JSON.parse(localStorage.getItem(SOLVED_KEY) || "[]"); } catch { return []; }
  }
  function getScore() {
    return parseInt(localStorage.getItem(SCORE_KEY) || "0", 10);
  }
  function setScore(v) { localStorage.setItem(SCORE_KEY, String(v)); paintScore(); }
  function paintScore() {
    document.querySelectorAll("[data-score]").forEach(el => { el.textContent = getScore() + " pts"; });
  }

  async function sha256(text) {
    const data = new TextEncoder().encode(text);
    const buf = await crypto.subtle.digest("SHA-256", data);
    return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
  }
  function normalize(s) {
    return s.trim().toLowerCase().replace(/\s+/g, " ");
  }

  function toast(msg) {
    let t = document.getElementById("toast");
    if (!t) { t = document.createElement("div"); t.id = "toast"; document.body.appendChild(t); }
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(t._tm);
    t._tm = setTimeout(() => t.classList.remove("show"), 2600);
  }

  function markSolved(ex, pts, id) {
    ex.classList.add("solved");
    const fb = ex.querySelector(".ex-feedback");
    if (fb) { fb.textContent = "صح! أحسنت، +" + pts + " نقطة"; fb.className = "ex-feedback ok"; }
    const solved = getSolved();
    if (!solved.includes(id)) {
      solved.push(id);
      localStorage.setItem(SOLVED_KEY, JSON.stringify(solved));
      setScore(getScore() + pts);
    }
    toast("إجابة صحيحة! +" + pts + " نقطة");
  }

  // Hash-graded text exercises
  document.querySelectorAll(".exercise[data-answer-hash]").forEach(ex => {
    const id = ex.dataset.exId;
    const pts = parseInt(ex.dataset.pts || "10", 10);
    const input = ex.querySelector("input");
    const btn = ex.querySelector("[data-check]");
    const fb = ex.querySelector(".ex-feedback");
    if (getSolved().includes(id)) {
      ex.classList.add("solved");
      if (fb) { fb.textContent = "محلولة من قبل ✓"; fb.className = "ex-feedback ok"; }
      if (input) input.disabled = true;
      if (btn) btn.disabled = true;
    }
    async function check() {
      if (!input || ex.classList.contains("solved")) return;
      const h = await sha256(normalize(input.value));
      if (h === ex.dataset.answerHash) { markSolved(ex, pts, id); input.disabled = true; btn.disabled = true; }
      else {
        fb.textContent = "لسه مش صح.. جرّب تاني";
        fb.className = "ex-feedback bad";
        input.style.animation = "none"; void input.offsetWidth;
        input.style.animation = "bitflip 0.5s ease";
      }
    }
    if (btn) btn.addEventListener("click", check);
    if (input) input.addEventListener("keydown", e => { if (e.key === "Enter") check(); });
  });

  // MCQ exercises
  document.querySelectorAll(".exercise[data-mcq]").forEach(ex => {
    const id = ex.dataset.exId;
    const pts = parseInt(ex.dataset.pts || "10", 10);
    const opts = ex.querySelectorAll(".mcq-opt");
    const fb = ex.querySelector(".ex-feedback");
    if (getSolved().includes(id)) {
      ex.classList.add("solved");
      opts.forEach(o => { o.style.pointerEvents = "none"; if (o.dataset.correct) o.classList.add("correct"); });
      if (fb) { fb.textContent = "محلولة من قبل ✓"; fb.className = "ex-feedback ok"; }
    }
    opts.forEach(opt => opt.addEventListener("click", () => {
      if (ex.classList.contains("solved")) return;
      if (opt.dataset.correct !== undefined) {
        markSolved(ex, pts, id);
        opts.forEach(o => { o.style.pointerEvents = "none"; });
        opt.classList.add("correct");
      } else {
        opt.classList.add("wrong");
        fb.textContent = "مش دي.. فكّر كمان شوية";
        fb.className = "ex-feedback bad";
        setTimeout(() => opt.classList.remove("wrong"), 900);
      }
    }));
  });

  // Hints
  document.querySelectorAll(".ex-hint").forEach(h => {
    h.addEventListener("click", () => h.classList.toggle("open"));
  });

  // Reveal on scroll (?snap=1 reveals everything immediately, for screenshots/previews)
  const snapMode = new URLSearchParams(location.search).has("snap");
  if (snapMode) {
    const st = document.createElement("style");
    st.textContent = ".reveal{transition:none!important;opacity:1!important;transform:none!important}";
    document.head.appendChild(st);
    document.querySelectorAll(".reveal").forEach(el => el.classList.add("in"));
  } else {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach(el => io.observe(el));
  }

  // Card cursor glow
  document.querySelectorAll(".module-card").forEach(card => {
    card.addEventListener("pointermove", e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 100) + "%");
      card.style.setProperty("--my", ((e.clientY - r.top) / r.height * 100) + "%");
    });
  });

  paintScore();
  window.CP = { sha256, normalize, toast, getScore };
})();
