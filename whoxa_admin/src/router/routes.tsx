// routes.tsx
import { lazy } from 'react';

import ProtectedRoute from './ProtectRoutes'
import Error from '../components/Error';
import Profile from '../pages/Pages/Admin/Profile';
import AccountSetting from '../pages/Pages/Admin/AccountSetting';
import Users from '../pages/Pages/Admin/UserDetails';
import ReportedUserList from '../components/User/ReportedUserDetails';
import ListAllProduct from '../components/Ecommerce/Product/ListAllProduct';
import AddProduct from '../pages/Pages/Ecom/Admin/AddProduct';
import ViewProductById from '../components/Ecommerce/Product/ViewProductById';
import EditProductForm from '../components/Ecommerce/Product/EditProduct';
import ListAllReportedPost from '../components/Social/Post/ListAllReportedPost';
import ListAllWallpaper from '../components/Wallpaper/ListAllWallpapers';
import UserList from '../components/User/UserList';
import AddNewWallpaper from '../components/Wallpaper/AddNewWallpaper';
import AddNewwebsiteSettings from '../components/SystemSetting/AppSesstings/AddAppSetting';
import ListAllSettings from '../components/SystemSetting/AppSesstings/ListAllSettings';
import EditwebsiteSettings from '../components/SystemSetting/AppSesstings/EditAppSetting';
import Error404 from '../pages/Pages/Error404';
import EditGroupSettings from '../components/SystemSetting/GroupSetting/EditGroupSetting';
import EditTermsConditions from '../components/SystemSetting/PrivacyPolicyAndTNC/EditTNC';
import EditPrivacyPolicy from '../components/SystemSetting/PrivacyPolicyAndTNC/EditPrivacyPolicy';
import LegalityPage from '../components/SystemSetting/PrivacyPolicyAndTNC/LegalityPage';
import AddNewAvatar from '../components/Avatar/AddNewAvatar';
import ListAllAvatar from '../components/Avatar/ListAllAvatar';
import GroupList from '../components/Group/GroupList';
import GroupUserList from '../components/Group/GroupUserList';
import CountryWiseUserData from '../components/Dashboard/CountryWiseUserData';
import CountryWiseAnlysisPage from '../pages/CountryWiseAnlysisPage';
import LanguageSetting from '../components/Language/LanguageSetting';
import LanguagesList from '../components/Language/LanguageList';
import EditOneSignalSettings from '../components/SystemSetting/AppSesstings/EditOneSignalSettings';
import EditGogleMapSettings from '../components/SystemSetting/AppSesstings/EditGogleMapSetting';
import ReportList from '../components/Report/ReportTypeList';
import SpecifiedReportUserDetails from '../components/User/SpecifiedReportedUserDetails';
import EditWebSettings from '../components/SystemSetting/WebSetting/EditwebSetting';
import ReportedGroupList from '../components/Group/ReportedGroupList';
import ReportedGroupUserList from '../components/Group/ReportedUserGroupList';
import Activation from '../components/Activation';
import EmailTemplatePreview from '../components/SystemSetting/EmailConfigrations/EmailTemplatePreview';


const LoginBoxed = lazy(() => import('../pages/Authentication/LoginBoxed'));
const Index = lazy(() => import('../pages/Index'));

