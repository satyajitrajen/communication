import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';
import { useEffect, useState } from 'react';
import { setPageTitle, toggleRTL } from '../../store/themeConfigSlice';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'; // Importing React Icons
import useAPI from '../../hooks/PostData';
import Cookies from 'js-cookie';
import { setAdminDetails } from '../../store/adminSlice';
import { useWebsiteSettings } from '../../store/api/useWebsiteSettings';

const LoginBoxed = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(setPageTitle('Login'));
    }, [dispatch]);

    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    let { data: websiteSettings } = useWebsiteSettings();

    const [flag, setFlag] = useState(themeConfig.locale);
    const [admin_email, setEmail] = useState('');
    const [admin_password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
    const [error, setError] = useState<string | null>(null);

    const { postData, loading } = useAPI();

    const submitForm = async (e: React.FormEvent) => {
        e.preventDefault();
        if (admin_email === '') {
            setError('Email is required!');
            return;
        }
        if (admin_password === '') {
            setError('Password is required!');
            return;
        }
        try {
            const response = await postData('admin-login', { admin_email, admin_password });
            console.log(response);
            if (!response || response.success === false) {
                setError(response.message || 'Login failed');
                return;
            } else {
                Cookies.set('adminToken', response.token, { expires: 30 });
                dispatch(setAdminDetails({
                    name: response.isAdmin.admin_name,
                    profilePic: response.isAdmin.profile_pic,
                    isAdmin: true,
                    adminEmail: admin_email
                }));

                console.log(response.isAdmin.profile_pic);
                
                navigate('/');
            }
        } catch (err: any) {
            console.error(err.response?.data?.message || 'An error occurred');
            setError(err.response?.data?.message || 'An error occurred');
        }
    };

    return (
        <div>
            <div className="absolute inset-0">
                <img src="/assets/images/auth/bg-gradient.png" alt="background" className="h-full w-full object-cover" />
            </div>

            <div className="relative flex min-h-screen items-center justify-center bg-[url(/Final.png)] bg-cover bg-top bg-no-repeat px-6 py-10  sm:px-16">
                <img src="/assets/images/auth/coming-soon-object1.png" alt="object" className="absolute left-0 top-1/2 h-full max-h-[893px] -translate-y-1/2" />
                {/* <img src="/assets/images/auth/coming-soon-object2.png" alt="object" className="absolute left-24 top-0 h-40 md:left-[30%]" /> */}
                <img src="/assets/images/auth/coming-soon-object3.png" alt="object" className="absolute right-0 top-0 h-[300px]" />
                {/* <img src="/assets/images/auth/polygon-object.svg" alt="polygon" className="absolute bottom-0 end-[28%]" /> */}
                <div className="relative w-full max-w-[870px] rounded-md p-2 bg-[linear-gradient(45deg,#fff9f9_0%,rgba(255,255,255,0)_25%,rgba(255,255,255,0)_75%,#fff9f9_100%)] bg-[length:200%_200%] animate-gradientRotation dark:bg-[linear-gradient(45deg,#fff9f9_0%,rgba(255,255,255,0)_25%,rgba(255,255,255,0)_75%,#fff9f9_100%)]">
                <div className="relative flex flex-col justify-center rounded-md bg-white/60 backdrop-blur-lg dark:bg-white/60 px-6 lg:min-h-[758px] py-20">
                        <div className="mx-auto w-full max-w-[440px]">
                            <div className="mb-10 flex-col text-center justify-around">
                                <img src={websiteSettings?.settings[0].website_logo} className='w-32 mx-auto mb-20' alt="Logo" />
                                <h1 className="text-3xl font-extrabold uppercase !leading-snug text-black md:text-4xl">Sign in</h1>
                                <p className="text-base font-bold leading-normal text-white-dark">Enter your email and password to login</p>
                            </div>
                            <form className="space-y-5 dark:text-black" onSubmit={submitForm}>
                                <div>
                                    <label htmlFor="admin_email">Email</label>
                                    <div className="relative text-white-dark">
                                        <input
                                            id="admin_email"
                                            type="email"
                                            placeholder="Enter Email"
                                            className="form-input dark:bg-white dark:text-dark dark:border-yellow-200 focus:border-[1px] focus:border-yellow-300 ps-10 placeholder:text-white-dark"
                                            value={admin_email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <FiMail className="text-xl" />
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="admin_password">Password</label>
                                    <div className="relative text-white-dark">
                                        <input
                                            id="admin_password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter Password"
                                            className="form-input dark:bg-white dark:text-dark dark:border-yellow-200 focus:border-[1px] focus:border-yellow-300 ps-10 placeholder:text-white-dark"
                                            value={admin_password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <span
                                            className="absolute end-4 top-1/2 -translate-y-1/2 cursor-pointer"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <FiEyeOff className="text-xl" /> : <FiEye className="text-xl" />}
                                        </span>
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <FiLock className="text-xl" />
                                        </span>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className="btn bg-gradient-to-tr hover:bg-gradient-to-tl from-yellow-400 to-white !mt-9 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]"
                                    disabled={loading}
                                >
                                    {loading ? 'Signing in...' : 'Sign in'}
                                </button>
                                {error && <p className="text-red-500">{error}</p>}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginBoxed;
