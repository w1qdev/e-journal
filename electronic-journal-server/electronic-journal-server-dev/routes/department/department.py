from flask import Blueprint, request, jsonify, Response
from webargs import flaskparser

from decorators import login_required, role_required
from .fields import department_add_model, department_edit_model, department_remove_model
from service import department_service


department_router = Blueprint('department', __name__)


@department_router.put('/department')
@login_required
@role_required(['ADMIN'])
def add(user):
    data = flaskparser.parser.parse(department_add_model, request)
    department = department_service.add(data['name'], data['president_id'])
    return jsonify(department)


@department_router.patch('/department')
@login_required
@role_required(['ADMIN'])
def edit(user):
    data = flaskparser.parser.parse(department_edit_model, request)
    department = department_service.edit(data['department_id'], data['name'], data['president_id'])
    return jsonify(department)


@department_router.delete('/department')
@login_required
@role_required(['ADMIN'])
def remove(user):
    data = flaskparser.parser.parse(department_remove_model, request)
    department_service.remove(data['department_id'])
    return Response(status=204)


@department_router.get('/department')
def get_departments():
    departments = department_service.get_departments()
    return jsonify(departments)


@department_router.get('/department/<department_id>')
def get_department(department_id):
    department = department_service.get_department(department_id)
    return jsonify(department)
