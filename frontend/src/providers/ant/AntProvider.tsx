import { AntGlobalAppContext } from '@/providers/ant/AntGlobalAppContext.tsx';
import { FC, ReactNode, useMemo } from 'react';
import { App, ConfigProvider, theme as antTheme } from 'antd';
import ruRu from 'antd/locale/ru_RU';
import { useAppSelector } from '@/hooks/use-store.ts';
import { selectCompact, selectTheme } from '@/store/features/theme/theme.selectros.ts';

interface Props {
    children: ReactNode;
}

const AntProvider: FC<Props> = ({ children }) => {
    const theme = useAppSelector(selectTheme);
    const compact = useAppSelector(selectCompact);

    const algorithm = useMemo(() => {
        const algorithms = [theme === 'dark' ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm];
        if (compact) algorithms.push(antTheme.compactAlgorithm);
        return algorithms;
    }, [theme, compact]);

    return (
        <ConfigProvider
            theme={{
                algorithm: algorithm,
            }}
            locale={ruRu}
        >
            <App>
                <AntGlobalAppContext />
                {children}
            </App>
        </ConfigProvider>
    );
};

export default AntProvider;
