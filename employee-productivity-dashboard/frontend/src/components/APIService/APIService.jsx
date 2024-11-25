import axios from "axios";

const API_KEY = "b30f8d97bca4f11b2310dcbc1c241e1a";
const BASE_URL = `https://desktime.com/api/v2/json/employees?apiKey=${API_KEY}`;

export const APIService = async () => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data.employees; // Returns raw employee data
  } catch (error) {
    throw new Error("Error fetching employee data");
  }
};
