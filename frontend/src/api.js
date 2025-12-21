
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000', // API Gateway URL
});

export const loginUser = async (email, password) => {
    // For demo, we might just register if login fails or just use register endpoint for both
    // But let's try login first.
    try {
        const res = await api.post('/users/login', { email, password });
        return res.data;
    } catch (error) {
        // If login fails, try register for "Easiest" demo flow?
        // User asked for "Register and log in".
        // Let's just return null or throw.
        throw error;
    }
};

export const registerUser = async (name, email, password) => {
    const res = await api.post('/users/register', { name, email, password });
    return res.data;
};

export const getAppointments = async (userId) => {
    const res = await api.get(`/appointments/user/${userId}`);
    return res.data;
};

export const createAppointment = async (appointment) => {
    const res = await api.post('/appointments', appointment);
    return res.data;
};

export const getNotifications = async (userId) => {
    const res = await api.get(`/notifications/user/${userId}`);
    return res.data;
};

export const markNotificationAsRead = async (id) => {
    const res = await api.patch(`/notifications/${id}/read`);
    return res.data;
};

export const updateAppointment = async (id, data) => {
    const res = await api.put(`/appointments/${id}`, data);
    return res.data;
};

export const deleteAppointment = async (id) => {
    const res = await api.delete(`/appointments/${id}`);
    return res.data;
};

export const getProductivity = async (userId) => {
    const res = await api.get(`/analytics/user/${userId}/productivity`);
    return res.data;
};

export const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post('/storage/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
};
