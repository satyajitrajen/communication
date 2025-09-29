import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import useApiPost from '../../hooks/PostData';

const LoginTypeChart = ({ className }: { className?: string }) => {
    const { postData } = useApiPost();
    const [email, setEmails] = useState<number>(0); // default to prevent donut bug
    const [mobile, setMobile] = useState<number>(); // default to prevent donut bug
    const [hasData, setHasData] = useState(false);

    const labels = ['Email', 'Mobile Number'];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await postData('Get-Login-types', {});
                if (response.success && response.result) {
                    const { emails, phone } = response.result;
                   
                    const total = emails + phone;

                    if (total === 0) {
                        setEmails(1)
                        setMobile(1)
                        setHasData(false);
                    } else {
                        setEmails(emails)
                        setMobile(phone)
                        setHasData(true);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch login types:', error);
            }
        };

        fetchData();
    }, []);

    const donutChart = {
        series: [email , mobile],
        options: {
            chart: {
                height: 300,
                type: 'donut',
                toolbar: { show: false },
                zoom: { enabled: false },
            },
            stroke: {
                show: true,
            },
            labels: labels,
            colors: hasData ? ['#4361ee', '#805dca'] : ['#e0e0e0', '#f0f0f0'],
            responsive: [
                {
                    breakpoint: 2,
                    options: {
                        chart: {
                            width: 200,
                        },
                    },
                },
            ],
            legend: {
                position: 'bottom',
            },
            dataLabels: {
                enabled: hasData,
            },
            tooltip: {
                enabled: hasData,
                y: {
                    formatter: function (val: number) {
                        return `${val} Users`;
                    }
                }
            },

        },
    };

    return (
        <div className={className}>
            <h2 className="text-xl font-bold  text-pretty text-black dark:text-white ">Customer By login</h2>

            <ReactApexChart
                options={donutChart.options}
                series={donutChart.series}
                type="donut"
                height={300}
            />
            {!hasData && (
                <p className="text-center text-sm text-gray-500 mt-2">No user login data found.</p>
            )}
        </div>
    );
};

export default LoginTypeChart;
