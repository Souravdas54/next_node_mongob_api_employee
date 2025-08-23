'use client';

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import api from "../api/interceptors";
import ConnectionTest from "./connection";

const Formdata = ({ employee, onCancel }) => {
    const [imageFile, setImageFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const fileInputRef = useRef(null);

    const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm({
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            city: '',
            image: '',
            status: 'inactive'
        }
    });

    const imageValue = watch('image');

    useEffect(() => {
        if (employee) {
            reset({
                name: employee.name || '',
                email: employee.email || '',
                phone: employee.phone || '',
                city: employee.city || '',
                image: employee.image || '',
                status: employee.status || 'inactive'
            });
        }
    }, [employee, reset]);

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);

            const imageUrl = URL.createObjectURL(file);
            setValue('image', imageUrl);
        }
    };

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        setSubmitError('');

        try {
            const formData = new FormData();

            // Append all form data
            formData.append('name', data.name);
            formData.append('email', data.email);
            formData.append('phone', data.phone);
            formData.append('city', data.city);
            formData.append('status', data.status);

            // Handle image
            if (imageFile) {
                formData.append('image', imageFile);
            } else if (data.image && data.image.startsWith('http')) {
                formData.append('image', data.image);
            } else {
                throw new Error('Image is required');
            }

            let response;
            if (employee && employee._id) {
                response = await api.put(`/update/user/${employee._id}`, formData);
            } else {
                response = await api.post('/create/employee', formData); // Note: changed to /create/employee
            }

            if (response.status >= 200 && response.status < 300) {
                if (typeof onSave === 'function') {
                    onSave();
                } else {
                    console.warn('onSave is not a function');
                    reset();
                    setImageFile(null);
                    if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                    }
                }
            } else {
                throw new Error(`Server returned status: ${response.status}`);
            }

        } catch (error) {
            console.error('Error saving employee:', error);

            // Enhanced error handling
            if (error.response) {
                // Server responded with error status
                console.log('Full error response:', error.response);

                if (error.response.data) {
                    // Try to get detailed error message from backend
                    const errorData = error.response.data;
                    setSubmitError(errorData.message || errorData.error || `Server error: ${error.response.status}`);

                    // Log detailed error info for debugging
                    if (errorData.errors) {
                        console.log('Validation errors:', errorData.errors);
                    }
                } else {
                    setSubmitError(`Server error: ${error.response.status}`);
                }
            } else if (error.request) {
                // Request was made but no response received
                setSubmitError('No response from server. Please check if the backend is running.');
            } else {
                // Something else happened
                setSubmitError(error.message || 'An unexpected error occurred');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <ConnectionTest />

            <form onSubmit={handleSubmit(onSubmit)} className="employee-form">
                <h2>{employee ? 'Edit Employee' : 'Add New Employee'}</h2>

                {submitError && (
                    <div className="error-message">
                        <strong>Error:</strong> {submitError}
                    </div>
                )}

                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        className={errors.name ? 'error' : ''}
                        {...register('name', {
                            required: 'Name is required',
                            minLength: {
                                value: 2,
                                message: 'Name must be at least 2 characters'
                            }
                        })}
                    />
                    {errors.name && <span className="error-text">{errors.name.message}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        className={errors.email ? 'error' : ''}
                        {...register('email', {
                            required: 'Email is required',
                            pattern: {
                                value: /\S+@\S+\.\S+/,
                                message: 'Email is invalid'
                            }
                        })}
                    />
                    {errors.email && <span className="error-text">{errors.email.message}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="phone">Phone:</label>
                    <input
                        type="text"
                        id="phone"
                        className={errors.phone ? 'error' : ''}
                        {...register('phone', {
                            required: 'Phone is required',
                            pattern: {
                                value: /^[0-9+\-\s()]{10,}$/,
                                message: 'Please enter a valid phone number'
                            }
                        })}
                    />
                    {errors.phone && <span className="error-text">{errors.phone.message}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="city">City:</label>
                    <input
                        type="text"
                        id="city"
                        className={errors.city ? 'error' : ''}
                        {...register('city', {
                            required: 'City is required',
                            minLength: {
                                value: 2,
                                message: 'City must be at least 2 characters'
                            }
                        })}
                    />
                    {errors.city && <span className="error-text">{errors.city.message}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="image">Image:</label>
                    <input
                        type="file"
                        id="image"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        accept="image/*"
                        className={errors.image ? 'error' : ''}
                    />
                    <input
                        type="hidden"
                        {...register('image', {
                            validate: (value) => {
                                return value || imageFile ? true : 'Image is required';
                            }
                        })}
                    />
                    {imageValue && (
                        <div className="image-preview">
                            <img src={imageValue} alt="Preview" className="preview-image" />
                        </div>
                    )}
                    {errors.image && <span className="error-text">{errors.image.message}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="status">Status:</label>
                    <select
                        id="status"
                        className={errors.status ? 'error' : ''}
                        {...register('status', {
                            required: 'Status is required'
                        })}
                    >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                    {/* <select
                        id="status"
                        className={errors.status ? 'error' : ''}
                        {...register('status', {
                            required: 'Status is required'
                        })}
                    >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select> */}
                    {errors.status && <span className="error-text">{errors.status.message}</span>}
                </div>

                <div className="form-actions">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="btn-secondary"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-primary"
                    >
                        {isSubmitting ? 'Saving...' : (employee ? 'Update' : 'Add')}
                    </button>
                </div>

                {/* Debug info */}
                {process.env.NODE_ENV === 'development' && (
                    <div style={{ marginTop: '20px', padding: '10px', background: '#f5f5f5', borderRadius: '4px' }}>
                        <small>
                            <strong>Debug:</strong> API Base URL: {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}
                        </small>
                    </div>
                )}
            </form>
        </>
    );
};

export default Formdata;