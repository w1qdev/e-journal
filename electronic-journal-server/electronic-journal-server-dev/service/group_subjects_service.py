from models import GroupSubject


def add(group_id: int, subject_id: int):
    group_subject = GroupSubject(group=group_id, subject_id=subject_id)
    group_subject.save()

    return group_subject.get_dto()


def remove(group_id: int, subject_id: int):
    group_subject = GroupSubject.delete().where(GroupSubject.group == group_id,
                                                GroupSubject.subject == subject_id)
    group_subject.execute()
    return


def get_groups_subjects():
    return [groups_subject.get_dto() for groups_subject in GroupSubject.select()]
