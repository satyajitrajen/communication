import PerfectScrollbar from 'react-perfect-scrollbar';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { toggleSidebar } from '../../store/themeConfigSlice';
import AnimateHeight from 'react-animate-height';
import { IRootState } from '../../store';
import { useState, useEffect } from 'react';
import IconCaretsDown from '../Icon/IconCaretsDown';
import IconCaretDown from '../Icon/IconCaretDown';
import IconMenuDashboard from '../Icon/Menu/IconMenuDashboard';
import IconMinus from '../Icon/IconMinus';
import IconMenuChat from '../Icon/Menu/IconMenuChat';
import IconMenuMailbox from '../Icon/Menu/IconMenuMailbox';
import IconMenuTodo from '../Icon/Menu/IconMenuTodo';
import IconMenuNotes from '../Icon/Menu/IconMenuNotes';
import IconMenuScrumboard from '../Icon/Menu/IconMenuScrumboard';
import IconMenuContacts from '../Icon/Menu/IconMenuContacts';
import IconMenuInvoice from '../Icon/Menu/IconMenuInvoice';
import IconMenuCalendar from '../Icon/Menu/IconMenuCalendar';
import IconMenuproducts from '../Icon/Menu/IconMenuComponents';
import IconMenuElements from '../Icon/Menu/IconMenuElements';
import IconMenuCharts from '../Icon/Menu/IconMenuCharts';
import IconMenuWidgets from '../Icon/Menu/IconMenuWidgets';
import IconMenuFontIcons from '../Icon/Menu/IconMenuFontIcons';
import IconMenuDragAndDrop from '../Icon/Menu/IconMenuDragAndDrop';
import IconMenuTables from '../Icon/Menu/IconMenuTables';
import IconMenuDatatables from '../Icon/Menu/IconMenuDatatables';
import IconMenuForms from '../Icon/Menu/IconMenuForms';
import IconMenuUsers from '../Icon/Menu/IconMenuUsers';
import IconMenuPages from '../Icon/Menu/IconMenuPages';
import IconMenuAuthentication from '../Icon/Menu/IconMenuAuthentication';
import IconMenuDocumentation from '../Icon/Menu/IconMenuDocumentation';
import IconMenuComponents from '../Icon/Menu/IconMenuComponents';
import { VscActivateBreakpoints } from "react-icons/vsc";

import {
  MdEmojiEmotions,
  MdSettingsApplications,
  MdWallpaper,
  MdOutlineGroups,
} from "react-icons/md";
import { useWebsiteSettings } from "../../store/api/useWebsiteSettings";

