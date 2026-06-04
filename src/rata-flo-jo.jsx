import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "./supabaseClient";

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
  { emoji: "💀", cat: "Supervivencia", name: "Supervivencia", sub: "Contra todo pronóstico." },
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

function MiniMap({ coords, size = 120 }) {
  if (!coords || coords.length < 2) {
    return (
      <div style={{ width: size, height: size, background: "#1a1a2e", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 11, color: "#555", textAlign: "center" }}>Sin recorrido</span>
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
    <svg width={size} height={size} style={{ borderRadius: 8, background: "#0f0f1e" }}>
      <polyline points={points} fill="none" stroke="#e040fb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={toX(start[1])} cy={toY(start[0])} r={4} fill="#00e676" />
      <circle cx={toX(end[1])} cy={toY(end[0])} r={4} fill="#ff1744" />
    </svg>
  );
}

function ShareCard({ run, onClose }) {
  const level = getCurrentLevel(run.totalKmAtRun || 0);
  const [shareType, setShareType] = useState("feed");
  const isStory = shareType === "story";
  const w = isStory ? 320 : 320;
  const h = isStory ? 568 : 320;

  const handleShare = (platform) => {
    alert(`🚀 Abriendo ${platform}...\n\nEn producción esto abriría el share nativo con la imagen generada.\n\n📏 ${run.distance.toFixed(2)} km | ⏱️ ${fmtTime(run.duration)} | ⚡ ${fmtPace(run.distance, run.duration)} min/km`);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 16 }}>
      <div style={{ background: "#12121f", borderRadius: 16, padding: 20, maxWidth: 380, width: "100%", maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>Compartir carrera</span>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#888", fontSize: 20, cursor: "pointer" }}>×</button>
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {["feed", "story"].map((t) => (
            <button key={t} onClick={() => setShareType(t)} style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: "none", cursor: "pointer", background: shareType === t ? "#e040fb" : "#1e1e35", color: "#fff", fontWeight: 600, fontSize: 13 }}>
              {t === "feed" ? "📸 Feed" : "📱 Historia"}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
          <div style={{ width: w, height: h, background: "linear-gradient(135deg, #0f0f1e 0%, #1a0a2e 100%)", borderRadius: 12, position: "relative", overflow: "hidden", padding: isStory ? "32px 24px" : "20px", boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: isStory ? "space-between" : "flex-start" }}>
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 80% 20%, rgba(224,64,251,0.15) 0%, transparent 60%)", pointerEvents: "none" }} />
            <div>
              <div style={{ color: "#e040fb", fontSize: 11, fontWeight: 700, letterSpacing: 3, marginBottom: 4 }}>RATA FLO — JO</div>
              <div style={{ color: "#fff", fontSize: isStory ? 18 : 14, fontWeight: 700, marginBottom: isStory ? 16 : 8 }}>{new Date(run.date).toLocaleDateString("es-PE", { weekday: "long", day: "numeric", month: "long" })}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: isStory ? 12 : 8 }}>
              {[
                { icon: "📏", label: "Distancia", val: `${run.distance.toFixed(2)} km` },
                { icon: "⏱️", label: "Tiempo", val: fmtTime(run.duration) },
                { icon: "⚡", label: "Ritmo", val: `${fmtPace(run.distance, run.duration)} /km` },
                { icon: "🌤️", label: "Clima", val: run.weather || "—" },
              ].map((s) => (
                <div key={s.label} style={{ background: "rgba(255,255,255,0.06)", borderRadius: 8, padding: isStory ? "12px" : "8px", backdropFilter: "blur(4px)" }}>
                  <div style={{ fontSize: isStory ? 18 : 14 }}>{s.icon}</div>
                  <div style={{ color: "#aaa", fontSize: 10, marginTop: 2 }}>{s.label}</div>
                  <div style={{ color: "#fff", fontWeight: 700, fontSize: isStory ? 16 : 13 }}>{s.val}</div>
                </div>
              ))}
            </div>
            {isStory && run.coords && run.coords.length > 1 && (
              <div style={{ display: "flex", justifyContent: "center", margin: "12px 0" }}>
                <MiniMap coords={run.coords} size={180} />
              </div>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: isStory ? 0 : 8, background: "rgba(224,64,251,0.1)", borderRadius: 10, padding: isStory ? "12px" : "8px" }}>
              <span style={{ fontSize: isStory ? 28 : 22 }}>{run.emotion?.emoji || "🐀"}</span>
              <div>
                <div style={{ color: "#e040fb", fontWeight: 700, fontSize: isStory ? 14 : 11 }}>{run.emotion?.name || "Rata Persistente"}</div>
                <div style={{ color: "#aaa", fontSize: isStory ? 11 : 10 }}>{run.emotion?.sub || ""}</div>
              </div>
              <div style={{ marginLeft: "auto", textAlign: "right" }}>
                <div style={{ fontSize: isStory ? 18 : 14 }}>{level.emoji}</div>
                <div style={{ color: "#888", fontSize: 9 }}>Nv. {level.level}</div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => handleShare("Facebook")} style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: "none", cursor: "pointer", background: "#1877f2", color: "#fff", fontWeight: 700, fontSize: 13 }}>
            📘 Facebook
          </button>
          <button onClick={() => handleShare("Instagram")} style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: "none", cursor: "pointer", background: "linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)", color: "#fff", fontWeight: 700, fontSize: 13 }}>
            📷 Instagram
          </button>
        </div>
      </div>
    </div>
  );
}

