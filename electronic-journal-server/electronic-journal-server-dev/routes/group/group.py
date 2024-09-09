from flask import Blueprint, request, jsonify, Response
from webargs import flaskparser
from decorators import login_required, role_required
from .fields import group_create_model, group_remove_model, group_edit_model
from service import group_service


group_router = Blueprint('group', __name__)


@group_router.put('/group')
@login_required
@role_required(['ADMIN', 'SCHEDULE_CREATOR'])
def create(user):
    data = flaskparser.parser.parse(group_create_model, request)
    group = group_service.create(data['name'], data['course'], data['profession_id'], data['tutor_id'])
    return jsonify(group)


@group_router.delete('/group')
@login_required
@role_required(['ADMIN', 'SCHEDULE_CREATOR'])
def remove(user):
    data = flaskparser.parser.parse(group_remove_model, request)
    group_service.remove(data['group_id'])
    return Response(status=204)


@group_router.patch('/group')
@login_required
@role_required(['ADMIN', 'SCHEDULE_CREATOR'])
def edit(user):
    data = flaskparser.parser.parse(group_edit_model, request)
    group = group_service.edit(data['group_id'], data['name'], data['course'], data['profession_id'], data['tutor_id'])
    return jsonify(group)


@group_router.get('/group')
def get_groups():
    groups = group_service.get_groups()
    return jsonify(groups)


@group_router.get('/group/<group_id>')
def get_group(group_id):
    group = group_service.get_group(group_id)
    return jsonify(group)


@group_router.get('/groups/urtk')
def get_urtk_groups():
    groups = group_service.get_urtk_groups()
    return jsonify(groups)
