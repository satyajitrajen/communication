import { combineReducers, configureStore } from '@reduxjs/toolkit';
import themeConfigSlice from './themeConfigSlice';
import adminSlice, { setAdminDetails } from './adminSlice'; // Import the adminSlice

const rootReducer = combineReducers({
    themeConfig: themeConfigSlice,
    admin: adminSlice, // Add the adminSlice to the rootReducer
});

const store = configureStore({
    reducer: rootReducer,
});

const adminDetails = localStorage.getItem('adminDetails');
if (adminDetails) {
    store.dispatch(setAdminDetails(JSON.parse(adminDetails)));
}
export type IRootState = ReturnType<typeof rootReducer>;
export default store;
