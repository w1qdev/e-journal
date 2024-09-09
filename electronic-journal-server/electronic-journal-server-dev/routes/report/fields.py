from webargs import fields

report_add_model = {
    'schedule_param_id': fields.Number(required=True),
    'student_id': fields.Number(required=True),
    'value': fields.String(required=True),
}


report_edit_model = {
    'report_id': fields.Number(required=True),
    'student_id': fields.Number(required=True),
    'value': fields.String(required=True),
}

report_delete_model = {
    'report_id': fields.Number(required=True),
}