const Sidebar = () => {
  const [currentMenu, setCurrentMenu] = useState<string>(() => {
    return localStorage.getItem('currentMenu') || '';
  });
  const [errorSubMenu, setErrorSubMenu] = useState(false);
  let { data: websiteSettings } = useWebsiteSettings();
  const themeConfig = useSelector((state: IRootState) => state.themeConfig);
  const semidark = useSelector(
    (state: IRootState) => state.themeConfig.semidark
  );
  const location = useLocation();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const toggleMenu = (value: string) => {
    setCurrentMenu((oldValue) => {
      const newValue = oldValue === value ? '' : value;
      localStorage.setItem('currentMenu', newValue);
      return newValue;
    });
  };
  const navigate = useNavigate();

  // useEffect(() => {
  //     const selector = document.querySelector('.sidebar ul a[href="' + window.location.pathname + '"]');
  //     if (selector) {
  //         selector.classList.add('active');
  //         const ul: any = selector.closest('ul.sub-menu');
  //         if (ul) {
  //             let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link') || [];
  //             if (ele.length) {
  //                 ele = ele[0];
  //                 setTimeout(() => {
  //                     ele.click();
  //                 });
  //             }
  //         }
  //     }
  // }, []);

  useEffect(() => {
    if (window.innerWidth < 1024 && themeConfig.sidebar) {
      dispatch(toggleSidebar());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);
  console.log(
    websiteSettings?.settings[0].website_logo,
    "websiteSettings?.settings[0].website_logo"
  );

  return (
    <div className={semidark ? 'dark z-50' : 'z-50'}>
      <nav
        className={`sidebar fixed min-h-screen h-full top-0 bottom-0 w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] z-50 transition-all duration-300 ${semidark ? 'text-white-dark' : ''
          }`}
      >
        <div className="bg-white dark:bg-black h-full">
          <div className="flex justify-between items-center px-4 py-3">
            <NavLink
              to="/admin"
              className="main-logo flex items-center shrink-0"
            >
              <img
                className="w-8 my-[5px]  flex-none"
                src={websiteSettings?.settings[0].website_logo}
                alt="logo"
              />
              <span
                className="text-2xl mr-1 ltr:ml-1.5 rtl:mr-1.5 font-semibold align-middle lg:inline dark:text-white-light">
                {t(' Admin')}
              </span>
            </NavLink>

            <button
              type="button"
              className="collapse-icon w-8 h-8  rounded-full  flex items-center hover:bg-gray-500/10 dark:hover:bg-dark-light/10 dark:text-white-light transition duration-300 rtl:rotate-180"
              onClick={() => dispatch(toggleSidebar())}
            >
              <IconCaretsDown className="m-auto  rotate-90 text-orange-400" />
            </button>
          </div>
          <PerfectScrollbar className="h-[calc(100vh-80px)] relative">
            <ul className="relative font-semibold space-y-0.5 p-4 py-0">
              <li className="menu nav-item">
                <NavLink to="/">
                  <div className="flex items-center">
                    <IconMenuDashboard className="group-hover:!text-primary shrink-0" />
                    <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                      {t('Dashboard')}
                    </span>
                  </div>
                </NavLink>
              </li>

              <h2
                className="py-3 px-7 flex items-center uppercase font-extrabold bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] -mx-4 mb-1">
                <IconMinus className="w-4 h-5 flex-none hidden" />
                <span>{t('Users')}</span>
              </h2>

              <li className="nav-item">
                <ul>
                  <li className="nav-item">
                    <NavLink to="/admin/users/user-details">
                      <div className="flex items-center">
                        <IconMenuUsers className="group-hover:!text-primary shrink-0" />
                        <span
                          className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                          {t('Users')}
                        </span>
                      </div>
                    </NavLink>
                  </li>
                  {/* UNCOMMENT  */}

                  <li className="nav-item">
                    <NavLink to="/admin/users/countrywise-Analysis">
                      <div className="flex items-center">
                        <IconMenuUsers className="group-hover:!text-primary shrink-0" />
                        <span
                          className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                          {t('Countrywise Users')}
                        </span>
                      </div>
                    </NavLink>
                  </li>

                  {/* ----- */}
                </ul>
              </li>
              <h2
                className="py-3 px-7 flex items-center uppercase font-extrabold bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] -mx-4 mb-1">
                <IconMinus className="w-4 h-5 flex-none hidden" />
                <span>{t('Groups')}</span>
              </h2>

              <li className="nav-item">
                <ul>
                  <li className="nav-item">
                    <NavLink to="/admin/Group/all-group-list">
                      <div className="flex items-center">
                        <MdOutlineGroups className="group-hover:!text-primary shrink-0" />
                        <span
                          className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                          {t('Group List')}
                        </span>
                      </div>
                    </NavLink>
                  </li>
                </ul>
              </li>
              <h2
                className="py-3 px-7 flex items-center uppercase font-extrabold bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] -mx-4 mb-1">
                <IconMinus className="w-4 h-5 flex-none hidden" />
                <span>{t('Reports')}</span>
              </h2>
              <li className="nav-item">
                <NavLink to="/admin/users/reported-user-list">
                  <div className="flex items-center">
                    <IconMenuUsers className="group-hover:!text-primary shrink-0" />
                    <span
                      className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                      {t('Reported Users')}
                    </span>
                  </div>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/admin/Group/all-reported-group-list">
                  <div className="flex items-center">
                    <MdOutlineGroups className="group-hover:!text-primary shrink-0" />
                    <span
                      className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                      {t('Reported Group List')}
                    </span>
                  </div>
                </NavLink>
              </li>
              <h2
                className="py-3 px-7 flex items-center uppercase font-extrabold bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] -mx-4 mb-1">
                <IconMinus className="w-4 h-5 flex-none hidden" />
                <span>{t('Settings')}</span>
              </h2>

              <li className="menu nav-item">
                <button
                  type="button"
                  className={`${currentMenu == 'Wallpaper Settings' ? 'active' : ''
                    } nav-link group w-full`}
                  onClick={() => toggleMenu('Wallpaper Settings')}
                >
                  <div className="flex items-center">
                    <MdWallpaper className="group-hover:!text-primary shrink-0" />
                    <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                      {t('Wallpaper Settings')}
                    </span>
                  </div>

                  <div
                    className={
                      currentMenu !== 'Wallpaper Settings'
                        ? 'rtl:rotate-90 -rotate-90'
                        : ''
                    }
                  >
                    <IconCaretDown />
                  </div>
                </button>

                <AnimateHeight
                  duration={300}
                  height={currentMenu == 'Wallpaper Settings' ? 'auto' : 0}
                >
                  <ul className="sub-menu text-gray-500">
                    <li>
                      <NavLink to="/admin/Wallpaper/list-all-wallpaper">
                        {t('Wallpaper List')}
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/admin/Wallpaper/add-a-new-wallpaper">
                        {t('Add Wallpapper')}
                      </NavLink>
                    </li>
                  </ul>
                </AnimateHeight>
                <button
                  type="button"
                  className={`${currentMenu == 'Avatar Setting' ? 'active' : ''
                    } nav-link group w-full`}
                  onClick={() => toggleMenu('Avatar Setting')}
                >
                  <div className="flex items-center">
                    <MdEmojiEmotions className="group-hover:!text-primary shrink-0" />
                    <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                      {t('Avatar Settings')}
                    </span>
                  </div>

                  <div
                    className={
                      currentMenu !== 'Avatar Setting'
                        ? 'rtl:rotate-90 -rotate-90'
                        : ''
                    }
                  >
                    <IconCaretDown />
                  </div>
                </button>
                <AnimateHeight
                  duration={300}
                  height={currentMenu === 'Avatar Setting' ? 'auto' : 0}
                >
                  <ul className="sub-menu text-gray-500">
                    <li>
                      <NavLink to="/admin/Avatar/list-all-avatar">
                        {t('Avatar List')}
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/admin/Avatar/add-a-new-avatar">
                        {t('Add Avatar')}
                      </NavLink>
                    </li>
                  </ul>
                </AnimateHeight>
                <button
                  type="button"
                  className={`${currentMenu === 'System Settings' ? 'active' : ''
                    } nav-link group w-full`}
                  onClick={() => toggleMenu('System Settings')}
                >
                  <div className="flex items-center">
                    <MdSettingsApplications className="group-hover:!text-primary shrink-0" />
                    <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                      {t('System Settings')}
                    </span>
                  </div>

                  <div
                    className={
                      currentMenu !== 'System Settings'
                        ? 'rtl:rotate-90 -rotate-90'
                        : ''
                    }
                  >
                    <IconCaretDown />
                  </div>
                </button>
                <AnimateHeight
                  duration={300}
                  height={currentMenu === 'System Settings' ? 'auto' : 0}
                >
                  <ul className="sub-menu text-gray-500">
                    <li>
                      <NavLink
                        to="/admin/System-Setting/General-Setting"
                        className={({ isActive }) => (isActive ? 'active' : '')}
                      >
                        {t('General Setting')}
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/admin/System-Setting/App-Setting"
                        className={({ isActive }) => (isActive ? 'active' : '')}
                      >
                        {t('App Setting')}
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/admin/System-Setting/Web-Setting"
                        className={({ isActive }) => (isActive ? 'active' : '')}
                      >
                        {t('Frontend Setting')}
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/admin/System-Setting/Advanced-Setting"
                        className={({ isActive }) => (isActive ? 'active' : '')}
                      >
                        {t('OTP Cofigration')}
                      </NavLink>
                    </li>
                    <li>
                      {/* <NavLink to="/System-Setting/Google-map-Setting" className={({ isActive }) => (isActive ? 'active' : '')}>{t('Google Map Setting')}</NavLink> */}
                    </li>
                    {/* <li>
                      <NavLink
                        to="/admin/System-Setting/email-Configration"
                        className={({ isActive }) => (isActive ? 'active' : '')}
                      >
                        {t('Email Configration')}
                      </NavLink>
                    </li> */}
                    
                    <li>
                      <NavLink
                        to="/admin/System-Setting/Pages"
                        className={({ isActive }) => (isActive ? 'active' : '')}
                      >
                        {t('Pages')}
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/admin/System-Setting/LanguageSettings"
                        className={({ isActive }) => (isActive ? 'active' : '')}
                      >
                        {t('Language Settings')}
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/admin/System-Setting/reportSettings"
                        className={({ isActive }) => (isActive ? 'active' : '')}
                      >
                        {t('Report Settings')}
                      </NavLink>
                    </li>
                  </ul>
                </AnimateHeight>
                <h2
                  className="py-3 px-7 flex items-center uppercase font-extrabold bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] -mx-4 mb-1">
                  <IconMinus className="w-4 h-5 flex-none hidden" />
                  <span>{t('Project Activation')}</span>
                </h2>
                {<li className="nav-item">
                  <NavLink to="/admin/project/Activation">
                    <div className="flex items-center">
                      <VscActivateBreakpoints className="group-hover:!text-primary shrink-0" />
                      <span
                        className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                        {t('Purchase Code')}
                      </span>
                    </div>
                  </NavLink>
                </li>}
              </li>
            </ul>
          </PerfectScrollbar>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
