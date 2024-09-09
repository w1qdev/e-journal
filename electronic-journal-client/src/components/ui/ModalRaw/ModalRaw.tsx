import { Modal, ModalProps } from 'antd';
import { FC } from 'react';

export const ModalRaw: FC<ModalProps> = ({ children, ...props }) => {
    return (
        <Modal destroyOnClose styles={{ body: { marginTop: 30 } }} footer={null} {...props}>
            {children}
        </Modal>
    );
};
