import { Table } from 'antd';
import { useGetSubjectsQuery, useRemoveSubjectMutation } from '@/api/subject.api.ts';
import { useMemo, useState } from 'react';
import { Subject } from '@/types/subject.types.ts';
import { useModal } from '@/hooks/use-modal.ts';
import { getSubjectColumns } from './columns.tsx';
import { ModalRaw } from '@/components/ui/ModalRaw/ModalRaw.tsx';
import { SubjectUpdateForm } from '@/components/forms/subject/SubjectUpdateForm/SubjectUpdateForm.tsx';

export const SubjectsTable = () => {
    const { data, isFetching } = useGetSubjectsQuery(null);
    const [removeSubject, { isLoading: isRemoving }] = useRemoveSubjectMutation();

    const [subject, setSubject] = useState<Subject>();
    const [updateModalOpen, openUpdateModal, closeUpdateModal] = useModal();

    const dataSource = useMemo(() => {
        return data?.map((item) => ({ key: item.id, ...item }));
    }, [data]);

    const onUpdateHandler = (subject: Subject) => {
        setSubject(subject);
        openUpdateModal();
    };

    const onRemoveHandler = (subject: Subject) => {
        removeSubject(subject.id);
    };

    return (
        <>
            <Table
                columns={getSubjectColumns(onUpdateHandler, onRemoveHandler)}
                dataSource={dataSource}
                loading={isFetching || isRemoving}
                bordered
                scroll={{ x: 1000 }}
            />

            <ModalRaw
                title="Редактирование предмета"
                open={updateModalOpen}
                onCancel={closeUpdateModal}
                width={600}
            >
                <SubjectUpdateForm subject={subject} onUpdated={closeUpdateModal} />
            </ModalRaw>
        </>
    );
};
