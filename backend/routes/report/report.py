from flask import Blueprint, request, jsonify, Response
from webargs import flaskparser

from decorators import login_required, role_required
from .fields import report_add_model, report_edit_model, report_delete_model
from service import report_service


report_router = Blueprint('report', __name__)


@report_router.put('/report')
@login_required
@role_required(['ADMIN', 'TEACHER'])
def add(user):
    data = flaskparser.parser.parse(report_add_model, request)
    journal = report_service.add(data['schedule_param_id'], data['student_id'], data['value'])
    return jsonify(journal)


@report_router.patch('/report')
@login_required
@role_required(['ADMIN', 'TEACHER'])
def edit(user):
    data = flaskparser.parser.parse(report_edit_model, request)
    journal = report_service.edit(data['report_id'], data['student_id'], data['value'])
    return jsonify(journal)


@report_router.delete('/report')
@login_required
@role_required(['ADMIN', 'TEACHER'])
def remove(user):
    data = flaskparser.parser.parse(report_delete_model, request)
    report_service.remove(data['report_id'])
    return Response(status=204)


@report_router.get('/report/date/<date_start>-<date_end>')
@login_required
def get_report(user, date_start, date_end):
    group_id = request.args.get('group_id')
    report = report_service.get_report(group_id, date_start, date_end)
    return jsonify(report)
