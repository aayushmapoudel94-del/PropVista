# PropVista — Real Estate Portfolio Analytics Platform

A property management and investment analytics platform.
**Stack:** React (frontend) · Flask/Python (backend) · PostgreSQL (database)

## Project Structure

```
propvista/
├── backend/            # Flask API (Python) — your main learning focus
│   ├── app/
│   │   ├── models/     # SQLAlchemy models (User, Property, Tenant, Lease, RentPayment, MaintenanceRequest)
│   │   ├── routes/     # Blueprints: auth, properties, tenants, leases, payments, maintenance, analytics
│   │   ├── config.py
│   │   └── extensions.py
│   ├── run.py
│   └── requirements.txt
├── database/
│   └── schema.sql       # Reference SQL schema
└── frontend/            # React + Vite
    └── src/
        ├── api/client.js
        ├── pages/
        └── App.jsx
```

## 1. Backend Setup (Python/Flask)

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env          # then edit DATABASE_URL, SECRET_KEY, JWT_SECRET_KEY
```

Create the PostgreSQL database:
```bash
psql -U postgres
CREATE DATABASE propvista_db;
CREATE USER propvista_user WITH PASSWORD 'propvista_pass';
GRANT ALL PRIVILEGES ON DATABASE propvista_db TO propvista_user;
```

Initialize migrations and create tables:
```bash
flask db init
flask db migrate -m "initial tables"
flask db upgrade
```

Run the server:
```bash
python run.py
```
API will be live at `http://localhost:5000/api`. Test it: `curl http://localhost:5000/api/health`

## 2. Frontend Setup (React)

```bash
cd frontend
npm install
npm start
```
Opens at `http://localhost:3000`, proxying `/api` calls to the Flask backend.

## 3. Suggested Build Order

1. **Auth** — register/login, confirm JWT works (use Postman/curl before touching React).
2. **Properties CRUD** — get one full module working end-to-end (DB → API → React) before moving to the next.
3. **Tenants + Leases** — link tenants to properties via leases.
4. **Rent Payments** — track due/paid, late fee logic.
5. **Maintenance** — requests and cost tracking.
6. **Analytics Dashboard** — aggregate queries (`/api/analytics/dashboard`).
7. **ROI Forecasting** — `/api/analytics/roi/<property_id>` (5/10/15-year projections).
8. **Polish** — validation, error handling, UI styling, charts (recharts is included).

## 4. API Endpoints Quick Reference

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Get JWT token |
| GET/POST | `/api/properties` | List / create properties |
| PUT/DELETE | `/api/properties/<id>` | Update / delete property |
| GET/POST | `/api/tenants` | List / create tenants |
| GET/POST | `/api/leases` | List / create leases |
| GET/POST | `/api/payments` | List / create rent payments |
| POST | `/api/payments/<id>/pay` | Mark payment as paid (auto late fee) |
| GET/POST | `/api/maintenance` | List / create maintenance requests |
| GET | `/api/analytics/dashboard` | Dashboard stats |
| GET | `/api/analytics/roi/<property_id>` | ROI forecast (5/10/15 yrs) |

## Notes for Learning Python/Flask Deeply

- Study `app/models/` first — this is core SQLAlchemy ORM (relationships, foreign keys, computed properties like `days_remaining`).
- Then `app/routes/analytics.py` — shows real aggregate SQL via SQLAlchemy (`func.sum`, `func.avg`, joins) and the ROI algorithm.
- Add more validation (e.g. with `marshmallow`, already in requirements.txt) as a next step.
- Add tests with `pytest` once modules are working.