const routes = [
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <Index />
      </ProtectedRoute>
    ),
    layout: 'default',
  },

  // Login Logout
  {
    path: '/admin/auth/Login',
    element: <LoginBoxed />,
    layout: 'blank',
  },

  // Admin Profile
  {
    path: '/admin/users/profile',
    element: (
      <ProtectedRoute>
        <Profile />,
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/users/user-account-settings',
    element: (
      <ProtectedRoute>
        <AccountSetting />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/users/user-details',
    element: (
      <ProtectedRoute>
        <UserList />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/users/reported-user-list',
    element: (
      <ProtectedRoute>
        <ReportedUserList />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/users/reported-user-details/:user_id',
    element: (
      <ProtectedRoute>
        <SpecifiedReportUserDetails/>
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/users/countrywise-Analysis',
    element: (
      <ProtectedRoute>
        <CountryWiseAnlysisPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/Group/all-group-list',
    element: (
      <ProtectedRoute>
        <GroupList />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/Group/all-reported-group-list',
    element: (
      <ProtectedRoute>
        <ReportedGroupList />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/Group/all-reported-group-list/:groupId',
    element: (
      <ProtectedRoute>
        <ReportedGroupUserList />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/Group/all-user-list-from-group/:groupData',
    element: (
      <ProtectedRoute>
        <GroupUserList />
      </ProtectedRoute>
    ),
  },

  {
    path: '/admin/products/list-all-product',
    element: (
      <ProtectedRoute>
        <ListAllProduct />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/products/ProductById',
    element: (
      <ProtectedRoute>
        <ViewProductById productId={undefined} />
      </ProtectedRoute>
    ),
  },
  {
    path: '/products/editProduct',
    element: (
      <ProtectedRoute>
        <EditProductForm productId={undefined} />
      </ProtectedRoute>
    ),
  },
  {
    path: '/products/add-new-Product',
    element: (
      <ProtectedRoute>
        <AddProduct />
      </ProtectedRoute>
    ),
  },

  // Wallpaper
  {
    path: '/admin/Wallpaper/list-all-wallpaper',
    element: (
      <ProtectedRoute>
        <ListAllWallpaper />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/Wallpaper/add-a-new-wallpaper',
    element: (
      <ProtectedRoute>
        <AddNewWallpaper />
      </ProtectedRoute>
    ),
  },
  // {
  //   path: '/admin/Wallpaper/list-all-wallpaper',
  //   element: (
  //     <ProtectedRoute>
  //       <ListAllWallpaper />
  //     </ProtectedRoute>
  //   ),
  // },
  {
    path: '/admin/Avatar/add-a-new-avatar',
    element: (
      <ProtectedRoute>
        <AddNewAvatar />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/Avatar/list-all-avatar',
    element: (
      <ProtectedRoute>
        <ListAllAvatar />
      </ProtectedRoute>
    ),
  },
  // System Settings

  {
    path: '/admin/System-Setting/App-Setting',
    element: (
      <ProtectedRoute>
        <EditwebsiteSettings />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/System-Setting/Web-Setting',
    element: (
      <ProtectedRoute>
        <EditWebSettings />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/System-Setting/Advanced-Setting',
    element: (
      <ProtectedRoute>
        <EditOneSignalSettings />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/System-Setting/email-Configration',
    element: (
      <ProtectedRoute>
        <EmailTemplatePreview />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/System-Setting/General-Setting',
    element: (
      <ProtectedRoute>
        <EditGroupSettings />
      </ProtectedRoute>
    ),
  },
  // {
  //   path: '/System-Setting/Google-map-Setting',
  //   element: (
  //     <ProtectedRoute>
  //       <EditGogleMapSettings />
  //     </ProtectedRoute>
  //   ),
  // },
  {
    path: '/admin/System-Setting/Pages',
    element: (
      <ProtectedRoute>
        <LegalityPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/System-Setting/LanguageSettings',
    element: (
      <ProtectedRoute>
        <LanguagesList />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/System-Setting/reportSettings',
    element: (
      <ProtectedRoute>
        <ReportList/>
      </ProtectedRoute>
    ),
  },
   {
    path: '/admin/project/Activation',
    element: (
      <ProtectedRoute>
        <Activation />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/System-Setting/LanguageSettings/:status_id',
    element: (
      <ProtectedRoute>
        <LanguageSetting />
      </ProtectedRoute>
    ),
  },

  {
    path: '/post/list-all-reported-post',
    element: (
      <ProtectedRoute>
        <ListAllReportedPost />
      </ProtectedRoute>
    ),
  },

  // else
  {
    path: '*',
    element: <Error404 />,
    layout: 'blank',
  },
];

export { routes };
