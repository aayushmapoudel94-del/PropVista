from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.property import Property

properties_bp = Blueprint("properties", __name__)


@properties_bp.route("", methods=["GET"])
@jwt_required()
def list_properties():
    owner_id = int(get_jwt_identity())
    props = Property.query.filter_by(owner_id=owner_id).all()
    return jsonify([p.to_dict() for p in props]), 200


@properties_bp.route("", methods=["POST"])
@jwt_required()
def create_property():
    owner_id = int(get_jwt_identity())
    data = request.get_json() or {}

    required = ["address", "purchase_price", "rental_amount"]
    missing = [f for f in required if f not in data]
    if missing:
        return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

    prop = Property(
        owner_id=owner_id,
        address=data["address"],
        city=data.get("city"),
        purchase_price=data["purchase_price"],
        current_value=data.get("current_value"),
        rental_amount=data["rental_amount"],
        status=data.get("status", "vacant"),
    )
    db.session.add(prop)
    db.session.commit()
    return jsonify(prop.to_dict()), 201


@properties_bp.route("/<int:property_id>", methods=["GET"])
@jwt_required()
def get_property(property_id):
    prop = Property.query.get_or_404(property_id)
    return jsonify(prop.to_dict()), 200


@properties_bp.route("/<int:property_id>", methods=["PUT"])
@jwt_required()
def update_property(property_id):
    prop = Property.query.get_or_404(property_id)
    data = request.get_json() or {}

    for field in ["address", "city", "purchase_price", "current_value", "rental_amount", "status"]:
        if field in data:
            setattr(prop, field, data[field])

    db.session.commit()
    return jsonify(prop.to_dict()), 200


@properties_bp.route("/<int:property_id>", methods=["DELETE"])
@jwt_required()
def delete_property(property_id):
    prop = Property.query.get_or_404(property_id)
    db.session.delete(prop)
    db.session.commit()
    return jsonify({"message": "Property deleted"}), 200