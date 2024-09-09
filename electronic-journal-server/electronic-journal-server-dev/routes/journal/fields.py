from webargs import fields

journal_add_model = {
    'schedule_param_id': fields.Number(required=True),
    'student_id': fields.Number(required=True),
    'rate': fields.String(required=True),
}


journal_edit_model = {
    'journal_id': fields.Number(required=True),
    'student_id': fields.Number(required=True),
    'rate': fields.String(required=True),
}

journal_delete_model = {
    'journal_id': fields.Number(required=True),
}
