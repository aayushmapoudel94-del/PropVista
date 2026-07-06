import { useEffect, useState } from "react";
import client from "../api/client";
import Layout from "../components/Layout";
import { PageHeader, Button, Input, Table, StatusPill, Card } from "../components/ui";

export default function Maintenance() {
  const [requests, setRequests] = useState([]);
  const [properties, setProperties] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ property_id: "", category: "", description: "", cost: "" });

  const load = () => client.get("/maintenance").then((res) => setRequests(res.data));

  useEffect(() => {
    load();
    client.get("/properties").then((res) => setProperties(res.data));
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await client.post("/maintenance", {
        ...form,
        property_id: Number(form.property_id),
        cost: form.cost ? Number(form.cost) : 0,
      });
      setForm({ property_id: "", category: "", description: "", cost: "" });
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add maintenance request");
    }
  };

  const markResolved = async (req) => {
    try {
      await client.put(`/maintenance/${req.id}`, { status: "resolved" });
      load();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update request");
    }
  };

  return (
    <Layout>
      <PageHeader
        eyebrow={`${requests.length} on record`}
        title="Maintenance"
        action={
          <Button variant="accent" onClick={() => setShowForm((s) => !s)}>
            {showForm ? "Cancel" : "+ Log request"}
          </Button>
        }
      />
      <div style={{ padding: "32px 48px" }}>
        {showForm && (
          <Card style={{ marginBottom: 24 }}>
            <form onSubmit={handleAdd} style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr 1.5fr 0.8fr auto", gap: 12, alignItems: "end" }}>
              <div>
                <label style={{ fontSize: 12, color: "var(--slate)", fontWeight: 600, display: "block", marginBottom: 6 }}>Property</label>
                <select
                  required
                  value={form.property_id}
                  onChange={(e) => setForm({ ...form, property_id: e.target.value })}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 6, border: "1px solid var(--line)", fontSize: 14 }}
                >
                  <option value="">Select property</option>
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>{p.address}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, color: "var(--slate)", fontWeight: 600, display: "block", marginBottom: 6 }}>Category</label>
                <Input placeholder="Plumbing" required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={{ width: "100%" }} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: "var(--slate)", fontWeight: 600, display: "block", marginBottom: 6 }}>Description</label>
                <Input placeholder="Leaking kitchen sink" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ width: "100%" }} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: "var(--slate)", fontWeight: 600, display: "block", marginBottom: 6 }}>Cost</label>
                <Input type="number" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} style={{ width: "100%" }} />
              </div>
              <Button type="submit" variant="primary">Save</Button>
            </form>
            {error && <div style={{ color: "var(--danger)", fontSize: 13, marginTop: 10 }}>{error}</div>}
          </Card>
        )}

        <Table
          empty="No maintenance requests yet."
          columns={[
            { key: "property_id", label: "Property", render: (r) => properties.find((p) => p.id === r.property_id)?.address || `#${r.property_id}` },
            { key: "category", label: "Category" },
            { key: "description", label: "Description" },
            { key: "cost", label: "Cost", render: (r) => <span className="num">${Number(r.cost).toLocaleString()}</span> },
            { key: "status", label: "Status", render: (r) => <StatusPill status={r.status} /> },
            {
              key: "action",
              label: "",
              render: (r) =>
                r.status !== "resolved" ? (
                  <Button variant="ghost" onClick={() => markResolved(r)} style={{ padding: "6px 12px", fontSize: 12 }}>
                    Mark resolved
                  </Button>
                ) : null,
            },
          ]}
          rows={requests}
        />
      </div>
    </Layout>
  );
}