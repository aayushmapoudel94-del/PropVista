from datetime import datetime
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.extensions import db
from app.models.maintenance import MaintenanceRequest

maintenance_bp = Blueprint("maintenance", __name__)


@maintenance_bp.route("", methods=["GET"])
@jwt_required()
def list_requests():
    requests_ = MaintenanceRequest.query.all()
    return jsonify([r.to_dict() for r in requests_]), 200


@maintenance_bp.route("", methods=["POST"])
@jwt_required()
def create_request():
    data = request.get_json() or {}
    if not data.get("property_id") or not data.get("category"):
        return jsonify({"error": "property_id and category are required"}), 400

    req = MaintenanceRequest(
        property_id=data["property_id"],
        category=data["category"],
        description=data.get("description"),
        cost=data.get("cost", 0),
    )
    db.session.add(req)
    db.session.commit()
    return jsonify(req.to_dict()), 201


@maintenance_bp.route("/<int:request_id>", methods=["PUT"])
@jwt_required()
def update_request(request_id):
    req = MaintenanceRequest.query.get_or_404(request_id)
    data = request.get_json() or {}
    for field in ["category", "description", "cost", "status"]:
        if field in data:
            setattr(req, field, data[field])
    if data.get("status") == "resolved":
        req.resolved_at = datetime.utcnow()
    db.session.commit()
    return jsonify(req.to_dict()), 200
