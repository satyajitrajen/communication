import React, { useState, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';
import useApiPost from "../../../hooks/PostData";
import { Link, useNavigate } from 'react-router-dom';

interface Product {
    product_thumbnail: string;
    product_id: number;
    Product_name: string;
    Product_desc: string;
    original_price: number;
    sale_price: number;
    createdAt: string;
    updatedAt: string;
    category_id: number | null;
    store_id: number;
}

const ListAllProduct: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const { postData } = useApiPost();
    const navigate = useNavigate();

    const limit = 10;

    const fetchProducts = useCallback(async () => {
        console.log('Fetching products'); // Debug log
        setLoading(true);
        try {
            const response = await postData('latest-product', { page: currentPage, limit });
            console.log(response.latestProducts);
            
            if (response && response.success === true) {
                setProducts(response.latestProducts);
                console.log(products);

                // Ensure total is a valid number
                const totalCount = response.pagination.total || 0;
                setTotalPages(Math.ceil(totalCount / limit));
            }

        } catch (err: any) {
            setError('Error fetching products');
        } finally {
            setLoading(false);
        }
    }, [currentPage, limit, postData]);

    useEffect(() => {
        fetchProducts();
    }, [currentPage]);


    const handleView = (product: Product) => {
        navigate(`/admin/products/ProductById`, { state: { product_id: product.product_id } });
    };
    const handleEdit = (product: Product) => {
        navigate(`/products/editProduct`, { state: { product_id: product.product_id } });
    };

    const handleDelete = async (product: Product) => {
        const result = await Swal.fire({
            icon: 'question',
            title: 'Are you sure?',
            text: `Do you really want to delete product ${product.product_id}?`,
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it',
            customClass: {
                confirmButton: 'bg-red-500 text-white',
                cancelButton: 'bg-gray-300 text-black'
            },
            padding: '2em',
        });

        if (result.isConfirmed) {
            try {
                const response = await postData('deleteProduct', { product_id: product.product_id });
                
                if (response.success === 'true') {
                    Swal.fire('Deleted!', 'Product has been deleted successfully.', 'success');
                    setProducts(products.filter(p => p.product_id !== product.product_id));
                } else {
                    Swal.fire('Error!', response.message, 'error');
                }
            } catch (error) {
                console.error('Error deleting product:', error);
                Swal.fire('Error!', 'There was a problem deleting the product.', 'error');
            }
        }
    };

    if (loading) return <div className="min-h-[325px] grid place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
        <span className="animate-spin border-2 border-black dark:border-white !border-l-transparent  rounded-full w-5 h-5 inline-flex"></span>
    </div>;
    if (error) return <p>{error}</p>;

    return (
        <div className="p-4">
            <ul className="flex space-x-2 rtl:space-x-reverse text-sm text-gray-700">
                <li>
                    <Link to="#" className="text-blue-500 hover:underline">
                        Products
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2 text-gray-500">
                    <span>Product List</span>
                </li>
            </ul>
            <div className="mt-6 overflow-x-auto">
                <table className="min-w-full rounded-md bg-white dark:bg-gray-900 dark:text-gray-200 border-gray-800  shadow-md">
                    <thead className="bg-gray-800 border-b border-gray-900">
                        <tr>
                            <th className="p-4 text-left">ID</th>
                            <th className="p-4 text-left">Thumbnail</th>
                            <th className="p-4 text-left">Name</th>
                            <th className="p-4 text-left">Description</th>
                            <th className="p-4 text-left">Original Price</th>
                            <th className="p-4 text-left">Sale Price</th>
                            <th className="p-4 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.product_id} className="border-b  border-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800">
                                <td className="p-4">{product.product_id}</td>
                                <td className="p-4">
                                    <div className='relative rounded-full w-16 h-16 flex justify-center bg-gray-300 dark:bg-gray-700  overflow-hidden'>
                                        <img src={product.product_thumbnail} alt={`${product.Product_name}`} className=" inset-0 w-16 h-16 object-cover" />
                                    </div>
                                </td>
                                <td className="p-4">{product.Product_name}</td>
                                <td className="p-4">{product.Product_desc}</td>
                                <td className="p-4">{product.original_price}</td>
                                <td className="p-4">{product.sale_price}</td>
                                <td className="p-4 space-x-2 items-center m-auto ">
                                    <div className='flex space-x-2 items-center m-auto '>
                                        <button type="button" className="btn btn-info"
                                            onClick={() => handleView(product)}
                                        >
                                            View
                                        </button>
                                        <button type="button" className="btn btn-warning"
                                            onClick={() => handleEdit(product)}
                                        >
                                            Edit
                                        </button>
                                        <button type="button" className="btn btn-danger"
                                            onClick={() => handleDelete(product)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex m-auto mt-5">
                <ul className="inline-flex items-center space-x-1 rtl:space-x-reverse m-auto ">
                    <li>
                        <button
                            type="button"
                            onClick={() => setCurrentPage(prevPage => Math.max(prevPage - 1, 1))}
                            className="flex justify-center font-semibold px-3.5 py-2 rounded transition bg-white-light text-dark hover:text-white hover:bg-primary dark:text-white-light dark:bg-[#191e3a] dark:hover:bg-primary"
                        >
                            <svg width="12" height="12" fill="currentColor" viewBox="0 0 16 16" className="bi bi-chevron-left" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11.293 9.293a1 1 0 0 0 0-1.414L8.707 5.707a1 1 0 0 0-1.414 1.414L9.586 9l-2.293 2.293a1 1 0 0 0 1.414 1.414l2.293-2.293z" />
                            </svg>
                        </button>
                    </li>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <li key={index}>
                            <button
                                type="button"
                                onClick={() => setCurrentPage(index + 1)}
                                className={`flex justify-center font-semibold px-3.5 py-2 rounded transition bg-white-light text-dark hover:text-white hover:bg-primary dark:text-white-light dark:bg-[#191e3a] dark:hover:bg-primary ${currentPage === index + 1 ? 'bg-primary text-white dark:text-white-light dark:bg-primary' : 'bg-white-light text-dark hover:text-white hover:bg-primary dark:text-white-light dark:bg-[#191e3a] dark:hover:bg-primary'}`}
                            >
                                {index + 1}
                            </button>
                        </li>
                    ))}
                    <li>
                        <button
                            type="button"
                            onClick={() => setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages))}
                            className="flex justify-center font-semibold px-3.5 py-2 rounded transition bg-white-light text-dark hover:text-white hover:bg-primary dark:text-white-light dark:bg-[#191e3a] dark:hover:bg-primary"
                        >
                            <svg width="12" height="12" fill="currentColor" viewBox="0 0 16 16" className="bi bi-chevron-right" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.707 9.293a1 1 0 0 1 0-1.414L7.293 5.707a1 1 0 1 1 1.414 1.414L6.414 9l2.293 2.293a1 1 0 0 1-1.414 1.414l-2.293-2.293z" />
                            </svg>
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default ListAllProduct;
