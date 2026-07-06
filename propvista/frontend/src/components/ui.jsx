export function PageHeader({ eyebrow, title, action }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        padding: "40px 48px 28px",
        borderBottom: "1px solid var(--line)",
      }}
    >
      <div>
        {eyebrow && (
          <div
            style={{
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--brass)",
              marginBottom: 6,
              fontWeight: 600,
            }}
          >
            {eyebrow}
          </div>
        )}
        <h1 style={{ fontSize: 30 }}>{title}</h1>
      </div>
      {action}
    </div>
  );
}

export function Card({ children, style }) {
  return (
    <div
      style={{
        background: "var(--paper)",
        border: "1px solid var(--line)",
        borderRadius: 10,
        padding: 20,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function StatCard({ label, value, hint }) {
  return (
    <Card>
      <div style={{ fontSize: 12, color: "var(--slate)", marginBottom: 8 }}>{label}</div>
      <div className="num" style={{ fontSize: 26, fontWeight: 500, color: "var(--ink)" }}>
        {value}
      </div>
      {hint && (
        <div style={{ fontSize: 12, color: "var(--slate)", marginTop: 6 }}>{hint}</div>
      )}
    </Card>
  );
}

export function Button({ children, variant = "primary", ...props }) {
  const styles = {
    primary: {
      background: "var(--ink)",
      color: "var(--parchment)",
      border: "1px solid var(--ink)",
    },
    accent: {
      background: "var(--brass)",
      color: "var(--ink)",
      border: "1px solid var(--brass)",
    },
    ghost: {
      background: "transparent",
      color: "var(--ink)",
      border: "1px solid var(--line)",
    },
  };
  return (
    <button
      {...props}
      style={{
        padding: "10px 18px",
        borderRadius: 6,
        fontSize: 13,
        fontWeight: 600,
        ...styles[variant],
        ...props.style,
      }}
    >
      {children}
    </button>
  );
}

export function Input(props) {
  return (
    <input
      {...props}
      style={{
        padding: "10px 12px",
        borderRadius: 6,
        border: "1px solid var(--line)",
        fontSize: 14,
        background: "var(--paper)",
        color: "var(--ink)",
        ...props.style,
      }}
    />
  );
}

export function Table({ columns, rows, empty }) {
  if (!rows || rows.length === 0) {
    return (
      <Card style={{ textAlign: "center", padding: 48, color: "var(--slate)" }}>
        {empty || "Nothing here yet."}
      </Card>
    );
  }
  return (
    <div style={{ border: "1px solid var(--line)", borderRadius: 10, overflow: "hidden", background: "var(--paper)" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "var(--parchment)", borderBottom: "1px solid var(--line)" }}>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{
                  textAlign: "left",
                  padding: "12px 20px",
                  fontSize: 11,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--slate)",
                  fontWeight: 600,
                }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.id ?? i} style={{ borderBottom: i < rows.length - 1 ? "1px solid var(--line)" : "none" }}>
              {columns.map((col) => (
                <td key={col.key} style={{ padding: "14px 20px", fontSize: 14 }}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function StatusPill({ status }) {
  const map = {
    occupied: { bg: "#E7F0EA", color: "var(--success)" },
    vacant: { bg: "#F5E9E3", color: "var(--danger)" },
    active: { bg: "#E7F0EA", color: "var(--success)" },
    ended: { bg: "#EEECE6", color: "var(--slate)" },
    paid: { bg: "#E7F0EA", color: "var(--success)" },
    unpaid: { bg: "#F5E9E3", color: "var(--danger)" },
    partial: { bg: "#F7EFDD", color: "#8A6A1E" },
    open: { bg: "#F5E9E3", color: "var(--danger)" },
    in_progress: { bg: "#F7EFDD", color: "#8A6A1E" },
    resolved: { bg: "#E7F0EA", color: "var(--success)" },
  };
  const s = map[status] || { bg: "#EEECE6", color: "var(--slate)" };
  return (
    <span
      style={{
        background: s.bg,
        color: s.color,
        padding: "4px 10px",
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 600,
        textTransform: "capitalize",
      }}
    >
      {status}
    </span>
  );
}
