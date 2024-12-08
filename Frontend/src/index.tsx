import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Layout } from './Components/LayoutArea/Layout/Layout';
import './index.css';
import { interceptor } from './Utils/Interceptor';
import { notify } from './Utils/Notify';
import { Provider } from 'react-redux';
import { store } from './Redux/Store';
import { ThemeProvider } from '@emotion/react';
import theme from './Utils/theme';
import { CssBaseline } from '@mui/material';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

(async () => {
    try { interceptor.registerInterceptor(); }
    catch (err) { notify.error(err) }
})();


root.render(
    <ThemeProvider theme={theme}>
        <CssBaseline /> 
        <Provider store={store}>
            <BrowserRouter>
                <Layout />
            </BrowserRouter>
        </Provider>
    </ThemeProvider>
);
