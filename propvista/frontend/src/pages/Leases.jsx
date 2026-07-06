import { useEffect, useState } from "react";
import client from "../api/client";
import Layout from "../components/Layout";
import { PageHeader, Button, Input, Table, StatusPill, Card } from "../components/ui";

export default function Leases() {
  const [leases, setLeases] = useState([]);
  const [properties, setProperties] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    property_id: "",
    tenant_id: "",
    start_date: "",
    end_date: "",
    monthly_rent: "",
    security_deposit: "",
  });

  const load = () => client.get("/leases").then((res) => setLeases(res.data));

  useEffect(() => {
    load();
    client.get("/properties").then((res) => setProperties(res.data));
    client.get("/tenants").then((res) => setTenants(res.data));
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await client.post("/leases", {
        ...form,
        property_id: Number(form.property_id),
        tenant_id: Number(form.tenant_id),
        monthly_rent: Number(form.monthly_rent),
        security_deposit: form.security_deposit ? Number(form.security_deposit) : undefined,
      });
      setForm({ property_id: "", tenant_id: "", start_date: "", end_date: "", monthly_rent: "", security_deposit: "" });
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create lease");
    }
  };

  return (
    <Layout>
      <PageHeader
        eyebrow={`${leases.length} on record`}
        title="Leases"
        action={
          <Button variant="accent" onClick={() => setShowForm((s) => !s)}>
            {showForm ? "Cancel" : "+ Create lease"}
          </Button>
        }
      />
      <div style={{ padding: "32px 48px" }}>
        {showForm && (
          <Card style={{ marginBottom: 24 }}>
            <form
              onSubmit={handleAdd}
              style={{ display: "grid", gridTemplateColumns: "1.5fr 1.5fr 1fr 1fr 1fr 1fr auto", gap: 12, alignItems: "end" }}
            >
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
                <label style={{ fontSize: 12, color: "var(--slate)", fontWeight: 600, display: "block", marginBottom: 6 }}>Tenant</label>
                <select
                  required
                  value={form.tenant_id}
                  onChange={(e) => setForm({ ...form, tenant_id: e.target.value })}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 6, border: "1px solid var(--line)", fontSize: 14 }}
                >
                  <option value="">Select tenant</option>
                  {tenants.map((t) => (
                    <option key={t.id} value={t.id}>{t.full_name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, color: "var(--slate)", fontWeight: 600, display: "block", marginBottom: 6 }}>Start date</label>
                <Input type="date" required value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} style={{ width: "100%" }} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: "var(--slate)", fontWeight: 600, display: "block", marginBottom: 6 }}>End date</label>
                <Input type="date" required value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} style={{ width: "100%" }} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: "var(--slate)", fontWeight: 600, display: "block", marginBottom: 6 }}>Monthly rent</label>
                <Input type="number" required value={form.monthly_rent} onChange={(e) => setForm({ ...form, monthly_rent: e.target.value })} style={{ width: "100%" }} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: "var(--slate)", fontWeight: 600, display: "block", marginBottom: 6 }}>Deposit</label>
                <Input type="number" value={form.security_deposit} onChange={(e) => setForm({ ...form, security_deposit: e.target.value })} style={{ width: "100%" }} />
              </div>
              <Button type="submit" variant="primary">Save</Button>
            </form>
            {error && <div style={{ color: "var(--danger)", fontSize: 13, marginTop: 10 }}>{error}</div>}
          </Card>
        )}

        <Table
          empty="No leases yet — create one once you have a property and tenant."
          columns={[
            { key: "property_id", label: "Property", render: (r) => properties.find((p) => p.id === r.property_id)?.address || `#${r.property_id}` },
            { key: "tenant_id", label: "Tenant", render: (r) => tenants.find((t) => t.id === r.tenant_id)?.full_name || `#${r.tenant_id}` },
            { key: "monthly_rent", label: "Rent", render: (r) => <span className="num">${Number(r.monthly_rent).toLocaleString()}</span> },
            { key: "end_date", label: "Ends" },
            { key: "days_remaining", label: "Days left", render: (r) => <span className="num">{r.days_remaining}</span> },
            { key: "status", label: "Status", render: (r) => <StatusPill status={r.status} /> },
          ]}
          rows={leases}
        />
      </div>
    </Layout>
  );
}