from webargs import fields


group_subjects_add_model = {
    'group_id': fields.Number(required=True),
    'subject_id': fields.Number(required=True),
}

group_subjects_remove_model = {
    **group_subjects_add_model
}
