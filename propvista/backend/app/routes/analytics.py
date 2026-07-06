from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import func
from app.extensions import db
from app.models.property import Property
from app.models.maintenance import MaintenanceRequest
from app.models.lease import Lease

analytics_bp = Blueprint("analytics", __name__)


@analytics_bp.route("/dashboard", methods=["GET"])
@jwt_required()
def dashboard():
    owner_id = int(get_jwt_identity())

    total_properties = Property.query.filter_by(owner_id=owner_id).count()
    occupied = Property.query.filter_by(owner_id=owner_id, status="occupied").count()
    vacant = total_properties - occupied

    monthly_income = (
        db.session.query(func.coalesce(func.sum(Property.rental_amount), 0))
        .filter(Property.owner_id == owner_id, Property.status == "occupied")
        .scalar()
    )

    maintenance_total = (
        db.session.query(func.coalesce(func.sum(MaintenanceRequest.cost), 0))
        .join(Property, Property.id == MaintenanceRequest.property_id)
        .filter(Property.owner_id == owner_id)
        .scalar()
    )

    occupancy_rate = (occupied / total_properties * 100) if total_properties else 0

    return jsonify({
        "total_properties": total_properties,
        "occupied_properties": occupied,
        "vacant_properties": vacant,
        "occupancy_rate": round(occupancy_rate, 2),
        "monthly_rental_income": float(monthly_income),
        "annual_rental_income": float(monthly_income) * 12,
        "total_maintenance_expenses": float(maintenance_total),
    }), 200


@analytics_bp.route("/roi/<int:property_id>", methods=["GET"])
@jwt_required()
def roi_forecast(property_id):
    """
    Simple ROI projection over 5/10/15 years.
    Query params (optional overrides): inflation, appreciation, tax_rate
    """
    prop = Property.query.get_or_404(property_id)

    inflation = float(request.args.get("inflation", 0.03))       # 3% default
    appreciation = float(request.args.get("appreciation", 0.04))  # 4% default
    tax_rate = float(request.args.get("tax_rate", 0.01))          # 1% property tax

    purchase_price = float(prop.purchase_price)
    annual_rent = float(prop.rental_amount) * 12

    # historical maintenance average for this property
    avg_maintenance = (
        db.session.query(func.coalesce(func.avg(MaintenanceRequest.cost), 0))
        .filter(MaintenanceRequest.property_id == property_id)
        .scalar()
    )
    avg_maintenance = float(avg_maintenance)

    results = {}
    for years in (5, 10, 15):
        total_rent = 0.0
        total_expenses = 0.0
        rent = annual_rent
        maintenance = avg_maintenance if avg_maintenance else annual_rent * 0.05

        for _ in range(years):
            total_rent += rent
            property_tax = purchase_price * tax_rate
            total_expenses += maintenance + property_tax
            rent *= (1 + inflation)          # rent grows with inflation
            maintenance *= (1 + inflation)   # costs grow with inflation

        future_value = purchase_price * ((1 + appreciation) ** years)
        appreciation_gain = future_value - purchase_price

        net_profit = total_rent - total_expenses + appreciation_gain
        roi_percent = (net_profit / purchase_price) * 100 if purchase_price else 0

        results[f"{years}_years"] = {
            "projected_rental_income": round(total_rent, 2),
            "projected_expenses": round(total_expenses, 2),
            "projected_appreciation_gain": round(appreciation_gain, 2),
            "projected_net_profit": round(net_profit, 2),
            "estimated_roi_percent": round(roi_percent, 2),
        }

    return jsonify({
        "property_id": property_id,
        "assumptions": {
            "inflation_rate": inflation,
            "appreciation_rate": appreciation,
            "property_tax_rate": tax_rate,
        },
        "projections": results,
    }), 200