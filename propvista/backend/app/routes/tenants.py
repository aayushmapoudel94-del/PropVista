from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.extensions import db
from app.models.tenant import Tenant

tenants_bp = Blueprint("tenants", __name__)


@tenants_bp.route("", methods=["GET"])
@jwt_required()
def list_tenants():
    tenants = Tenant.query.all()
    return jsonify([t.to_dict() for t in tenants]), 200


@tenants_bp.route("", methods=["POST"])
@jwt_required()
def create_tenant():
    data = request.get_json() or {}
    if not data.get("full_name"):
        return jsonify({"error": "full_name is required"}), 400

    tenant = Tenant(full_name=data["full_name"], email=data.get("email"), phone=data.get("phone"))
    db.session.add(tenant)
    db.session.commit()
    return jsonify(tenant.to_dict()), 201


@tenants_bp.route("/<int:tenant_id>", methods=["PUT"])
@jwt_required()
def update_tenant(tenant_id):
    tenant = Tenant.query.get_or_404(tenant_id)
    data = request.get_json() or {}
    for field in ["full_name", "email", "phone"]:
        if field in data:
            setattr(tenant, field, data[field])
    db.session.commit()
    return jsonify(tenant.to_dict()), 200


@tenants_bp.route("/<int:tenant_id>", methods=["DELETE"])
@jwt_required()
def delete_tenant(tenant_id):
    tenant = Tenant.query.get_or_404(tenant_id)
    db.session.delete(tenant)
    db.session.commit()
    return jsonify({"message": "Tenant deleted"}), 200
