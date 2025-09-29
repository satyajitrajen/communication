// import { useEffect, useState } from "react";
// import useApiPost from "../../hooks/PostData";

// const Last30hourUser = () => {
//     const { postData } = useApiPost();
//     const [totalUsers, setTotalUsers] = useState(0);
//     const [countryList, setCountryList] = useState([]);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const response = await postData('Get-Active-Users-last-30-mins', {});
//                 if (response.success) {
//                     setTotalUsers(response.totalActiveUsers || 0);

//                     // Slice top 5 countries and filter out empty ones optionally
//                     const topCountries = (response.activeCountries || [])
//                         .filter(c => c.country) // optionally filter out blank countries
//                         .slice(0, 5);

//                     setCountryList(topCountries);
//                 }
//             } catch (error) {
//                 console.error('Failed to fetch platform activity:', error);
//             }
//         };

//         fetchData();
//     }, []);

//     return (
//         <div className="panel my-3  h-full p-0 border-0 overflow-hidden">
//             {/* Header */}
//             <div className="p-6 bg-gradient-to-r from-yellow-500 to-yellow-200 dark:to-yellow-950 ">
//                 <div className="text-black dark:text-white flex justify-between items-center">
//                     <div className="flex flex-col ">

//                         <p className="text-xl">Active Users</p>
//                         <span className="text-gray-400">Last 30 Mins</span>
//                     </div>
//                     <h5 className="ltr:ml-auto rtl:mr-auto text-2xl">
//                         <span className="text-white-light">Total: </span>{totalUsers}
//                     </h5>
//                 </div>
//             </div>

//             {/* Country List */}
//             {countryList.length == 0 ? (
//                 <div
//                     className="flex items-center justify-center"
//                     style={{ height: "calc(100% - 100px)" }} // Replace 80px with your desired subtraction
//                 >
//                     <div className="text-gray-500 dark:text-gray-400 text-sm">No users</div>
//                 </div>
//             ) : (
//                     <ul className="space-y-3">
//                         {countryList.map((country, index) => (
//                             <li key={index}>
//                                 <div className="flex justify-between text-[#515365] dark:text-gray-200 my-2 mx-4">
//                                     <div className="flex gap-2 items-center">
//                                         <img
//                                             width="24"
//                                             src={`/assets/images/flags/${country.country.substring(0, 2).toUpperCase()}.svg`}
//                                             className="max-w-none"
//                                             alt="flag"
//                                         />
//                                         <span>{country.country || 'Unknown'}</span>
//                                     </div>
//                                     <span>{country.count}</span>
//                                 </div>

//                                 {/* Yellow underline with side margin */}
//                                 <div className="w-full h-1">
//                                     <div className="bg-yellow-400 mt-1 mx-4 rounded h-0.5"></div>
//                                 </div>
//                             </li>
//                         ))}
//                     </ul>

//             )}
//         </div>
//     );
// };

// export default Last30hourUser;





import { useEffect, useState } from "react";
import useApiPost from "../../hooks/PostData";
import { Chart } from 'react-google-charts';

const Last30hourUser = () => {
    const { postData } = useApiPost();
    const [totalUsers, setTotalUsers] = useState(0);
    const [isLoading, setIsloadoing] = useState(false);

    const [countryList, setCountryList] = useState([]);
    const dotColors = ['#22d3ee', '#0891b2', '#0ea5e9'];

    const mapData = [
        ['Country', 'Active Users'],
        ...countryList.map((country: any) => [
            country.country,
            typeof country.count === 'string' ? parseInt(country.count, 10) : country.count
        ])
    ];
    const    colors = ['#e0f7ff', '#0891b2']

    const maxUsers = countryList.reduce((max: number, country: any) => {
        const count = typeof country.count === 'string' ? parseInt(country.count, 10) : country.count || 0;
        return Math.max(max, count);
    }, 0);
    const mapOptions = {
        colorAxis: {
            colors: colors,
            minValue: 0,
            maxValue: maxUsers,
        },
        backgroundColor: 'transparent',
        datalessRegionColor: '#f1f5f9',
        defaultColor: '#f1f5f9',
        legend: 'none',
        tooltip: {
            textStyle: {
                fontSize: 12,
            },
        },
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsloadoing(true)
                const response = await postData('Get-Active-Users-last-30-mins', {});
                if (response.success) {
                    setTotalUsers(response.totalActiveUsers || 0);

                    // Slice top 5 countries and filter out empty ones optionally
                    const topCountries = (response.activeCountries || [])
                        .filter(c => c.country) // optionally filter out blank countries
                        .slice(0, 5);

                    setCountryList(topCountries);
                }
                setIsloadoing(false)

            } catch (error) {
                console.error('Failed to fetch platform activity:', error);
            }
        };

        fetchData();
    }, []);
    const chartContainerStyle = {
        width: '100%',
        height: '100%',
    };

    return (
        <div className="panel text-black dark:text-white-light shadow-default col-span-3 p-6 rounded-lg  mt-5">
            {/* Header */}


            <h2 className="text-lg font-semibold text-table-header-text mb-2">Active Users by Country  <span className="font-normal text-sm">(Last 30 Minutes Users)</span>
            </h2>
            <div className="mb-6">
                <div className="text-7xl font-bold text-table-header-text mb-8">
                    {isLoading ? '...' : totalUsers.toLocaleString()}
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-center">
                {/* Left side - Table */}
                {/* Left side - Table */}
                <div className='col-span-2 self-start   mt-4'>
                    <div className="text-black dark:text-white-light rounded-lg  max-h-[330px] overflow-y-auto border border-table-divider">
                        {/* Table Header */}
                        <div className='px-2 py-3 '>
                            <div className="grid grid-cols-2 gap-4 px-4 py-3 bg-table-header-bg rounded-lg">
                                <div className="text-sm font-medium text-table-header-text uppercase tracking-wide w-full">
                                    Country
                                </div>
                                <div className="text-sm font-medium text-table-header-text uppercase tracking-wide">
                                    Active User
                                </div>
                            </div>
                        </div>

                        {/* Table Rows - Show top 3 countries or "No Data" */}
                        {countryList.length > 0 ? (
                            countryList.map((country:any, index) => {
                                const count = typeof country.count === 'string'
                                    ? parseInt(country.count, 10)
                                    : country.count;
                                const dotColor = dotColors[index % dotColors.length];

                                return (
                                    <div
                                        key={index}
                                        className="grid grid-cols-2 gap-4 px-4 py-4  border-b border-table-divider last:border-b-0"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-3 h-3 rounded-full flex-shrink-0"
                                                style={{ backgroundColor: dotColor }}
                                            ></div>
                                            <div className="flex gap-2 items-center">
                                                <img
                                                    width="24"
                                                    src={`/assets/images/flags/${country.country.substring(0, 2).toUpperCase()}.svg`}
                                                    className="max-w-none"
                                                    alt="flag"
                                                />
                                                <span>{country.country || 'Unknown'}</span>
                                            </div>
                                        </div>
                                        <div className="text-text-muted font-semibold">
                                            {count}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="flex items-center justify-center   h-[260px] text-text-muted font-medium">
                                No Data
                            </div>
                        )}
                    </div>
                </div>


                {/* Right side - Map */}
                <div className="relative  col-span-2">
                    <div className="text-black dark:text-white-light rounded-lg p-4 h-full">
                        <div className="h-full w-full ">
                            <div style={chartContainerStyle}>
                                <Chart
                                    chartType="GeoChart"
                                    width="100%"
                                    height="100%"
                                    data={mapData}
                                    options={mapOptions}
                                />
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </div>
    );
};

export default Last30hourUser;
