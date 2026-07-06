-- PropVista Database Schema (reference only — Flask-Migrate manages actual migrations)

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE properties (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100),
    purchase_price NUMERIC(12,2) NOT NULL,
    current_value NUMERIC(12,2),
    rental_amount NUMERIC(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'vacant',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE tenants (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(120),
    phone VARCHAR(30),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE leases (
    id SERIAL PRIMARY KEY,
    property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    tenant_id INTEGER NOT NULL REFERENCES tenants(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    monthly_rent NUMERIC(10,2) NOT NULL,
    security_deposit NUMERIC(10,2),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE rent_payments (
    id SERIAL PRIMARY KEY,
    lease_id INTEGER NOT NULL REFERENCES leases(id) ON DELETE CASCADE,
    due_date DATE NOT NULL,
    amount_due NUMERIC(10,2) NOT NULL,
    amount_paid NUMERIC(10,2) DEFAULT 0,
    paid_date DATE,
    late_fee NUMERIC(10,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'unpaid',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE maintenance_requests (
    id SERIAL PRIMARY KEY,
    property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    category VARCHAR(60) NOT NULL,
    description TEXT,
    cost NUMERIC(10,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'open',
    created_at TIMESTAMP DEFAULT NOW(),
    resolved_at TIMESTAMP
);

-- Helpful indexes
CREATE INDEX idx_properties_owner ON properties(owner_id);
CREATE INDEX idx_leases_property ON leases(property_id);
CREATE INDEX idx_leases_tenant ON leases(tenant_id);
CREATE INDEX idx_payments_lease ON rent_payments(lease_id);
CREATE INDEX idx_maintenance_property ON maintenance_requests(property_id);
