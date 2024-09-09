import { FC, ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store/store.ts';

interface Props {
    children: ReactNode;
}

const StoreProvider: FC<Props> = ({ children }) => {
    return <Provider store={store}>{children}</Provider>;
};

export default StoreProvider;
