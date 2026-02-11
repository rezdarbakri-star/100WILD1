import { useState, useEffect, useRef } from "react";


const RED = "#e3000f";
const DARK = "#0a0a0a";

const CAUGHT_CREATURES = ["Isbjörn","Arctic Fox","Caiman","Lejon","Elefant","Giraff","Silverback Gorilla","Schimpans"];
const UNLOCKED_SKILLS = ["Dykning","Kajak","Trekking","Bergsklättring","Camping","Fallskärmshoppning","Expedition","Spårning"];

const EXPEDITION_PHOTOS = [
  { src: "", back: "ARKTIS", color: "#7ec8e3", grad: "linear-gradient(135deg, #0d1b2a, #1b3a5c)" },
  { src: "", back: "DJUNGELN", color: "#4caf50", grad: "linear-gradient(135deg, #1b3a1f, #2e5e2e)" },
  { src: "", back: "HAVET", color: "#039be5", grad: "linear-gradient(135deg, #0a1628, #1a3a5c)" },
  { src: "", back: "SAHARA", color: "#ffc107", grad: "linear-gradient(135deg, #2e1a00, #5c3a00)" },
  { src: "", back: "AMAZONAS", color: "#81c784", grad: "linear-gradient(135deg, #0a1e0a, #2e5e2e)" },
];

const BIOME_THEMES = {
  hero:    { bg: "#0a0a0a", accent: RED, particle: RED, glow: "rgba(227,0,15,0.06)" },
  format:  { bg: "#0a0a0a", accent: RED, particle: "#ff4444", glow: "rgba(227,0,15,0.07)" },
  arctic:  { bg: "#060d14", accent: "#7ec8e3", particle: "#c8e6f0", glow: "rgba(126,200,227,0.06)" },
  amazon:  { bg: "#050e06", accent: "#4caf50", particle: "#81c784", glow: "rgba(76,175,80,0.06)" },
  savanna: { bg: "#0e0904", accent: "#ff9800", particle: "#ffb74d", glow: "rgba(255,152,0,0.06)" },
  skills:  { bg: "#0a0a0a", accent: RED, particle: "#ff4444", glow: "rgba(227,0,15,0.06)" },
  stats:   { bg: "#0a0a0a", accent: RED, particle: RED, glow: "rgba(227,0,15,0.06)" },
  cta:     { bg: "#0a0a0a", accent: RED, particle: "#ff4444", glow: "rgba(227,0,15,0.08)" },
};

const BIOMES = [
  { id: "arctic", name: "ARKTIS", icon: "❄️", color: "#7ec8e3", creatures: [
    { name: "Isbjörn", icon: "🐻‍❄️", id: "001" }, { name: "Arctic Fox", icon: "🦊", id: "002" },
    { name: "Narval", icon: "🦄", id: "003", locked: true }, { name: "Valross", icon: "🦭", id: "004", locked: true },
    { name: "Snöleopard", icon: "🐆", id: "005", locked: true }, { name: "???", icon: "❓", id: "006", mystery: true },
  ] },
  { id: "amazon", name: "AMAZONAS", icon: "🌿", color: "#4caf50", creatures: [
    { name: "Caiman", icon: "🐊", id: "007" }, { name: "Jaguar", icon: "🐆", id: "008", locked: true },
    { name: "Anakonda", icon: "🐍", id: "009", locked: true }, { name: "Giftgroda", icon: "🐸", id: "010", locked: true },
    { name: "Ara", icon: "🦜", id: "011", locked: true }, { name: "???", icon: "❓", id: "012", mystery: true },
  ] },
  { id: "savanna", name: "SAVANN", icon: "🌅", color: "#ff9800", creatures: [
    { name: "Lejon", icon: "🦁", id: "013" }, { name: "Elefant", icon: "🐘", id: "014" },
    { name: "Giraff", icon: "🦒", id: "015" }, { name: "Silverback Gorilla", icon: "🦍", id: "016" },
    { name: "Schimpans", icon: "🐒", id: "017" }, { name: "Gepard", icon: "🐆", id: "018", locked: true },
    { name: "???", icon: "❓", id: "019", mystery: true },
  ] },
];

