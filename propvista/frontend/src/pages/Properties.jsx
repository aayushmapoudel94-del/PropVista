import { useEffect, useState } from "react";
import client from "../api/client";
import Layout from "../components/Layout";
import { PageHeader, Button, Input, Table, StatusPill, Card } from "../components/ui";

export default function Properties() {
  const [properties, setProperties] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ address: "", city: "", purchase_price: "", rental_amount: "" });
  const [error, setError] = useState("");

  const load = () => client.get("/properties").then((res) => setProperties(res.data));

  useEffect(() => {
    load();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await client.post("/properties", form);
      setForm({ address: "", city: "", purchase_price: "", rental_amount: "" });
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add property");
    }
  };

  return (
    <Layout>
      <PageHeader
        eyebrow={`${properties.length} on record`}
        title="Properties"
        action={
          <Button variant="accent" onClick={() => setShowForm((s) => !s)}>
            {showForm ? "Cancel" : "+ Add property"}
          </Button>
        }
      />
      <div style={{ padding: "32px 48px" }}>
        {showForm && (
          <Card style={{ marginBottom: 24 }}>
            <form onSubmit={handleAdd} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr auto", gap: 12, alignItems: "end" }}>
              <div>
                <label style={{ fontSize: 12, color: "var(--slate)", fontWeight: 600, display: "block", marginBottom: 6 }}>Address</label>
                <Input
                  placeholder="221B Baker Street"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  required
                  style={{ width: "100%" }}
                />
              </div>
              <div>
                <label style={{ fontSize: 12, color: "var(--slate)", fontWeight: 600, display: "block", marginBottom: 6 }}>City</label>
                <Input
                  placeholder="Pokhara"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  style={{ width: "100%" }}
                />
              </div>
              <div>
                <label style={{ fontSize: 12, color: "var(--slate)", fontWeight: 600, display: "block", marginBottom: 6 }}>Purchase Price</label>
                <Input
                  type="number"
                  placeholder="250000"
                  value={form.purchase_price}
                  onChange={(e) => setForm({ ...form, purchase_price: e.target.value })}
                  required
                  style={{ width: "100%" }}
                />
              </div>
              <div>
                <label style={{ fontSize: 12, color: "var(--slate)", fontWeight: 600, display: "block", marginBottom: 6 }}>Monthly Rent</label>
                <Input
                  type="number"
                  placeholder="1800"
                  value={form.rental_amount}
                  onChange={(e) => setForm({ ...form, rental_amount: e.target.value })}
                  required
                  style={{ width: "100%" }}
                />
              </div>
              <Button type="submit" variant="primary">Save</Button>
            </form>
            {error && <div style={{ color: "var(--danger)", fontSize: 13, marginTop: 10 }}>{error}</div>}
          </Card>
        )}

        <Table
          empty="No properties yet — add your first one above."
          columns={[
            { key: "address", label: "Address", render: (r) => (
                <div>
                  <div style={{ fontWeight: 600 }}>{r.address}</div>
                  {r.city && <div style={{ fontSize: 12, color: "var(--slate)" }}>{r.city}</div>}
                </div>
              )
            },
            { key: "purchase_price", label: "Purchase Price", render: (r) => (
                <span className="num">${Number(r.purchase_price).toLocaleString()}</span>
              )
            },
            { key: "rental_amount", label: "Monthly Rent", render: (r) => (
                <span className="num">${Number(r.rental_amount).toLocaleString()}</span>
              )
            },
            { key: "status", label: "Status", render: (r) => <StatusPill status={r.status} /> },
          ]}
          rows={properties}
        />
      </div>
    </Layout>
  );
}
