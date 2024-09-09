import {Button, Card, Space, Tag} from 'antd';
import { SchedulesTable } from '@/components/tables/SchedulesTable/SchedulesTable.tsx';
import { DownloadOutlined, PlusOutlined } from '@ant-design/icons';
import { ModalRaw } from '@/components/ui/ModalRaw/ModalRaw.tsx';
import { useModal } from '@/hooks/use-modal.ts';
import { ScheduleCreateForm } from '@/components/forms/schedule/ScheduleCreateForm/ScheduleCreateForm.tsx';
import { axiosInstance } from '@/api/axios.ts';
import { saveBlobToFile } from '@/utils/save-blob-to-file.ts';
import {message, notification} from "@/utils/ant-context.ts";
import {AxiosError} from "axios";
import {createElement, Fragment} from "react";
import {getErrorMessage} from "@/utils/get-error-message.ts";

export const SchedulesPage = () => {
    const [createModalOpen, openCreateModal, closeCreateModal] = useModal();

    const onDownload = async () => {
        try {
            message.open({
                type: 'loading',
                content: 'Генерация файла...',
                duration: 0
            });
            const { data } = await axiosInstance.get<Blob>('/schedule/urtk/download', {
                responseType: 'blob',
            });
            saveBlobToFile(data, 'Расписание');
        } catch (e) {
            const error = e as AxiosError
            const message = getErrorMessage(e);
            notification.open({
                message: createElement(Fragment, null, [
                    createElement(Tag, { color: 'error', bordered: false, key: 'status' }, [
                        message.status,
                    ]),
                    message.url,
                ]),
                description: `Ошибка генерации файла ${error}`,
                duration: 5,
            });
        }
        message.destroy()
    };

    return (
        <Card
            title="Расписание"
            extra={
                <Space>
                    <Button icon={<DownloadOutlined />} onClick={onDownload} />
                    <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
                        Добавить
                    </Button>
                </Space>
            }
        >
            <SchedulesTable />

            <ModalRaw
                title="Новое расписание"
                open={createModalOpen}
                onCancel={closeCreateModal}
                width={600}
            >
                <ScheduleCreateForm onCreated={closeCreateModal} />
            </ModalRaw>
        </Card>
    );
};
