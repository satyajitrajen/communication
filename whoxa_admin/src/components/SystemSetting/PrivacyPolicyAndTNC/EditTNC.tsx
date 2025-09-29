import React, { useState, useEffect, useRef } from 'react';
import useApiPost from '../../../hooks/PostData'; // Adjust the path as necessary
import Swal from 'sweetalert2';
import JoditEditor from 'jodit-react';
import toast from 'react-hot-toast';

function EditTermsConditions() {
    const editor = useRef(null);
    const [termsLink, setTermsLink] = useState<string>('');
    const [settingId, setSettingId] = useState<number>(0);
    const [initialTermsLink, setInitialTermsLink] = useState<string>('');
    const [isDirty, setIsDirty] = useState(false);
    const { loading, error, postData } = useApiPost(); // Destructure the hook
    const [updateFlag, setUpdateFlag] = useState(false);

    useEffect(() => {
        // Fetch existing settings when the component mounts
        const fetchSettings = async () => {
            try {
                const response = await postData('get-tncs');

                if (response.success) {
                    const TandCs = response.TandCs;

                    if (TandCs && TandCs.length > 0) {
                        const { Link, id } = TandCs[0];
                        setTermsLink(Link);
                        setInitialTermsLink(Link);
                        setSettingId(id);
                    }
                }
            } catch (err) {
                console.error('Failed to fetch terms and conditions settings:', err);
            }
        };

        fetchSettings();
    }, [updateFlag]);

    useEffect(() => {
        // Check if the content has changed
        setIsDirty(termsLink !== initialTermsLink && termsLink !== '');
    }, [termsLink, initialTermsLink]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        

        const formData = new FormData();
        formData.append('id', settingId.toString());
        formData.append('Link', termsLink);

        try {
            const response = await postData('edit-tncs', formData);
            if (response.success) {
                Swal.fire({
                    title: 'Success!',
                    text: 'Terms and Conditions updated successfully.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                });
                setUpdateFlag(!updateFlag); // Trigger update
            }
        } catch (err) {
            console.error('Failed to update terms and conditions:', err);
        }
    };

    return (
        <div className="mt-6">
            <form onSubmit={handleSubmit} className="mt-6 space-y-5 ">
                <div>
                    <label htmlFor="termsLink" className='text-2xl text-dark mb-3'>Terms and Conditions</label>
                    <JoditEditor
                        ref={editor}
                        value={termsLink}
                        onChange={newContent => setTermsLink(newContent)}
                        className="jodit-editor" // Add class for styling
                        config={{
                            readonly: false,
                            placeholder: 'Enter the Terms and Conditions',
                            height: 500, // Set the fixed height
                        }}
                    />
                </div>

                {loading && <p>Loading...</p>}
                {error && <p className="text-red-500">Failed to update terms and conditions. Please try again.</p>}

                <button type="submit" className="btn btn-primary !mt-2 btn-md" disabled={!isDirty}>
                    Submit
                </button>
            </form>
        </div>
    );
}

export default EditTermsConditions;
