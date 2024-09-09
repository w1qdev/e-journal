import { RouterProvider } from 'react-router-dom';
import { routes } from '@/router/routes.tsx';
import { useCheckoutQuery } from '@/api/user.api.ts';
import { FullscreenLoading } from '@/components/ui/FullscreenLoading/FullscreenLoading.tsx';

const App = () => {
    const { isLoading } = useCheckoutQuery(null);
    return isLoading ? <FullscreenLoading /> : <RouterProvider router={routes} />;
};

export default App;