function PostRunModal({ run, onSave, onDiscard }) {
  const [sel, setSel] = useState(null);
  const [weather, setWeather] = useState("");
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 16 }}>
      <div style={{ background: "#12121f", borderRadius: 16, padding: 24, maxWidth: 380, width: "100%", maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>🏁</div>
          <div style={{ color: "#e040fb", fontWeight: 700, fontSize: 18 }}>¡Stopin!</div>
          <div style={{ color: "#888", fontSize: 13, marginTop: 4 }}>{run.distance.toFixed(2)} km · {fmtTime(run.duration)}</div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <div style={{ color: "#aaa", fontSize: 12, marginBottom: 8, fontWeight: 600 }}>🌤️ ¿Cómo estaba el clima?</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {WEATHER_OPTIONS.map((w) => (
              <button key={w} onClick={() => setWeather(w)} style={{ padding: "6px 10px", borderRadius: 20, border: `1px solid ${weather === w ? "#e040fb" : "#333"}`, background: weather === w ? "rgba(224,64,251,0.15)" : "transparent", color: weather === w ? "#e040fb" : "#aaa", fontSize: 12, cursor: "pointer" }}>
                {w}
              </button>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: 20 }}>
          <div style={{ color: "#aaa", fontSize: 12, marginBottom: 8, fontWeight: 600 }}>¿Cómo te sientes?</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            {EMOCIONES.map((e) => (
              <button key={e.name} onClick={() => setSel(e)} style={{ padding: "8px", borderRadius: 10, border: `1px solid ${sel?.name === e.name ? "#e040fb" : "#2a2a40"}`, background: sel?.name === e.name ? "rgba(224,64,251,0.12)" : "#1a1a2e", cursor: "pointer", textAlign: "left" }}>
                <div style={{ fontSize: 18 }}>{e.emoji}</div>
                <div style={{ color: sel?.name === e.name ? "#e040fb" : "#ccc", fontSize: 11, fontWeight: 600, marginTop: 2 }}>{e.name}</div>
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={onDiscard} style={{ flex: 1, padding: "12px 0", borderRadius: 10, border: "1px solid #333", background: "transparent", color: "#888", fontWeight: 600, cursor: "pointer" }}>
            Descartar
          </button>
          <button onClick={() => sel && onSave({ ...run, weather, emotion: sel })} disabled={!sel} style={{ flex: 2, padding: "12px 0", borderRadius: 10, border: "none", background: sel ? "#e040fb" : "#333", color: "#fff", fontWeight: 700, cursor: sel ? "pointer" : "not-allowed", fontSize: 15 }}>
            Guardar carrera 💾
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RataFloJo({ session, onLogout }) {
  const [tab, setTab] = useState("inicio");
  const [runs, setRuns] = useState([]);
  const [runsLoading, setRunsLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [coords, setCoords] = useState([]);
  const [distance, setDistance] = useState(0);
  const [gpsError, setGpsError] = useState(null);
  const [postRun, setPostRun] = useState(null);
  const [shareRun, setShareRun] = useState(null);
  const [newLevel, setNewLevel] = useState(null);
  const timerRef = useRef(null);
  const watchRef = useRef(null);
  const startTimeRef = useRef(null);

  const totalKm = runs.reduce((s, r) => s + (r.distance || 0), 0);
  const currentLevel = getCurrentLevel(totalKm);
  const nextLevel = getNextLevel(totalKm);

  // Cargar carreras desde Supabase
  useEffect(() => {
    if (!session) return;
    const loadRuns = async () => {
      setRunsLoading(true);
      const { data, error } = await supabase
        .from("runs")
        .select("*")
        .order("date", { ascending: false });
      if (!error && data) setRuns(data);
      setRunsLoading(false);
    };
    loadRuns();
  }, [session]);

  const startRun = useCallback(() => {
    setGpsError(null);
    setCoords([]);
    setDistance(0);
    setElapsed(0);
    startTimeRef.current = Date.now();
    if (!navigator.geolocation) {
      setGpsError("Tu navegador no soporta GPS.");
      return;
    }
    watchRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const pt = [pos.coords.latitude, pos.coords.longitude];
        setCoords((prev) => {
          const next = [...prev, pt];
          setDistance(calcDistance(next));
          return next;
        });
      },
      () => setGpsError("No se pudo obtener ubicación. Verifica permisos de GPS."),
      { enableHighAccuracy: true, maximumAge: 2000, timeout: 10000 }
    );
    timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    setRunning(true);
  }, []);

  const stopRun = useCallback(() => {
    clearInterval(timerRef.current);
    if (watchRef.current) navigator.geolocation.clearWatch(watchRef.current);
    setRunning(false);
    setPostRun({ distance, duration: elapsed, coords, date: new Date().toISOString() });
  }, [distance, elapsed, coords]);

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

    if (!error && data) {
      setRuns((prev) => [data, ...prev]);
    }
    setPostRun(null);
    if (newLvl.level > prevLevel.level) {
      setNewLevel(newLvl);
      setTimeout(() => setNewLevel(null), 4000);
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
    <div style={{ minHeight: "100vh", background: "#0a0a14", color: "#fff", fontFamily: "'Segoe UI', sans-serif", maxWidth: 420, margin: "0 auto", position: "relative" }}>
      {/* Header */}
      <div style={{ padding: "16px 20px 8px", background: "linear-gradient(180deg, #0f0f22 0%, transparent 100%)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {avatar && <img src={avatar} alt="avatar" style={{ width: 32, height: 32, borderRadius: "50%", border: "2px solid #e040fb" }} />}
            <div>
              <div style={{ fontSize: 10, color: "#e040fb", fontWeight: 700, letterSpacing: 2 }}>RATA FLO — JO</div>
              <div style={{ fontSize: 12, color: "#aaa" }}>{name.split(" ")[0]} 🐀</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 20 }}>{currentLevel.emoji}</div>
              <div style={{ fontSize: 10, color: "#888" }}>Nv. {currentLevel.level}</div>
              <div style={{ fontSize: 11, color: "#e040fb", fontWeight: 600 }}>{totalKm.toFixed(1)} km</div>
            </div>
            <button onClick={onLogout} style={{ background: "none", border: "1px solid #2a2a40", borderRadius: 8, color: "#555", fontSize: 11, padding: "4px 8px", cursor: "pointer" }}>
              Salir
            </button>
          </div>
        </div>
      </div>

      {/* Level up notification */}
      {newLevel && (
        <div style={{ position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", background: "#e040fb", borderRadius: 16, padding: "12px 20px", zIndex: 200, textAlign: "center" }}>
          <div style={{ fontSize: 30 }}>{newLevel.emoji}</div>
          <div style={{ color: "#fff", fontWeight: 800, fontSize: 14 }}>¡NIVEL {newLevel.level}!</div>
          <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 12 }}>{newLevel.name}</div>
        </div>
      )}

      {/* Content */}
      <div style={{ padding: "0 16px 80px" }}>
        {tab === "inicio" && (
          <TabInicio
            running={running}
            elapsed={elapsed}
            distance={distance}
            coords={coords}
            gpsError={gpsError}
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
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 420, background: "#0f0f22", borderTop: "1px solid #1e1e35", display: "flex" }}>
        {[
          { id: "inicio", icon: "🐀", label: "Inicio" },
          { id: "historial", icon: "📋", label: "Historial" },
          { id: "niveles", icon: "👑", label: "Niveles" },
        ].map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, padding: "12px 0", background: "transparent", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, opacity: tab === t.id ? 1 : 0.45 }}>
            <span style={{ fontSize: 20 }}>{t.icon}</span>
            <span style={{ fontSize: 10, color: tab === t.id ? "#e040fb" : "#aaa", fontWeight: tab === t.id ? 700 : 400 }}>{t.label}</span>
            {tab === t.id && <div style={{ width: 20, height: 2, background: "#e040fb", borderRadius: 1 }} />}
          </button>
        ))}
      </div>

      {postRun && <PostRunModal run={postRun} onSave={saveRun} onDiscard={() => setPostRun(null)} />}
      {shareRun && <ShareCard run={shareRun} onClose={() => setShareRun(null)} />}
    </div>
  );
}

function TabInicio({ running, elapsed, distance, coords, gpsError, onStart, onStop, currentLevel, nextLevel, totalKm }) {
  const pace = fmtPace(distance, elapsed);
  const nextKm = nextLevel ? nextLevel.km : currentLevel.km;
  const progress = nextLevel ? Math.min(((totalKm - currentLevel.km) / (nextLevel.km - currentLevel.km)) * 100, 100) : 100;

  return (
    <div>
      {running ? (
        <div style={{ textAlign: "center", paddingTop: 20 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(0,230,118,0.1)", borderRadius: 20, padding: "6px 14px", marginBottom: 20 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#00e676", animation: "blink 1s infinite" }} />
            <span style={{ color: "#00e676", fontSize: 12, fontWeight: 700 }}>GPS ACTIVO</span>
          </div>
          <div style={{ fontSize: 56, fontWeight: 900, color: "#fff", lineHeight: 1 }}>{fmtTime(elapsed)}</div>
          <div style={{ color: "#888", fontSize: 13, marginBottom: 24 }}>tiempo</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
            <div style={{ background: "#1a1a2e", borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#e040fb" }}>{distance.toFixed(2)}</div>
              <div style={{ color: "#666", fontSize: 12 }}>kilómetros</div>
            </div>
            <div style={{ background: "#1a1a2e", borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#7c4dff" }}>{pace}</div>
              <div style={{ color: "#666", fontSize: 12 }}>min/km</div>
            </div>
          </div>
          {coords.length > 1 && (
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
              <MiniMap coords={coords} size={200} />
            </div>
          )}
          <button onClick={onStop} style={{ width: "100%", padding: "18px 0", borderRadius: 16, border: "none", background: "linear-gradient(135deg, #ff1744, #d50000)", color: "#fff", fontSize: 20, fontWeight: 900, cursor: "pointer", letterSpacing: 2 }}>
            STOPIN 🛑
          </button>
        </div>
      ) : (
        <div style={{ paddingTop: 16 }}>
          <div style={{ background: "#1a1a2e", borderRadius: 16, padding: 20, marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 40 }}>{currentLevel.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ color: "#e040fb", fontSize: 11, fontWeight: 700 }}>NIVEL {currentLevel.level}</div>
                <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>{currentLevel.name}</div>
                <div style={{ color: "#888", fontSize: 11 }}>{currentLevel.desc}</div>
              </div>
            </div>
            {nextLevel && (
              <div style={{ marginTop: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 10, color: "#666" }}>Próximo: {nextLevel.emoji} {nextLevel.name}</span>
                  <span style={{ fontSize: 10, color: "#888" }}>{totalKm.toFixed(1)} / {nextLevel.km} km</span>
                </div>
                <div style={{ background: "#0f0f1e", borderRadius: 4, height: 6 }}>
                  <div style={{ width: `${progress}%`, height: "100%", background: "linear-gradient(90deg, #7c4dff, #e040fb)", borderRadius: 4, transition: "width 0.5s" }} />
                </div>
              </div>
            )}
          </div>
          {gpsError && (
            <div style={{ background: "rgba(255,23,68,0.1)", border: "1px solid rgba(255,23,68,0.3)", borderRadius: 10, padding: 12, marginBottom: 16, color: "#ff5252", fontSize: 13 }}>
              ⚠️ {gpsError}
            </div>
          )}
          <button onClick={onStart} style={{ width: "100%", padding: "22px 0", borderRadius: 20, border: "none", background: "linear-gradient(135deg, #7c4dff, #e040fb)", color: "#fff", fontSize: 22, fontWeight: 900, cursor: "pointer", letterSpacing: 3, boxShadow: "0 0 40px rgba(224,64,251,0.3)" }}>
            LE — RI — GO 🐀
          </button>
          <div style={{ textAlign: "center", color: "#555", fontSize: 11, marginTop: 10 }}>Activa el GPS al salir a correr</div>
        </div>
      )}
      <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
    </div>
  );
}

function TabHistorial({ runs, loading, onShare, onDelete }) {
  const [confirmDel, setConfirmDel] = useState(null);
  if (loading) {
    return (
      <div style={{ textAlign: "center", paddingTop: 60, color: "#555" }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>🐀</div>
        <div style={{ fontSize: 14, color: "#666" }}>Cargando carreras...</div>
      </div>
    );
  }
  if (runs.length === 0) {
    return (
      <div style={{ textAlign: "center", paddingTop: 60, color: "#555" }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🐀</div>
        <div style={{ fontSize: 16, color: "#888" }}>Todavía no hay carreras.</div>
        <div style={{ fontSize: 13, marginTop: 6 }}>¡Dale Le-ri-go!</div>
      </div>
    );
  }
  return (
    <div style={{ paddingTop: 16 }}>
      <div style={{ color: "#888", fontSize: 12, marginBottom: 12 }}>{runs.length} carrera{runs.length !== 1 ? "s" : ""} registrada{runs.length !== 1 ? "s" : ""}</div>
      {runs.map((r) => (
        <div key={r.id} style={{ background: "#1a1a2e", borderRadius: 14, padding: 16, marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
            <div>
              <div style={{ color: "#e040fb", fontSize: 11, fontWeight: 700 }}>{new Date(r.date).toLocaleDateString("es-PE", { weekday: "short", day: "numeric", month: "short" }).toUpperCase()}</div>
              <div style={{ color: "#fff", fontSize: 18, fontWeight: 800 }}>{r.distance.toFixed(2)} km</div>
            </div>
            {r.emotion && (
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 24 }}>{r.emotion.emoji}</div>
                <div style={{ fontSize: 9, color: "#888", maxWidth: 80, textAlign: "center" }}>{r.emotion.name}</div>
              </div>
            )}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
            {[
              { icon: "⏱️", val: fmtTime(r.duration) },
              { icon: "⚡", val: `${fmtPace(r.distance, r.duration)}/km` },
              { icon: "🌤️", val: r.weather?.split(" ")[1] || "—" },
            ].map((s) => (
              <div key={s.icon} style={{ background: "#0f0f1e", borderRadius: 8, padding: "6px 8px", textAlign: "center" }}>
                <div style={{ fontSize: 14 }}>{s.icon}</div>
                <div style={{ color: "#ccc", fontSize: 11, fontWeight: 600 }}>{s.val}</div>
              </div>
            ))}
          </div>
          {r.coords && r.coords.length > 1 && (
            <div style={{ marginBottom: 12 }}>
              <MiniMap coords={r.coords} size={100} />
            </div>
          )}
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => onShare(r)} style={{ flex: 1, padding: "9px 0", borderRadius: 10, border: "none", background: "rgba(224,64,251,0.15)", color: "#e040fb", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
              📤 Compartir
            </button>
            {confirmDel === r.id ? (
              <>
                <button onClick={() => { onDelete(r.id); setConfirmDel(null); }} style={{ flex: 1, padding: "9px 0", borderRadius: 10, border: "none", background: "#ff1744", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                  Confirmar 🗑️
                </button>
                <button onClick={() => setConfirmDel(null)} style={{ padding: "9px 12px", borderRadius: 10, border: "1px solid #333", background: "transparent", color: "#888", fontSize: 13, cursor: "pointer" }}>
                  No
                </button>
              </>
            ) : (
              <button onClick={() => setConfirmDel(r.id)} style={{ padding: "9px 12px", borderRadius: 10, border: "1px solid #2a2a40", background: "transparent", color: "#555", fontSize: 18, cursor: "pointer" }}>
                🗑️
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

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
      <div style={{ background: "linear-gradient(135deg, #1a0a2e, #0f0f22)", borderRadius: 16, padding: 16, marginBottom: 20, textAlign: "center" }}>
        <div style={{ fontSize: 48 }}>{currentLevel.emoji}</div>
        <div style={{ color: "#e040fb", fontWeight: 800, fontSize: 20 }}>{currentLevel.name}</div>
        <div style={{ color: "#888", fontSize: 12, marginTop: 4 }}>{currentLevel.desc}</div>
        <div style={{ color: "#555", fontSize: 11, marginTop: 8 }}>{totalKm.toFixed(1)} km acumulados</div>
      </div>
      {stages.map((stage) => {
        const stageLevels = LEVELS.filter((l) => l.level >= stage.range[0] && l.level <= stage.range[1]);
        const anyUnlocked = stageLevels.some((l) => totalKm >= l.km);
        return (
          <div key={stage.name} style={{ marginBottom: 16 }}>
            <div style={{ color: anyUnlocked ? "#e040fb" : "#444", fontSize: 11, fontWeight: 700, letterSpacing: 1, marginBottom: 8, textTransform: "uppercase" }}>
              {stage.name}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {stageLevels.map((l) => {
                const unlocked = totalKm >= l.km;
                const isCurrent = l.level === currentLevel.level;
                return (
                  <div key={l.level} style={{ background: isCurrent ? "rgba(224,64,251,0.15)" : unlocked ? "#1a1a2e" : "#0f0f18", borderRadius: 10, padding: 12, border: isCurrent ? "1px solid #e040fb" : "1px solid transparent", opacity: unlocked ? 1 : 0.4 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <span style={{ fontSize: 22 }}>{unlocked ? l.emoji : "🔒"}</span>
                      <span style={{ fontSize: 10, color: unlocked ? "#e040fb" : "#444", fontWeight: 700 }}>Nv.{l.level}</span>
                    </div>
                    <div style={{ color: unlocked ? "#fff" : "#444", fontSize: 11, fontWeight: 700, marginTop: 4 }}>{l.name}</div>
                    <div style={{ color: "#555", fontSize: 10, marginTop: 2 }}>{l.km} km</div>
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