const SKILL_TREES = [
  { id: "water", name: "VATTEN", icon: "🌊", color: "#039be5", skills: [
    { name: "Dykning", icon: "🤿", id: "S01" }, { name: "Kajak", icon: "🛶", id: "S02" },
    { name: "Klippdykning", icon: "🏊", id: "S03", locked: true }, { name: "???", icon: "❓", id: "S04", mystery: true },
  ] },
  { id: "land", name: "TERRA", icon: "⛰️", color: "#ff9800", skills: [
    { name: "Trekking", icon: "🥾", id: "S05" }, { name: "Bergsklättring", icon: "🧗", id: "S06" },
    { name: "Camping", icon: "🏕️", id: "S07" }, { name: "Spårning", icon: "🐾", id: "S08" },
    { name: "Bikepacking", icon: "🚴", id: "S09", locked: true }, { name: "???", icon: "❓", id: "S10", mystery: true },
  ] },
  { id: "extreme", name: "EXTREM", icon: "⚡", color: RED, skills: [
    { name: "Fallskärmshoppning", icon: "🪂", id: "S11" }, { name: "Expedition", icon: "🗺️", id: "S12" },
    { name: "Överlevnad", icon: "🔥", id: "S13", locked: true }, { name: "Wingsuit", icon: "🦅", id: "S14", locked: true },
    { name: "???", icon: "❓", id: "S15", mystery: true },
  ] },
];

const totalCreatures = BIOMES.reduce((a, b) => a + b.creatures.length, 0);
const caughtCount = BIOMES.reduce((a, b) => a + b.creatures.filter(c => CAUGHT_CREATURES.includes(c.name)).length, 0);
const totalSkills = SKILL_TREES.reduce((a, b) => a + b.skills.length, 0);
const unlockedCount = SKILL_TREES.reduce((a, b) => a + b.skills.filter(s => UNLOCKED_SKILLS.includes(s.name)).length, 0);

/* ───── Reusable Components ───── */

function Ring({ pct, color, size = 68, stroke = 3, children }) {
  const r = (size - stroke) / 2, circ = 2 * Math.PI * r;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1)" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>{children}</div>
    </div>
  );
}

