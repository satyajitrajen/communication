import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import useApiPost from '../../hooks/PostData';
import Dropdown from '../Dropdown';
import { FaCaretDown } from "react-icons/fa6";

function MonthlyDataComponent() {
    const MIN_YEAR = 2023; // Define your minimum year
    const [chartData, setChartData] = useState({
        series: [],
        options: {
            chart: {
                type: 'bar',
                height: 360,
            },
            xaxis: {
                categories: [],
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
    }, []);

    useEffect(() => {
        const fetchMonthlyData = async () => {
            try {
                const [userResponse, groupResponse] = await Promise.all([
                    postData('Get-monthly-Users', { year }),
                    postData('Get-monthly-groups', { year }),
                ]);

                if (userResponse.success && groupResponse.success) {
                    console.log('User Response:', userResponse);
                    console.log('Group Response:', groupResponse);

                    const userCounts = userResponse.yearlyUserCounts.map(item => item.count);
                    const groupCounts = groupResponse.yearlyGroupCounts.map(item => item.count);
                    const categories = userResponse.yearlyUserCounts.map(item => item.month.substring(0, 3).toUpperCase());

                    setChartData({
                        series: [
                            {
                                name: 'New Users',
                                data: userCounts,
                            },
                            {
                                name: 'New Groups',
                                data: groupCounts,
                            },
                        ],
                        options: {
                            chart: {
                                height: 360,
                                type: 'bar',
                                fontFamily: 'Nunito, sans-serif',
                                toolbar: {
                                    show: false,
                                },
                            },
                            dataLabels: {
                                enabled: false,
                            },
                            stroke: {
                                width: 2,
                                colors: ['transparent'],
                            },
                            colors: ['#5c1ac3', '#ffbb44'],
                            plotOptions: {
                                bar: {
                                    horizontal: false,
                                    columnWidth: '55%',
                                    borderRadius: 8,
                                    borderRadiusApplication: 'end',
                                },
                            },
                            legend: {
                                position: 'bottom',
                                horizontalAlign: 'center',
                                fontSize: '14px',
                                itemMargin: {
                                    horizontal: 8,
                                    vertical: 8,
                                },
                            },
                            grid: {
                                borderColor: '#e0e6ed',
                                padding: {
                                    left: 20,
                                    right: 20,
                                },
                            },
                            xaxis: {
                                categories,
                                axisBorder: {
                                    show: true,
                                    color: '#e0e6ed',
                                },
                            },
                            yaxis: {
                                tickAmount: 6,
                                labels: {
                                    offsetX: 0,
                                },
                            },
                            fill: {
                                type: 'gradient',
                                gradient: {
                                    shade: 'light',
                                    type: 'vertical',
                                    shadeIntensity: 0.3,
                                    inverseColors: false,
                                    opacityFrom: 1,
                                    opacityTo: 0.8,
                                    stops: [0, 100],
                                },
                            },
                            tooltip: {
                                marker: {
                                    show: true,
                                },
                            },
                        },
                    });
                } else {
                    console.error('Error in API responses');
                }
            } catch (err) {
                console.error('Error fetching monthly data', err);
            }
        };

        fetchMonthlyData();
    }, [year]);

    return (
        <div className="panel  h-full p-0 col-span-2 md:col-span-2 lg:col-span-4">
            <div className="flex items-start justify-between dark:text-white-light mb-5 p-5 border-b border-white-light dark:border-[#1b2e4b]">
                <div className='flex justify-between items-center gap-x-2'>
                    <h5 className="font-bold text-lg text-black dark:text-white-light">Yearly Data of </h5>
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
                options={chartData.options}
                series={chartData.series}
                type="bar"
                height={360}
                className="overflow-hidden"
            />
        </div >
    );
}

export default MonthlyDataComponent;
