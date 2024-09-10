import { Table } from 'antd';
import { useGetProfessionsQuery, useRemoveProfessionMutation } from '@/api/profession.api.ts';
import { useMemo, useState } from 'react';
import { getProfessionColumns } from './columns.tsx';
import { useModal } from '@/hooks/use-modal.ts';
import { Profession } from '@/types/profession.types.ts';
import { ModalRaw } from '@/components/ui/ModalRaw/ModalRaw.tsx';
import { ProfessionUpdateForm } from '@/components/forms/profession/ProfessionUpdateForm/ProfessionUpdateForm.tsx';

export const ProfessionsTable = () => {
    const { data, isFetching } = useGetProfessionsQuery(null);

    const [removeProfession, { isLoading: isRemoving }] = useRemoveProfessionMutation();

    const [profession, setProfession] = useState<Profession>();
    const [updateModalOpen, openUpdateModal, closeUpdateModal] = useModal();

    const dataSource = useMemo(() => {
        return data?.map((item) => ({ key: item.id, ...item }));
    }, [data]);

    const onUpdateHandler = (profession: Profession) => {
        setProfession(profession);
        openUpdateModal();
    };

    const onRemoveHandler = (profession: Profession) => {
        removeProfession(profession.id);
    };

    return (
        <>
            <Table
                columns={getProfessionColumns(onUpdateHandler, onRemoveHandler)}
                dataSource={dataSource}
                loading={isFetching || isRemoving}
                bordered
                scroll={{ x: 1000 }}
            />

            <ModalRaw
                title="Редактирование специальности"
                open={updateModalOpen}
                onCancel={closeUpdateModal}
                width={600}
            >
                <ProfessionUpdateForm profession={profession} onUpdated={closeUpdateModal} />
            </ModalRaw>
        </>
    );
};
