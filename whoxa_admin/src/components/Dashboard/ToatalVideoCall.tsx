import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Dropdown from '../Dropdown';
import IconHorizontalDots from '../Icon/IconHorizontalDots';
import IconEye from '../Icon/IconEye';
import useApiPost from '../../hooks/PostData'; // Adjust path as necessary
import { FaVideo } from "react-icons/fa";

function TotalVideoCall() {
    const [totalVideoCall, setTotalVideoCall] = useState<number | null>(null);
    // const [percentageChange, setPercentageChange] = useState<string | null>(null);
    const [lastWeekVideoCall, setLastWeekVideoCall] = useState<number | null>(null);
    const { loading, error, postData } = useApiPost();
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await postData('All-VideoCall-count-with-lastweek', {}); // Replace with your actual endpoint and request body
                console.log(response);

                if (response && response.success) {
                    setTotalVideoCall(response.totalVideoCallcount);
                    // setPercentageChange(response.percentageChange);
                    setLastWeekVideoCall(response.lastWeekVideoCallcount);
                } else {
                    console.error(response.message || 'Error fetching user data');
                }

            } catch (err) {
                console.error('Error fetching user data', err);
            }
        };

        fetchUserData();
    }, []);

    const handleViewVideoCall = () => {
        navigate('#'); // Replace '/all-users' with your target route
    };

    if (loading) return <div className="spinner">Loading...</div>;
    if (error) return <div className="error">Error fetching data</div>;

    return (
        <div className="panel bg-gradient-to-r from-fuchsia-500 to-fuchsia-400">
            <div className="flex justify-between">
                <div className="ltr:mr-1 rtl:ml-1 text-md font-semibold flex gap-x-3 items-center justify-center">
                    <FaVideo className='text-xl' />
                    <div>Video Calls</div>
                </div>
                <div className="dropdown">
                    <Dropdown
                        offset={[0, 5]}
                        placement={'bottom-start'}
                        btnClassName="hover:opacity-80"
                        button={<IconHorizontalDots className="hover:opacity-80 opacity-70" />}
                    >
                        <ul className="text-black dark:text-white-dark">
                            <li>
                                <button type="button">View AllCalls</button>
                            </li>
                        </ul>
                    </Dropdown>
                </div>
            </div>
            <div className="flex items-center mt-7">
                <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3"> {totalVideoCall} </div>
            </div>
            <div className="flex items-center font-semibold mt-5">
                <IconEye className="ltr:mr-2 rtl:ml-2 shrink-0" />
                Last Week {lastWeekVideoCall} Video Calls
            </div>
        </div>
    )
}

export default TotalVideoCall