function Ctr({ target, suffix = "", dur = 1500 }) {
  const [v, setV] = useState(0);
  const ref = useRef(null);
  const go = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(e => {
      if (e[0].isIntersecting && !go.current) {
        go.current = true; const s = performance.now();
        const tick = n => { const p = Math.min((n - s) / dur, 1); setV(Math.round((1 - Math.pow(1 - p, 3)) * target)); if (p < 1) requestAnimationFrame(tick); };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target, dur]);
  return <span ref={ref}>{v}{suffix}</span>;
}

function Card({ item, color, idx, unlockedList }) {
  const [flip, setFlip] = useState(false);
  const active = unlockedList.includes(item.name);
  return (
    <div onClick={() => active && setFlip(!flip)} className="cc" style={{
      perspective: 600, animation: `cardPop 0.4s ease ${idx * 0.05}s both`,
      cursor: active ? "pointer" : "default",
    }}>
      <div style={{ width: "100%", aspectRatio: "3/4", position: "relative", transformStyle: "preserve-3d",
        transition: "transform 0.5s cubic-bezier(0.4,0,0.2,1)", transform: flip ? "rotateY(180deg)" : "none" }}>
        {/* Front */}
        <div style={{
          position: "absolute", inset: 0, backfaceVisibility: "hidden", borderRadius: 12,
          background: item.mystery ? "linear-gradient(135deg,#1a1a1a,#222)" : item.locked ? "linear-gradient(135deg,#111,#181818)" : `linear-gradient(135deg, ${color}12, ${color}28)`,
          border: active ? `2px solid ${color}` : "1px solid rgba(255,255,255,0.05)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          gap: 6, padding: "12px 6px", overflow: "hidden",
          boxShadow: active ? `0 4px 24px ${color}25` : "none",
        }}>
          {active && <div style={{ position: "absolute", top: 6, right: 6, width: 16, height: 16, borderRadius: "50%", background: color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: "bold", color: "#000" }}>✓</div>}
          {item.locked && <div style={{ position: "absolute", top: 6, right: 6, fontSize: 11, opacity: 0.25 }}>🔒</div>}
          <div style={{ fontSize: item.mystery ? 24 : 30, filter: item.locked ? "grayscale(1) brightness(0.25)" : "none" }}>{item.icon}</div>
          <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(10px, 2.5vw, 13px)", letterSpacing: 1.5, color: item.mystery ? "rgba(255,255,255,0.12)" : item.locked ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.85)", textAlign: "center", lineHeight: 1.2, maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", padding: "0 2px" }}>
            {item.mystery ? "???" : item.locked ? "LOCKED" : item.name.toUpperCase()}</div>
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 7, letterSpacing: 1, color: active ? color : "rgba(255,255,255,0.12)" }}>#{item.id}</div>
        </div>
        {/* Back */}
        {active && <div style={{
          position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)", borderRadius: 12,
          background: `linear-gradient(135deg, ${color}18, ${color}35)`, border: `2px solid ${color}`,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, padding: 12,
        }}>
          <div style={{ fontSize: 28 }}>{item.icon}</div>
          <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(11px, 2.5vw, 15px)", letterSpacing: 2, color, textAlign: "center", lineHeight: 1.2 }}>{item.name.toUpperCase()}</div>
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 7, color: "rgba(255,255,255,0.45)", textAlign: "center", lineHeight: 1.6 }}>UNLOCKED ✓</div>
        </div>}
      </div>
    </div>
  );
}

function ExpCard({ photo, idx }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  const [flipped, setFlipped] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(e => { if (e[0].isIntersecting) setVis(true); }, { threshold: 0.1 });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className="exp-card" onClick={() => setFlipped(!flipped)} style={{
      opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(25px)",
      transition: `opacity 0.6s ease ${0.1 + idx * 0.1}s, transform 0.6s ease ${0.1 + idx * 0.1}s`,
      flex: "1 1 0", minWidth: 0, perspective: 800, cursor: "pointer",
    }}>
      <div style={{ width: "100%", aspectRatio: "3/4", position: "relative", transformStyle: "preserve-3d",
        transition: "transform 0.6s cubic-bezier(0.4,0,0.2,1)", transform: flipped ? "rotateY(180deg)" : "none" }}>
        <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", borderRadius: 8, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ width: "100%", height: "100%", background: photo.src ? `url(${photo.src}) center/cover` : photo.grad }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 40%)" }} />
          <div style={{ position: "absolute", top: 10, right: 10, width: 6, height: 6, borderRadius: "50%", background: RED, boxShadow: `0 0 6px ${RED}` }} />
        </div>
        <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)", borderRadius: 8, overflow: "hidden", background: photo.grad, border: `1px solid ${photo.color}40`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <div style={{ position: "absolute", inset: 0, opacity: 0.06, background: `repeating-linear-gradient(0deg, transparent, transparent 3px, ${photo.color} 3px, ${photo.color} 4px)` }} />
          <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(16px, 3vw, 28px)", letterSpacing: 5, color: photo.color, textShadow: `0 0 30px ${photo.color}40`, position: "relative" }}>{photo.back}</div>
          <div style={{ width: 20, height: 2, background: photo.color, opacity: 0.5 }} />
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 7, letterSpacing: 2, color: "rgba(255,255,255,0.3)" }}>EXPEDITION</div>
        </div>
      </div>
    </div>
  );
}

/* ───── Atmosphere Canvas ───── */

