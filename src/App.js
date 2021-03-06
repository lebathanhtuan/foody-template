import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Router, Switch } from "react-router-dom";
import { ThemeProvider } from 'styled-components';
import { I18nextProvider } from 'react-i18next';
import jwtDecode from "jwt-decode";

import history from './utils/history';
import i18n from './utils/locales/i18n';

import DefaultLayout from './layouts/DefaultLayout';
import AdminLayout from './layouts/AdminLayout';
import FullLayout from './layouts/FullLayout';

import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import NotFoundPage from './pages/NotFound';

import HomePage from './pages/user/Home';
import AboutPage from './pages/user/About';
import StoreDetailPage from './pages/user/StoreDetail';
import CartPage from './pages/user/Cart';
import CheckoutPage from './pages/user/Checkout';

import DashboardPage from './pages/admin/Dashboard';
import StoreListPage from './pages/admin/StoreList';
import ModifyStorePage from './pages/admin/ModifyStore';
import CategoryListPage from './pages/admin/CategoryList';

import {
  getUserInfoAction,
} from './redux/actions'

import { lightTheme, darkTheme } from './styles/themes';

import './App.css';
import 'antd/dist/antd.css';
import 'suneditor/dist/css/suneditor.min.css';
import './styles/suneditor.custom.css'

const THEME = {
  light: lightTheme,
  dark: darkTheme,
}

function App(props) {
  const { theme } = useSelector((state) => state.commonReducer);

  const dispatch = useDispatch();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo) {
      const decodedUserInfo = jwtDecode(userInfo.accessToken);
      dispatch(getUserInfoAction({ id: decodedUserInfo.sub }));
    }
  }, []);

  return (
    <ThemeProvider theme={THEME[theme]}>
      <I18nextProvider i18n={i18n}>
        <Router history={history}>
          <Switch>
            <DefaultLayout exact path="/" component={HomePage} />
            <DefaultLayout exact path="/about" component={AboutPage} />
            <DefaultLayout exact path="/store/:id" component={StoreDetailPage} />
            <DefaultLayout exact path="/cart" component={CartPage} />
            <DefaultLayout exact path="/checkout" component={CheckoutPage} />
          
            <AdminLayout exact path="/admin" component={DashboardPage} />
            <AdminLayout exact path="/admin/stores" component={StoreListPage} />
            <AdminLayout exact path="/admin/store/create" component={ModifyStorePage} />
            <AdminLayout exact path="/admin/store/:id/edit" component={ModifyStorePage} />
            <AdminLayout exact path="/admin/categories" component={CategoryListPage} />

            <FullLayout exact path="/login" component={LoginPage} />
            <FullLayout exact path="/register" component={RegisterPage} />
            <FullLayout component={NotFoundPage} />
          </Switch>
        </Router>
      </I18nextProvider>
    </ThemeProvider>
  );
}

export default App;
