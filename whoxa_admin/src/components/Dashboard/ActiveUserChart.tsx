import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import useApiPost from '../../hooks/PostData';
import Dropdown from '../Dropdown'; // Ensure Dropdown component is imported
import { FaCaretDown } from "react-icons/fa6";

const MIN_YEAR = 2023; // Define your minimum year

const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const viewOptions = ['Year', 'Month', 'Day'];

const ActiveUser = () => {
    const [chartData, setChartData] = useState({
        series: [
            {
                name: 'Active Users',
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
            colors: ['#4caf50'],
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
                categories: [], // This will be updated with the dates, months, or days
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
            responsive: [
                {
                    breakpoint: 768, // For mobile screens
                    options: {
                        xaxis: {
                            tickAmount: 10, // Show only 15 labels on mobile
                        },
                    },
                },
                
            ],
        },
    });
    const [year, setYear] = useState(new Date().getFullYear()); // Default to current year
    const [month, setMonth] = useState(new Date().getMonth()); // Default to current month
    const [day, setDay] = useState(new Date().getDate()); // Default to current day
    const [years, setYears] = useState([]);
    const [monthsList, setMonthsList] = useState(months);
    const [viewOption, setViewOption] = useState('Month'); // Default to Month view
    const [days, setDays] = useState([]);
    const { loading, postData } = useApiPost();

    useEffect(() => {
        // Generate the list of years from MIN_YEAR to the current year
        const currentYear = new Date().getFullYear();
        const yearList = [];
        for (let i = MIN_YEAR; i <= currentYear; i++) {
            yearList.push(i);
        }
        setYears(yearList);
    }, []);

    useEffect(() => {
        // Generate the list of days for the selected month
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const dayList = [];
        for (let i = 1; i <= daysInMonth; i++) {
            dayList.push(i);
        }
        setDays(dayList);
    }, [year, month]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await postData('Get-Active-Users', {
                    year,
                    month: viewOption === 'Month' ? month + 1 : null,
                    // day: viewOption === 'Day' ? day : null,
                });
                console.log(response);

                if (response.success) {
                    const categories = viewOption === 'Day'
                        ? response.dailyUpdatedUserCounts.map(item => item.date)
                        : viewOption === 'Month'
                            ? response.dailyUpdatedUserCounts.map(item => item.date.substring(0, 7))
                            : response.dailyUpdatedUserCounts.map(item => item.date);

                    const counts = response.dailyUpdatedUserCounts.map(item => item.count);

                    setChartData(prevData => ({
                        ...prevData,
                        series: [
                            {
                                name: 'Active Users',
                                data: counts,
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
                    console.error(response.message || 'Error fetching user data');
                }
            } catch (err) {
                console.error('Error fetching user data', err);
            }
        };

        fetchUserData();
    }, [year, month, day, viewOption]);

    return (
        <div className="my-3 panel h-full p-0 col-span-3 md:col-span-3 lg:col-span-4 ">
            <div className="flex items-start justify-between dark:text-white-light mb-5 p-5 border-b border-white-light dark:border-[#1b2e4b]">
                <div className='flex justify-between flex-col md:flex-row md:items-center gap-x-2 w-full'>
                    <div className='flex items-center gap-x-2  '>
                        <div >
                            <h5 className="font-bold  text-lg text-black dark:text-white-light">Daily Active Users </h5>

                        </div>
                    </div>
                    <div className='flex items-center gap-x-2 text-sm'>
                        {viewOption === 'Month' && (
                            <div className='flex items-center gap-x-2 mt-2 md:mt-0'>
                                <h5 className="font-bold text-lg text-black dark:text-white-light">Month: </h5>
                                <Dropdown
                                    // offset={[0, 5]}
                                    placement={'bottom-start'}
                                    btnClassName="hover:opacity-80"
                                    button={
                                        <div className='flex font-semibold space-x-1'>
                                            <span className="text-lg text-yellow-600 ">
                                                {monthsList[month]}
                                            </span>
                                            <FaCaretDown className='text-lg text-yellow-600' />
                                        </div>}
                                >
                                    <ul className="bg-white dark:bg-[#191e3a] text-yellow-600 border border-gray-300 dark:border-[#30375e] rounded-md shadow-lg mt-1 dark:text-yellow-600 max-h-48 overflow-auto">
                                        {monthsList.map((monthName, index) => (
                                            <li key={index}>
                                                <button
                                                    type="button"
                                                    onClick={() => setMonth(index)}
                                                    className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-[#30375e] rounded-lg"
                                                    aria-label={`Select month ${monthName}`}
                                                >
                                                    {monthName}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </Dropdown>
                            </div>
                        )}

                        <div className='flex items-center gap-x-2 mt-2 md:mt-0'>
                            <h5 className="font-bold text-lg text-black dark:text-white-light">Year: </h5>
                            <Dropdown
                                // offset={[0, 5]}
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

export default ActiveUser;
