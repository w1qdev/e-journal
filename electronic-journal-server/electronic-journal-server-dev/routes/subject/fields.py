from webargs import fields


create_subjects_model = {
    'name': fields.String(required=True),
    'slug': fields.String(required=True),
    'code': fields.String(required=True),
    'teacher_id': fields.Number(required=False, load_default=None),
}

delete_subjects_model = {
    'subject_id': fields.Number(required=True),
}

edit_subjects_model = {
    'subject_id': fields.Number(required=True),
    'name': fields.String(required=True),
    'slug': fields.String(required=True),
    'code': fields.String(required=True),
    'teacher_id': fields.Number(required=False, load_default=None),
}
