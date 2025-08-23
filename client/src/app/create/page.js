'use client';

import React, { useRef, useState } from 'react'
import { createEmployee } from '@/api/endpoint';
import { useRouter } from 'next/navigation';
import { Container, Typography, TextField, Button, Box, Paper, InputAdornment, Alert, FormHelperText, Chip, Avatar, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Person, Email, Phone, LocationCity, CloudUpload, CheckCircle } from '@mui/icons-material';


export default function Createpage() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        city: "",
        status: "Inactive"
    })

    const [image, setImage] = useState(null); // IMAGE

    const [msg, setMsg] = useState('');// MESSAGE
    const fileInputRef = useRef(null);
    const router = useRouter();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        const formData = new FormData();

        formData.append('name', form.name)
        formData.append('email', form.email)
        formData.append('phone', form.phone)
        formData.append('city', form.city)
        formData.append('status', form.status)
        if (image) {
            formData.append('image', image)
        }
        console.log([...formData.entries()]);

        try {
            const response = await createEmployee(formData);

            console.log(response.data);
            
            console.log(typeof response.data);

            setMsg('Employee created successfully');
            setForm({ name: '', email: '', phone: '', city: '', status: 'Inactive' });
            setImage(null);

            router.push('/list') // Redirect age

        } catch (error) {
            setMsg('Error creating employee: ' + error.message);
        }
    }

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
                    Create Page
                </Typography>

                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
                    <TextField
                        fullWidth
                        label="Name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        margin="normal"
                        variant="outlined"
                        placeholder="Enter name"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Person color="action" />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        margin="normal"
                        variant="outlined"
                        placeholder="Enter email"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Email color="action" />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <TextField
                        fullWidth
                        label="Phone"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        margin="normal"
                        variant="outlined"
                        placeholder="Enter phone"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Phone color="action" />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <TextField
                        fullWidth
                        label="City"
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        margin="normal"
                        variant="outlined"
                        placeholder="Enter city"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LocationCity color="action" />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Status</InputLabel>
                        <Select
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                            label="Status"
                        >
                            <MenuItem value="Inactive">Inactive</MenuItem>
                            <MenuItem value="Active">Active</MenuItem>
                        </Select>
                    </FormControl>

                    <Box sx={{ mt: 3, mb: 2, textAlign: 'center' }}>
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                        />
                        <Button
                            variant="outlined"
                            startIcon={<CloudUpload />}
                            onClick={() => fileInputRef.current?.click()}
                            sx={{ py: 1.2, px: 3 }}
                        >
                            {image ? 'Change Photo' : 'Upload Employee Photo'}
                        </Button>

                        {image && (
                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                                <Avatar
                                    src={URL.createObjectURL(image)}
                                    alt="Employee"
                                    sx={{ width: 80, height: 80 }}
                                />
                            </Box>
                        )}
                    </Box>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="large"
                        sx={{ mt: 3, mb: 2, py: 1.5, fontWeight: 'bold' }}
                    >
                        Create
                    </Button>

                    {msg && (
                        <Alert severity={msg.includes('successfully') ? 'success' : 'error'} sx={{ mt: 2 }}>
                            {msg}
                        </Alert>
                    )}
                </Box>
            </Paper>
        </Container>
    )
}
