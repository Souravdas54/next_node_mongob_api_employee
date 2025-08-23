'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, Avatar, IconButton, Alert
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, ToggleOn as ToggleIcon, Add as AddIcon, Visibility as ViewIcon } from '@mui/icons-material';

import { getAllData, deleteData, toggleStatus } from '@/api/endpoint';


export default function Listpage() {
  const [employee, setEmployee] = useState([]);
  const [msg, setMsg] = useState('')
  console.log(employee);

  useEffect(() => {
    fetchEmployee()
  }, [])

  const fetchEmployee = async () => {
    try {
      const res = await getAllData()
      setEmployee(res?.data?.data)
    } catch (error) {
      setMsg('Error fetching employee , please connect your server', error)
    }
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this employee ?')) {
      try {
        await deleteData(id)
        setMsg('Employee deleted successfully')
        fetchEmployee()
      } catch (error) {
        setMsg("Error deleted employee", error)
      }
    }
  }

  const handleToggleStatus = async (id) => {
    try {
      const res = await toggleStatus(id)
      setMsg("Status togglgd done")

      setEmployee(prev => prev.map(emp => emp._id ? { ...emp, status: res.data.data.status } : emp))

      fetchEmployee()
    } catch (error) {
      setMsg('Error toggling status: ' + error.message);
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Employee List
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          component={Link}
          href="/create"
        >
          Add New Employee
        </Button>
      </Box>

      {msg && (
        <Alert severity="info" color='success' sx={{ mb: 2 }}>
          {msg}
        </Alert>
      )}

      <TableContainer component={Paper} elevation={3}>
        <Table sx={{ minWidth: 650 }} aria-label="employee table">
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.main' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Email</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Phone</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>City</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Image</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employee.map((emp) => (
              <TableRow
                key={emp._id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { backgroundColor: 'action.hover' } }}
              >
                <TableCell component="th" scope="row">
                  <Typography variant="body1" fontWeight="medium">
                    {emp.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {emp.email}
                  </Typography>
                </TableCell>
                <TableCell>{emp.phone}</TableCell>
                <TableCell>{emp.city}</TableCell>
                <TableCell>
                  {emp.image ? (
                    <Avatar
                      src={`http://localhost:8500/server/${emp?.image.replace(/\\/g, "/")}`}
                      alt={emp.name}
                      sx={{ width: 56, height: 56 }}
                      variant="rounded"
                    />
                  ) : (
                    <Chip label="No Image" variant="outlined" color="default" />
                  )}
                </TableCell>
                <TableCell>
                  <Chip
                    label={emp.status}
                    color={emp.status === 'Active' ? 'success' : emp.status === 'Inactive' ? 'error' : 'warning'}
                    variant={emp.status === 'Inactive' ? 'outlined' : 'filled'}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      color="primary"
                      onClick={() => handleToggleStatus(emp._id)}
                      title="Toggle Status"

                    >
                      <ToggleIcon sx={{ fontSize: 50 }} />
                    </IconButton>

                    <IconButton
                      color="secondary"
                      component={Link}
                      href={`/edit/${emp._id}`}
                      title="Edit"
                    >
                      <EditIcon  sx={{ fontSize: 25 }} />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(emp._id)}
                      title="Delete"
                    >
                      <DeleteIcon sx={{ fontSize: 25 }} />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {employee.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No employees found. Add your first employee!
          </Typography>
        </Box>
      )}
    </Box>
  )
}
