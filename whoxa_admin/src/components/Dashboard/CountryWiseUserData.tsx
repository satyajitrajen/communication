import React, { useEffect, useState } from 'react';
import useApiPost from '../../hooks/PostData'; // Adjust path as necessary
import Dropdown from '../Dropdown';
import IconHorizontalDots from '../Icon/IconHorizontalDots';
import { NavLink } from 'react-router-dom';

const CountryWiseUserData = ({ currentPage, limit }) => {
    const [countryData, setCountryData] = useState([]);
    const { loading, error, postData } = useApiPost();

    const colorGradients = [
        'from-[#00aaff] to-[#0044cc]',
        'from-[#ff7f50] to-[#ff4500]',
        'from-[#32cd32] to-[#006400]',
        // Additional colors
    ];

    useEffect(() => {
        const fetchCountryData = async () => {
            try {
                const response = await postData('Get-Countrywise-trafic', { page: currentPage, pageSize: limit });
                console.log("resss" , response);
                
                if (response && response.success) {
                    setCountryData(response.data);
                } else {
                    console.error(response.message || 'Error fetching country data');
                }
            } catch (err) {
                console.error('Error fetching country data', err);
            }
        };

        fetchCountryData();
    }, [currentPage, limit]); // Re-fetch data when currentPage or limit changes
    if (loading) return <div className='h-full w-full panel flex justify-center items-center' >
        <span className="animate-spin border-[3px] border-transparent border-l-primary rounded-full w-28 h-28 inline-block align-middle m-auto mb-10"></span>
    </div>

    if (error) return <div className="error">Error fetching data</div>;

    return (
        <div className="my-3 h-full   flex flex-col space-y-5 sm:col-span-2 xl:col-span-2 panel">
            <div className='flex justify-between'>
                <div className="flex items-start justify-between mb-5">
                    <h5 className="font-bold text-lg text-black dark:text-white-light">Countrywise Users</h5>
                </div>
                <div className="dropdown">
                    <Dropdown
                        offset={[0, 5]}
                        placement={'bottom-start'}
                        btnClassName="hover:text-primary"
                        button={<IconHorizontalDots className="text-black/70 dark:text-white/70 hover:!text-primary" />}
                    >
                        <ul>
                            <li>
                                <NavLink to="/admin/users/countrywise-Analysis" className="inline-block">
                                    <button type="button" className="btn-class">
                                        View
                                    </button>
                                </NavLink>
                            </li>

                        </ul>
                    </Dropdown>
                </div>
            </div>
            {countryData.map((country, index) => (
                <div key={index} className="flex items-center">
                    <div className="flex w-9 h-9 justify-center items-center">
                        <img
                            src={`/assets/images/flags/${country.country.substring(0, 2).toUpperCase()}.svg`}
                            className="max-w-none w-5 h-5"
                            alt={`${country.country} flag`}
                        />
                    </div>
                    <div className="px-3 flex-initial w-full">
                        <div className="w-summary-info flex justify-between font-semibold text-white-dark mb-1">
                            <h6>{country.country_full_name}</h6>
                            <p className="ltr:ml-auto rtl:mr-auto text-xs">{country.percentage}%</p>
                        </div>
                        <div>
                            <div className="w-full rounded-full h-5 p-1 bg-dark-light overflow-hidden shadow-3xl dark:bg-dark-light/10 dark:shadow-none">
                                <div
                                    className={`bg-gradient-to-r ${colorGradients[index % colorGradients.length]} w-full h-full rounded-full`}
                                    style={{ width: `${country.percentage}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CountryWiseUserData;
