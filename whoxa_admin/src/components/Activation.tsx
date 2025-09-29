import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import useApiPost from "../hooks/PostData";
import { BiSolidCheckboxChecked } from "react-icons/bi";
import toast from "react-hot-toast";

function Activation() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [purchaseCode, setPurchaseCode] = useState<string | null>(null);

    const { postData } = useApiPost();



    const GetPurchaseCode = async () => {
        setLoading(true); // Start loading
        try {
           
            const response = await postData("/get-purchasecode", {}); // API call
            if (response && response.status) {
                setPurchaseCode(response.purchase_code)
            } else {
                Swal.fire("Error!", response.message || "An error occurred.", "error");
                setError(response.message || "Unknown error");
            }
        } catch (err: any) {
            Swal.fire("Error!", "Error deactivating the project.", "error");
            setError("Error deactivating the project");
        } finally {
            setLoading(false); // Stop loading
        }
    }
    useEffect(() => {
        GetPurchaseCode(); // Correctly pass the function reference
    }, []); // Empty dependency array to call only once on mount

    const Deactivate = async () => {
        // Show confirmation dialog
        const confirmation = await Swal.fire({
            title: "Are you sure?",
            text: "Do you really want to deactivate this project?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, deactivate it!",
            cancelButtonText: "Cancel",
        });
        
        if (confirmation.isConfirmed) {
            setLoading(true); // Start loading
            try {
                const response = await postData("de-activation", {}); // API call
                console.log(response);

                if (response && response.status) {
                    Swal.fire("Deactivated!", response.message, "success");
                    setError(null); // Clear any errors
                } else {
                    Swal.fire("Error!", response.message || "An error occurred.", "error");
                    setError(response.message || "Unknown error");
                }
            } catch (err: any) {
                Swal.fire("Error!", "Error deactivating the project.", "error");
                setError("Error deactivating the project");
            } finally {
                setLoading(false); // Stop loading
            }
        }
    };

    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse text-sm text-gray-700">
                <li>
                    <Link to="#" className="text-blue-500 hover:underline">
                        Project Activation
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2 text-gray-500">
                    <span>Purchase Code</span>
                </li>
            </ul>
            <div className="text-2xl text-dark mb-3 mt-3">Purchase Code</div>
            <div className="panel flex flex-col  items-start gap-5">
                <div className="flex justify-center gap-5 items-center w-full">
                    <input id="appEmail" type="text" value={purchaseCode} placeholder="Your Purchase Code" className="form-input max-w-full" required disabled />
                    {/* <BiSolidCheckboxChecked color="green" size={50} /> */}
                </div>
                <button
                    type="button"
                    onClick={Deactivate}
                    className="btn btn-danger"
                    disabled={loading}
                >
                    {loading ? (
                        <span className="loader">Deactivate This Project</span> // Add your loader class here
                    ) : (
                        <span>Deactivate This Project</span>
                    )}
                </button>
            </div>
        </div>
    );
}

export default Activation;
