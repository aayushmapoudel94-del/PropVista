import { useEffect, useState } from "react";
import client from "../api/client";
import Layout from "../components/Layout";
import { PageHeader, StatCard, Card } from "../components/ui";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    client
      .get("/analytics/dashboard")
      .then((res) => setStats(res.data))
      .catch((err) => {
        setError(
          err.response
            ? `Error ${err.response.status}: ${JSON.stringify(err.response.data)}`
            : err.message
        );
      });
  }, []);

  return (
    <Layout>
      <PageHeader eyebrow="Portfolio" title="Overview" />
      <div style={{ padding: "32px 48px" }}>
        {error && (
          <Card style={{ borderColor: "var(--danger)", color: "var(--danger)", marginBottom: 20 }}>
            {error}
          </Card>
        )}
        {!error && !stats && <p style={{ color: "var(--slate)" }}>Loading…</p>}
        {stats && (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 16,
                marginBottom: 16,
              }}
            >
              <StatCard label="Total Properties" value={stats.total_properties} />
              <StatCard label="Occupied" value={stats.occupied_properties} />
              <StatCard label="Vacant" value={stats.vacant_properties} />
              <StatCard label="Occupancy Rate" value={`${stats.occupancy_rate}%`} />
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 16,
              }}
            >
              <StatCard
                label="Monthly Rental Income"
                value={`$${stats.monthly_rental_income.toLocaleString()}`}
              />
              <StatCard
                label="Annual Rental Income"
                value={`$${stats.annual_rental_income.toLocaleString()}`}
              />
              <StatCard
                label="Total Maintenance Expenses"
                value={`$${stats.total_maintenance_expenses.toLocaleString()}`}
              />
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
