import { Button, Form, Input } from 'antd';
import { FC } from 'react';
import { useCreateProfessionMutation } from '@/api/profession.api.ts';
import { REQUIRED_RULE } from '@/constants/required-rule.ts';

interface ProfessionCreateFormData {
    name: string;
    slug: string;
}

interface Props {
    onCreated?: () => void;
}

export const ProfessionCreateForm: FC<Props> = ({ onCreated }) => {
    const [createProfession, { isLoading: isCreating }] = useCreateProfessionMutation();

    const onFinish = async (data: ProfessionCreateFormData) => {
        await createProfession(data);
        onCreated?.();
    };

    return (
        <Form
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            labelAlign="left"
            onFinish={onFinish}
        >
            <Form.Item name="name" label="Название" rules={[REQUIRED_RULE]}>
                <Input placeholder={'Название'}/>
            </Form.Item>
            <Form.Item name="slug" label="Краткое название" rules={[REQUIRED_RULE]}>
                <Input placeholder={'Краткое название'}/>
            </Form.Item>
            <Form.Item style={{ display: 'flex', justifyContent: 'right' }}>
                <Button htmlType="submit" loading={isCreating} type="primary">
                    Создать
                </Button>
            </Form.Item>
        </Form>
    );
};
