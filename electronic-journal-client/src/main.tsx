import ReactDOM from 'react-dom/client';
import AntProvider from '@/providers/ant/AntProvider.tsx';
import StoreProvider from '@/providers/store/StoreProvider.tsx';
import App from './App.tsx';
import './index.css';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';

dayjs.locale('ru');

ReactDOM.createRoot(document.getElementById('root')!).render(
    <StoreProvider>
        <AntProvider>
            <App />
        </AntProvider>
    </StoreProvider>,
);
