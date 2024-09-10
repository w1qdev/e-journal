from flask import Response, request, Blueprint, jsonify, send_file
from webargs import flaskparser
from decorators import login_required, role_required
from service import schedule_service
from .fields import create_schedule_model, remove_schedule_model, edit_schedule_model, change_visibility_model


schedule_router = Blueprint('schedule', __name__)


@schedule_router.put('/schedule')
@login_required
@role_required(['ADMIN', 'SCHEDULE_CREATOR'])
def create(user):
    data = flaskparser.parser.parse(create_schedule_model, request)
    schedule = schedule_service.create(data['date'])
    return jsonify(schedule)


@schedule_router.delete('/schedule')
@login_required
@role_required(['ADMIN', 'SCHEDULE_CREATOR'])
def remove(user):
    data = flaskparser.parser.parse(remove_schedule_model, request)
    schedule_service.remove(data['schedule_id'])
    return Response(status=204)


@schedule_router.patch('/schedule')
@login_required
@role_required(['ADMIN', 'SCHEDULE_CREATOR'])
def edit(user):
    data = flaskparser.parser.parse(edit_schedule_model, request)
    schedule = schedule_service.edit(data['schedule_id'], data['date'])
    return jsonify(schedule)


@schedule_router.get('/schedule')
def get_schedules():
    schedules = schedule_service.get_schedules()
    return jsonify(schedules)


@schedule_router.get('/schedule/<schedule_id>')
def get_schedule(schedule_id):
    schedule = schedule_service.get_schedule(schedule_id)
    return jsonify(schedule)


@schedule_router.patch('/schedule/change_visibility')
@login_required
@role_required(['ADMIN', 'SCHEDULE_CREATOR'])
def change_visibility(user):
    data = flaskparser.parser.parse(change_visibility_model, request)
    schedule = schedule_service.change_visibility(data['schedule_id'], data['visible'])
    return jsonify(schedule)


@schedule_router.get('/schedule/urtk/download')
def urtk_schedules_download():
    file_stream, document_name = schedule_service.urtk_schedules_download()
    return send_file(file_stream, as_attachment=True, download_name=document_name)


@schedule_router.get('/schedule/group/<group_id>')
def get_group_schedule(group_id):
    schedule = schedule_service.get_group_schedule(group_id)
    return jsonify(schedule)


@schedule_router.get('/schedule/date/<date_start>-<date_end>')
@login_required
@role_required(['ADMIN', 'TEACHER'])
def get_teacher_schedule(user, date_start, date_end):
    schedule = schedule_service.get_teacher_schedule(user, date_start, date_end)
    return jsonify(schedule)
