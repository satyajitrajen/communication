import React, { useState, useEffect } from 'react';
import useApiPost from '../../hooks/PostData'; // Adjust the import path accordingly
import FullScreenImageModal from '../../components/Reusable/FullScreenImageModal'; // Adjust the import path accordingly
import Dropdown from '../Dropdown';
import IconHorizontalDots from '../Icon/IconHorizontalDots';
import { NavLink } from 'react-router-dom';

interface NewGroupListProps {
    className?: string;
}

const NewGroupList: React.FC<NewGroupListProps> = ({ className }) => {
    const [groups, setGroups] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalImages, setModalImages] = useState<string[]>([]);
    const [initialSlide, setInitialSlide] = useState(0);
    const { postData } = useApiPost();

    useEffect(() => {
        // Fetch groups when the component mounts
        const fetchGroups = async () => {
            try {
                const response = await postData('Get-Latest-5-groups', {});
                if (response.success) {
                    setGroups(response.groups); // Assuming response has a groups field
                }
            } catch (error) {
                console.error('Failed to fetch groups', error);
            } finally {
                setLoading(false);
            }
        };

        fetchGroups();
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
                <h5 className="font-bold text-lg text-black dark:text-white-light">Recent Groups</h5>
                <div className="dropdown">
                    <Dropdown
                        offset={[-10, 5]}
                        // placement={''}
                        btnClassName="hover:text-primary"
                        button={<IconHorizontalDots className="text-black/70 dark:text-white/70 hover:!text-primary" />}
                    >
                        <ul>
                            <li>
                                <NavLink to="/admin/Group/all-group-list" className="inline-block">
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
                    <table className='w-full'>
                        <thead className='text-dark dark:text-white-light'>
                            <tr>
                                <th className="ltr:rounded-l-md rtl:rounded-r-md">Profile</th>
                                {/* <th>Group Name</th> */}
                                <th>Created At</th>
                                <th className='text-center'>Total Users</th>
                            </tr>
                        </thead>
                        <tbody>
                            {groups.map((group, index) => (
                                <tr key={group.Groupid} className="text-white-dark hover:text-black dark:hover:text-white-light/90 group">
                                    <td className="min-w-[150px] text-black dark:text-white">
                                        <div className="flex items-center cursor-pointer" onClick={() => openModal([group.GroupProfile], 0)}>
                                            <img className="w-8 h-8 rounded-md ltr:mr-3 rtl:ml-3 object-cover" src={group.GroupProfile} alt="group profile" />
                                            <span className="whitespace-nowrap">{group.groupname}</span>
                                        </div>
                                    </td>
                                    {/* <td>{group.groupname}</td> */}
                                    <td>{new Date(group.CreatedAt).toLocaleDateString()}</td>
                                    <td className='text-center'>{group.GroupTotalUsersCount}</td>
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

export default NewGroupList;
