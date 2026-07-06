import { NavLink, useNavigate } from "react-router-dom";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Overview", glyph: "◆" },
  { to: "/properties", label: "Properties", glyph: "▤" },
  { to: "/tenants", label: "Tenants", glyph: "☖" },
  { to: "/leases", label: "Leases", glyph: "§" },
  { to: "/payments", label: "Rent Ledger", glyph: "¤" },
  { to: "/maintenance", label: "Maintenance", glyph: "⚒" },
];

export default function Layout({ children }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside
        style={{
          width: 240,
          background: "var(--ink)",
          color: "var(--parchment)",
          padding: "28px 20px",
          display: "flex",
          flexDirection: "column",
          position: "sticky",
          top: 0,
          height: "100vh",
        }}
      >
        <div style={{ marginBottom: 40 }}>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: "-0.01em",
            }}
          >
            PropVista
          </div>
          <div
            style={{
              fontSize: 11,
              color: "var(--brass)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginTop: 4,
            }}
          >
            Portfolio Ledger
          </div>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 12px",
                borderRadius: 6,
                textDecoration: "none",
                color: isActive ? "var(--ink)" : "var(--parchment)",
                background: isActive ? "var(--brass)" : "transparent",
                fontSize: 14,
                fontWeight: isActive ? 600 : 400,
                transition: "background 0.15s ease",
              })}
            >
              <span style={{ width: 18, textAlign: "center", opacity: 0.9 }}>{item.glyph}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          style={{
            marginTop: 20,
            background: "transparent",
            border: "1px solid rgba(246,243,236,0.2)",
            color: "var(--parchment)",
            padding: "10px 12px",
            borderRadius: 6,
            fontSize: 13,
            textAlign: "left",
          }}
        >
          Sign out
        </button>
      </aside>

      <main style={{ flex: 1, background: "var(--parchment)", minHeight: "100vh" }}>
        {children}
      </main>
    </div>
  );
}
