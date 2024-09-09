from models import Subject
from exceptions import ApiError


def create(name: str, slug: str, code: str, teacher_id: int):
    subject = Subject(
        name=name,
        slug=slug,
        code=code,
        teacher=teacher_id
    )
    subject.save()

    return subject.get_dto()


def delete(subject_id: int):
    subject = Subject.delete().where(Subject.id == subject_id)
    subject.execute()


def edit(subject_id: int, name: str, slug: str, code: str, teacher_id: int):
    subject = Subject.get_or_none(Subject.id == subject_id)
    if not subject:
        raise ApiError.BadRequest('Предмет не найден')

    subject.name = name
    subject.slug = slug
    subject.code = code
    subject.teacher = teacher_id
    subject.save()

    return subject.get_dto()


def get_subjects():
    return [subject.get_dto() for subject in Subject.select().order_by(Subject.name.asc())]


def get_subject(subject_id: int):
    subject = Subject.get_or_none(id=subject_id)
    if not subject:
        raise ApiError.BadRequest('Предмет не найден')

    return subject.get_dto()
