import { useEffect, useState } from "react";
import client from "../api/client";
import Layout from "../components/Layout";
import { PageHeader, Button, Input, Table, Card } from "../components/ui";

export default function Tenants() {
  const [tenants, setTenants] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ full_name: "", email: "", phone: "" });

  const load = () => client.get("/tenants").then((res) => setTenants(res.data));
  useEffect(() => { load(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    await client.post("/tenants", form);
    setForm({ full_name: "", email: "", phone: "" });
    setShowForm(false);
    load();
  };

  return (
    <Layout>
      <PageHeader
        eyebrow={`${tenants.length} on record`}
        title="Tenants"
        action={<Button variant="accent" onClick={() => setShowForm((s) => !s)}>{showForm ? "Cancel" : "+ Add tenant"}</Button>}
      />
      <div style={{ padding: "32px 48px" }}>
        {showForm && (
          <Card style={{ marginBottom: 24 }}>
            <form onSubmit={handleAdd} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 12, alignItems: "end" }}>
              <div>
                <label style={{ fontSize: 12, color: "var(--slate)", fontWeight: 600, display: "block", marginBottom: 6 }}>Full name</label>
                <Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required style={{ width: "100%" }} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: "var(--slate)", fontWeight: 600, display: "block", marginBottom: 6 }}>Email</label>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={{ width: "100%" }} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: "var(--slate)", fontWeight: 600, display: "block", marginBottom: 6 }}>Phone</label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} style={{ width: "100%" }} />
              </div>
              <Button type="submit">Save</Button>
            </form>
          </Card>
        )}
        <Table
          empty="No tenants yet — add your first one above."
          columns={[
            { key: "full_name", label: "Name" },
            { key: "email", label: "Email" },
            { key: "phone", label: "Phone" },
          ]}
          rows={tenants}
        />
      </div>
    </Layout>
  );
}
