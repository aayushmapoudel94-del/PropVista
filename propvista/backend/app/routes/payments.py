from datetime import date, datetime
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.extensions import db
from app.models.payment import RentPayment

payments_bp = Blueprint("payments", __name__)

LATE_FEE_RATE = 0.05  # 5% of amount due, applied once overdue


@payments_bp.route("", methods=["GET"])
@jwt_required()
def list_payments():
    payments = RentPayment.query.all()
    return jsonify([p.to_dict() for p in payments]), 200


@payments_bp.route("", methods=["POST"])
@jwt_required()
def create_payment():
    data = request.get_json() or {}
    required = ["lease_id", "due_date", "amount_due"]
    missing = [f for f in required if f not in data]
    if missing:
        return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

    payment = RentPayment(
        lease_id=data["lease_id"],
        due_date=datetime.strptime(data["due_date"], "%Y-%m-%d").date(),
        amount_due=data["amount_due"],
    )
    db.session.add(payment)
    db.session.commit()
    return jsonify(payment.to_dict()), 201


@payments_bp.route("/<int:payment_id>/pay", methods=["POST"])
@jwt_required()
def pay_rent(payment_id):
    payment = RentPayment.query.get_or_404(payment_id)
    data = request.get_json() or {}
    amount_paid = data.get("amount_paid", payment.amount_due)

    today = date.today()
    if today > payment.due_date and payment.status != "paid":
        payment.late_fee = round(float(payment.amount_due) * LATE_FEE_RATE, 2)

    payment.amount_paid = amount_paid
    payment.paid_date = today
    payment.status = "paid" if float(amount_paid) >= float(payment.amount_due) else "partial"

    db.session.commit()
    return jsonify(payment.to_dict()), 200
