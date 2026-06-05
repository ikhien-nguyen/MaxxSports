import axios from "axios";

const API_URL = "http://localhost:8080/xsports/api";

export const optionService = {

    getColors: async () => {

        const response = await axios.get(
            `${API_URL}/colors`
        );

        return response.data;
    },

    getSizes: async () => {

        const response = await axios.get(
            `${API_URL}/sizes`
        );

        return response.data;
    }

};