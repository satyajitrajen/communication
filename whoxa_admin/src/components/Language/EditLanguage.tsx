import React, { useState, useEffect, useMemo } from 'react';
import useApiPost from '../../hooks/PostData';
import Swal from 'sweetalert2';
import Select from 'react-select';
import CountryList from 'country-list';
import toast from 'react-hot-toast';

const getCountryNameByCode = (code: string) => {
    const countryData = CountryList.getData();
    const country = countryData.find(c => c.code === code);
    return country ? country.name : null;
};

const getCountryCodeByName = (name: string) => {
    const countryData = CountryList.getData();
    const country = countryData.find(c => c.name === name);
    return country ? country.code : null;
};

interface EditLanguageProps {
    languageName: string;
    languageCountry: string; // Expecting country code
    language_alignment: string;
    status_id: string;
    onClose: () => void;
}

const EditLanguage: React.FC<EditLanguageProps> = ({ languageName: initialLanguageName, languageCountry: initialLanguageCountry, language_alignment:initialLanguageAlignment,  status_id, onClose }) => {
    const directionOptions = [
        { value: 'ltr', label: 'Left to Right (LTR)' },
        { value: 'rtl', label: 'Right to Left (RTL)' },
    ];
    const [languageName, setLanguageName] = useState<string>(initialLanguageName);
    const [languageCountry, setLanguageCountry] = useState<{ value: string; label: string } | null>(null);
    const [language_alignment, setLanguage_alignment] = useState<{ value: string; label: string } | null>(
        directionOptions.find((option) => option.value === initialLanguageAlignment) || null
    );

    const { postData } = useApiPost();

    const countryOptions = useMemo(() =>
        CountryList.getData().map((country) => ({
            value: country.code, // e.g., 'AE'
            label: country.name, // e.g., 'United Arab Emirates'
        })),
        []
    );

    useEffect(() => {
        if (initialLanguageCountry) {
            const countryName = getCountryNameByCode(initialLanguageCountry);
            if (countryName) {
                const country = countryOptions.find(c => c.label === countryName);
                setLanguageCountry(country || null);
            }
        }
    }, [initialLanguageCountry, countryOptions]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        
        if (!languageName || !languageCountry) {
            Swal.fire({
                icon: 'warning',
                title: 'Validation Error',
                text: 'Please fill in all fields.',
                confirmButtonText: 'OK',
            });
            return;
        }

        try {
            const response = await postData('Edit-Language', {
                status_id,
                language_name: languageName,
                language_country: languageCountry?.value,
                language_alignment: language_alignment?.value,
                default_status: false
            });
            console.log(response);


            if (response.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Language updated successfully.',
                    confirmButtonText: 'OK',
                }).then(() => onClose());
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.message || 'Failed to update language.',
                    confirmButtonText: 'OK',
                });
            }
        } catch (error) {

            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred while updating the language.',
                confirmButtonText: 'OK',
            });
        }
    };

    const formatOptionLabel = ({ value, label }: { value: string; label: string }) => (
        <div className="flex items-center">
            <img
                width="20"
                src={`/assets/images/flags/${value.toUpperCase()}.svg`}
                className="max-w-none mr-2"
                alt="flag"
            />
            {label}
        </div>
    );

    return (
        <div className="max-w-md mx-auto p-4 h-[46vh]">
            <div className='pt-16'>
                <h2 className="text-xl font-bold mb-4">Edit Language</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="languageName" className="block text-sm font-medium text-gray-700">
                            Language Name
                        </label>
                        <input
                            id="languageName"
                            type="text"
                            value={languageName}
                            onChange={(e) => setLanguageName(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm lg:text-lg px-3 py-2"
                            aria-required="true"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="languageCountry" className="block text-sm font-medium text-gray-700">
                            Language Country
                        </label>
                        <Select
                            id="languageCountry"
                            options={countryOptions}
                            value={languageCountry}
                            onChange={(selectedOption) => setLanguageCountry(selectedOption as { value: string; label: string })}
                            className="mt-1"
                            placeholder="Select a country"
                            isClearable
                            aria-required="true"
                            formatOptionLabel={formatOptionLabel}
                            menuPortalTarget={document.body}
                            styles={{
                                menuPortal: (base) => ({
                                    ...base,
                                    zIndex: 9999,
                                }),
                            }}
                        />
                    </div>
                    <div>
                        <label htmlFor="textDirection" className="block text-sm font-medium text-gray-700">
                            Text Direction
                        </label>
                        <Select
                            id="languageAlignment"
                            options={directionOptions}
                            value={language_alignment}
                            onChange={(selectedOption) => setLanguage_alignment(selectedOption)}
                            placeholder="Select alignment"
                            isClearable
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Update Language
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditLanguage;
