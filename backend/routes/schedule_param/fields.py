from webargs import fields


schedule_param_add_model = {
    'schedule_id': fields.Number(required=True),
    'group_id': fields.Number(required=True),
    'sub_group': fields.String(required=False, load_default=None),
    'subject_id': fields.Number(required=True),
    'first_half': fields.String(required=False, load_default=None),
    'number': fields.Number(required=True),
    'office': fields.String(required=False, load_default=None)
}

schedule_param_add_certification_model = {
    'schedule_id': fields.Number(required=True),
    'group_id': fields.Number(required=True),
    'subject_id': fields.Number(required=True),
    'certification_period': fields.String(required=True)
}

schedule_param_remove_model = {
    'param_id': fields.Number(required=True),
}

schedule_param_edit_model = {
    'param_id': fields.Number(required=True),
    'subject_id': fields.Number(required=True),
    'sub_group': fields.String(required=False, load_default=None),
    'first_half': fields.String(required=False, load_default=None),
    'office': fields.String(required=False, load_default=None),
    'lesson_type': fields.String(required=False, load_default=None),
    'lesson_code': fields.String(required=False, load_default=None),
    'topic': fields.String(required=False, load_default=None),
    'homework': fields.String(required=False, load_default=None),
    'end_date': fields.DateTime(required=False, load_default=None),
}
