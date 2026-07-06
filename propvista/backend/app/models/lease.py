from datetime import date, datetime
from app.extensions import db


class Lease(db.Model):
    __tablename__ = "leases"

    id = db.Column(db.Integer, primary_key=True)
    property_id = db.Column(db.Integer, db.ForeignKey("properties.id"), nullable=False)
    tenant_id = db.Column(db.Integer, db.ForeignKey("tenants.id"), nullable=False)

    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    monthly_rent = db.Column(db.Numeric(10, 2), nullable=False)
    security_deposit = db.Column(db.Numeric(10, 2))
    status = db.Column(db.String(20), default="active")  # active | ended | terminated
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    payments = db.relationship("RentPayment", backref="lease", lazy=True, cascade="all, delete-orphan")

    @property
    def days_remaining(self):
        delta = self.end_date - date.today()
        return max(delta.days, 0)

    def to_dict(self):
        return {
            "id": self.id,
            "property_id": self.property_id,
            "tenant_id": self.tenant_id,
            "start_date": self.start_date.isoformat(),
            "end_date": self.end_date.isoformat(),
            "monthly_rent": float(self.monthly_rent),
            "security_deposit": float(self.security_deposit) if self.security_deposit else None,
            "status": self.status,
            "days_remaining": self.days_remaining,
        }
