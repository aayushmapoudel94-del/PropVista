from datetime import datetime
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.extensions import db
from app.models.lease import Lease
from app.models.property import Property

leases_bp = Blueprint("leases", __name__)


@leases_bp.route("", methods=["GET"])
@jwt_required()
def list_leases():
    leases = Lease.query.all()
    return jsonify([l.to_dict() for l in leases]), 200


@leases_bp.route("", methods=["POST"])
@jwt_required()
def create_lease():
    data = request.get_json() or {}
    required = ["property_id", "tenant_id", "start_date", "end_date", "monthly_rent"]
    missing = [f for f in required if f not in data]
    if missing:
        return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

    lease = Lease(
        property_id=data["property_id"],
        tenant_id=data["tenant_id"],
        start_date=datetime.strptime(data["start_date"], "%Y-%m-%d").date(),
        end_date=datetime.strptime(data["end_date"], "%Y-%m-%d").date(),
        monthly_rent=data["monthly_rent"],
        security_deposit=data.get("security_deposit"),
    )
    db.session.add(lease)

    # Mark property as occupied
    prop = Property.query.get(data["property_id"])
    if prop:
        prop.status = "occupied"

    db.session.commit()
    return jsonify(lease.to_dict()), 201


@leases_bp.route("/<int:lease_id>", methods=["PUT"])
@jwt_required()
def update_lease(lease_id):
    lease = Lease.query.get_or_404(lease_id)
    data = request.get_json() or {}
    for field in ["monthly_rent", "security_deposit", "status"]:
        if field in data:
            setattr(lease, field, data[field])
    if "end_date" in data:
        lease.end_date = datetime.strptime(data["end_date"], "%Y-%m-%d").date()
    db.session.commit()
    return jsonify(lease.to_dict()), 200
