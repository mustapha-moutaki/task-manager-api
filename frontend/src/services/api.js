// src/services/api.js
import axios from 'axios';

// Get the API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Create axios instance with the base URL
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true // Include cookies with requests if using Laravel Sanctum
});

const API = {
  // Task related API calls
  getAllTasks: async (statusFilter = null) => {
    try {
      let url = '/tasks';
      if (statusFilter !== null) {
        url += `?status=${statusFilter ? '1' : '0'}`;
      }
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },

  getTask: async (id) => {
    try {
      const response = await apiClient.get(`/tasks/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error);
      throw error;
    }
  },

  createTask: async (taskData) => {
    try {
      // Convert boolean status to 0/1 for Laravel
      const formattedTaskData = {
        ...taskData,
        status: taskData.status ? 1 : 0
      };
      
      const response = await apiClient.post('/tasks', formattedTaskData);
      return response.data;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  updateTask: async (id, taskData) => {
    try {
        // Convert boolean status to 0/1 for Laravel
        const formattedTaskData = {
            ...taskData,
            status: taskData.status ? 1 : 0
        };
        
        const response = await apiClient.patch(`/tasks/${id}`, formattedTaskData); // Change to PATCH
        return response.data;
    } catch (error) {
        console.error(`Error updating task ${id}:`, error);
        throw error;
    }
},


  deleteTask: async (id) => {
    try {
      const response = await apiClient.delete(`/tasks/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting task ${id}:`, error);
      throw error;
    }
  },

  toggleTaskStatus: async (id) => {
    try {
      const response = await apiClient.patch(`/tasks/${id}/toggle-status`);
      return response.data;
    } catch (error) {
      console.error(`Error toggling task status ${id}:`, error);
      throw error;
    }
  },

  // Create instance with FormData for file uploads
  uploadTaskWithImage: async (taskData) => {
    try {
      const formData = new FormData();
      
      // Add all task data to FormData with proper status conversion
      for (const key in taskData) {
        if (key === 'image' && taskData[key]) {
          formData.append('image', taskData[key]);
        } else if (key === 'status') {
          // Convert boolean to integer (0/1) for Laravel
          formData.append(key, taskData[key] ? 1 : 0);
        } else {
          formData.append(key, taskData[key]);
        }
      }
      
      // Log the FormData contents for debugging
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }
      
      const response = await axios.post(`${API_BASE_URL}/tasks`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json'
        },
        withCredentials: true
      });
      
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        // Log validation errors if they exist
        console.error('Validation errors:', error.response.data);
      }
      console.error('Error uploading task with image:', error);
      throw error;
    }
  },

  updateTaskWithImage: async (id, taskData) => {
    try {
        const formData = new FormData();
        
        for (const key in taskData) {
            if (key === 'image' && taskData[key]) {
                formData.append('image', taskData[key]);
            } else if (key === 'status') {
              
                formData.append(key, taskData[key] ? 1 : 0);
            } else {
                formData.append(key, taskData[key]);
            }
        }
        
        // Add _method field for Laravel to handle PATCH requests with FormData
        formData.append('_method', 'PATCH');
        
        const response = await axios.post(`${API_BASE_URL}/tasks/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Accept': 'application/json'
            },
            withCredentials: true
        });
        
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            // Log validation errors if they exist
            console.error('Validation errors:', error.response.data);
        }
        console.error(`Error updating task ${id} with image:`, error);
        throw error;
    }
},

};

export default API;
