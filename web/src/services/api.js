import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api'; // Replace with your API base URL

const jwtToken = localStorage.getItem('token');

const apiService = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'contentType': 'application/json',
    'Authorization': `Bearer ${jwtToken}`
  }
});

export const fetchManager = async () => {
  try {
    const empId = localStorage.getItem('id');

    const response = await apiService.get(`/employee/${empId}/manager`);
    return response.data.manager;

  } catch (error) {
    throw new Error(error.response?.data || error.message);
  }
};

export const fetchPositions = async () => {
  try {
    const managerId = (await fetchManager())._id;

    const response = await apiService.get(`/positions/${managerId}`);
    return response.data.positions;

  } catch (error) {
    throw new Error(error.response?.data || error.message);
  }
};



export default apiService;