function Atmosphere({ themeId }) {
  const canvasRef = useRef(null);
  const anim = useRef(null);
  const pts = useRef([]);
  const theme = BIOME_THEMES[themeId] || BIOME_THEMES.hero;
  useEffect(() => {
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext("2d");
    const resize = () => { c.width = c.offsetWidth; c.height = c.offsetHeight; };
    resize(); window.addEventListener("resize", resize);
    const count = 50;
    const mk = () => {
      const b = { x: Math.random() * c.width, life: 1, decay: 0.0008 + Math.random() * 0.002, op: 0.15 + Math.random() * 0.3 };
      if (themeId === "arctic") return { ...b, y: -10, sz: 1.5 + Math.random() * 3, vx: (Math.random() - .5) * 1.2, vy: .5 + Math.random() * 1.2 };
      if (themeId === "amazon") return { ...b, y: Math.random() * c.height, sz: 1 + Math.random() * 2.5, vx: (Math.random() - .5) * .4, vy: -.2 - Math.random() * .4, op: .25 + Math.random() * .4 };
      if (themeId === "savanna") return { ...b, y: Math.random() * c.height, sz: 1 + Math.random() * 2.5, vx: .6 + Math.random() * 1.5, vy: (Math.random() - .5) * .3 };
      return { ...b, y: c.height + 10, sz: 1 + Math.random() * 2, vx: (Math.random() - .5) * .5, vy: -.3 - Math.random() * .6 };
    };
    pts.current = Array.from({ length: count }, mk);
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      for (const p of pts.current) {
        p.x += p.vx; p.y += p.vy; p.life -= p.decay;
        if (p.life <= 0) Object.assign(p, mk());
        ctx.globalAlpha = p.life * p.op; ctx.fillStyle = theme.particle; ctx.shadowBlur = 0; ctx.shadowColor = "transparent";
        if (themeId === "amazon") { ctx.shadowColor = theme.particle; ctx.shadowBlur = 10; }
        if (themeId === "savanna") { ctx.fillRect(p.x, p.y, p.sz * 2, p.sz * .6); }
        else { ctx.beginPath(); ctx.arc(p.x, p.y, p.sz, 0, Math.PI * 2); ctx.fill(); }
      }
      ctx.globalAlpha = 1; ctx.shadowBlur = 0;
      anim.current = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(anim.current); window.removeEventListener("resize", resize); };
  }, [themeId, theme.particle]);
  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1, width: "100%", height: "100%" }} />;
}

function Section({ themeId, children, style = {} }) {
  const theme = BIOME_THEMES[themeId] || BIOME_THEMES.hero;
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(e => { if (e[0].isIntersecting) setVis(true); }, { threshold: 0.02 });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <section ref={ref} data-theme={themeId} style={{
      position: "relative", overflow: "hidden", minHeight: 200,
      background: `radial-gradient(ellipse at 50% 50%, ${theme.glow}, ${theme.bg})`,
      borderTop: `1px solid ${theme.accent}12`,
      opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(25px)",
      transition: "opacity 0.8s ease, transform 0.8s ease", ...style,
    }}>
      {vis && <Atmosphere themeId={themeId} />}
      <div style={{ position: "relative", zIndex: 2, padding: "clamp(60px, 10vw, 100px) clamp(16px, 4vw, 24px)" }}>{children}</div>
    </section>
  );
}

/* ───── Cursor ───── */

