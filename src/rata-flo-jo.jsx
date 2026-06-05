import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "./supabaseClient";

// ─── ANIMATIONS CSS ───────────────────────────────────────────────────────────
// ─── COLOR PALETTE ───────────────────────────────────────────────────────────
const C = {
  bg:        "#faf8f4",      // crema suave
  bgCard:    "#4a3f35",      // blanco puro para cards
  bgCard2:   "#f5f2ec",      // crema para cards secundarias
  mint:      "#7ec8b0",      // menta principal
  mintLight: "#b8e8d8",      // menta claro
  mintPale:  "#e8f7f2",      // menta muy suave
  peach:     "#f4a57a",      // melocotón principal
  peachLight:"#ffd4b8",      // melocotón claro
  peachPale: "#fff0e8",      // melocotón muy suave
  lavender:  "#c4b5d4",      // lavanda suave para acentos
  text:      "#4a3f35",      // marrón suave para texto principal
  textMid:   "#8a7a70",      // texto secundario
  textLight: "#bfb0a8",      // texto apagado
  border:    "#ede8e0",      // bordes suaves
  white:     "#4a3f35",
  danger:    "#e8857a",      // rojo suave
};

const GLOBAL_STYLES = `
  @keyframes pulse-btn { 0%,100%{transform:scale(1);box-shadow:0 8px 30px rgba(126,200,176,0.4)} 50%{transform:scale(1.03);box-shadow:0 12px 40px rgba(126,200,176,0.6)} }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
  @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes fadeInUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes zoomIn { from{opacity:0;transform:scale(0.5)} to{opacity:1;transform:scale(1)} }
  @keyframes confetti-fall { 0%{transform:translateY(-10px) rotate(0deg);opacity:1} 100%{transform:translateY(100vh) rotate(720deg);opacity:0} }
  @keyframes float { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-6px)} }
  @keyframes tab-slide { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  @keyframes level-pop { 0%{transform:scale(0) rotate(-10deg);opacity:0} 60%{transform:scale(1.15) rotate(3deg)} 100%{transform:scale(1) rotate(0deg);opacity:1} }
  @keyframes gps-ping { 0%{transform:scale(1);opacity:1} 100%{transform:scale(3);opacity:0} }
  body { background: #faf8f4 !important; }
  .btn-lrg { animation: pulse-btn 2s ease-in-out infinite; }
  .btn-lrg:active { transform: scale(0.96) !important; transition: transform 0.1s; }
  .fade-in-up { animation: fadeInUp 0.4s ease forwards; }
  .zoom-in { animation: zoomIn 0.3s ease forwards; }
  .bounce-emoji { animation: bounce 1.5s ease-in-out infinite; }
  .float-anim { animation: float 3s ease-in-out infinite; }
  * { -webkit-tap-highlight-color: transparent; }
`;

