import style from './FullscreenLoading.module.css';
import { LoadingOutlined } from '@ant-design/icons';

export const FullscreenLoading = () => {
    return (
        <div className={style.loader}>
            <LoadingOutlined />
        </div>
    );
};
