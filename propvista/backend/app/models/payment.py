from datetime import datetime
from app.extensions import db


class RentPayment(db.Model):
    __tablename__ = "rent_payments"

    id = db.Column(db.Integer, primary_key=True)
    lease_id = db.Column(db.Integer, db.ForeignKey("leases.id"), nullable=False)

    due_date = db.Column(db.Date, nullable=False)
    amount_due = db.Column(db.Numeric(10, 2), nullable=False)
    amount_paid = db.Column(db.Numeric(10, 2), default=0)
    paid_date = db.Column(db.Date, nullable=True)
    late_fee = db.Column(db.Numeric(10, 2), default=0)
    status = db.Column(db.String(20), default="unpaid")  # unpaid | paid | partial
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "lease_id": self.lease_id,
            "due_date": self.due_date.isoformat(),
            "amount_due": float(self.amount_due),
            "amount_paid": float(self.amount_paid or 0),
            "paid_date": self.paid_date.isoformat() if self.paid_date else None,
            "late_fee": float(self.late_fee or 0),
            "status": self.status,
        }
