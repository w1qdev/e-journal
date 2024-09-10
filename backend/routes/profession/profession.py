from flask import Blueprint, request, jsonify, Response
from webargs import flaskparser

from decorators import login_required, role_required
from .fields import profession_add_model, profession_edit_model, profession_remove_model
from service import profession_service


profession_router = Blueprint('profession', __name__)


@profession_router.put('/profession')
@login_required
@role_required(['ADMIN'])
def add(user):
    data = flaskparser.parser.parse(profession_add_model, request)
    profession = profession_service.add(data['name'], data['slug'])
    return jsonify(profession)


@profession_router.patch('/profession')
@login_required
@role_required(['ADMIN'])
def edit(user):
    data = flaskparser.parser.parse(profession_edit_model, request)
    profession = profession_service.edit(data['profession_id'], data['name'], data['slug'])
    return jsonify(profession)


@profession_router.delete('/profession')
@login_required
@role_required(['ADMIN'])
def remove(user):
    data = flaskparser.parser.parse(profession_remove_model, request)
    profession_service.remove(data['profession_id'])
    return Response(status=204)


@profession_router.get('/profession')
def get_departments():
    professions = profession_service.get_professions()
    return jsonify(professions)


@profession_router.get('/profession/<profession_id>')
def get_department(profession_id):
    profession = profession_service.get_profession(profession_id)
    return jsonify(profession)
