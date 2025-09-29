import React, { useState, useEffect } from 'react';
import useApiPost from '../../hooks/PostData'; // Adjust the import path accordingly
import FullScreenImageModal from '../../components/Reusable/FullScreenImageModal'; // Adjust the import path accordingly
import Dropdown from '../Dropdown';
import IconHorizontalDots from '../Icon/IconHorizontalDots';
import { NavLink } from 'react-router-dom';

interface NewUsersListProps {
    className?: string;
}

const NewUsersList: React.FC<NewUsersListProps> = ({ className }) => {
    const [users, setUsers] = useState<any[]>([]); // Updated type for better flexibility
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalImages, setModalImages] = useState<string[]>([]);
    const [initialSlide, setInitialSlide] = useState(0);
    const { postData } = useApiPost();

    useEffect(() => {
        // Fetch users when the component mounts
        const fetchUsers = async () => {
            try {
                const response = await postData('Get-Latest-5-users', {});
                if (response.success) {
                    setUsers(response.latestUsers); // Assuming response has a userData field
                }
            } catch (error) {
                console.error('Failed to fetch users', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const openModal = (images: string[], initialIndex: number) => {
        setModalImages(images);
        setInitialSlide(initialIndex);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className={`my-3 panel  w-full ${className} col-span-2 overflow-auto`}>
            <div className="flex items-center justify-between mb-5">
                <h5 className="font-bold text-lg text-black dark:text-white-light">Recent Users</h5>
                <div className="dropdown">
                    <Dropdown
                        offset={[-10, 5]}
                        // placement={'bottom-start'}
                        btnClassName="hover:text-primary"
                        button={<IconHorizontalDots className="text-black/70 dark:text-white/70 hover:!text-primary" />}
                    >
                        <ul>
                            <li>
                                <NavLink to="/admin/users/user-details" className="inline-block">
                                    <button type="button" className="btn-class ">
                                        View
                                    </button>
                                </NavLink>
                            </li>

                        </ul>
                    </Dropdown>
                </div>
            </div>
            {loading ? (
                <div className="text-center">Loading...</div>
            ) : (
                <div className="">
                    <table className=''>
                        <thead className='text-dark dark:text-white-light'>
                            <tr>
                                <th className="">Profile</th>
                                {/* <th>Name</th> */}
                                <th>Country</th>
                                <th className='text-center'>Platform</th>
                                <th>Joined at</th>

                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr key={user.user_id} className="text-white-dark hover:text-black dark:hover:text-white-light/90 group">
                                    <td className="min-w-[150px] text-black dark:text-white">
                                        <div className="flex items-center cursor-pointer" onClick={() => openModal([user.profile_image], 0)}>
                                            <img className="w-8 h-8 rounded-md ltr:mr-3 rtl:ml-3 object-cover" src={user.profile_image} alt="profile" />
                                            <div className='flex flex-col'>

                                                <span className="whitespace-nowrap">{user.first_name} {user.last_name}</span>
                                                <span className='text-gray-400 dark:text-gray-700 font-extralight'>{user.sub_data}</span>

                                            </div>
                                        </div>
                                    </td>
                                    {/* <td className='text-center'>{user.country_code}</td> */}
                                    <td>
                                        <div className="flex items-center gap-2">
                                            <img width="24" src={`/assets/images/flags/${user.country.substring(0, 2).toUpperCase()}.svg`} className="max-w-none" alt="flag" />
                                            <div>{user.country.substring(0, 2).toUpperCase()}</div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className='flex justify-center'>
                                            {user.is_web ? <div className="flex items-center justify-center w-1/2">
                                                <span className="badge badge-outline-success rounded-full">Web</span>
                                            </div> : null}
                                            {user.is_mobile ? <div className="flex items-center justify-center w-1/2">
                                                <span className="badge badge-outline-warning rounded-full">
                                                    App
                                                </span>
                                            </div> : null}

                                        </div>
                                    </td>
                                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <FullScreenImageModal
                isOpen={isModalOpen}
                onClose={closeModal}
                images={modalImages}
                initialSlide={initialSlide}
            />
        </div>
    );
};

export default NewUsersList;
