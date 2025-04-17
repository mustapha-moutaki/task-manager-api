import React, { useState, useEffect } from 'react';
import API from '../api';
// import material ui composents
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Grid, 
  Checkbox, 
  Card, 
  CardContent, 
  CardMedia, 
  CardActions, 
  Chip, 
  CircularProgress, 
  Alert, 
  ButtonGroup, 
  IconButton, 
  Divider,
  Button as MuiButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import UndoIcon from '@mui/icons-material/Undo';
import ImageIcon from '@mui/icons-material/Image';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';


const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: false,
    image: null,
    tags: ''
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [statusFilter, setStatusFilter] = useState(null);
  const [allTags, setAllTags] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, [statusFilter]);

  useEffect(() => {
    if (tasks.length > 0) {
      const tagsSet = new Set();
      tasks.forEach(task => {
        if (task.tags) {
          const taskTags = task.tags.split(',').map(tag => tag.trim());
          taskTags.forEach(tag => {
            if (tag) tagsSet.add(tag);
          });
        }
      });
      setAllTags(Array.from(tagsSet).sort());
    }
  }, [tasks]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await API.getAllTasks(statusFilter);
      let tasksList = response?.data?.tasks || response?.tasks || [];
      
      setTasks(tasksList);
      setError(null);
    } catch (err) {
      setError('Failed to fetch tasks. Please try again later.');
      console.error(err);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setValidationErrors({ ...validationErrors, [name]: null });

    if (type === 'file') {
      const file = files[0];
      if (file) {
        setFormData({ ...formData, [name]: file });
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
      }
    } else if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setValidationErrors({});
    
    if (!formData.title || !formData.description) {
      setError('Title and description are required');
      setLoading(false);
      return;
    }
    
    try {
      const formattedTags = formData.tags
        ? formData.tags.split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0)
            .join(',')
        : '';
      
      if (isEditing) {
        const taskData = {
          title: formData.title,
          description: formData.description,
          status: formData.status,
          tags: formattedTags
        };
  
        if (formData.image instanceof File) {
          await API.updateTaskWithImage(editingTaskId, { ...taskData, image: formData.image });
        } else {
          await API.updateTask(editingTaskId, taskData);
        }
      } else {
        const taskData = {
          title: formData.title,
          description: formData.description,
          status: formData.status,
          tags: formattedTags
        };


        
        if (formData.image) {
          await API.uploadTaskWithImage({ ...taskData, image: formData.image });
        } else {
          await API.createTask(taskData);
        }
      }
      resetForm();
      fetchTasks();
    } catch (err) {
      if (err.response && err.response.status === 422 && err.response.data?.errors) {
        const validationErrors = err.response.data.errors;
        setValidationErrors(validationErrors);
        const message = Object.values(validationErrors).flat().join(', ');
        setError(`Validation error: ${message}`);
      } else {
        setError('Error saving task. Please check your form and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', status: false, image: null, tags: '' });
    setImagePreview(null);
    setIsEditing(false);
    setEditingTaskId(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await API.deleteTask(id);
        setTasks(tasks.filter(task => task.id !== id));
      } catch (err) {
        setError('Failed to delete task. Please try again.');
      }
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await API.toggleTaskStatus(id);
      setTasks(tasks.map(task =>
        task.id === id ? { ...task, status: !task.status } : task
      ));
    } catch (err) {
      setError('Failed to update task status. Please try again.');
    }
  };

  const handleEdit = (task) => {
    setFormData({
      title: task.title,
      description: task.description,
      status: task.status,
      image: null,
      tags: task.tags || ''
    });
  
    if (task.image_path) {
      setImagePreview(`http://localhost:8000/${task.image_path}`);
    } else {
      setImagePreview(null);
    }
    
    setIsEditing(true);
    setEditingTaskId(task.id);
  };

  // Helper function to make tag colors
  const getTagColor = (tag) => {
    // Simple hash function to generate consistent colors for tags
    const hash = tag.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    
    const tagColors = [
      'primary',
      'secondary',
      'success',
      'info',
      'warning',
      'error',
    ];
    
    return tagColors[Math.abs(hash) % tagColors.length];
  };

  if (loading && tasks.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: 'grey.100', py: 4, minHeight: '100vh' }}>
      <Container maxWidth="lg">
        {/* Header section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" fontWeight="bold" color="text.primary">
            Task Manager
          </Typography>
          
          {/* Status filter buttons */}
          <ButtonGroup variant="contained" aria-label="task status filter">
            <MuiButton 
              onClick={() => setStatusFilter(null)}
              color={statusFilter === null ? "primary" : "inherit"}
              variant={statusFilter === null ? "contained" : "outlined"}
            >
              All
            </MuiButton>
            <MuiButton 
              onClick={() => setStatusFilter(false)}
              color={statusFilter === false ? "warning" : "inherit"}
              variant={statusFilter === false ? "contained" : "outlined"}
            >
              Pending
            </MuiButton>
            <MuiButton 
              onClick={() => setStatusFilter(true)}
              color={statusFilter === true ? "success" : "inherit"}
              variant={statusFilter === true ? "contained" : "outlined"}
            >
              Done
            </MuiButton>
          </ButtonGroup>
        </Box>

        {/* Create/Edit Task Form with Tailwind CSS */}
        <div className="w-full mb-8 bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white">
              {isEditing ? 'Edit Task' : 'Create New Task'}
            </h2>
          </div>
          
          {error && (
            <div className="mx-6 mt-4">
              <Alert severity="error">{error}</Alert>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title Input */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Task Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition 
                    ${validationErrors.title ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter task title"
                />
                {validationErrors.title && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.title[0]}</p>
                )}
              </div>

              {/* Tags Input */}
              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="work, urgent, personal"
                />
                <p className="mt-1 text-xs text-gray-500">Example: work, fun, personal</p>
              </div>

              {/* Description Textarea */}
              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Task Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition
                    ${validationErrors.description ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Describe your task here..."
                ></textarea>
                {validationErrors.description && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.description[0]}</p>
                )}
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="status"
                  name="status"
                  checked={formData.status}
                  onChange={handleChange}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                />
                <label htmlFor="status" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                  Mark as done
                </label>
              </div>

              {/* Image Upload Button */}
              <div className="flex items-center">
                <label htmlFor="image-upload" className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer">
                  <PhotoCameraIcon className="mr-2 h-5 w-5" />
                  Upload Image
                  <input
                    id="image-upload"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={handleChange}
                    className="sr-only"
                  />
                </label>
                {validationErrors.image && (
                  <p className="ml-3 text-sm text-red-600">{validationErrors.image[0]}</p>
                )}
              </div>

              {/* Image Preview */}
              {imagePreview && (
                <div className="md:col-span-2">
                  <div className="inline-block p-2 bg-gray-100 rounded-lg">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="h-32 rounded-lg"
                    />
                    {isEditing && !(formData.image instanceof File) && (
                      <p className="mt-1 text-xs text-gray-500">
                        Current image will be kept unless you select a new one
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 mt-6">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200 shadow-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 shadow-sm"
              >
                {isEditing ? 'Update Task' : 'Create Task'}
              </button>
            </div>
          </form>
        </div>

        {/* Tasks List - Using Material UI for cards with wider layout */}
        {tasks.length === 0 ? (
  <Paper sx={{ p: 3, textAlign: 'center' }}>
    <Typography color="text.secondary">No tasks found.</Typography>
  </Paper>
) : (
  <Grid container spacing={3} justifyContent="center">
    {tasks.map((task) => (
      <Grid item xs={12} md={8} lg={6} key={task.id}>
        <Card 
          sx={{ 
            height: 220, 
            display: 'flex',
            border: 1,
            borderColor: task.status ? 'success.light' : 'warning.light',
            transition: 'all 0.3s',
            '&:hover': {
              boxShadow: 6
            }
          }}
        >
          {/* Left side - Image section */}
          <Box sx={{ width: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.100' }}>
            {task.image_path ? (
              <CardMedia
                component="img"
                image={`http://localhost:8000/${task.image_path}`}
                alt="Task"
                sx={{ height: '100%', width: '100%', objectFit: 'cover' }}
              />
            ) : (
              <Box sx={{ 
                height: '100%', 
                width: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                bgcolor: 'grey.100',
              }}>
                <ImageIcon sx={{ fontSize: 64, color: 'text.disabled' }} />
              </Box>
            )}
          </Box>
          
          {/* Right side - Content section */}
          <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
            <CardContent sx={{ flexGrow: 1, pb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Checkbox
                  checked={task.status}
                  onChange={() => handleToggleStatus(task.id)}
                  size="small"
                />
                <Typography 
                  variant="h6" 
                  component="h3"
                  sx={{
                    ...(task.status && {
                      textDecoration: 'line-through',
                      color: 'text.secondary'
                    })
                  }}
                >
                  {task.title}
                </Typography>
              </Box>
              
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  mb: 2,
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {task.description}
              </Typography>
              
              {/* Tags Display */}
              {task.tags && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                  {task.tags.split(',').map((tag, idx) => 
                    tag.trim() && (
                      <Chip 
                        key={idx} 
                        label={tag.trim()}
                        size="small"
                        color={getTagColor(tag.trim())}
                      />
                    )
                  )}
                </Box>
              )}
            </CardContent>
            
            <Divider />
            
            <CardActions sx={{ bgcolor: 'grey.50', justifyContent: 'space-between', px: 2 }}>
              <MuiButton
                size="small"
                startIcon={<EditIcon />}
                onClick={() => handleEdit(task)}
                variant="outlined"
                color="primary"
              >
                Edit
              </MuiButton>
              
              <MuiButton
                size="small"
                startIcon={task.status ? <UndoIcon /> : <CheckCircleIcon />}
                onClick={() => handleToggleStatus(task.id)}
                variant="contained"
                color={task.status ? "warning" : "success"}
              >
                {task.status ? 'Undo' : 'Done'}
              </MuiButton>
              
              <IconButton
                size="small"
                onClick={() => handleDelete(task.id)}
                color="error"
                aria-label="delete"
              >
                <DeleteIcon />
              </IconButton>
            </CardActions>
          </Box>
        </Card>
      </Grid>
    ))}
  </Grid>
)}
        
      </Container>
    </Box>
  );
};

export default TaskManager;