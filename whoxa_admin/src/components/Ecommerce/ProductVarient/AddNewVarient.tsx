import React, { useState } from 'react';
import axios from 'axios';

const AddVariantForm = ({ productId }) => {
    const [color, setColor] = useState('');
    const [size, setSize] = useState('');
    const [type, setType] = useState('');
    const [inStock, setInStock] = useState('');
    const [images, setImages] = useState([]);

    const handleImageChange = (e) => {
        setImages([...e.target.files]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('product_id', productId);
        formData.append('varient', JSON.stringify({ color, size, type, in_stock: inStock }));

        images.forEach((image) => {
            formData.append('varientImages', image);
        });

        try {
            const response = await axios.post('/api/your-endpoint/addVarient', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                alert('Variant added successfully');
            } else {
                alert('Failed to add variant');
            }
        } catch (error) {
            console.error('Error adding variant:', error);
            alert('Error adding variant');
        }
    };

    return (
        <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div>
                <label htmlFor="color">Color:</label>
                <input
                    type="text"
                    id="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="size">Size:</label>
                <input
                    type="text"
                    id="size"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="type">Type:</label>
                <input
                    type="text"
                    id="type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="inStock">In Stock:</label>
                <input
                    type="number"
                    id="inStock"
                    value={inStock}
                    onChange={(e) => setInStock(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="images">Images:</label>
                <input
                    type="file"
                    id="images"
                    multiple
                    onChange={handleImageChange}
                />
            </div>
            <button type="submit">Add Variant</button>
        </form>
    );
};

export default AddVariantForm;