import axios from "axios";

const API_URL =
    "http://localhost:8080/xsports/products";

export const getAllProducts = async () => {

    const response =
        await axios.get(
            `${API_URL}/getAllProducts`
        );

    return response.data;
};