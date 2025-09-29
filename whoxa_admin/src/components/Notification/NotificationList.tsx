import React, { useEffect, useState } from 'react';
import Dropdown from '../Dropdown';
import IconBellBing from '../../components/Icon/IconBellBing';
import IconInfoCircle from '../../components/Icon/IconInfoCircle';
import useApiPost from '../../hooks/PostData';
import { formatDistanceToNow, differenceInDays, format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface Notification {
    profile_image: string;
    user_id: number;
    phone_number: string;
    country: string;
    first_name: string;
    last_name: string;
    user_name: string;
    gender: string;
    viewed_by_admin: boolean;
    createdAt: string;
}

interface NotificationDropdownProps {
    isRtl: boolean;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ isRtl }) => {
    const { loading, error, data, postData } = useApiPost();
    const [updateFlag, setUpdateFlag] = useState<Boolean>(false);
    const [hasNotifications, setHasNotifications] = useState<Boolean>(false);
    const navigate = useNavigate();

    // Function to fetch notifications
    const fetchNotifications = async () => {
        try {
            const response = await postData('List-AllNotification', {});
            console.log("Fetched Data: ", response); // Log the data to check the structure

            if (response.success) {
                setHasNotifications(response.Notifications && response.Notifications.length > 0);
            }
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
    };
    useEffect(() => {
        fetchNotifications();
    }, [updateFlag]);
    // Trigger API call when the notification bell icon is clicked
    const handleDropdownOpen = async () => {
        await fetchNotifications(); // Fetch notifications when the dropdown is opened
        setUpdateFlag(!updateFlag); // Optionally force component re-render after fetching data
    };

    const formatTime = (time: string) => {
        const createdTime = new Date(time);
        const now = new Date();

        if (differenceInDays(now, createdTime) < 7) {
            return `${formatDistanceToNow(createdTime, { addSuffix: true })}`;
        }

        return format(createdTime, 'MMM dd, yyyy');
    };

    const getUserIds = () => {
        if (data?.Notifications) {
            return data.Notifications.map((notification: Notification) => notification.user_id);
        }
        return [];
    };

    const markAllAsRead = async () => {
        const userIds = getUserIds();
        try {
            await postData('View-User', { user_ids: userIds });
            setUpdateFlag(!updateFlag);
            navigate('/admin/users/user-details'); // Redirect after marking as read
        } catch (error) {
            console.error('Failed to mark notifications as read:', error);
        }
    };

    return (
        <div className="dropdown shrink-0">
            <Dropdown
                offset={[0, 8]}
                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                btnClassName="relative block p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60"
                button={
                    <span onClick={handleDropdownOpen}>
                        <IconBellBing />
                        {hasNotifications && (
                            <span className="flex absolute w-3 h-3 ltr:right-0 rtl:left-0 top-0">
                                <span className="animate-ping absolute ltr:-left-[3px] rtl:-right-[3px] -top-[3px] inline-flex h-full w-full rounded-full bg-success/50 opacity-75"></span>
                                <span className="relative inline-flex rounded-full w-[6px] h-[6px] bg-success"></span>
                            </span>
                        )}
                    </span>
                }
            >
                <ul className="!py-0 text-dark dark:text-white-dark w-[300px] sm:w-[350px] divide-y dark:divide-white/10 overflow-auto">
                    <li onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center px-4 py-2 justify-between font-semibold">
                            <h4 className="text-lg">Notification</h4>
                            {data?.returned_count ? <span className="badge bg-primary/80">{data.returned_count} New</span> : ''}
                        </div>
                    </li>
                    {loading ? (
                        <li>
                            <div className="p-4 text-center">Loading...</div>
                        </li>
                    ) : error ? (
                        <li>
                            <div className="p-4 text-center text-danger">Failed to load notifications.</div>
                        </li>
                    ) : data?.Notifications?.length > 0 ? (
                        <>
                            {data.Notifications.map((notification: Notification) => (
                                <li key={notification.user_id} className="dark:text-white-light/90" onClick={(e) => e.stopPropagation()}>
                                    <div className="group flex items-center px-4 py-2">
                                        <div className="grid place-content-center rounded">
                                            <div className="w-12 h-12 relative">
                                                <img
                                                    className="w-12 h-12 rounded-full object-cover"
                                                    alt="profile"
                                                    src={notification.profile_image || '/default-profile.png'}
                                                />
                                            </div>
                                        </div>
                                        <div className="ltr:pl-3 rtl:pr-3 flex flex-auto">
                                            <div className="ltr:pr-3 rtl:pl-3">
                                                <h6 >
                                                    <span className="font-bold">
                                                        {notification.first_name && notification.last_name
                                                            ? `${notification.first_name} ${notification.last_name}`
                                                            : notification.user_name || notification.phone_number}
                                                    </span>
                                                    <span >
                                                         {' is added as ' }
                                                    </span>
                                                    <span className="font-bold">
                                                        New User
                                                    </span>
                                                </h6>
                                                <span className="text-xs block font-normal dark:text-gray-500">
                                                    {formatTime(notification.createdAt)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                            <li>
                                <div className="p-4">
                                    <button className="btn btn-primary block w-full btn-small" onClick={markAllAsRead}>
                                        View All Users
                                    </button>
                                </div>
                            </li>
                        </>
                    ) : (
                        <li onClick={(e) => e.stopPropagation()}>
                            <button type="button" className="!grid place-content-center hover:!bg-transparent text-lg min-h-[200px]">
                                <div className="mx-auto ring-4 ring-primary/30 rounded-full mb-4 text-primary">
                                    <IconInfoCircle fill={true} className="w-10 h-10" />
                                </div>
                                No Notifications.
                            </button>
                        </li>
                    )}
                </ul>
            </Dropdown>
        </div>
    );
};

export default NotificationDropdown;
