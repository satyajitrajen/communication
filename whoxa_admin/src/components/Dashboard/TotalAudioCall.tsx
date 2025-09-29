import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Dropdown from '../Dropdown';
import IconHorizontalDots from '../Icon/IconHorizontalDots';
import IconEye from '../Icon/IconEye';
import useApiPost from '../../hooks/PostData'; // Adjust path as necessary
import { FiPhoneCall } from "react-icons/fi";

function TotalAudioCall() {
    const [totalAudioCall, setTotalAudioCall] = useState<number | null>(null);
    // const [percentageChange, setPercentageChange] = useState<string | null>(null);
    const [lastWeekAudioCall, setLastWeekAudioCall] = useState<number | null>(null);
    const { loading, error, postData } = useApiPost();
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await postData('All-AudioCall-count-with-lastweek', {}); // Replace with your actual endpoint and request body
                console.log(response);

                if (response && response.success) {
                    setTotalAudioCall(response.totalAudioCallcount);
                    // setPercentageChange(response.percentageChange);
                    setLastWeekAudioCall(response.lastWeekAudioCallcount);
                } else {
                    console.error(response.message || 'Error fetching user data');
                }

            } catch (err) {
                console.error('Error fetching user data', err);
            }
        };

        fetchUserData();
    }, []);

    const handleViewAudioCall = () => {
        navigate('#'); // Replace '/all-users' with your target route
    };

    if (loading) return <div className="spinner">Loading...</div>;
    if (error) return <div className="error">Error fetching data</div>;

    return (
        <div className="panel bg-gradient-to-r from-blue-500 to-blue-400">
            <div className="flex justify-between">
                <div className="ltr:mr-1 rtl:ml-1 text-md font-semibold flex gap-x-3 items-center justify-center">
                    <FiPhoneCall className='text-xl' />
                    <div>Audio Calls</div>
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
                                <button type="button" onClick={handleViewAudioCall}>View All Calls</button>
                            </li>

                        </ul>
                    </Dropdown>
                </div>
            </div>
            <div className="flex items-center mt-7">
                <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3"> {totalAudioCall} </div>
                {/* <div className="badge bg-white/30">+ 1.35% </div> */}
            </div>
            <div className="flex items-center font-semibold mt-5">
                <IconEye className="ltr:mr-2 rtl:ml-2 shrink-0" />
                Last Week {lastWeekAudioCall} Audio Calls
            </div>
        </div>
    )
}

export default TotalAudioCall