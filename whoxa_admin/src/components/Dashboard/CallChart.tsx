import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import useApiPost from '../../hooks/PostData';
import Dropdown from '../Dropdown';
import { FaCaretDown } from "react-icons/fa6";

const MIN_YEAR = 2023; // Define your minimum year

const CallChart = () => {
    const [chartData, setChartData] = useState({
        series: [
            {
                name: 'Video Calls',
                data: [],
            },
            {
                name: 'Audio Calls',
                data: [],
            },
        ],
        options: {
            chart: {
                type: 'area',
                height: 300,
                zoom: {
                    enabled: false,
                },
                toolbar: {
                    show: false,
                },
            },
            colors: ['#5c1ac3', '#ffbb44'],
            dataLabels: {
                enabled: false,
            },
            stroke: {
                width: 2,
                curve: 'smooth',
            },
            xaxis: {
                axisBorder: {
                    color: '#e0e6ed',
                },
                labels: {
                    style: {
                        colors: '#6c757d',
                    },
                },
                categories: [],
            },
            yaxis: {
                labels: {
                    style: {
                        colors: '#6c757d',
                    },
                },
            },
            grid: {
                borderColor: '#e0e6ed',
            },
            tooltip: {
                theme: 'light',
            },
            legend: {
                horizontalAlign: 'center',
            },
        },
    });
    const [year, setYear] = useState(new Date().getFullYear()); // Default to current year
    const [years, setYears] = useState([]);
    const { loading, postData } = useApiPost();

    useEffect(() => {
        // Generate the list of years from MIN_YEAR to the current year
        const currentYear = new Date().getFullYear();
        const yearList = [];
        for (let i = MIN_YEAR; i <= currentYear; i++) {
            yearList.push(i);
        }
        setYears(yearList);
    }, [year]);

    useEffect(() => {
        const fetchCallData = async () => {
            try {
                // Fetch data for both video and audio calls
                const [videoResponse, audioResponse] = await Promise.all([
                    postData('Get-Yearly-VideoCall', { year }),
                    postData('Get-Yearly-AudioCall', { year }),
                ]);

                if (videoResponse.success && audioResponse.success) {
                    console.log('Video Calls Response:', videoResponse);
                    console.log('Audio Calls Response:', audioResponse);

                    // Extract data for video calls (use "count" field, not "calls")
                    const videoCallCounts = videoResponse.yearlyVideoCallCounts.map(item => item.count);

                    // Extract data for audio calls
                    const audioCallCounts = audioResponse.yearlyAudioCallCounts.map(item => item.count);

                    // Determine categories from the audio call response (assuming both responses have the same months)
                    const categories = audioResponse.yearlyAudioCallCounts.map(item => item.month.substring(0, 3).toUpperCase());

                    setChartData(prevData => ({
                        ...prevData,
                        series: [
                            {
                                name: 'Video Calls',
                                data: videoCallCounts,
                            },
                            {
                                name: 'Audio Calls',
                                data: audioCallCounts,
                            },
                        ],
                        options: {
                            ...prevData.options,
                            xaxis: {
                                ...prevData.options.xaxis,
                                categories,
                            },
                        },
                    }));
                } else {
                    console.error('Error in API responses');
                }
            } catch (err) {
                console.error('Error fetching call data', err);
            }
        };

        fetchCallData();
    }, [year]);

    return (
        <div className="panel h-full p-0 col-span-2 md:col-span-2 lg:col-span-4">
            <div className="flex items-start justify-between dark:text-white-light mb-5 p-5 border-b border-white-light dark:border-[#1b2e4b]">
                <div className='flex justify-between items-center gap-x-2'>
                    <h5 className="font-bold text-lg text-black dark:text-white-light">Yearly Call Data of </h5>
                    <Dropdown
                        offset={[0, 5]}
                        placement={'bottom-start'}
                        btnClassName="hover:opacity-80"
                        button={
                            <div className='flex font-semibold space-x-1'>
                                <span className="text-lg text-yellow-600 ">
                                    {year}
                                </span>
                                <FaCaretDown className='text-lg text-yellow-600' />
                            </div>}
                    >
                        <ul className="bg-white dark:bg-[#191e3a] text-yellow-600 border border-gray-300 dark:border-[#30375e] rounded-md shadow-lg mt-1 dark:text-yellow-600">
                            {years.map((yearOption) => (
                                <li key={yearOption}>
                                    <button
                                        type="button"
                                        onClick={() => setYear(yearOption)}
                                        className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-[#30375e] rounded-lg"
                                        aria-label={`Select year ${yearOption}`}
                                    >
                                        {yearOption}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </Dropdown>
                </div>
            </div>
            <ReactApexChart
                series={chartData.series}
                options={chartData.options}
                type="area"
                height={300}
            />
        </div>
    );
};

export default CallChart;
