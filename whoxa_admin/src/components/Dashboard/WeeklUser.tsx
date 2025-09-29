import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import useApiPost from '../../hooks/PostData'; // Adjust path as necessary
import { RiUser3Line } from "react-icons/ri";

function WeeklyNewUserComponent() {
    const [chartData, setChartData] = useState({
        series: [],
        options: {}
    });
    const { loading, postData } = useApiPost();

    useEffect(() => {
        const fetchWeeklyUserData = async () => {
            try {
                const response = await postData('Get-Weekly-Users', {}); // Replace with your actual endpoint and request body
                if (response && response.success) {
                    const daysOfWeek = response.weeklyUserCounts.map(item => item.day.substring(0, 3).toUpperCase());
                    const counts = response.weeklyUserCounts.map(item => item.count);

                    // Get the max value for calculating the remaining height
                    const maxValue = Math.max(...counts);
                    const remainingCounts = counts.map(value => maxValue - value);

                    setChartData({
                        series: [
                            {
                                name: 'New Users',
                                data: counts, // Actual data
                            },
                            {
                                name: 'Behind',
                                data: remainingCounts, // Remaining height to fill up to max
                            },
                        ],
                        options: {
                            chart: {
                                height: 160,
                                type: 'bar',
                                fontFamily: 'Nunito, sans-serif',
                                toolbar: {
                                    show: false,
                                },
                                stacked: true, // Stack the bars
                            },
                            dataLabels: {
                                enabled: false,
                            },
                            stroke: {
                                show: true,
                                width: 1,
                            },
                            colors: ['#e2a03f', '#e0e6ed'], // Use a different color for the remaining height
                            responsive: [
                                {
                                    breakpoint: 480,
                                    options: {
                                        legend: {
                                            position: 'bottom',
                                            offsetX: -10,
                                            offsetY: 0,
                                        },
                                    },
                                },
                            ],
                            xaxis: {
                                labels: {
                                    show: true, // Enable the labels on the x-axis
                                    rotate: -45, // Optional: rotates labels to avoid overlap
                                    style: {
                                        colors: [], // Optional: add specific colors if you want
                                        fontSize: '12px', // Font size for the labels
                                        fontFamily: 'Nunito, sans-serif',
                                    },
                                },
                                categories: daysOfWeek, // Set the daysOfWeek array to the x-axis categories
                                axisBorder: {
                                    show: false, // Hides the border line on the x-axis
                                },
                                axisTicks: {
                                    show: false, // Hides the ticks on the x-axis
                                },
                            },
                            yaxis: {
                                show: false,
                            },
                            fill: {
                                opacity: 1,
                            },
                            plotOptions: {
                                bar: {
                                    horizontal: false,
                                    columnWidth: '35%',

                                },
                            },
                            legend: {
                                show: false,
                            },
                            grid: {
                                show: false, // Ensures no grid lines are shown
                                xaxis: {
                                    lines: {
                                        show: false, // Ensures no lines on the x-axis
                                    },
                                },
                                padding: {
                                    top: 10,
                                    right: -20,
                                    bottom: 0,
                                    left: -20,
                                },
                            },
                        },
                    });

                } else {
                    console.error(response.message || 'Error fetching weekly user data');
                }
            } catch (err) {
                console.error('Error fetching weekly user data', err);
            }
        };

        fetchWeeklyUserData();
    }, []);

    return (
        <div className="my-3 panel h-full sm:col-span-2 xl:col-span-1.5">
            <div className="flex items-center mb-5">
                <h5 className="font-bold text-lg text-black dark:text-white-light">
                    Weekly New Users
                    <span className="block text-white-dark text-sm font-normal">Go to columns for details.</span>
                </h5>
                <div className="ltr:ml-auto rtl:mr-auto relative">
                    <div className="w-11 h-11 text-warning bg-[#ffeccb] dark:bg-warning dark:text-[#ffeccb] grid place-content-center rounded-full">
                        <RiUser3Line className='text-2xl' />
                    </div>
                </div>
            </div>
            <div>
                <div className="bg-white dark:bg-black rounded-lg overflow-hidden">
                    {loading ? (
                        <div className="min-h-[325px] grid place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
                            <span className="animate-spin border-2 border-black dark:border-white !border-l-transparent  rounded-full w-5 h-5 inline-flex"></span>
                        </div>
                    ) : (
                        <ReactApexChart series={chartData.series} options={chartData.options} type="bar" height={250} />
                    )}
                </div>
            </div>
        </div>
    );
}

export default WeeklyNewUserComponent;
