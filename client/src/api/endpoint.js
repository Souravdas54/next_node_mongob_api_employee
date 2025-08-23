import axios from "axios";

const Api_URL = 'http://localhost:8500/api'

export const createEmployee = async (data) => {
    return await axios.post(`${Api_URL}/create`, data,)
}

export const getAllData = async () => {
    return await axios.get(`${Api_URL}/list`)
}

export const editdata = async (id) => {
    return await axios.get(`${Api_URL}/edit/${id}`)
}

export const updateData = async (id, data) => {
    return await axios.put(`${Api_URL}/update/${id}`, data,
        {
             headers: { "Content-Type": "multipart/form-data" },
        }
    )
}

export const deleteData = async (id) => {
    return await axios.delete(`${Api_URL}/delete/${id}`)
}

export const toggleStatus = async (id) => {
    return await axios.patch(`${Api_URL}/toggle/status/${id}`)
}