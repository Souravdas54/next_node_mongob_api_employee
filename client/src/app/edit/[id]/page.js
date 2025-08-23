'use client';

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { editdata, updateData } from "@/api/endpoint";

import { Container, Typography, TextField, Button, Box, Paper, InputAdornment, Alert, FormHelperText, Chip, Avatar, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Person, Email, Phone, LocationCity, CloudUpload, CheckCircle } from '@mui/icons-material';

export default function Editeuser() {

    const [image, setImage] = useState(null);
    const [msg, setMsg] = useState('');
    const router = useRouter();
    const { id } = useParams();
    const fileInputRef = useRef(null);

    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        city: '',
        status: 'Inactive',
    });
    // console.log("all fields", form);


    useEffect(() => {
        if (id) fetchEmployee();

    }, [id])

    const fetchEmployee = async () => {
        try {
            const res = await editdata(id)
            const fielddata = res?.data?.data;
            setForm({
                name: fielddata?.name || '',
                email: fielddata?.email || '',
                phone: fielddata?.phone || '',
                city: fielddata?.city || '',
                status: fielddata?.status || 'Inactive',
            })
            // console.log(res);
            if (fielddata?.image) {
                setImage(fielddata.image)
            }

        } catch (error) {
            setMsg('Error fetching employee', error.message)
            console.log("edit page message", error.message);

        }
    }
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const handleImageChange = (e) => {
        // setImage(e.target.files[0]);
        const file = e.target.files[0];
        if (file) {
            setImage(URL.createObjectURL(file))
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault()

        const formData = new FormData();

        formData.append('name', form.name)
        formData.append('email', form.email)
        formData.append('phone', form.phone)
        formData.append('city', form.city)
        formData.append('status', form.status)
        // if (image) {
        //     formData.append('image', image)
        // }
        if (image && typeof image !== "string") {
            formData.append('image', image);
        }

        try {
            await updateData(id, formData);
            setMsg('Employee update successfully');

            router.push('/list') // Redirect age

        } catch (error) {
            setMsg('Error update employee: ' + error.message);
        }
    }
    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom align="center" color="success">
                    Edit Employee Page
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
                        // placeholder="Enter name"
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
                        // placeholder="Enter email"
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
                        // placeholder="Enter phone"
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
                        // placeholder="Enter city"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LocationCity color="action" />
                                </InputAdornment>
                            ),
                        }}
                    />
                    {/* <FormControl fullWidth margin="normal">
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
                    </FormControl> */}

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
                                    src={typeof image === "string" ? `http://localhost:8500/${image}` : URL.createObjectURL(image)}
                                    // src={URL.createObjectURL(image)}
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
                        color="success"
                    >
                        Update
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