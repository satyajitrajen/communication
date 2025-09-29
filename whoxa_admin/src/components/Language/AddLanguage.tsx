import React, { useState } from 'react';
import useApiPost from '../../hooks/PostData'; // Adjust path as necessary
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Select from 'react-select'; // Import react-select
import { countries } from 'countries-list';
import toast from 'react-hot-toast';

interface AddLanguageProps {
    onClose: () => void; // Define the onClose prop type
}
// List of countries for the dropdown with flag URLs
const countryOptions = Object.keys(countries).map((key) => ({
    value: key,
    label: countries[key].name,
}));
const directionOptions = [
    { value: 'ltr', label: 'Left to Right (LTR)' },
    { value: 'rtl', label: 'Right to Left (RTL)' },
];
const AddLanguage: React.FC<AddLanguageProps> = ({ onClose }) => {
    const [languageName, setLanguageName] = useState<string>('');
    const [languageCountry, setLanguageCountry] = useState<{ value: string; label: string } | null>(null); // Updated type
    const [language_alignment, setLanguage_alignment] = useState<{ value: string; label: string } | null>(null); // Updated type
    const { postData } = useApiPost();
    const navigate = useNavigate();

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
            const response = await postData('Add-a-new-language', {
                language: languageName,
                country: languageCountry.value, // Use the country code
                language_alignment: language_alignment?.value // Use the country code
            });

            if (response.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Language added successfully.',
                    confirmButtonText: 'OK',
                }).then(() => {
                    navigate('/admin/System-Setting/LanguageSettings'); // Adjust path as necessary
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.message || 'Failed to add language.',
                    confirmButtonText: 'OK',
                });
            }
        } catch (error) {
            let errorMessage = 'An error occurred while adding the language.';

            if (error instanceof Error) {
                errorMessage = error.message;
            }

            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: errorMessage,
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
        <div className="max-w-sm sm:max-w-md mx-auto p-4 h-auto md:h-auto">
            <div className="pt-6 md:pt-6">
                <h2 className="text-lg md:text-xl font-bold mb-4 text-center">
                    Add New Language
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label
                            htmlFor="languageName"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            Language Name
                        </label>
                        <input
                            id="languageName"
                            type="text"
                            value={languageName}
                            onChange={(e) => setLanguageName(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm lg:text-base px-3 py-2 dark:bg-[#1e293b] dark:text-white"
                            aria-required="true"
                            required
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="languageCountry"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            Language Country
                        </label>
                        <Select
                            id="languageCountry"
                            options={countryOptions}
                            value={languageCountry}
                            onChange={(selectedOption) =>
                                setLanguageCountry(selectedOption as { value: string; label: string })
                            }
                            className="mt-1"
                            placeholder="Select a country"
                            isClearable
                            required
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
                        <label
                            htmlFor="textDirection"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            Text Direction
                        </label>
                        <Select
                            id="textDirection"
                            options={directionOptions}
                            value={language_alignment}
                            onChange={(selectedOption) => setLanguage_alignment(selectedOption)}
                            className="mt-1"
                            placeholder="Select text direction"
                            isClearable
                            required
                            aria-required="true"
                            menuPortalTarget={document.body}
                            styles={{
                                menuPortal: (base) => ({
                                    ...base,
                                    zIndex: 9999,
                                }),
                            }}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md text-sm md:text-base hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Add Language
                    </button>
                </form>
            </div>
        </div>


    );
};

export default AddLanguage;
