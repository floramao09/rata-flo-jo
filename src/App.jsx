import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import RataFloJo from "./rata-flo-jo.jsx";

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh", background: "#0a0a14", display: "flex",
        alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16
      }}>
        <div style={{ fontSize: 48 }}>🐀</div>
        <div style={{ color: "#e040fb", fontSize: 14, fontWeight: 700, letterSpacing: 2 }}>
          CARGANDO...
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div style={{
        minHeight: "100vh", background: "#0a0a14", display: "flex",
        alignItems: "center", justifyContent: "center", padding: 24,
        fontFamily: "'Segoe UI', sans-serif"
      }}>
        <div style={{
          background: "#12121f", borderRadius: 24, padding: 40,
          maxWidth: 360, width: "100%", textAlign: "center",
          border: "1px solid #1e1e35"
        }}>
          <div style={{ fontSize: 64, marginBottom: 8 }}>🐀</div>
          <div style={{ color: "#e040fb", fontWeight: 900, fontSize: 22, letterSpacing: 2, marginBottom: 4 }}>
            RATA FLO — JO
          </div>
          <div style={{ color: "#555", fontSize: 13, marginBottom: 8 }}>
            Tu app de running personal
          </div>
          <div style={{ color: "#888", fontSize: 12, marginBottom: 32 }}>
            Inicia sesión para guardar tus carreras en la nube y acceder desde cualquier dispositivo 📱
          </div>

          <button
            onClick={handleGoogleLogin}
            style={{
              width: "100%", padding: "14px 0", borderRadius: 14,
              border: "1px solid #2a2a40", background: "#1a1a2e",
              color: "#fff", fontSize: 15, fontWeight: 700,
              cursor: "pointer", display: "flex", alignItems: "center",
              justifyContent: "center", gap: 12
            }}
          >
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Entrar con Google
          </button>

          <div style={{ marginTop: 24, color: "#333", fontSize: 11 }}>
            Solo tú puedes ver tus carreras 🔒
          </div>
        </div>
      </div>
    );
  }

  return <RataFloJo session={session} onLogout={handleLogout} />;
}
