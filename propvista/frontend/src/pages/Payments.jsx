import { useEffect, useState } from "react";
import client from "../api/client";
import Layout from "../components/Layout";
import { PageHeader, Button, Input, Table, StatusPill, Card } from "../components/ui";

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [leases, setLeases] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ lease_id: "", due_date: "", amount_due: "" });

  const load = () => client.get("/payments").then((res) => setPayments(res.data));

  useEffect(() => {
    load();
    client.get("/leases").then((res) => setLeases(res.data));
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await client.post("/payments", {
        ...form,
        lease_id: Number(form.lease_id),
        amount_due: Number(form.amount_due),
      });
      setForm({ lease_id: "", due_date: "", amount_due: "" });
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add payment");
    }
  };

  const markPaid = async (payment) => {
    try {
      await client.post(`/payments/${payment.id}/pay`, { amount_paid: payment.amount_due });
      load();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to mark as paid");
    }
  };

  return (
    <Layout>
      <PageHeader
        eyebrow={`${payments.length} on record`}
        title="Rent Ledger"
        action={
          <Button variant="accent" onClick={() => setShowForm((s) => !s)}>
            {showForm ? "Cancel" : "+ Add payment due"}
          </Button>
        }
      />
      <div style={{ padding: "32px 48px" }}>
        {showForm && (
          <Card style={{ marginBottom: 24 }}>
            <form onSubmit={handleAdd} style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr auto", gap: 12, alignItems: "end" }}>
              <div>
                <label style={{ fontSize: 12, color: "var(--slate)", fontWeight: 600, display: "block", marginBottom: 6 }}>Lease</label>
                <select
                  required
                  value={form.lease_id}
                  onChange={(e) => setForm({ ...form, lease_id: e.target.value })}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 6, border: "1px solid var(--line)", fontSize: 14 }}
                >
                  <option value="">Select lease</option>
                  {leases.map((l) => (
                    <option key={l.id} value={l.id}>Lease #{l.id} — ${Number(l.monthly_rent).toLocaleString()}/mo</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, color: "var(--slate)", fontWeight: 600, display: "block", marginBottom: 6 }}>Due date</label>
                <Input type="date" required value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} style={{ width: "100%" }} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: "var(--slate)", fontWeight: 600, display: "block", marginBottom: 6 }}>Amount due</label>
                <Input type="number" required value={form.amount_due} onChange={(e) => setForm({ ...form, amount_due: e.target.value })} style={{ width: "100%" }} />
              </div>
              <Button type="submit" variant="primary">Save</Button>
            </form>
            {error && <div style={{ color: "var(--danger)", fontSize: 13, marginTop: 10 }}>{error}</div>}
          </Card>
        )}

        <Table
          empty="No rent payments recorded yet."
          columns={[
            { key: "lease_id", label: "Lease #" },
            { key: "due_date", label: "Due" },
            { key: "amount_due", label: "Amount Due", render: (r) => <span className="num">${Number(r.amount_due).toLocaleString()}</span> },
            { key: "amount_paid", label: "Paid", render: (r) => <span className="num">${Number(r.amount_paid).toLocaleString()}</span> },
            { key: "late_fee", label: "Late Fee", render: (r) => <span className="num">${Number(r.late_fee).toLocaleString()}</span> },
            { key: "status", label: "Status", render: (r) => <StatusPill status={r.status} /> },
            {
              key: "action",
              label: "",
              render: (r) =>
                r.status !== "paid" ? (
                  <Button variant="ghost" onClick={() => markPaid(r)} style={{ padding: "6px 12px", fontSize: 12 }}>
                    Mark paid
                  </Button>
                ) : null,
            },
          ]}
          rows={payments}
        />
      </div>
    </Layout>
  );
}