const LEVELS = [
  { level: 1, km: 0, emoji: "🐣", name: "Pollito Desplumado", desc: "Corrió 4 minutos y ya vio a Dios." },
  { level: 2, km: 1, emoji: "🐭", name: "Ratita de Vereda", desc: "Descubrió que las subidas fueron creadas por el demonio." },
  { level: 3, km: 3, emoji: "🐹", name: "Hámster Confundido", desc: "Corre sin entender por qué empezó." },
  { level: 4, km: 5, emoji: "🐇", name: "Conejita Ansiosa", desc: "Se adelanta mentalmente 8 kilómetros." },
  { level: 5, km: 8, emoji: "🦆", name: "Pato Cardio", desc: "Hace sonidos extraños al respirar." },
  { level: 6, km: 12, emoji: "🐿️", name: "Ardilla Paranormal", desc: "Corre como si hubiera robado algo." },
  { level: 7, km: 16, emoji: "🐁", name: "Rata Energética", desc: "Empieza a sentir superioridad moral." },
  { level: 8, km: 21, emoji: "🦔", name: "Erizo Deportivo", desc: "Corre lento pero emocionalmente rápido." },
  { level: 9, km: 27, emoji: "🐈", name: "Gata Callejera Turbo", desc: "Ya esquiva personas automáticamente." },
  { level: 10, km: 34, emoji: "🦝", name: "Mapache Atlético", desc: "Sobrevive solo con café y voluntad." },
  { level: 11, km: 42, emoji: "🐐", name: "Cabrita de Montaña", desc: "Las piernas tiemblan pero el ego crece." },
  { level: 12, km: 51, emoji: "🦘", name: "Cangurita Caótica", desc: "Saltó un charco y se sintió olímpica." },
  { level: 13, km: 61, emoji: "🐕", name: "Perrita del Asfalto", desc: "Corre aunque nadie la esté persiguiendo." },
  { level: 14, km: 72, emoji: "🐒", name: "Monita del Cardio", desc: "Empieza a correr haciendo monólogos internos." },
  { level: 15, km: 84, emoji: "🐺", name: "Lobita Motivacional", desc: "Publicó su primera historia post-entrenamiento." },
  { level: 16, km: 97, emoji: "🐎", name: "Pony de Guerra", desc: "Descubrió músculos nuevos." },
  { level: 17, km: 111, emoji: "🦙", name: "Alpaca Aerodinámica", desc: "Corre elegante pero jadeando." },
  { level: 18, km: 126, emoji: "🐆", name: "Gatita Leopardo", desc: "Empieza a adelantar señores." },
  { level: 19, km: 142, emoji: "🦌", name: "Venadita del Viento", desc: "Ya tiene playlist cinematográfica." },
  { level: 20, km: 159, emoji: "🐗", name: "Jabalina Emocional", desc: "Corre impulsada por problemas personales." },
  { level: 21, km: 180, emoji: "🦊", name: "Zorra Supersónica", desc: "Se siente misteriosa usando lentes oscuros." },
  { level: 22, km: 202, emoji: "🐪", name: "Camella Persistente", desc: "Descubrió el poder de seguir aunque duela." },
  { level: 23, km: 225, emoji: "🦅", name: "Aguilita Callejera", desc: "Corre mirando el horizonte dramáticamente." },
  { level: 24, km: 249, emoji: "🐅", name: "Tigresa Flo-Jo", desc: "Ya intimida con solo calentar." },
  { level: 25, km: 274, emoji: "🐬", name: "Delfina de Velocidad", desc: "Respira raro pero con técnica." },
  { level: 26, km: 300, emoji: "🦢", name: "Cisne Deportivo", desc: "Corre bonita aunque esté muriendo." },
  { level: 27, km: 327, emoji: "🐍", name: "Serpiente Aeróbica", desc: "Se desliza entre peatones con odio." },
  { level: 28, km: 355, emoji: "🦈", name: "Tiburona del Cardio", desc: "Ya huele el miedo de los principiantes." },
  { level: 29, km: 384, emoji: "🦁", name: "Leona del Asfalto", desc: "La música ya activó el modo villana." },
  { level: 30, km: 414, emoji: "🐆", name: "Chita Interdimensional", desc: "Por un momento creyó que podía ir a las olimpiadas." },
  { level: 31, km: 445, emoji: "🦄", name: "Unicornia Deportiva", desc: "Corrió escuchando música como protagonista de anime." },
  { level: 32, km: 477, emoji: "🐉", name: "Dragoncita del Sprint", desc: "Empieza a generar calor corporal sospechoso." },
  { level: 33, km: 510, emoji: "🦇", name: "Murciélaga Nocturna", desc: "Ya considera correr incluso de noche." },
  { level: 34, km: 544, emoji: "🐺", name: "Loba Nuclear", desc: "Las pantorrillas dejaron de quejarse." },
  { level: 35, km: 579, emoji: "🦖", name: "Velocirraptora Cardio", desc: "Corre con energía de depredadora emocional." },
  { level: 36, km: 615, emoji: "🐦", name: "Correcaminos Existencial", desc: "Meep meep, desgraciados." },
  { level: 37, km: 652, emoji: "⚡", name: "Liebre Eléctrica", desc: "Desarrolló odio hacia caminar lento." },
  { level: 38, km: 690, emoji: "🌪️", name: "Halcona del Viento", desc: "Empieza a correr por placer. Grave situación." },
  { level: 39, km: 729, emoji: "☄️", name: "Pantera Meteórica", desc: "Ya da miedo en las pistas." },
  { level: 40, km: 769, emoji: "🔥", name: "Gueparda Apocalíptica", desc: "Corre como si el mundo explotara detrás." },
  { level: 41, km: 810, emoji: "🚀", name: "Rata Orbital", desc: "Entró accidentalmente en velocidad de despegue." },
  { level: 42, km: 852, emoji: "🛸", name: "Alienígena del Sprint", desc: "Las leyes físicas dejaron de aplicarle." },
  { level: 43, km: 895, emoji: "🌌", name: "Jaguar Cuántico", desc: "Corre más rápido que sus problemas." },
  { level: 44, km: 939, emoji: "⚔️", name: "Fénix del Asfalto", desc: "Renació después de cada subida." },
  { level: 45, km: 984, emoji: "💫", name: "Estrella Fugaz Deportiva", desc: "Solo se la ve pasar." },
  { level: 46, km: 1030, emoji: "🌠", name: "Demonia Galáctica del Cardio", desc: "Ya no escucha música. La música la escucha a ella." },
  { level: 47, km: 1077, emoji: "🪐", name: "Depredadora de Constelaciones", desc: "Los peatones se apartan automáticamente." },
  { level: 48, km: 1125, emoji: "⚡", name: "Bestia Relativista", desc: "Casi rompió el espacio-tiempo en una bajada." },
  { level: 49, km: 1174, emoji: "☄️", name: "Diosa Supersónica Flo-Jo", desc: "El viento pidió permiso para pasar." },
  { level: 50, km: 1224, emoji: "👑", name: "RATA FLO JO CÓSMICA DEFINITIVA", desc: "Entidad mitológica. Corre más rápido que sus traumas." },
];

const EMOCIONES = [
  { emoji: "💀", cat: "Supervivencia", name: "No Morí", sub: "Contra todo pronóstico." },
  { emoji: "🫁", cat: "Supervivencia", name: "Pulmones Ofendidos", sub: "Hay una queja formal en proceso." },
  { emoji: "🦴", cat: "Supervivencia", name: "Crujido Sospechoso", sub: "Escuché algo raro y decidí ignorarlo." },
  { emoji: "🚑", cat: "Supervivencia", name: "Necesito Que Me Recojan", sub: "Físicamente aquí. Espiritualmente ya no." },
  { emoji: "🤡", cat: "Supervivencia", name: "¿Quién Me Mandó?", sub: "Tomé malas decisiones y aquí estamos." },
  { emoji: "🐀", cat: "Caos Deportivo", name: "Rata Persistente", sub: "No tenía ganas, pero vine igual." },
  { emoji: "🦆", cat: "Caos Deportivo", name: "Pato Cardio", sub: "Sonidos extraños incluidos." },
  { emoji: "🥔", cat: "Caos Deportivo", name: "Papa Deportista", sub: "No elegante. Sí efectiva." },
  { emoji: "☕", cat: "Caos Deportivo", name: "Funcionando por Cafeína", sub: "El café hizo gran parte del trabajo." },
  { emoji: "🌪️", cat: "Caos Deportivo", name: "Caos Controlado", sub: "Sorprendentemente, nada salió mal." },
  { emoji: "⚔️", cat: "Épicos", name: "Guerrera del Asfalto", sub: "Hoy conquisté algo." },
  { emoji: "👑", cat: "Épicos", name: "Emperatriz", sub: "Hoy el mundo fue pequeño." },
  { emoji: "🔥", cat: "Épicos", name: "Invencible", sub: "Podría haber seguido." },
  { emoji: "⚡", cat: "Épicos", name: "Elegida por el Caos", sub: "Todo salió mejor de lo esperado." },
  { emoji: "🏆", cat: "Épicos", name: "Leyenda Temporal", sub: "Por unos minutos fui imparable." },
  { emoji: "🧙", cat: "Fantásticos", name: "Bruja del Camino", sub: "Algo mágico ocurrió hoy." },
  { emoji: "🌕", cat: "Fantásticos", name: "Bendecida por la Luna", sub: "La noche estuvo de mi lado." },
  { emoji: "🦄", cat: "Fantásticos", name: "Unicornio Interior", sub: "Elegancia inesperada." },
  { emoji: "✨", cat: "Fantásticos", name: "Personaje Principal", sub: "Hoy la protagonista era yo." },
  { emoji: "🌌", cat: "Fantásticos", name: "Visitante Intergaláctica", sub: "Vine de otra galaxia a correr." },
];

