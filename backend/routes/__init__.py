from .user import user
from .subject import subject
from .group import group
from .department import department
from .group_subjects import group_subjects
from .role import role
from .profession import profession
from .schedule import schedule
from .schedule_param import schedule_param
from .journal import journal
from .report import report

routes = [
    user.user_router,
    subject.subject_router,
    group.group_router,
    department.department_router,
    group_subjects.group_subjects_router,
    role.role_router,
    profession.profession_router,
    schedule.schedule_router,
    schedule_param.schedule_param_router,
    journal.journal_router,
    report.report_router,
]
