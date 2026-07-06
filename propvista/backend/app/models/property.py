from datetime import datetime
from app.extensions import db


class Property(db.Model):
    __tablename__ = "properties"

    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    address = db.Column(db.String(255), nullable=False)
    city = db.Column(db.String(100))
    purchase_price = db.Column(db.Numeric(12, 2), nullable=False)
    current_value = db.Column(db.Numeric(12, 2))
    rental_amount = db.Column(db.Numeric(10, 2), nullable=False)
    status = db.Column(db.String(20), default="vacant")  # vacant | occupied
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    leases = db.relationship("Lease", backref="property", lazy=True, cascade="all, delete-orphan")
    maintenance_requests = db.relationship("MaintenanceRequest", backref="property", lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "owner_id": self.owner_id,
            "address": self.address,
            "city": self.city,
            "purchase_price": float(self.purchase_price) if self.purchase_price is not None else None,
            "current_value": float(self.current_value) if self.current_value is not None else None,
            "rental_amount": float(self.rental_amount) if self.rental_amount is not None else None,
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