function Cursor() {
  const outerRef = useRef(null);
  const dotRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);
  useEffect(() => {
    const onMove = (e) => { mouse.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) { dotRef.current.style.left = e.clientX + "px"; dotRef.current.style.top = e.clientY + "px"; } };
    const loop = () => {
      pos.current.x += (mouse.current.x - pos.current.x) * 0.12;
      pos.current.y += (mouse.current.y - pos.current.y) * 0.12;
      if (outerRef.current) { outerRef.current.style.left = pos.current.x + "px"; outerRef.current.style.top = pos.current.y + "px"; }
      requestAnimationFrame(loop);
    };
    document.addEventListener("mousemove", onMove); loop();
    const addH = () => setHovering(true), rmH = () => setHovering(false);
    const obs = new MutationObserver(() => {
      document.querySelectorAll(".cc,.pc,.glitch,[data-hover],.exp-card").forEach(el => {
        el.removeEventListener("mouseenter", addH); el.removeEventListener("mouseleave", rmH);
        el.addEventListener("mouseenter", addH); el.addEventListener("mouseleave", rmH);
      });
    });
    obs.observe(document.body, { childList: true, subtree: true });
    return () => { document.removeEventListener("mousemove", onMove); obs.disconnect(); };
  }, []);
  return (
    <>
      <div ref={outerRef} style={{ position: "fixed", pointerEvents: "none", zIndex: 10000, transform: "translate(-50%,-50%)",
        width: hovering ? 55 : 20, height: hovering ? 55 : 20,
        border: `2px solid ${RED}`, borderRadius: "50%", mixBlendMode: "difference",
        background: hovering ? "rgba(227,0,15,0.08)" : "transparent",
        transition: "width .25s, height .25s, background .25s" }} />
      <div ref={dotRef} style={{ position: "fixed", pointerEvents: "none", zIndex: 10001, transform: "translate(-50%,-50%)",
        width: 5, height: 5, background: RED, borderRadius: "50%" }} />
    </>
  );
}

/* ───── Biome / Skill Grid ───── */

function CardGrid({ items, color, unlockedList }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(clamp(90px, 20vw, 120px), 1fr))", gap: "clamp(8px, 2vw, 14px)" }}>
      {items.map((item, i) => <Card key={item.id} item={item} color={color} idx={i} unlockedList={unlockedList} />)}
    </div>
  );
}

function BiomeHeader({ biome, caughtCount }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
        <span style={{ fontSize: "clamp(24px, 5vw, 32px)" }}>{biome.icon}</span>
        <div style={{ flex: 1 }}>
          <div className="glitch" data-hover style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(30px,6vw,50px)", letterSpacing: 4, color: "white", lineHeight: 1 }}>{biome.name}</div>
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "clamp(7px, 1.5vw, 9px)", letterSpacing: 2, color: `${biome.color}80` }}>BIOM · LEVEL {BIOMES.indexOf(biome) + 1}</div>
        </div>
        <div>
          <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(24px, 5vw, 32px)", color: biome.color, letterSpacing: 2 }}>{caughtCount}</span>
          <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "clamp(9px, 1.5vw, 11px)", color: "rgba(255,255,255,.2)" }}>/{biome.creatures.length}</span>
        </div>
      </div>
      <div style={{ height: 3, borderRadius: 2, background: "rgba(255,255,255,.04)", overflow: "hidden" }}>
        <div style={{ width: `${(caughtCount / biome.creatures.length) * 100}%`, height: "100%", borderRadius: 2, background: `linear-gradient(90deg, ${biome.color}, ${biome.color}aa)`, boxShadow: `0 0 10px ${biome.color}40` }} />
      </div>
    </div>
  );
}

/* ───── Main App ───── */

