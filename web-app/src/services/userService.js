import api from '../api/api';

export const userService = {
    // =====================================================================
    // LUỒNG USER/CLIENT
    // =====================================================================
    updateProfile: async (updateUserRequest) => {
        const response = await api.post('/user/update', updateUserRequest);
        return response.data;
    },

    getUserById: async (id) => {
        const response = await api.get(`/user/getUser/${id}`);
        return response.data;
    },

    // =====================================================================
    // LUỒNG ADMIN
    // =====================================================================
    getAllUsersForAdmin: async () => {
        const response = await api.get('/user/getAllUsers');
        return response.data;
    },

    deleteUserByAdmin: async (id) => {
        const response = await api.post(`/user/deleteUser/${id}`);
        return response.data;
    }
};