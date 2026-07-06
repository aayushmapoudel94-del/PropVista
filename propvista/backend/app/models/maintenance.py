from datetime import datetime
from app.extensions import db


class MaintenanceRequest(db.Model):
    __tablename__ = "maintenance_requests"

    id = db.Column(db.Integer, primary_key=True)
    property_id = db.Column(db.Integer, db.ForeignKey("properties.id"), nullable=False)

    category = db.Column(db.String(60), nullable=False)  # plumbing, electrical, etc.
    description = db.Column(db.Text)
    cost = db.Column(db.Numeric(10, 2), default=0)
    status = db.Column(db.String(20), default="open")  # open | in_progress | resolved
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    resolved_at = db.Column(db.DateTime, nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "property_id": self.property_id,
            "category": self.category,
            "description": self.description,
            "cost": float(self.cost or 0),
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "resolved_at": self.resolved_at.isoformat() if self.resolved_at else None,
        }
