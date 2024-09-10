from flask import Blueprint, jsonify
from decorators import login_required
from service import role_service

role_router = Blueprint('role', __name__)


@role_router.get('/role')
@login_required
def get_roles(user):
    roles = role_service.get_roles()
    return jsonify(roles)


@role_router.get('/role/<slug>')
@login_required
def get_role(user, slug):
    role = role_service.get_role(slug)
    return jsonify(role)
