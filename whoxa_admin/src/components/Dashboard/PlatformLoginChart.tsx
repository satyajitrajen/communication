import React, { useEffect, useState } from "react";
import {
    ResponsiveContainer,
    Pie,
    PieChart,
    Cell,
} from "recharts";
import useApiPost from "../../hooks/PostData";

const COLORS = ["#2CD4B2", "#4B9EFF", "#FFB84C", "#A5A5A5"]; // web, mobile, both, others

const PlatformActivityChart = () => {
    const { postData } = useApiPost();
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const response = await postData("Get-Platform-Activity", {});
                if (response.success && response.result) {
                    const { web, mobile, both, others } = response.result;

                    const totalCount = web + mobile + both + others;
                    setTotal(totalCount);

                    // split "both" between web + mobile
                    const webCount = web + both / 2;
                    const mobileCount = mobile + both / 2;

                    const webPercent = ((webCount / totalCount) * 100).toFixed(2);
                    const mobilePercent = ((mobileCount / totalCount) * 100).toFixed(2);
                    const othersPercent = ((others / totalCount) * 100).toFixed(2);

                    const formattedData = [
                        { name: "Website", value: webCount, percent: webPercent },
                        { name: "Mobile App", value: mobileCount, percent: mobilePercent },
                        // { name: "Others", value: others, percent: othersPercent },
                    ];

                    setData(formattedData);
                }
            } catch (error) {
                console.error("Failed to fetch platform activity:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="panel text-black dark:text-white-light shadow-default p-4 w-full  rounded-lg mt-5">
            <h2 className="text-lg font-semibold text-table-header-text">
                Platform Activity
            </h2>

            {/* Half Circle Pie */}
            <div className="relative flex">
                <ResponsiveContainer height={240} width="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="90%"
                            startAngle={180}
                            endAngle={0}
                            innerRadius={80}
                            outerRadius={100}
                            dataKey="value"
                            paddingAngle={2}
                            label={({ percent }) => `${percent}%`}
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>

                {/* Center text */}
                <div className="absolute text-center transform -translate-x-1/2 bottom-7 left-1/2">
                    <h2 className="text-text-muted text-xl font-semibold">
                        {isLoading ? "..." : total}
                    </h2>
                    <p className="text-text-muted text-sm font-medium">
                        Total Users
                    </p>
                </div>
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-6 mt-2">
                {isLoading ? (
                    <div className="text-text-muted">Loading platform data...</div>
                ) : data.length > 0 ? (
                    data.map((entry, index) => (
                        <div key={index} className="flex items-start gap-2">
                            <div
                                className="w-4 h-4 rounded-sm mt-1"
                                style={{
                                    backgroundColor: COLORS[index % COLORS.length],
                                }}
                            />
                            <div className="flex flex-col items-start">
                                <span className="font-poppins text-text-muted text-sm">
                                    {entry.name}
                                </span>
                                <span className="text-text-muted text-sm">
                                    {entry.percent}%
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-text-muted">No platform data available</div>
                )}
            </div>
        </div>
    );
};

export default PlatformActivityChart;
