from flask import Flask
from app.config import Config
from app.extensions import db, migrate, jwt, cors


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Init extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    cors.init_app(app, resources={r"/api/*": {"origins": "*"}})

    # Import models so Flask-Migrate can detect them
    from app.models import user, property, tenant, lease, payment, maintenance  # noqa

    # Register blueprints
    from app.routes.auth import auth_bp
    from app.routes.properties import properties_bp
    from app.routes.tenants import tenants_bp
    from app.routes.leases import leases_bp
    from app.routes.payments import payments_bp
    from app.routes.maintenance import maintenance_bp
    from app.routes.analytics import analytics_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(properties_bp, url_prefix="/api/properties")
    app.register_blueprint(tenants_bp, url_prefix="/api/tenants")
    app.register_blueprint(leases_bp, url_prefix="/api/leases")
    app.register_blueprint(payments_bp, url_prefix="/api/payments")
    app.register_blueprint(maintenance_bp, url_prefix="/api/maintenance")
    app.register_blueprint(analytics_bp, url_prefix="/api/analytics")

    @app.route("/api/health")
    def health():
        return {"status": "ok", "message": "PropVista API running"}

    return app
