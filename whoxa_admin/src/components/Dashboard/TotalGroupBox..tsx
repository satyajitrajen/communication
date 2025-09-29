import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Dropdown from '../Dropdown';
import IconHorizontalDots from '../Icon/IconHorizontalDots';
import IconEye from '../Icon/IconEye';
import useApiPost from '../../hooks/PostData'; // Adjust path as necessary
import { MdOutlineGroups } from "react-icons/md";

function TotalGroupBox() {
    const [totalGroup, setTotalGroup] = useState<number | null>(null);
    // const [percentageChange, setPercentageChange] = useState<string | null>(null);
    const [lastWeekGroups, setLastWeekGroups] = useState<number | null>(null);
    const { loading, error, postData } = useApiPost();
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await postData('All-group-count-with-lastweek', {}); // Replace with your actual endpoint and request body
                console.log(response);

                if (response && response.success) {
                    setTotalGroup(response.allGroupCount);
                    // setPercentageChange(response.percentageChange);
                    setLastWeekGroups(response.lastWeekGroupCount);
                } else {
                    console.error(response.message || 'Error fetching user data');
                }

            } catch (err) {
                console.error('Error fetching user data', err);
            }
        };

        fetchUserData();
    }, []);

    const handleViewAllGroups = () => {
        navigate('/admin/Group/all-group-list'); // Replace '/all-users' with your target route
    };

    if (loading) return <div className="spinner">Loading...</div>;
    if (error) return <div className="error">Error fetching data</div>;

    return (
        <div className="panel bg-gradient-to-r from-violet-500 to-violet-400">
            <div className="flex justify-between">
                <div className="ltr:mr-1 rtl:ml-1 text-md font-semibold flex gap-x-3 items-center justify-center">
                    <MdOutlineGroups className='text-3xl' />
                    <div>Groups</div>
                </div>
                <div className="dropdown">
                    <Dropdown
                        offset={[-50, 5]}
                        placement={'bottom-start'}
                        btnClassName="hover:opacity-80"
                        button={<IconHorizontalDots className="hover:opacity-80 opacity-70" />}
                    >
                        <ul className="text-black dark:text-white-dark">
                            <li>
                                <button type="button" onClick={handleViewAllGroups}>View All Group</button>
                            </li>

                        </ul>
                    </Dropdown>
                </div>
            </div>
            <div className="flex items-center mt-5">
                <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3"> {totalGroup} </div>
            </div>
            <div className="flex items-center font-semibold mt-5">
                <IconEye className="ltr:mr-2 rtl:ml-2 shrink-0" />
                Last Week {lastWeekGroups} Groups
            </div>
        </div>
    )
}

export default TotalGroupBox