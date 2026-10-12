/* ==========================================================================
   Portfolio – Sudhanshu Shrivastav
   EDIT THE CONFIG BELOW. Everything else works automatically.
   Leave a value as "" to hide it (links) – nothing breaks.
   ========================================================================== */
const SITE = {
  name: "Sudhanshu Shrivastav",
  email: "abc@gmail.com",                     // e.g. "you@gmail.com"  <-- required for the contact form
  github: "",                    // e.g. "https://github.com/yourname"
  linkedin: "",                  // e.g. "https://www.linkedin.com/in/yourname"
  resume: "",                    // e.g. "resume.pdf" (put the file in this folder)
  projects: {                    // project links; "" shows "Link coming soon"
    portfolio: "",               // live URL of this site
    tasks: "",                   // live demo URL
    dbtool: ""                   // GitHub repo URL
  }
};

(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const safe = fn => { try { return fn(); } catch (e) { return null; } };
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isUrl = v => /^(https?:\/\/|mailto:)/i.test(v) || /^[\w./-]+\.\w+$/.test(v);

  /* ---------- site data (name, year) ---------- */
  const parts = SITE.name.trim().split(/\s+/);
  const map = {
    "name": SITE.name,
    "name-upper": SITE.name.toUpperCase(),
    "first-upper": parts[0].toUpperCase(),
    "last-upper": parts.slice(1).join(" ").toUpperCase()
  };
  $$("[data-site]").forEach(el => { const v = map[el.dataset.site]; if (v) el.textContent = v; });
  $$("[data-year]").forEach(el => (el.textContent = new Date().getFullYear()));



  /* =====================================================================
     CODE LAYER: syntax-highlighted Java behind gears and pages
     ===================================================================== */
  const SNIPPETS = {
    loader: `import java.util.*;
import java.util.stream.*;

public class Portfolio {
    private final String owner = "${SITE.name}";
    private final List<String> stack =
        List.of("Java", "MySQL", "JavaScript", "HTML", "CSS");

    public static void main(String[] args) {
        Portfolio app = new Portfolio();
        app.calibrateGears(12);
        app.compile();
        app.launch();
    }

    // every tooth must mesh before we move
    void calibrateGears(int teeth) {
        for (int t = 0; t < teeth; t++) {
            Gear.rotate(360.0 / teeth * t);
        }
    }

    void compile() {
        stack.stream()
             .map(s -> "compiled: " + s)
             .forEach(System.out::println);
    }

    @Override
    public String toString() {
        return owner + " :: Java Developer";
    }

    void launch() {
        Rocket rocket = new Rocket(3, 2, 1);
        rocket.ignite();
        while (rocket.altitude() < 408) {
            rocket.climb();
        }
        System.out.println("Orbit reached");
    }
}`,
    engine: `public class Engine implements Runnable {
    private double thrust = 0.0;
    private boolean ignited = false;

    @Override
    public void run() {
        ignited = true;
        while (ignited && thrust < 100) {
            thrust += 2.5;
            Thread.sleep(16);
        }
    }

    // learn -> build -> ship -> repeat
    public static int fib(int n) {
        return n < 2 ? n : fib(n - 1) + fib(n - 2);
    }

    Map<String, Integer> skills = Map.of(
        "Java", 85, "SQL", 75, "JS", 75
    );

    String query = "SELECT * FROM projects WHERE status = 'shipped'";

    public Optional<String> nextGoal() {
        return Optional.of("Junior Developer");
    }
}`,
    developer: `public class Developer {
    String name    = "${SITE.name}";
    String role    = "Java Developer";
    String degree  = "B.Tech, CSE";
    String[] stack = {"Java", "HTML", "CSS", "JS", "MySQL"};
    boolean openToWork = true;

    // what drives me
    String goal() {
        return "Build accessible, efficient software";
    }
}`
  };
  const esc = t => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const TOKEN = /(\/\/.*$)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(@\w+)|\b(public|private|protected|class|static|final|void|new|return|for|while|if|else|import|package|boolean|int|double|var|this|true|false|extends|implements|interface|try|catch|throws)\b|\b(String|List|Map|Rocket|Gear|System|Portfolio|Developer|Engine|Thread|Optional|Runnable|Integer|Override)\b|\b(\d+(?:\.\d+)?)\b|(\w+)(?=\()/g;
  const CLS = [null, "tk-c", "tk-s", "tk-a", "tk-k", "tk-t", "tk-n", "tk-f"];
  const highlight = line => {
    let out = "", last = 0, m;
    TOKEN.lastIndex = 0;
    while ((m = TOKEN.exec(line))) {
      out += esc(line.slice(last, m.index));
      const g = m.findIndex((v, i) => i > 0 && v !== undefined);
      out += `<span class="${CLS[g]}">${esc(m[0])}</span>`;
      last = m.index + m[0].length;
      if (m[0].length === 0) TOKEN.lastIndex++;
    }
    return out + esc(line.slice(last));
  };
  const codeHTML = (name, twice) => {
    const lines = SNIPPETS[name].split("\n").map(l => `<span class="ln">${highlight(l) || " "}</span>`).join("");
    return twice ? lines + lines : lines;
  };
  // fill static layers
  $$("pre[data-code]").forEach(pre => {
    const looping = pre.classList.contains("code-col");
    pre.innerHTML = looping ? codeHTML(pre.dataset.code, true) : `<span class="scroll">${codeHTML(pre.dataset.code, true)}</span>`;
  });
  // drifting code behind inner pages
  $$(".page").forEach((pg, i) => {
    if (pg.classList.contains("nf")) return;
    const pre = document.createElement("pre");
    pre.className = "page-code"; pre.setAttribute("aria-hidden", "true");
    pre.innerHTML = `<span class="scroll">${codeHTML(i % 2 ? "loader" : "engine", true)}</span>`;
    pg.prepend(pre);
  });
  // loader: moving "current line" highlight
  const hotCol = $(".code-col.c1");
  if (hotCol && !reduceMotion) {
    const lns = $$(".ln", hotCol); let h = 0;
    const hotTimer = setInterval(() => {
      lns.forEach(l => l.classList.remove("hot"));
      lns[h % lns.length].classList.add("hot"); h += 1;
      if (!document.body.contains(hotCol)) clearInterval(hotTimer);
    }, 140);
  }

  /* ---------- gear loader (home, once per session) ---------- */
  const loader = $("#loader");
  const loaderOn = !!loader && document.documentElement.classList.contains("loading");
  const LOADER_MS = 2100;
  if (loader && !loaderOn) loader.remove();
  if (loaderOn) {
    const pct = $("#ld-pct"), bar = $("#ld-bar"), txt = $("#ld-text");
    const steps = ["Calibrating gears", "Compiling Java", "Fueling the rocket", "Ready for launch"];
    const cmds = ["git pull origin main", "javac Portfolio.java", "java Portfolio --fuel=100", "./launch --target=orbit"];
    const cmdEl = $("#ld-cmd");
    const t0 = performance.now(), dur = LOADER_MS - 400;
    const frame = now => {
      const k = Math.min(Math.max((now - t0) / dur, 0), 1), e = 1 - Math.pow(1 - k, 3);
      pct.textContent = Math.round(e * 100);
      bar.style.transform = "scaleX(" + e + ")";
      const si = Math.min(steps.length - 1, Math.floor(e * steps.length));
      txt.textContent = steps[si];
      if (cmdEl) { const local = Math.min(1, (e * steps.length - si) * 1.8); cmdEl.textContent = cmds[si].slice(0, Math.ceil(cmds[si].length * local)); }
      if (k < 1) requestAnimationFrame(frame);
      else setTimeout(() => {
        loader.classList.add("done");
        document.documentElement.classList.remove("loading");
        safe(() => sessionStorage.setItem("booted", "1"));
        setTimeout(() => loader.remove(), 1000);
      }, 250);
    };
    requestAnimationFrame(frame);
  }
  const startDelay = loaderOn ? LOADER_MS + 150 : 0;

  /* ---------- letter-split headline animation ---------- */
  const splitTargets = $$("[data-split], .page-title");
  const heroName = $(".name");
  if (heroName) heroName.setAttribute("aria-label", SITE.name);
  if (!reduceMotion) {
    let idx = 0;
    splitTargets.forEach(el => {
      const text = el.textContent;
      const host = el.closest("h1") || el;
      if (!host.hasAttribute("aria-label")) host.setAttribute("aria-label", host.textContent.replace(/\s+/g, " ").trim());
      el.textContent = "";
      const isPage = el.classList.contains("page-title");
      text.split(/(\s+)/).forEach(word => {
        if (/^\s+$/.test(word)) { el.appendChild(document.createTextNode(" ")); return; }
        if (!word) return;
        const w = document.createElement("span"); w.className = "w"; w.setAttribute("aria-hidden", "true");
        Array.from(word).forEach(ch => {
          const s = document.createElement("span");
          s.className = "ch"; s.textContent = ch; s.style.setProperty("--i", idx++);
          w.appendChild(s);
        });
        el.appendChild(w);
      });
      if (isPage) idx = 0;
      host.classList.add("split-anim");
    });
    const total = idx;
    setTimeout(() => $$(".split-anim").forEach(h => { h.classList.remove("split-anim"); h.classList.add("split-done"); }),
      Math.max(total, 12) * 40 + 1000 + startDelay);
  }

  /* ---------- scroll progress bar ---------- */
  const bar = document.createElement("div");
  bar.className = "progress"; bar.setAttribute("aria-hidden", "true");
  document.body.appendChild(bar);
  let ticking = false;
  const paintProgress = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = "scaleX(" + (max > 0 ? scrollY / max : 0) + ")";
    ticking = false;
  };
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(paintProgress); } }, { passive: true });
  paintProgress();

  /* ---------- tech marquee (seamless loop) ---------- */
  $$(".marquee").forEach(m => {
    const track = $(".track", m);
    if (!track) return;
    if (reduceMotion) { track.style.flexWrap = "wrap"; return; }
    for (let i = 0; i < 2; i++) { const c = track.cloneNode(true); c.setAttribute("aria-hidden", "true"); m.appendChild(c); }
  });

  /* ---------- pointer effects (desktop only) ---------- */
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (finePointer && !reduceMotion) {
    // tilt + spotlight on cards
    $$(".tilt").forEach(card => {
      card.addEventListener("mousemove", e => {
        const r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        card.style.setProperty("--ry", ((x - .5) * 10).toFixed(2) + "deg");
        card.style.setProperty("--rx", ((.5 - y) * 10).toFixed(2) + "deg");
        card.style.setProperty("--mx", (x * 100).toFixed(1) + "%");
        card.style.setProperty("--my", (y * 100).toFixed(1) + "%");
      });
      card.addEventListener("mouseleave", () => { card.style.setProperty("--rx", "0deg"); card.style.setProperty("--ry", "0deg"); });
    });
    // magnetic buttons
    $$(".magnetic, .badge").forEach(btn => {
      btn.addEventListener("mousemove", e => {
        const r = btn.getBoundingClientRect();
        btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .18}px, ${(e.clientY - r.top - r.height / 2) * .28}px)`;
      });
      btn.addEventListener("mouseleave", () => (btn.style.transform = ""));
    });
    // hero glow follows the cursor
    const hero = $(".hero"), bg = $(".hero-bg");
    if (hero && bg) hero.addEventListener("mousemove", e => {
      const r = bg.getBoundingClientRect();
      bg.style.setProperty("--cx", e.clientX - r.left + "px");
      bg.style.setProperty("--cy", e.clientY - r.top + "px");
    });
  }

  /* ---------- social + resume + project links ---------- */
  const social = $$("[data-social]");
  [["GitHub", SITE.github], ["LinkedIn", SITE.linkedin]].forEach(([label, url]) => {
    if (!url) return;
    social.forEach(ul => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = url; a.textContent = label; a.target = "_blank"; a.rel = "noopener";
      li.appendChild(a); ul.appendChild(li);
    });
  });
  social.forEach(ul => { if (!ul.children.length) ul.remove(); });

  $$("[data-resume]").forEach(a => { if (SITE.resume) { a.href = SITE.resume; a.hidden = false; } });

  $$("[data-link]").forEach(a => {
    const url = SITE[a.dataset.link];
    const wrap = a.closest("[data-wrap]");
    if (url) { a.href = url; a.textContent = url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, ""); if (wrap) wrap.hidden = false; }
  });

  $$("[data-project-link]").forEach(a => {
    const url = SITE.projects[a.dataset.projectLink];
    if (url && isUrl(url)) {
      a.href = url; a.target = "_blank"; a.rel = "noopener";
      a.setAttribute("aria-label", a.textContent + " (opens in a new tab)");
    } else {
      const s = document.createElement("span");
      s.className = "go is-soon"; s.textContent = "Link coming soon";
      a.replaceWith(s);
    }
  });

  /* ---------- theme toggle ---------- */
  const root = document.documentElement;
  const themeBtn = $("#theme-toggle");
  const currentTheme = () => root.getAttribute("data-theme") ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  function paintTheme() {
    if (!themeBtn) return;
    const dark = currentTheme() === "dark";
    themeBtn.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
    themeBtn.dataset.mode = dark ? "dark" : "light";
  }
  if (themeBtn) themeBtn.addEventListener("click", () => {
    const next = currentTheme() === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    safe(() => localStorage.setItem("theme", next));
    paintTheme();
  });
  paintTheme();

  /* ---------- mobile menu ---------- */
  const menuBtn = $("#menu-toggle"), nav = $("#site-nav");
  function setMenu(open) {
    if (!menuBtn || !nav) return;
    nav.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  if (menuBtn) {
    menuBtn.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
    document.addEventListener("keydown", e => { if (e.key === "Escape") { setMenu(false); menuBtn.focus(); } });
    document.addEventListener("click", e => { if (!e.target.closest(".bar")) setMenu(false); });
    $$("a", nav).forEach(a => a.addEventListener("click", () => setMenu(false)));
  }

  /* ---------- scroll reveal ---------- */
  const reveals = $$(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    document.documentElement.classList.add("js-reveal");
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    }), { threshold: 0.12 });
    reveals.forEach((el, i) => { el.style.transitionDelay = Math.min(i % 6, 5) * 60 + "ms"; io.observe(el); });
  } else reveals.forEach(el => el.classList.add("in"));

  /* ---------- back to top + header shadow ---------- */
  const toTop = $("#to-top"), header = $(".site-header");
  const onScroll = () => header && header.classList.toggle("scrolled", window.scrollY > 4);
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();


  /* =====================================================================
     ENGINEERING LAYER: gears, rocket, sparks, mission launch
     ===================================================================== */
  const ROCKET_SVG = '<svg class="rocket-svg" viewBox="0 0 64 128" aria-hidden="true"><path class="r-fin" d="M14 82 L1 108 L1 118 L14 106Z"/><path class="r-fin" d="M50 82 L63 108 L63 118 L50 106Z"/><path class="r-body" d="M32 3 C46 20 50 42 50 66 L50 108 L14 108 L14 66 C14 42 18 20 32 3Z"/><path class="r-nose" d="M32 3 C39 11 43 19 46 28 L18 28 C21 19 25 11 32 3Z"/><circle class="r-win" cx="32" cy="52" r="9"/><circle class="r-glint" cx="29" cy="49" r="2.6"/><rect class="r-stripe" x="14" y="88" width="36" height="6"/><path class="r-nozzle" d="M21 108 L43 108 L40 120 L24 120Z"/></svg>';

  /* hero gears turn with time + scroll */
  const hg = [$(".hgA"), $(".hgB"), $(".hgC")];
  if (hg[0] && !reduceMotion) {
    let visible = true, last = performance.now(), ang = 0;
    const heroEl = $(".hero");
    if ("IntersectionObserver" in window) new IntersectionObserver(es => { visible = es[0].isIntersecting; if (visible) requestAnimationFrame(spinG); }).observe(heroEl);
    let lastScroll = scrollY;
    const spinG = now => {
      const dt = Math.min(now - last, 50); last = now;
      const ds = scrollY - lastScroll; lastScroll = scrollY;
      ang += dt * 0.012 + ds * 0.35;
      hg[0].style.transform = `rotate(${ang}deg)`;
      hg[1].style.transform = `rotate(${-ang * 1.5}deg)`;
      hg[2].style.transform = `rotate(${ang * 2}deg)`;
      if (visible) requestAnimationFrame(spinG);
    };
    requestAnimationFrame(spinG);
  }

  /* rocket back-to-top (all pages) */
  const rt = document.createElement("button");
  rt.type = "button"; rt.className = "rocket-top"; rt.setAttribute("aria-label", "Back to top");
  rt.innerHTML = '<span class="mini">' + ROCKET_SVG + '<span class="flame"></span></span>';
  document.body.appendChild(rt);
  let inMission = false;
  const showRt = () => rt.classList.toggle("show", scrollY > 500 && !inMission && !rt.classList.contains("launching"));
  const missionEl = $(".mission");
  if (missionEl && "IntersectionObserver" in window) new IntersectionObserver(es => { inMission = es[0].isIntersecting; showRt(); }, { rootMargin: "-85% 0px 0px 0px" }).observe(missionEl);
  addEventListener("scroll", showRt, { passive: true }); showRt();
  const launchToTop = () => {
    if (reduceMotion) { scrollTo({ top: 0 }); return; }
    if (rt.classList.contains("launching")) return;
    const r = rt.getBoundingClientRect();
    rt.classList.add("show", "launching");
    for (let i = 0; i < 10; i++) {
      const p = document.createElement("span");
      p.className = "puff";
      p.style.left = r.left + r.width / 2 - 9 + "px"; p.style.top = r.top + r.height - 12 + "px";
      p.style.setProperty("--dx", (Math.random() * 120 - 60) + "px");
      p.style.setProperty("--dy", (Math.random() * 30 + 10) + "px");
      p.style.animationDelay = 250 + i * 30 + "ms";
      document.body.appendChild(p); setTimeout(() => p.remove(), 1500);
    }
    setTimeout(() => scrollTo({ top: 0, behavior: "smooth" }), 450);
    setTimeout(() => { rt.classList.remove("launching", "show"); }, 1700);
  };
  rt.addEventListener("click", launchToTop);
  if (toTop) toTop.addEventListener("click", e => { e.preventDefault(); launchToTop(); });

  /* welding sparks on click (desktop) */
  if (finePointer && !reduceMotion) {
    const cols = ["#FFC24B", "#FF9A3C", "#8A96FF", "#FFFFFF"];
    document.addEventListener("pointerdown", e => {
      if (e.target.closest("input, textarea, select")) return;
      for (let i = 0; i < 10; i++) {
        const s = document.createElement("span"), a = Math.random() * Math.PI * 2, d = 24 + Math.random() * 46;
        s.className = "spark";
        s.style.left = e.clientX - 3 + "px"; s.style.top = e.clientY - 3 + "px";
        s.style.setProperty("--dx", Math.cos(a) * d + "px"); s.style.setProperty("--dy", Math.sin(a) * d + 18 + "px");
        s.style.setProperty("--c", cols[i % cols.length]);
        document.body.appendChild(s); setTimeout(() => s.remove(), 650);
      }
    });
  }

  /* mission: scroll-driven launch sequence */
  const mission = $(".mission");
  if (mission) {
    const scene = $(".scene", mission), canvas = $(".stars", mission), ctx = canvas.getContext("2d");
    const stages = $$(".stage", mission), stageList = $(".stages", mission), cd = $("#countdown");
    const hudAlt = $("#hud-alt"), hudVel = $("#hud-vel"), hudT = $("#hud-t");
    const thresholds = [0.2, 0.36, 0.52, 0.68, 0.84];
    let stars = [], W = 0, H = 0, P = 0, seen = false;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const sizeCanvas = () => {
      W = scene.clientWidth; H = scene.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(W * H / 5200);
      stars = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.4 + .3, z: Math.random() * .8 + .2, tw: Math.random() * 6.28 }));
    };
    const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
    const ease = k => k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
    const draw = now => {
      ctx.clearRect(0, 0, W, H);
      const shift = P * H * 5;
      for (const s of stars) {
        const y = (s.y + shift * s.z) % H;
        const a = .45 + .55 * Math.sin(now / 600 + s.tw);
        ctx.globalAlpha = a * s.z; ctx.fillStyle = "#fff";
        const streak = P > .2 && P < .95 ? Math.min(10, 26 * s.z * (P - .2)) : 0;
        ctx.fillRect(s.x, y - streak, s.r, s.r + streak);
      }
      ctx.globalAlpha = 1;
    };
    const update = () => {
      const r = mission.getBoundingClientRect(), total = mission.offsetHeight - innerHeight;
      P = reduceMotion ? 1 : clamp(-r.top / total, 0, 1);
      mission.style.setProperty("--p", P.toFixed(4));
      const lift = clamp((P - .18) / .3, 0, 1);
      const rocketY = -ease(lift) * H * .46;
      const bob = lift >= 1 ? Math.sin(performance.now() / 500) * 4 : 0;
      scene.style.setProperty("--rocketY", (reduceMotion ? 0 : rocketY + bob) + "px");
      scene.style.setProperty("--padY", Math.max(0, (P - .18)) * H * 2.2 + "px");
      const ign = clamp((P - .08) / .1, 0, 1);
      scene.style.setProperty("--flameO", reduceMotion ? 1 : ign);
      scene.style.setProperty("--flameH", (reduceMotion ? 50 : 20 + ign * 60 + lift * 40) + "px");
      scene.style.setProperty("--shake", (!reduceMotion && P > .1 && P < .3 ? (Math.random() * 3 - 1.5) : 0) + "px");
      const sm = clamp((P - .1) / .2, 0, 1);
      scene.style.setProperty("--smoke", sm);
      scene.style.setProperty("--smokeO", P < .1 ? 0 : clamp(1 - (P - .3) / .2, 0, .9));
      // countdown
      let label = "";
      if (!reduceMotion) {
        if (P > .005 && P < .04) label = "3"; else if (P < .07 && P >= .04) label = "2";
        else if (P < .1 && P >= .07) label = "1"; else if (P >= .1 && P < .2) label = "LIFTOFF";
      }
      cd.textContent = label; cd.classList.toggle("on", !!label); cd.classList.toggle("liftoff", label === "LIFTOFF");
      // stages
      let lit = 0;
      stages.forEach((st, i) => { const on = reduceMotion || P >= thresholds[i]; st.classList.toggle("on", on); if (on) lit = i; });
      const stageP = reduceMotion ? 1 : clamp((P - thresholds[0]) / (thresholds[thresholds.length - 1] - thresholds[0]), 0, 1);
      stageList.style.setProperty("--stageP", stageP);
      // HUD
      const flight = clamp((P - .18) / .82, 0, 1);
      hudAlt.textContent = Math.round(Math.pow(flight, 1.6) * 408);
      hudVel.textContent = Math.round(Math.pow(flight, .8) * 7660).toLocaleString("en-US");
      const secs = Math.round(flight * 540);
      hudT.textContent = String(Math.floor(secs / 60)).padStart(2, "0") + ":" + String(secs % 60).padStart(2, "0");
    };
    const loop = now => { if (!seen) return; update(); draw(now); requestAnimationFrame(loop); };
    sizeCanvas(); update(); draw(0);
    addEventListener("resize", () => { sizeCanvas(); update(); draw(performance.now()); });
    if ("IntersectionObserver" in window && !reduceMotion) {
      new IntersectionObserver(es => { const was = seen; seen = es[0].isIntersecting; if (seen && !was) requestAnimationFrame(loop); }, { rootMargin: "100px" }).observe(mission);
    }
  }

  /* manifesto slides with scroll, gears turn */
  const man = $(".manifesto-line");
  if (man && !reduceMotion) {
    const moveMan = () => {
      const r = man.getBoundingClientRect();
      if (r.bottom < -200 || r.top > innerHeight + 200) return;
      const k = (innerHeight - r.top) / (innerHeight + r.height);
      man.style.setProperty("--mx", (-k * man.scrollWidth * 0.35) + "px");
      man.style.setProperty("--mr", (k * 540) + "deg");
    };
    addEventListener("scroll", () => requestAnimationFrame(moveMan), { passive: true }); moveMan();
  }


  /* =====================================================================
     SECTION ANIMATIONS (about / skills / projects / contact / footer)
     ===================================================================== */
  // footer gear
  $$(".site-footer .wrap > p:first-child").forEach(p => {
    const g = document.createElement("span"); g.className = "ft-gear"; g.setAttribute("aria-hidden", "true"); g.textContent = "⚙";
    p.prepend(g);
  });

  // about: Developer.java types itself
  const cw = $("#cw-code");
  if (cw) {
    const lines = SNIPPETS.developer.split("\n");
    const out = $("#cw-out"), state = $("#cw-state"), run = $("#cw-run");
    const finish = () => { cw.innerHTML = lines.map(l => `<span class="ln">${highlight(l) || " "}</span>`).join(""); state.textContent = "✓ Compiled"; };
    const runIt = () => {
      out.classList.remove("on"); out.innerHTML = "";
      void out.offsetWidth;
      out.innerHTML = `<p class="dim">$ java Developer</p><p>Hello, I'm ${esc(SITE.name.split(" ")[0])}. Let's build something great.</p><p class="dim">Process finished with exit code 0</p>`;
      out.classList.add("on");
    };
    run.addEventListener("click", () => { finish(); runIt(); });
    if (reduceMotion || !("IntersectionObserver" in window)) { finish(); }
    else {
      let started = false;
      const typeAll = () => {
        let li = 0, ci = 0;
        const done = [];
        const step = () => {
          if (li >= lines.length) { finish(); setTimeout(runIt, 500); return; }
          const line = lines[li];
          ci++;
          const typing = `<span class="ln cur">${esc(line.slice(0, ci))}<span class="caret"></span></span>`;
          cw.innerHTML = done.join("") + typing;
          if (ci >= line.length) { done.push(`<span class="ln">${highlight(line) || " "}</span>`); li++; ci = 0; return setTimeout(step, 120); }
          setTimeout(step, line[ci - 1] === " " ? 12 : 22 + Math.random() * 30);
        };
        step();
      };
      new IntersectionObserver((es, o) => { if (es[0].isIntersecting && !started) { started = true; o.disconnect(); setTimeout(typeAll, 400); } }, { threshold: .3 }).observe(cw);
    }
  }

  // skills: percentage counters
  $$(".skills .lvl").forEach(l => {
    const target = parseInt(l.querySelector("i").style.getPropertyValue("--w"), 10) || 0;
    const b = document.createElement("b"); b.className = "pct"; b.setAttribute("aria-hidden", "true"); b.textContent = reduceMotion ? target + "%" : "0%";
    l.before(b);
    if (reduceMotion || !("IntersectionObserver" in window)) { b.textContent = target + "%"; return; }
    new IntersectionObserver((es, o) => {
      if (!es[0].isIntersecting) return; o.disconnect();
      const t0 = performance.now() + 200;
      const f = now => { const k = Math.min(Math.max((now - t0) / 1100, 0), 1), e = 1 - Math.pow(1 - k, 3); b.textContent = Math.round(e * target) + "%"; if (k < 1) requestAnimationFrame(f); };
      requestAnimationFrame(f);
    }, { threshold: .4 }).observe(l);
  });

  /* ---------- typewriter role text (home) ---------- */
  const typed = $("[data-typed]");
  if (typed && !reduceMotion) {
    const words = typed.dataset.words.split("|");
    const role = typed.closest(".role");
    if (role) role.setAttribute("aria-label", words.join(", "));
    typed.setAttribute("aria-hidden", "true");
    let w = 0, c = words[0].length, deleting = true;
    const tick = () => {
      const word = words[w];
      if (deleting) {
        c--; typed.textContent = word.slice(0, c);
        if (c === 0) { deleting = false; w = (w + 1) % words.length; return setTimeout(tick, 350); }
        return setTimeout(tick, 45);
      }
      c++; typed.textContent = words[w].slice(0, c);
      if (c === words[w].length) { deleting = true; return setTimeout(tick, 2200); }
      setTimeout(tick, 85);
    };
    setTimeout(tick, 2600 + startDelay);
  }

  /* ---------- project filter ---------- */
  const chips = $$(".chip[data-filter]");
  if (chips.length) {
    const items = $$(".project"), countEl = $("#proj-count"), empty = $("#proj-empty");
    const apply = f => {
      let n = 0;
      items.forEach(p => { const show = f === "all" || p.dataset.kind === f; p.hidden = !show; if (show) { n++; p.classList.remove("pop"); void p.offsetWidth; p.classList.add("pop"); p.style.animationDelay = (n - 1) * 70 + "ms"; } });
      chips.forEach(c => { const on = c.dataset.filter === f; c.classList.toggle("is-on", on); c.setAttribute("aria-pressed", String(on)); });
      countEl.textContent = `Showing ${n} of ${items.length} project${items.length === 1 ? "" : "s"}`;
      empty.hidden = n !== 0;
    };
    chips.forEach(c => c.addEventListener("click", () => apply(c.dataset.filter)));
    apply("all");
    if (location.hash) {
      const t = $(location.hash); if (t && t.classList.contains("project")) t.classList.add("flash");
    }
  }

  /* ---------- contact form ---------- */
  const form = $("#contact-form");
  if (form) {
    const status = $("#form-status"), msg = $("#message"), counter = $("#msg-count");
    const emailLink = $("[data-email]"), emailText = $("[data-email-text]"), copyBtn = $("#copy-email");
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(SITE.email);

    if (emailOk) {
      emailLink.href = "mailto:" + SITE.email; emailText.textContent = SITE.email;
      if (navigator.clipboard) copyBtn.hidden = false;
      copyBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(SITE.email).then(() => {
          copyBtn.textContent = "Copied"; setTimeout(() => (copyBtn.textContent = "Copy"), 1800);
        });
      });
    } else {
      emailLink.removeAttribute("href"); emailText.textContent = "Not set yet";
    }

    const rules = {
      name: v => v.trim().length >= 2 || "Please enter your name (at least 2 characters).",
      email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || "Please enter a valid email address.",
      message: v => v.trim().length >= 10 || "Please write a message of at least 10 characters."
    };
    const check = field => {
      const input = form.elements[field], r = rules[field](input.value), err = $("#" + field + "-err");
      const ok = r === true;
      err.textContent = ok ? "" : r;
      input.setAttribute("aria-invalid", String(!ok));
      return ok;
    };
    Object.keys(rules).forEach(f => {
      form.elements[f].addEventListener("blur", () => check(f));
      form.elements[f].addEventListener("input", () => { if (form.elements[f].getAttribute("aria-invalid") === "true") check(f); });
    });
    msg.addEventListener("input", () => (counter.textContent = msg.value.length + " / 1000"));

    form.addEventListener("submit", e => {
      e.preventDefault();
      status.className = "status"; status.textContent = "";
      if (form.elements.website.value) return;                       // honeypot
      const results = Object.keys(rules).map(check);
      if (results.includes(false)) {
        const bad = Object.keys(rules).find(f => form.elements[f].getAttribute("aria-invalid") === "true");
        form.elements[bad].focus(); return;
      }
      if (!emailOk) {
        status.className = "status bad";
        status.textContent = "The site owner has not set a destination email yet (see SITE.email in app.js).";
        return;
      }
      const n = form.elements.name.value.trim(), em = form.elements.email.value.trim(), m = form.elements.message.value.trim();
      const url = "mailto:" + SITE.email + "?subject=" + encodeURIComponent("Portfolio message from " + n) +
        "&body=" + encodeURIComponent(m + "\n\n" + n + " (" + em + ")");
      window.location.href = url;
      if (!reduceMotion) {
        const btn = form.querySelector('button[type="submit"]'), r = btn.getBoundingClientRect();
        const pl = document.createElement("span"); pl.className = "plane"; pl.textContent = "\u2708"; pl.setAttribute("aria-hidden", "true");
        pl.style.left = r.right - 30 + "px"; pl.style.top = r.top + 4 + "px";
        document.body.appendChild(pl); setTimeout(() => pl.remove(), 1500);
      }
      status.className = "status good";
      status.textContent = "Opening your email app… If nothing happens, email me directly at " + SITE.email + ".";
      safe(() => sessionStorage.removeItem("draft"));
    });

    // keep an unsent draft
    const saved = safe(() => JSON.parse(sessionStorage.getItem("draft") || "null"));
    if (saved) Object.keys(saved).forEach(k => { if (form.elements[k] && !form.elements[k].value) form.elements[k].value = saved[k]; });
    counter.textContent = msg.value.length + " / 1000";
    form.addEventListener("input", () => safe(() => sessionStorage.setItem("draft", JSON.stringify({
      name: form.elements.name.value, email: form.elements.email.value, message: form.elements.message.value }))));
  }
})();
