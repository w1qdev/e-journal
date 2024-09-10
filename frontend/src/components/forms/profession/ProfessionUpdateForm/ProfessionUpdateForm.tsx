import { Button, Form, Input } from 'antd';
import { Profession } from '@/types/profession.types.ts';
import { FC } from 'react';
import { useUpdateProfessionMutation } from '@/api/profession.api.ts';
import { REQUIRED_RULE } from '@/constants/required-rule.ts';

interface ProfessionUpdateFormData {
    name: string;
    slug: string;
}

interface Props {
    profession?: Profession;
    onUpdated?: () => void;
}

export const ProfessionUpdateForm: FC<Props> = ({ profession, onUpdated }) => {
    const [updateProfession, { isLoading: isUpdating }] = useUpdateProfessionMutation();

    const onFinish = async (data: ProfessionUpdateFormData) => {
        if (!profession) return;
        await updateProfession({ profession_id: profession.id, ...data });
        onUpdated?.();
    };

    return (
        <Form
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            labelAlign="left"
            onFinish={onFinish}
            initialValues={{
                name: profession?.name,
                slug: profession?.slug,
            }}
        >
            <Form.Item name="name" label="Название" rules={[REQUIRED_RULE]}>
                <Input placeholder={'Название'}/>
            </Form.Item>
            <Form.Item name="slug" label="Краткое название" rules={[REQUIRED_RULE]}>
                <Input placeholder={'Краткое название'}/>
            </Form.Item>
            <Form.Item style={{ display: 'flex', justifyContent: 'right' }}>
                <Button htmlType="submit" loading={isUpdating} type="primary">
                    Сохранить
                </Button>
            </Form.Item>
        </Form>
    );
};
