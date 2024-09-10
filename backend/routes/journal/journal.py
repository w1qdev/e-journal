from flask import Blueprint, request, jsonify, Response
from webargs import flaskparser

from decorators import login_required, role_required
from .fields import journal_add_model, journal_edit_model, journal_delete_model
from service import journal_service


journal_router = Blueprint('journal', __name__)


@journal_router.put('/journal')
@login_required
@role_required(['ADMIN', 'TEACHER'])
def add(user):
    data = flaskparser.parser.parse(journal_add_model, request)
    journal = journal_service.add(data['schedule_param_id'], data['student_id'], data['rate'])
    return jsonify(journal)


@journal_router.patch('/journal')
@login_required
@role_required(['ADMIN', 'TEACHER'])
def edit(user):
    data = flaskparser.parser.parse(journal_edit_model, request)
    journal = journal_service.edit(data['journal_id'], data['student_id'], data['rate'])
    return jsonify(journal)


@journal_router.delete('/journal')
@login_required
@role_required(['ADMIN', 'TEACHER'])
def remove(user):
    data = flaskparser.parser.parse(journal_delete_model, request)
    journal_service.remove(data['journal_id'])
    return Response(status=204)


@journal_router.get('/journal')
@login_required
def get_journal(user):
    group_id = request.args.get('group_id')
    subject_id = request.args.get('subject_id')
    lesson_type = request.args.get('lesson_type')
    journal = journal_service.get_journal(group_id, subject_id, lesson_type)
    return jsonify(journal)