const WEATHER_OPTIONS = ["☀️ Soleado", "⛅ Nublado", "🌧️ Lloviendo", "🌫️ Neblina", "🌬️ Ventoso", "🌡️ Caluroso", "❄️ Frío"];
const CONFETTI_COLORS = ["#7ec8b0", "#c4b5d4", "#7ec8b0", "#e8857a", "#ffea00", "#00b0ff"];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function calcDistance(coords) {
  if (coords.length < 2) return 0;
  let total = 0;
  for (let i = 1; i < coords.length; i++) {
    const [lat1, lon1] = coords[i - 1];
    const [lat2, lon2] = coords[i];
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
    total += R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }
  return total;
}

function fmtTime(s) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

function fmtPace(distKm, secs) {
  if (distKm < 0.01) return "--:--";
  const secPerKm = secs / distKm;
  const m = Math.floor(secPerKm / 60);
  const s = Math.floor(secPerKm % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function getCurrentLevel(totalKm) {
  let cur = LEVELS[0];
  for (const l of LEVELS) {
    if (totalKm >= l.km) cur = l;
    else break;
  }
  return cur;
}

function getNextLevel(totalKm) {
  for (const l of LEVELS) {
    if (totalKm < l.km) return l;
  }
  return null;
}

// ─── CONFETTI ─────────────────────────────────────────────────────────────────
function Confetti({ active }) {
  if (!active) return null;
  const pieces = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    left: Math.random() * 100,
    delay: Math.random() * 1.5,
    size: 6 + Math.random() * 8,
    duration: 2 + Math.random() * 2,
  }));
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 300, overflow: "hidden" }}>
      {pieces.map((p) => (
        <div key={p.id} style={{
          position: "absolute", top: -20, left: `${p.left}%`,
          width: p.size, height: p.size, borderRadius: Math.random() > 0.5 ? "50%" : 2,
          background: p.color,
          animation: `confetti-fall ${p.duration}s ${p.delay}s ease-in forwards`,
        }} />
      ))}
    </div>
  );
}

// ─── MINI MAP ─────────────────────────────────────────────────────────────────
function MiniMap({ coords, size = 120 }) {
  if (!coords || coords.length < 2) {
    return (
      <div style={{ width: size, height: size, background: "#4a3f35", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 11, color: "#bfb0a8" }}>Sin recorrido</span>
      </div>
    );
  }
  const lats = coords.map((c) => c[0]);
  const lons = coords.map((c) => c[1]);
  const minLat = Math.min(...lats), maxLat = Math.max(...lats);
  const minLon = Math.min(...lons), maxLon = Math.max(...lons);
  const pad = 10;
  const w = size - pad * 2, h = size - pad * 2;
  const toX = (lon) => pad + ((lon - minLon) / (maxLon - minLon || 1)) * w;
  const toY = (lat) => pad + ((maxLat - lat) / (maxLat - minLat || 1)) * h;
  const points = coords.map((c) => `${toX(c[1])},${toY(c[0])}`).join(" ");
  const start = coords[0], end = coords[coords.length - 1];
  return (
    <svg width={size} height={size} style={{ borderRadius: 8, background: "#f5f2ec" }}>
      <polyline points={points} fill="none" stroke="#7ec8b0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={toX(start[1])} cy={toY(start[0])} r={5} fill="#7ec8b0" />
      <circle cx={toX(end[1])} cy={toY(end[0])} r={5} fill="#e8857a" />
    </svg>
  );
}

