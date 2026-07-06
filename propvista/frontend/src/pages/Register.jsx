import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import client from "../api/client";
import { Button, Input } from "../components/ui";

export default function Register() {
  const [form, setForm] = useState({ full_name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await client.post("/auth/register", form);
      localStorage.setItem("access_token", res.data.access_token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--ink)",
        padding: 20,
      }}
    >
      <div style={{ width: 380 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 30, color: "var(--parchment)" }}>
            PropVista
          </div>
          <div
            style={{
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--brass)",
              marginTop: 6,
            }}
          >
            Create your account
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            background: "var(--paper)",
            borderRadius: 12,
            padding: 32,
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <label style={{ fontSize: 12, color: "var(--slate)", fontWeight: 600 }}>Full name</label>
          <Input
            placeholder="Jane Landlord"
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            required
          />
          <label style={{ fontSize: 12, color: "var(--slate)", fontWeight: 600 }}>Email</label>
          <Input
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <label style={{ fontSize: 12, color: "var(--slate)", fontWeight: 600 }}>Password</label>
          <Input
            type="password"
            placeholder="At least 8 characters"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          {error && (
            <div style={{ color: "var(--danger)", fontSize: 13, marginTop: -4 }}>{error}</div>
          )}

          <Button type="submit" variant="accent" style={{ marginTop: 8, width: "100%" }}>
            Create account
          </Button>

          <div style={{ textAlign: "center", fontSize: 13, color: "var(--slate)", marginTop: 4 }}>
            Already have an account?{" "}
            <Link to="/" style={{ color: "var(--brass)", fontWeight: 600, textDecoration: "none" }}>
              Log in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
