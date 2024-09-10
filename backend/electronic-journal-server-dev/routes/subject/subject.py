from flask import Blueprint, request, jsonify, Response
from webargs import flaskparser

from decorators import login_required, role_required
from .fields import create_subjects_model, delete_subjects_model, edit_subjects_model
from service import subject_service

subject_router = Blueprint('subject', __name__)


@subject_router.put('/subject')
@login_required
@role_required(['ADMIN', 'SCHEDULE_CREATOR'])
def create(user):
    data = flaskparser.parser.parse(create_subjects_model, request)
    level = subject_service.create(data['name'], data['slug'], data['code'], data['teacher_id'])
    return jsonify(level)


@subject_router.delete('/subject')
@login_required
@role_required(['ADMIN', 'SCHEDULE_CREATOR'])
def remove(user):
    data = flaskparser.parser.parse(delete_subjects_model, request)
    subject_service.delete(data['subject_id'])
    return Response(status=204)


@subject_router.patch('/subject')
@login_required
@role_required(['ADMIN', 'SCHEDULE_CREATOR'])
def edit(user):
    data = flaskparser.parser.parse(edit_subjects_model, request)
    level = subject_service.edit(data['subject_id'], data['name'], data['slug'], data['code'], data['teacher_id'])
    return jsonify(level)


@subject_router.get('/subject')
def get_subjects():
    subjects = subject_service.get_subjects()
    return jsonify(subjects)


@subject_router.get('/subject/<subject_id>')
def get_subject(subject_id):
    subject = subject_service.get_subject(subject_id)
    return jsonify(subject)