// ─── SHARE CARD ───────────────────────────────────────────────────────────────
function ShareCard({ run, onClose }) {
  const level = getCurrentLevel(run.totalKmAtRun || 0);
  const [shareType, setShareType] = useState("feed");
  const cardRef = useRef(null);
  const isStory = shareType === "story";
  const h = isStory ? 568 : 320;

  const handleShare = (platform) => {
    alert(`🚀 Abriendo ${platform}...\n\n📏 ${run.distance.toFixed(2)} km | ⏱️ ${fmtTime(run.duration)} | ⚡ ${fmtPace(run.distance, run.duration)} min/km`);
  };

  const handleDownload = async () => {
    try {
      const el = cardRef.current;
      if (!el) return;
      // Use html2canvas via CDN
      if (!window.html2canvas) {
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
        document.head.appendChild(script);
        await new Promise((res) => { script.onload = res; });
      }
      const canvas = await window.html2canvas(el, { backgroundColor: null, scale: 2, useCORS: true, logging: false });
      const link = document.createElement("a");
      link.download = `rata-flo-jo-${new Date(run.date).toLocaleDateString("es-PE").replace(/\//g,"-")}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch {
      alert("No se pudo descargar. Intenta hacer captura de pantalla.");
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 16 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="zoom-in" style={{ background: "#4a3f35", borderRadius: 16, padding: 20, maxWidth: 380, width: "100%", maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
          <span style={{ color: "#4a3f35", fontWeight: 700, fontSize: 16 }}>Compartir carrera</span>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#8a7a70", fontSize: 22, cursor: "pointer", lineHeight: 1 }}>×</button>
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {["feed", "story"].map((t) => (
            <button key={t} onClick={() => setShareType(t)} style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: "none", cursor: "pointer", background: shareType === t ? "#7ec8b0" : "#f0ece4", color: "#4a3f35", fontWeight: 600, fontSize: 13, transition: "all 0.2s" }}>
              {t === "feed" ? "📸 Feed" : "📱 Historia"}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
          <div ref={cardRef} style={{ width: 320, height: h, background: "linear-gradient(135deg, #e8f7f2 0%, #fff0e8 100%)", borderRadius: 12, position: "relative", overflow: "hidden", padding: isStory ? "32px 24px" : "20px", boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: isStory ? "space-between" : "flex-start" }}>
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 80% 20%, rgba(126,200,176,0.15) 0%, transparent 60%)", pointerEvents: "none" }} />
            <div>
              <div style={{ color: "#7ec8b0", fontSize: 11, fontWeight: 700, letterSpacing: 3, marginBottom: 4 }}>RATA FLO — JO</div>
              <div style={{ color: "#4a3f35", fontSize: isStory ? 18 : 14, fontWeight: 700, marginBottom: isStory ? 16 : 8 }}>{new Date(run.date).toLocaleDateString("es-PE", { weekday: "long", day: "numeric", month: "long" })}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: isStory ? 12 : 8 }}>
              {[
                { icon: "📏", label: "Distancia", val: `${run.distance.toFixed(2)} km` },
                { icon: "⏱️", label: "Tiempo", val: fmtTime(run.duration) },
                { icon: "⚡", label: "Ritmo", val: `${fmtPace(run.distance, run.duration)} /km` },
                { icon: "🌤️", label: "Clima", val: run.weather || "—" },
              ].map((s) => (
                <div key={s.label} style={{ background: "rgba(126,200,176,0.08)", borderRadius: 8, padding: isStory ? "12px" : "8px" }}>
                  <div style={{ fontSize: isStory ? 18 : 14 }}>{s.icon}</div>
                  <div style={{ color: "#8a7a70", fontSize: 10, marginTop: 2 }}>{s.label}</div>
                  <div style={{ color: "#4a3f35", fontWeight: 700, fontSize: isStory ? 16 : 13 }}>{s.val}</div>
                </div>
              ))}
            </div>
            {isStory && run.coords && run.coords.length > 1 && (
              <div style={{ display: "flex", justifyContent: "center", margin: "12px 0" }}>
                <MiniMap coords={run.coords} size={180} />
              </div>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: isStory ? 0 : 8, background: "rgba(126,200,176,0.1)", borderRadius: 10, padding: isStory ? "12px" : "8px" }}>
              <span style={{ fontSize: isStory ? 28 : 22 }}>{run.emotion?.emoji || "🐀"}</span>
              <div>
                <div style={{ color: "#7ec8b0", fontWeight: 700, fontSize: isStory ? 14 : 11 }}>{run.emotion?.name || "Rata Persistente"}</div>
                <div style={{ color: "#8a7a70", fontSize: isStory ? 11 : 10 }}>{run.emotion?.sub || ""}</div>
              </div>
              <div style={{ marginLeft: "auto", textAlign: "right" }}>
                <div style={{ fontSize: isStory ? 18 : 14 }}>{level.emoji}</div>
                <div style={{ color: "#8a7a70", fontSize: 9 }}>Nv. {level.level}</div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <button onClick={() => handleShare("Facebook")} style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: "none", cursor: "pointer", background: "#1877f2", color: "#4a3f35", fontWeight: 700, fontSize: 13, transition: "opacity 0.2s" }}>
            📘 Facebook
          </button>
          <button onClick={() => handleShare("Instagram")} style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: "none", cursor: "pointer", background: "linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)", color: "#4a3f35", fontWeight: 700, fontSize: 13 }}>
            📷 Instagram
          </button>
        </div>
        <button onClick={handleDownload} style={{ width: "100%", padding: "10px 0", borderRadius: 10, border: "1px solid #333", background: "#4a3f35", color: "#8a7a70", fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "all 0.2s" }}>
          ⬇️ Descargar PNG
        </button>
      </div>
    </div>
  );
}

// ─── POST RUN MODAL ───────────────────────────────────────────────────────────
function PostRunModal({ run, onSave, onDiscard }) {
  const [sel, setSel] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 50);
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 16 }}>
      <div style={{ background: "#4a3f35", borderRadius: 16, padding: 24, maxWidth: 380, width: "100%", maxHeight: "90vh", overflowY: "auto", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(30px)", transition: "all 0.4s ease" }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div className="bounce-emoji" style={{ fontSize: 40, marginBottom: 8 }}>🏁</div>
          <div style={{ color: "#7ec8b0", fontWeight: 700, fontSize: 18 }}>¡Stopin!</div>
          <div style={{ color: "#8a7a70", fontSize: 13, marginTop: 4 }}>{run.distance.toFixed(2)} km · {fmtTime(run.duration)}</div>
          {run.weather && (
            <div style={{ marginTop: 8, display: "inline-block", background: "rgba(126,200,176,0.06)", borderRadius: 20, padding: "4px 12px", fontSize: 12, color: "#8a7a70" }}>
              {run.weather}
            </div>
          )}
        </div>
        <div style={{ marginBottom: 20 }}>
          <div style={{ color: "#8a7a70", fontSize: 12, marginBottom: 8, fontWeight: 600 }}>¿Cómo te sientes?</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            {EMOCIONES.map((e) => (
              <button key={e.name} onClick={() => setSel(e)} style={{ padding: "8px", borderRadius: 10, border: `1px solid ${sel?.name === e.name ? "#7ec8b0" : "#ede8e0"}`, background: sel?.name === e.name ? "rgba(126,200,176,0.12)" : "#4a3f35", cursor: "pointer", textAlign: "left", transition: "all 0.2s", transform: sel?.name === e.name ? "scale(1.04)" : "scale(1)" }}>
                <div style={{ fontSize: 18 }}>{e.emoji}</div>
                <div style={{ color: sel?.name === e.name ? "#7ec8b0" : "#ccc", fontSize: 11, fontWeight: 600, marginTop: 2 }}>{e.name}</div>
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={onDiscard} style={{ flex: 1, padding: "12px 0", borderRadius: 10, border: "1px solid #333", background: "transparent", color: "#8a7a70", fontWeight: 600, cursor: "pointer" }}>
            Descartar
          </button>
          <button onClick={() => sel && onSave({ ...run, emotion: sel })} disabled={!sel} style={{ flex: 2, padding: "12px 0", borderRadius: 10, border: "none", background: sel ? "#7ec8b0" : "#ede8e0", color: "#4a3f35", fontWeight: 700, cursor: sel ? "pointer" : "not-allowed", fontSize: 15, transition: "all 0.3s", transform: sel ? "scale(1.02)" : "scale(1)" }}>
            Guardar carrera 💾
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── LEVEL UP NOTIFICATION ────────────────────────────────────────────────────
function LevelUpBanner({ level }) {
  if (!level) return null;
  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 250, pointerEvents: "none" }}>
      <div style={{ background: "linear-gradient(135deg, #7ec8b0, #f4a57a)", borderRadius: 24, padding: "28px 36px", textAlign: "center", animation: "level-pop 0.5s ease forwards", boxShadow: "0 8px 40px rgba(126,200,176,0.4)" }}>
        <div style={{ fontSize: 56, marginBottom: 4 }}>{level.emoji}</div>
        <div style={{ color: "#ffffff", fontWeight: 900, fontSize: 18, letterSpacing: 1 }}>¡NIVEL {level.level}!</div>
        <div style={{ color: "rgba(255,255,255,0.9)", fontSize: 14, marginTop: 4 }}>{level.name}</div>
        <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 11, marginTop: 6, fontStyle: "italic" }}>{level.desc}</div>
      </div>
    </div>
  );
}

// ─── WEATHER FETCH ────────────────────────────────────────────────────────────
async function fetchWeather(lat, lon) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto`;
    const res = await fetch(url);
    const data = await res.json();
    const code = data?.current?.weather_code ?? -1;
    const temp = Math.round(data?.current?.temperature_2m ?? 0);
    let icon = "🌤️", label = "Despejado";
    if (code === 0) { icon = "☀️"; label = "Soleado"; }
    else if (code <= 3) { icon = "⛅"; label = "Nublado"; }
    else if (code <= 49) { icon = "🌫️"; label = "Neblina"; }
    else if (code <= 67) { icon = "🌧️"; label = "Lloviendo"; }
    else if (code <= 77) { icon = "❄️"; label = "Nieve"; }
    else if (code <= 82) { icon = "🌧️"; label = "Lluvia fuerte"; }
    else if (code <= 99) { icon = "⛈️"; label = "Tormenta"; }
    return `${icon} ${label} ${temp}°C`;
  } catch {
    return "🌤️ Sin datos";
  }
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function RataFloJo({ session, onLogout }) {
  const [tab, setTab] = useState("inicio");
  const [prevTab, setPrevTab] = useState("inicio");
  const [runs, setRuns] = useState([]);
  const [runsLoading, setRunsLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [coords, setCoords] = useState([]);
  const [distance, setDistance] = useState(0);
  const [gpsError, setGpsError] = useState(null);
  const [weather, setWeather] = useState(null);
  const [postRun, setPostRun] = useState(null);
  const [shareRun, setShareRun] = useState(null);
  const [newLevel, setNewLevel] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const timerRef = useRef(null);
  const watchRef = useRef(null);
  const startTimeRef = useRef(null);
  const firstGpsRef = useRef(false);
  const wakeLockRef = useRef(null);

  const totalKm = runs.reduce((s, r) => s + (r.distance || 0), 0);
  const currentLevel = getCurrentLevel(totalKm);
  const nextLevel = getNextLevel(totalKm);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = GLOBAL_STYLES;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    if (!session) return;
    const loadRuns = async () => {
      setRunsLoading(true);
      const { data, error } = await supabase.from("runs").select("*").order("date", { ascending: false });
      if (!error && data) setRuns(data);
      setRunsLoading(false);
    };
    loadRuns();
  }, [session]);

  // Recalculate elapsed using real clock (survives screen-off)
  useEffect(() => {
    if (!running) return;
    const tick = () => {
      if (startTimeRef.current) {
        setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }
    };
    timerRef.current = setInterval(tick, 1000);
    const onVisible = () => { if (document.visibilityState === "visible") tick(); };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(timerRef.current);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [running]);

  // Wake Lock — keeps screen alive while running
  useEffect(() => {
    if (!running) {
      if (wakeLockRef.current) {
        wakeLockRef.current.release().catch(() => {});
        wakeLockRef.current = null;
      }
      return;
    }
    const requestWakeLock = async () => {
      try {
        if ("wakeLock" in navigator) {
          wakeLockRef.current = await navigator.wakeLock.request("screen");
        }
      } catch {}
    };
    requestWakeLock();
    // Re-acquire wake lock when screen comes back
    const onVisible = async () => {
      if (document.visibilityState === "visible" && running) {
        try {
          if ("wakeLock" in navigator && (!wakeLockRef.current || wakeLockRef.current.released)) {
            wakeLockRef.current = await navigator.wakeLock.request("screen");
          }
        } catch {}
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [running]);

  const changeTab = useCallback((newTab) => {
    setPrevTab(tab);
    setTab(newTab);
  }, [tab]);

  const startRun = useCallback(() => {
    setGpsError(null);
    setCoords([]);
    setDistance(0);
    setElapsed(0);
    setWeather(null);
    firstGpsRef.current = false;
    startTimeRef.current = Date.now();
    if (!navigator.geolocation) {
      setGpsError("Tu navegador no soporta GPS.");
      return;
    }
    watchRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const acc = pos.coords.accuracy;
        // Only accept points with accuracy <= 50m
        if (acc > 50) return;
        const pt = [pos.coords.latitude, pos.coords.longitude];
        // Fetch weather only once on first good GPS fix
        if (!firstGpsRef.current) {
          firstGpsRef.current = true;
          fetchWeather(pos.coords.latitude, pos.coords.longitude).then(setWeather);
        }
        setCoords((prev) => {
          // Ignore point if it's suspiciously far from last point (>200m jump = GPS glitch)
          if (prev.length > 0) {
            const last = prev[prev.length - 1];
            const jumpDist = calcDistance([last, pt]);
            if (jumpDist > 0.2) return prev; // ignore jumps > 200m
          }
          const next = [...prev, pt];
          setDistance(calcDistance(next));
          return next;
        });
      },
      (err) => {
        if (err.code !== 3) { // ignore timeouts, only show real errors
          setGpsError("No se pudo obtener ubicación. Verifica permisos de GPS.");
        }
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 30000 }
    );
    setRunning(true);
  }, []);

  const stopRun = useCallback(() => {
    clearInterval(timerRef.current);
    if (watchRef.current) navigator.geolocation.clearWatch(watchRef.current);
    if (wakeLockRef.current) {
      wakeLockRef.current.release().catch(() => {});
      wakeLockRef.current = null;
    }
    setRunning(false);
    const finalElapsed = startTimeRef.current ? Math.floor((Date.now() - startTimeRef.current) / 1000) : elapsed;
    setPostRun({ distance, duration: finalElapsed, coords, date: new Date().toISOString(), weather });
  }, [distance, elapsed, coords, weather]);


  const saveRun = useCallback(async (runData) => {
    const prevTotal = runs.reduce((s, r) => s + (r.distance || 0), 0);
    const newTotal = prevTotal + runData.distance;
    const prevLevel = getCurrentLevel(prevTotal);
    const newLvl = getCurrentLevel(newTotal);

    const { data, error } = await supabase.from("runs").insert([{
      user_id: session.user.id,
      date: runData.date,
      distance: runData.distance,
      duration: runData.duration,
      coords: runData.coords,
      weather: runData.weather,
      emotion: runData.emotion,
    }]).select().single();

    if (!error && data) setRuns((prev) => [data, ...prev]);
    setPostRun(null);

    if (newLvl.level > prevLevel.level) {
      setNewLevel(newLvl);
      setShowConfetti(true);
      setTimeout(() => { setNewLevel(null); setShowConfetti(false); }, 4000);
    }
  }, [runs, session]);

  const deleteRun = useCallback(async (id) => {
    await supabase.from("runs").delete().eq("id", id);
    setRuns((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const user = session?.user;
  const avatar = user?.user_metadata?.avatar_url;
  const name = user?.user_metadata?.full_name || user?.email || "Flo-Jo";

  return (
    <div style={{ minHeight: "100vh", background: "#faf8f4", color: "#4a3f35", fontFamily: "'Segoe UI', sans-serif", maxWidth: 420, margin: "0 auto", position: "relative" }}>

      {/* Header */}
      <div style={{ padding: "16px 20px 8px", background: "linear-gradient(180deg, #0f0f22 0%, transparent 100%)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {avatar && <img src={avatar} alt="avatar" style={{ width: 32, height: 32, borderRadius: "50%", border: "2px solid #e040fb" }} />}
            <div>
              <div style={{ fontSize: 10, color: "#7ec8b0", fontWeight: 700, letterSpacing: 2 }}>RATA FLO — JO</div>
              <div style={{ fontSize: 12, color: "#8a7a70" }}>{name.split(" ")[0]} 🐀</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ textAlign: "right" }}>
              <div className="float-anim" style={{ fontSize: 20 }}>{currentLevel.emoji}</div>
              <div style={{ fontSize: 10, color: "#8a7a70" }}>Nv. {currentLevel.level}</div>
              <div style={{ fontSize: 11, color: "#7ec8b0", fontWeight: 600 }}>{totalKm.toFixed(1)} km</div>
            </div>
            <button onClick={onLogout} style={{ background: "none", border: "1px solid #2a2a40", borderRadius: 8, color: "#bfb0a8", fontSize: 11, padding: "4px 8px", cursor: "pointer" }}>
              Salir
            </button>
          </div>
        </div>
      </div>

      {/* Confetti */}
      <Confetti active={showConfetti} />

      {/* Level up */}
      <LevelUpBanner level={newLevel} />

      {/* Content */}
      <div key={tab} style={{ padding: "0 16px 80px", animation: "tab-slide 0.3s ease forwards" }}>
        {tab === "inicio" && (
          <TabInicio
            running={running}
            elapsed={elapsed}
            distance={distance}
            coords={coords}
            gpsError={gpsError}
            weather={weather}
            onStart={startRun}
            onStop={stopRun}
            currentLevel={currentLevel}
            nextLevel={nextLevel}
            totalKm={totalKm}
          />
        )}
        {tab === "historial" && (
          <TabHistorial runs={runs} loading={runsLoading} onShare={setShareRun} onDelete={deleteRun} />
        )}
        {tab === "niveles" && <TabNiveles totalKm={totalKm} currentLevel={currentLevel} />}
      </div>

      {/* Bottom nav */}
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 420, background: "#4a3f35", borderTop: "1px solid #1e1e35", display: "flex" }}>
        {[
          { id: "inicio", icon: "🐀", label: "Inicio" },
          { id: "historial", icon: "📋", label: "Historial" },
          { id: "niveles", icon: "👑", label: "Niveles" },
        ].map((t) => (
          <button key={t.id} onClick={() => changeTab(t.id)} style={{ flex: 1, padding: "12px 0", background: "transparent", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, opacity: tab === t.id ? 1 : 0.45, transition: "opacity 0.2s" }}>
            <span style={{ fontSize: 20, transition: "transform 0.2s", transform: tab === t.id ? "scale(1.2)" : "scale(1)" }}>{t.icon}</span>
            <span style={{ fontSize: 10, color: tab === t.id ? "#7ec8b0" : "#bfb0a8", fontWeight: tab === t.id ? 700 : 400 }}>{t.label}</span>
            {tab === t.id && <div style={{ width: 20, height: 2, background: "#7ec8b0", borderRadius: 1, animation: "fadeInUp 0.2s ease" }} />}
          </button>
        ))}
      </div>

      {postRun && <PostRunModal run={postRun} onSave={saveRun} onDiscard={() => setPostRun(null)} />}
      {shareRun && <ShareCard run={shareRun} onClose={() => setShareRun(null)} />}
    </div>
  );
}

// ─── TAB INICIO ───────────────────────────────────────────────────────────────
function TabInicio({ running, elapsed, distance, coords, gpsError, weather, onStart, onStop, currentLevel, nextLevel, totalKm }) {
  const pace = fmtPace(distance, elapsed);
  const progress = nextLevel ? Math.min(((totalKm - currentLevel.km) / (nextLevel.km - currentLevel.km)) * 100, 100) : 100;
  const [btnPressed, setBtnPressed] = useState(false);

  const handleStart = () => {
    setBtnPressed(true);
    setTimeout(() => { setBtnPressed(false); onStart(); }, 200);
  };

  const handleStop = () => {
    setBtnPressed(true);
    setTimeout(() => { setBtnPressed(false); onStop(); }, 200);
  };

  if (running) {
    return (
      <div style={{ textAlign: "center", paddingTop: 20 }}>
        {/* GPS indicator + weather */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, marginBottom: 20 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(126,200,176,0.15)", borderRadius: 20, padding: "6px 14px" }}>
            <div style={{ position: "relative", width: 12, height: 12 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#7ec8b0", position: "absolute", top: 2, left: 2 }} />
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "rgba(126,200,176,0.4)", position: "absolute", animation: "gps-ping 1.5s ease-out infinite" }} />
            </div>
            <span style={{ color: "#7ec8b0", fontSize: 12, fontWeight: 700 }}>GPS ACTIVO</span>
          </div>
          {weather ? (
            <div style={{ fontSize: 12, color: "#8a7a70", background: "rgba(126,200,176,0.06)", borderRadius: 20, padding: "3px 12px" }}>{weather}</div>
          ) : (
            <div style={{ fontSize: 11, color: "#bfb0a8" }}>Detectando clima...</div>
          )}
        </div>

        {/* Timer */}
        <div className="fade-in-up" style={{ fontSize: 60, fontWeight: 900, color: "#4a3f35", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
          {fmtTime(elapsed)}
        </div>
        <div style={{ color: "#bfb0a8", fontSize: 12, marginBottom: 24 }}>tiempo</div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
          {[
            { val: distance.toFixed(2), unit: "km", color: "#7ec8b0" },
            { val: pace, unit: "min/km", color: "#c4b5d4" },
          ].map((s, i) => (
            <div key={i} style={{ background: "#4a3f35", borderRadius: 12, padding: 16, animation: `fadeInUp 0.4s ${i * 0.1}s ease both` }}>
              <div style={{ fontSize: 30, fontWeight: 800, color: s.color, fontVariantNumeric: "tabular-nums" }}>{s.val}</div>
              <div style={{ color: "#bfb0a8", fontSize: 12 }}>{s.unit}</div>
            </div>
          ))}
        </div>

        {/* Mini map */}
        {coords.length > 1 && (
          <div className="fade-in-up" style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
            <MiniMap coords={coords} size={200} />
          </div>
        )}

        {/* Stop button */}
        <button onClick={handleStop} style={{ width: "100%", padding: "18px 0", borderRadius: 16, border: "none", background: "linear-gradient(135deg, #ff1744, #d50000)", color: "#4a3f35", fontSize: 20, fontWeight: 900, cursor: "pointer", letterSpacing: 2, transition: "transform 0.15s", transform: btnPressed ? "scale(0.96)" : "scale(1)", boxShadow: "0 4px 20px rgba(232,133,122,0.4)" }}>
          STOPIN 🛑
        </button>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: 16 }}>
      {/* Level card */}
      <div className="fade-in-up" style={{ background: "#4a3f35", borderRadius: 16, padding: 20, marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span className="float-anim" style={{ fontSize: 42 }}>{currentLevel.emoji}</span>
          <div style={{ flex: 1 }}>
            <div style={{ color: "#7ec8b0", fontSize: 11, fontWeight: 700 }}>NIVEL {currentLevel.level}</div>
            <div style={{ color: "#4a3f35", fontWeight: 700, fontSize: 14 }}>{currentLevel.name}</div>
            <div style={{ color: "#8a7a70", fontSize: 11 }}>{currentLevel.desc}</div>
          </div>
        </div>
        {nextLevel && (
          <div style={{ marginTop: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 10, color: "#bfb0a8" }}>→ {nextLevel.emoji} {nextLevel.name}</span>
              <span style={{ fontSize: 10, color: "#8a7a70" }}>{totalKm.toFixed(1)} / {nextLevel.km} km</span>
            </div>
            <div style={{ background: "#f5f2ec", borderRadius: 6, height: 7, overflow: "hidden" }}>
              <div style={{ width: `${progress}%`, height: "100%", background: "linear-gradient(90deg, #7ec8b0, #f4a57a)", borderRadius: 6, transition: "width 1s ease" }} />
            </div>
          </div>
        )}
      </div>

      {gpsError && (
        <div className="fade-in-up" style={{ background: "rgba(232,133,122,0.1)", border: "1px solid rgba(232,133,122,0.3)", borderRadius: 10, padding: 12, marginBottom: 16, color: "#e8857a", fontSize: 13 }}>
          ⚠️ {gpsError}
        </div>
      )}

      {/* Le-ri-go button */}
      <button
        onClick={handleStart}
        className="btn-lrg"
        style={{ width: "100%", padding: "22px 0", borderRadius: 20, border: "none", background: "linear-gradient(135deg, #7ec8b0, #f4a57a)", color: "#ffffff", fontSize: 22, fontWeight: 900, cursor: "pointer", letterSpacing: 3, transform: btnPressed ? "scale(0.96)" : "scale(1)", transition: "transform 0.15s" }}
      >
        LE — RI — GO 🐀
      </button>
      <div style={{ textAlign: "center", color: "#bfb0a8", fontSize: 11, marginTop: 10 }}>Activa el GPS al salir a correr</div>
    </div>
  );
}

// ─── TAB HISTORIAL ────────────────────────────────────────────────────────────
function TabHistorial({ runs, loading, onShare, onDelete }) {
  const [confirmDel, setConfirmDel] = useState(null);

  if (loading) {
    return (
      <div style={{ textAlign: "center", paddingTop: 60 }}>
        <div className="bounce-emoji" style={{ fontSize: 36, marginBottom: 12 }}>🐀</div>
        <div style={{ fontSize: 14, color: "#bfb0a8" }}>Cargando carreras...</div>
      </div>
    );
  }

  if (runs.length === 0) {
    return (
      <div style={{ textAlign: "center", paddingTop: 60 }}>
        <div className="float-anim" style={{ fontSize: 48, marginBottom: 12 }}>🐀</div>
        <div style={{ fontSize: 16, color: "#8a7a70" }}>Todavía no hay carreras.</div>
        <div style={{ fontSize: 13, color: "#bfb0a8", marginTop: 6 }}>¡Dale Le-ri-go!</div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: 16 }}>
      <div style={{ color: "#bfb0a8", fontSize: 12, marginBottom: 12 }}>{runs.length} carrera{runs.length !== 1 ? "s" : ""} registrada{runs.length !== 1 ? "s" : ""}</div>
      {runs.map((r, idx) => (
        <div key={r.id} className="fade-in-up" style={{ background: "#4a3f35", borderRadius: 14, padding: 16, marginBottom: 10, animation: `fadeInUp 0.3s ${idx * 0.05}s ease both` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
            <div>
              <div style={{ color: "#7ec8b0", fontSize: 11, fontWeight: 700 }}>{new Date(r.date).toLocaleDateString("es-PE", { weekday: "short", day: "numeric", month: "short" }).toUpperCase()}</div>
              <div style={{ color: "#4a3f35", fontSize: 20, fontWeight: 800 }}>{r.distance.toFixed(2)} km</div>
            </div>
            {r.emotion && (
              <div style={{ textAlign: "center" }}>
                <div className="float-anim" style={{ fontSize: 26 }}>{r.emotion.emoji}</div>
                <div style={{ fontSize: 9, color: "#bfb0a8", maxWidth: 80, textAlign: "center" }}>{r.emotion.name}</div>
              </div>
            )}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
            {[
              { icon: "⏱️", val: fmtTime(r.duration) },
              { icon: "⚡", val: `${fmtPace(r.distance, r.duration)}/km` },
              { icon: "🌤️", val: r.weather?.split(" ")[1] || "—" },
            ].map((s) => (
              <div key={s.icon} style={{ background: "#f5f2ec", borderRadius: 8, padding: "6px 8px", textAlign: "center" }}>
                <div style={{ fontSize: 14 }}>{s.icon}</div>
                <div style={{ color: "#8a7a70", fontSize: 11, fontWeight: 600 }}>{s.val}</div>
              </div>
            ))}
          </div>
          {r.coords && r.coords.length > 1 && (
            <div style={{ marginBottom: 12 }}>
              <MiniMap coords={r.coords} size={100} />
            </div>
          )}
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => onShare(r)} style={{ flex: 1, padding: "9px 0", borderRadius: 10, border: "none", background: "rgba(126,200,176,0.15)", color: "#7ec8b0", fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "background 0.2s" }}>
              📤 Compartir
            </button>
            {confirmDel === r.id ? (
              <>
                <button onClick={() => { onDelete(r.id); setConfirmDel(null); }} style={{ flex: 1, padding: "9px 0", borderRadius: 10, border: "none", background: "#e8857a", color: "#4a3f35", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                  Confirmar 🗑️
                </button>
                <button onClick={() => setConfirmDel(null)} style={{ padding: "9px 12px", borderRadius: 10, border: "1px solid #333", background: "transparent", color: "#8a7a70", fontSize: 13, cursor: "pointer" }}>
                  No
                </button>
              </>
            ) : (
              <button onClick={() => setConfirmDel(r.id)} style={{ padding: "9px 12px", borderRadius: 10, border: "1px solid #2a2a40", background: "transparent", color: "#bfb0a8", fontSize: 18, cursor: "pointer", transition: "color 0.2s" }}>
                🗑️
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── TAB NIVELES ──────────────────────────────────────────────────────────────
function TabNiveles({ totalKm, currentLevel }) {
  const stages = [
    { name: "Sobrevivir", range: [1, 10] },
    { name: "El cardio ya no da miedo", range: [11, 20] },
    { name: "Ya corre por problemas emocionales", range: [21, 25] },
    { name: "Se está volviendo una amenaza", range: [26, 30] },
    { name: "Velocidad mitológica", range: [31, 35] },
    { name: "La realidad ya no la contiene", range: [36, 40] },
    { name: "Bestias cósmicas", range: [41, 45] },
    { name: "Rata Flo-Jo Suprema", range: [46, 50] },
  ];

  return (
    <div style={{ paddingTop: 16 }}>
      {/* Current level hero */}
      <div className="fade-in-up" style={{ background: "linear-gradient(135deg, #1a0a2e, #0f0f22)", borderRadius: 16, padding: 20, marginBottom: 20, textAlign: "center", border: "1px solid rgba(126,200,176,0.2)" }}>
        <div className="float-anim" style={{ fontSize: 52, marginBottom: 6 }}>{currentLevel.emoji}</div>
        <div style={{ color: "#7ec8b0", fontWeight: 800, fontSize: 18 }}>{currentLevel.name}</div>
        <div style={{ color: "#8a7a70", fontSize: 12, marginTop: 4 }}>{currentLevel.desc}</div>
        <div style={{ color: "#bfb0a8", fontSize: 11, marginTop: 8 }}>{totalKm.toFixed(1)} km acumulados</div>
      </div>

      {stages.map((stage, si) => {
        const stageLevels = LEVELS.filter((l) => l.level >= stage.range[0] && l.level <= stage.range[1]);
        const anyUnlocked = stageLevels.some((l) => totalKm >= l.km);
        return (
          <div key={stage.name} style={{ marginBottom: 16, animation: `fadeInUp 0.3s ${si * 0.06}s ease both` }}>
            <div style={{ color: anyUnlocked ? "#7ec8b0" : "#ede8e0", fontSize: 10, fontWeight: 700, letterSpacing: 1, marginBottom: 8, textTransform: "uppercase" }}>
              {anyUnlocked ? "✦ " : ""}{stage.name}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {stageLevels.map((l) => {
                const unlocked = totalKm >= l.km;
                const isCurrent = l.level === currentLevel.level;
                return (
                  <div key={l.level} style={{ background: isCurrent ? "rgba(126,200,176,0.12)" : unlocked ? "#4a3f35" : "#f8f5ef", borderRadius: 10, padding: 12, border: isCurrent ? "1px solid #e040fb" : "1px solid transparent", opacity: unlocked ? 1 : 0.35, transition: "all 0.2s" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <span style={{ fontSize: 22, filter: unlocked ? "none" : "grayscale(1)" }}>{unlocked ? l.emoji : "🔒"}</span>
                      <span style={{ fontSize: 10, color: isCurrent ? "#7ec8b0" : "#bfb0a8", fontWeight: 700 }}>Nv.{l.level}</span>
                    </div>
                    <div style={{ color: unlocked ? "#ddd" : "#ede8e0", fontSize: 11, fontWeight: 700, marginTop: 4 }}>{l.name}</div>
                    <div style={{ color: "#bfb0a8", fontSize: 10, marginTop: 2 }}>{l.km} km</div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