function App() {
  const [scrollY, setScrollY] = useState(0);
  const [currentTheme, setCurrentTheme] = useState("hero");
  useEffect(() => {
    const fn = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  useEffect(() => {
    const obs = new IntersectionObserver(e => {
      e.forEach(en => { if (en.isIntersecting && en.target.dataset.theme) setCurrentTheme(en.target.dataset.theme); });
    }, { threshold: 0.3 });
    const t = setTimeout(() => { document.querySelectorAll("[data-theme]").forEach(el => obs.observe(el)); }, 200);
    return () => { clearTimeout(t); obs.disconnect(); };
  }, []);
  const progress = Math.min((scrollY / Math.max(document.documentElement.scrollHeight - window.innerHeight, 1)) * 100, 100) || 0;
  const aT = BIOME_THEMES[currentTheme] || BIOME_THEMES.hero;
  const isMobile = typeof window !== "undefined" && window.matchMedia("(hover: none)").matches;

  return (
    <div style={{ background: DARK, minHeight: "100vh", cursor: isMobile ? "auto" : "none" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(25px)}to{opacity:1;transform:translateY(0)}}
        @keyframes cardPop{from{opacity:0;transform:scale(.85) translateY(12px)}to{opacity:1;transform:scale(1) translateY(0)}}
        @keyframes pulse{0%,100%{opacity:.3}50%{opacity:1}}
        @keyframes glitchShake{0%{transform:translate(0)}20%{transform:translate(-3px,2px)}40%{transform:translate(3px,-2px)}60%{transform:translate(-2px,1px)}80%{transform:translate(2px,-1px)}100%{transform:translate(0)}}
        .cc{transition:transform .3s}.cc:hover{transform:scale(1.04)}
        .pc{transition:all .4s!important}.pc:hover{border-color:rgba(227,0,15,.25)!important;background:rgba(227,0,15,.04)!important;transform:translateY(-4px)!important}
        .pc:hover .pl{transform:scaleX(1)!important}
        .glitch{display:block;position:relative;transition:text-shadow .3s}
        .glitch:hover{animation:glitchShake .3s;text-shadow:3px 0 ${RED},-3px 0 rgba(0,255,255,.4)!important}
        .exp-card{transition:transform .3s}.exp-card:hover>div{transform:translateY(-4px)!important;box-shadow:0 8px 30px rgba(0,0,0,.5)!important}
        @media(hover:none){.cursor-wrap{display:none!important}body{cursor:auto!important}}
      `}</style>

      {!isMobile && <div className="cursor-wrap"><Cursor /></div>}

      {/* Progress bar */}
      <div style={{ position: "fixed", top: 0, left: 0, height: 3, zIndex: 9999, width: `${progress}%`,
        background: `linear-gradient(90deg, ${aT.accent}, ${aT.particle})`, boxShadow: `0 0 14px ${aT.accent}80`,
        transition: "background 0.8s, box-shadow 0.8s" }} />

      {/* ═══ HERO ═══ */}
      <section data-theme="hero" style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative", overflow: "hidden",
        background: `radial-gradient(ellipse at 30% 40%, rgba(227,0,15,0.06), ${DARK})`,
      }}>
        <Atmosphere themeId="hero" />
        <div style={{ textAlign: "center", position: "relative", zIndex: 2, padding: "40px 24px" }}>
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "clamp(9px,1.1vw,12px)", letterSpacing: 7, color: RED, marginBottom: 24, opacity: 0, animation: "fadeUp .8s ease .3s forwards" }}>
            RED BULL · REZDAR
            <div style={{ width: 40, height: 2, background: RED, margin: "14px auto 0" }} />
          </div>
          <div style={{ fontFamily: "'Bebas Neue',sans-serif", lineHeight: .85, opacity: 0, animation: "fadeUp 1s ease .6s forwards" }}>
            <div className="glitch" data-hover style={{ fontSize: "clamp(100px,20vw,280px)", color: "white", letterSpacing: -5 }}>100</div>
            <div className="glitch" data-hover style={{ fontSize: "clamp(90px,18vw,260px)", color: RED, letterSpacing: 8, marginTop: -15, textShadow: "0 0 80px rgba(227,0,15,.15)" }}>WILD</div>
          </div>
          <p style={{ fontFamily: "'Space Mono',monospace", fontSize: "clamp(10px,1.2vw,14px)", color: "rgba(232,228,223,.5)", marginTop: 30, lineHeight: 1.8, letterSpacing: 1, opacity: 0, animation: "fadeUp .8s ease 1s forwards" }}>
            Extrema biomer. Riktiga expeditioner.<br/>Varje destination en level.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "clamp(30px,6vw,70px)", marginTop: 55, opacity: 0, animation: "fadeUp .8s ease 1.3s forwards" }}>
            {[
              { val: caughtCount, max: 100, label: "ARTER", color: RED },
              { val: 3, max: 12, label: "BIOMES", color: "#7ec8e3" },
              { val: unlockedCount, max: totalSkills, label: "SKILLS", color: "#ff9800" },
            ].map((r, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                <Ring pct={r.val / r.max} color={r.color} size={68} stroke={3}>
                  <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 22, color: r.color, letterSpacing: 1 }}>{r.val}</span>
                </Ring>
                <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "clamp(7px,.8vw,9px)", letterSpacing: 3, color: "rgba(232,228,223,.3)" }}>{r.label}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 70, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: 0, animation: "fadeUp .6s ease 1.8s forwards" }}>
            <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 8, letterSpacing: 3, color: "#555" }}>SCROLLA</span>
            <div style={{ width: 1, height: 35, background: `linear-gradient(to bottom, ${RED}, transparent)`, animation: "pulse 2s ease infinite" }} />
          </div>
        </div>
      </section>

      {/* ═══ FORMAT ═══ */}
      <Section themeId="format" style={{ minHeight: "auto" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 50 }}>
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "clamp(9px,1vw,11px)", letterSpacing: 6, color: RED, marginBottom: 30 }}>
              FORMATET<div style={{ width: 40, height: 2, background: RED, margin: "14px auto 0" }} />
            </div>
            <div style={{ fontFamily: "'Bebas Neue',sans-serif", lineHeight: .9 }}>
              <div className="glitch" data-hover style={{ fontSize: "clamp(50px,10vw,140px)", color: "white", letterSpacing: 2 }}>POKÉMON X</div>
              <div className="glitch" data-hover style={{ fontSize: "clamp(50px,10vw,140px)", color: RED, letterSpacing: 3, textShadow: `0 0 60px rgba(227,0,15,.2)` }}>BEAR GRYLLS</div>
            </div>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "clamp(13px,1.2vw,17px)", color: "rgba(232,228,223,.4)", lineHeight: 1.8, maxWidth: 500, margin: "35px auto 0" }}>
              Varje avsnitt är ett nytt level — nya biomer, nya utmaningar, nya arter att upptäcka och dokumentera i verkligheten.
            </p>
          </div>
          <div style={{ display: "flex", gap: "clamp(6px, 1.5vw, 12px)", overflow: "hidden" }}>
            {EXPEDITION_PHOTOS.map((p, i) => <ExpCard key={i} photo={p} idx={i} />)}
          </div>
        </div>
      </Section>

      {/* ═══ 3 BIOMES ═══ */}
      {BIOMES.map((biome) => {
        const caught = biome.creatures.filter(c => CAUGHT_CREATURES.includes(c.name)).length;
        return (
          <Section key={biome.id} themeId={biome.id}>
            <div style={{ maxWidth: 900, margin: "0 auto" }}>
              <BiomeHeader biome={biome} caughtCount={caught} />
              <CardGrid items={biome.creatures} color={biome.color} unlockedList={CAUGHT_CREATURES} />
            </div>
          </Section>
        );
      })}

      {/* ═══ SKILLS ═══ */}
      <Section themeId="skills">
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 50 }}>
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "clamp(9px,1vw,11px)", letterSpacing: 6, color: RED, marginBottom: 20 }}>
              EXPEDITION SKILLS<div style={{ width: 40, height: 2, background: RED, margin: "14px auto 0" }} />
            </div>
            <div className="glitch" data-hover style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(40px,8vw,90px)", color: "white", letterSpacing: 3 }}>SKILL TREE</div>
          </div>
          {SKILL_TREES.map((tree, ti) => {
            const unlocked = tree.skills.filter(s => UNLOCKED_SKILLS.includes(s.name)).length;
            return (
              <div key={tree.id} style={{ marginBottom: ti < SKILL_TREES.length - 1 ? 50 : 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                  <span style={{ fontSize: "clamp(24px, 5vw, 32px)" }}>{tree.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(24px,5vw,40px)", letterSpacing: 4, color: "white", lineHeight: 1 }}>{tree.name}</div>
                    <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "clamp(7px, 1.5vw, 9px)", letterSpacing: 2, color: `${tree.color}80` }}>SKILL TREE · TIER {ti + 1}</div>
                  </div>
                  <div>
                    <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(24px, 5vw, 32px)", color: tree.color, letterSpacing: 2 }}>{unlocked}</span>
                    <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "clamp(9px, 1.5vw, 11px)", color: "rgba(255,255,255,.2)" }}>/{tree.skills.length}</span>
                  </div>
                </div>
                <div style={{ height: 3, borderRadius: 2, background: "rgba(255,255,255,.04)", marginBottom: 20, overflow: "hidden" }}>
                  <div style={{ width: `${(unlocked / tree.skills.length) * 100}%`, height: "100%", borderRadius: 2, background: `linear-gradient(90deg, ${tree.color}, ${tree.color}aa)`, boxShadow: `0 0 10px ${tree.color}40` }} />
                </div>
                <CardGrid items={tree.skills} color={tree.color} unlockedList={UNLOCKED_SKILLS} />
              </div>
            );
          })}
        </div>
      </Section>

      {/* ═══ STATS ═══ */}
      <Section themeId="stats" style={{ textAlign: "center" }}>
        <div>
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: 6, color: RED, marginBottom: 20 }}>
            CONTENT CREATOR<div style={{ width: 40, height: 2, background: RED, margin: "14px auto 0" }} />
          </div>
          <div className="glitch" data-hover style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(55px,11vw,130px)", color: "white", letterSpacing: 5, lineHeight: .9 }}>REZDAR</div>
          <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(65px,13vw,170px)", color: RED, letterSpacing: -2, lineHeight: .9 }}><Ctr target={750} suffix=".000" /></div>
          <div style={{ display: "flex", justifyContent: "center", gap: "clamp(30px,7vw,90px)", marginTop: 50, padding: "28px 0", borderTop: "1px solid rgba(255,255,255,.05)", borderBottom: "1px solid rgba(255,255,255,.05)" }}>
            {[{ l: "TIKTOK", v: 485 }, { l: "YOUTUBE", v: 200 }, { l: "INSTAGRAM", v: 70 }].map(s => (
              <div key={s.l}>
                <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(28px,5vw,58px)", color: RED, letterSpacing: 2 }}><Ctr target={s.v} suffix="K" /></div>
                <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "clamp(7px,.9vw,10px)", letterSpacing: 4, color: "rgba(232,228,223,.4)", marginTop: 4 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══ CTA ═══ */}
      <Section themeId="cta" style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "'Bebas Neue',sans-serif", lineHeight: .85 }}>
            <div className="glitch" data-hover style={{ fontSize: "clamp(70px,14vw,200px)", color: "white", letterSpacing: 3 }}>PRESS</div>
            <div className="glitch" data-hover style={{ fontSize: "clamp(70px,14vw,200px)", color: RED, letterSpacing: 3 }}>START.</div>
          </div>
          <div style={{ width: 40, height: 3, background: RED, margin: "20px auto 0" }} />
          <p style={{ fontFamily: "'Space Mono',monospace", fontSize: "clamp(10px,1.2vw,14px)", color: "rgba(232,228,223,.45)", marginTop: 30, letterSpacing: 1, lineHeight: 1.7 }}>Låt oss bygga Sveriges mest<br/>unika serie</p>
        </div>
      </Section>

      {/* Footer */}
      <div style={{ padding: "20px clamp(16px, 4vw, 40px)", background: DARK, borderTop: "1px solid rgba(255,255,255,.03)", display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 12, letterSpacing: 3, color: RED, opacity: .5 }}>RED BULL</span>
        <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 8, letterSpacing: 2, color: "rgba(255,255,255,.15)" }}>100 WILD · 2026</span>
      </div>
    </div>
  );
}

export default App;
