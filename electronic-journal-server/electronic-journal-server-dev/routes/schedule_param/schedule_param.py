from flask import Blueprint, request, jsonify, Response
from service import schedule_param_service
from webargs import flaskparser
from decorators import login_required, role_required
from .fields import (schedule_param_add_model, schedule_param_remove_model, schedule_param_edit_model,
                     schedule_param_add_certification_model)


schedule_param_router = Blueprint('schedule_param', __name__)


@schedule_param_router.put('/schedule_param')
@login_required
@role_required(['ADMIN', 'SCHEDULE_CREATOR'])
def add(user):
    data = flaskparser.parser.parse(schedule_param_add_model, request)
    schedule_param = schedule_param_service.add(data['schedule_id'], data['group_id'], data['sub_group'],
                                                data['subject_id'], data['first_half'], data['number'], data['office'])
    return jsonify(schedule_param)


@schedule_param_router.put('/schedule_param/certification')
@login_required
@role_required(['ADMIN', 'TEACHER'])
def add_certification(user):
    data = flaskparser.parser.parse(schedule_param_add_certification_model, request)
    schedule_param = schedule_param_service.add_certification(data['schedule_id'], data['group_id'], data['subject_id'],
                                                              data['certification_period'])
    return jsonify(schedule_param)


@schedule_param_router.patch('/schedule_param')
@login_required
@role_required(['ADMIN', 'SCHEDULE_CREATOR', 'TEACHER'])
def edit(user):
    data = flaskparser.parser.parse(schedule_param_edit_model, request)
    schedule_param = schedule_param_service.edit(data['param_id'], data['subject_id'], data['sub_group'],
                                                 data['first_half'], data['office'], data['lesson_type'],
                                                 data['lesson_code'], data['topic'], data['homework'], data['end_date'])
    return jsonify(schedule_param)


@schedule_param_router.delete('/schedule_param')
@login_required
@role_required(['ADMIN', 'SCHEDULE_CREATOR', 'TEACHER'])
def remove(user):
    data = flaskparser.parser.parse(schedule_param_remove_model, request)
    schedule_param_service.remove(user.role.slug, data['param_id'])
    return Response(status=204)


@schedule_param_router.get('/schedule_param/<schedule_param_id>')
@login_required
def by_id(user, schedule_param_id):
    schedule_param = schedule_param_service.by_id(schedule_param_id)
    return jsonify(schedule_param)
