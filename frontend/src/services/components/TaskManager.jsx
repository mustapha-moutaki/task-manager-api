import React, { useState, useEffect } from 'react';
import API from '../api';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Grid, 
  TextField, 
  Button, 
  Checkbox, 
  FormControlLabel, 
  Card, 
  CardContent, 
  CardMedia, 
  CardActions, 
  Chip, 
  CircularProgress, 
  Alert, 
  ButtonGroup, 
  IconButton, 
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import UndoIcon from '@mui/icons-material/Undo';
import ImageIcon from '@mui/icons-material/Image';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

// Styled components
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
            <Button 
              onClick={() => setStatusFilter(null)}
              color={statusFilter === null ? "primary" : "inherit"}
              variant={statusFilter === null ? "contained" : "outlined"}
            >
              All
            </Button>
            <Button 
              onClick={() => setStatusFilter(false)}
              color={statusFilter === false ? "warning" : "inherit"}
              variant={statusFilter === false ? "contained" : "outlined"}
            >
              Pending
            </Button>
            <Button 
              onClick={() => setStatusFilter(true)}
              color={statusFilter === true ? "success" : "inherit"}
              variant={statusFilter === true ? "contained" : "outlined"}
            >
              Done
            </Button>
          </ButtonGroup>
        </Box>

        {/* Create/Edit Task Form */}
        <Paper 
          elevation={3} 
          sx={{ mb: 4, overflow: 'hidden', borderRadius: 2 }}
        >
          <Box sx={{ 
            px: 3, 
            py: 2, 
            background: 'linear-gradient(to right, #1976d2, #9c27b0)' 
          }}>
            <Typography variant="h6" color="white">
              {isEditing ? 'Edit Task' : 'Create New Task'}
            </Typography>
          </Box>
          
          {error && (
            <Box sx={{ mx: 3, mt: 2 }}>
              <Alert severity="error">{error}</Alert>
            </Box>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {/* Title Input */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="title"
                  name="title"
                  label="Task Title"
                  value={formData.title}
                  onChange={handleChange}
                  error={!!validationErrors.title}
                  helperText={validationErrors.title ? validationErrors.title[0] : ''}
                  variant="outlined"
                />
              </Grid>

              {/* Tags Input */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="tags"
                  name="tags"
                  label="Tags (comma separated)"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="work, urgent, personal"
                  variant="outlined"
                  helperText="Example: work, urgent, personal"
                />
              </Grid>

              {/* Description Textarea */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="description"
                  name="description"
                  label="Task Description"
                  value={formData.description}
                  onChange={handleChange}
                  error={!!validationErrors.description}
                  helperText={validationErrors.description ? validationErrors.description[0] : ''}
                  multiline
                  rows={3}
                  variant="outlined"
                />
              </Grid>

              {/* Status */}
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      id="status"
                      name="status"
                      checked={formData.status}
                      onChange={handleChange}
                      color="primary"
                    />
                  }
                  label="Mark as done"
                />
              </Grid>

              {/* Image Upload */}
              <Grid item xs={12} md={6}>
                <Button
                  component="label"
                  variant="contained"
                  startIcon={<PhotoCameraIcon />}
                  color="primary"
                >
                  Upload Image
                  <VisuallyHiddenInput 
                    type="file" 
                    name="image"
                    accept="image/*"
                    onChange={handleChange}
                  />
                </Button>
                {validationErrors.image && (
                  <Typography variant="caption" color="error" sx={{ ml: 2 }}>
                    {validationErrors.image[0]}
                  </Typography>
                )}
              </Grid>

              {/* Image Preview */}
              {imagePreview && (
                <Grid item xs={12}>
                  <Box sx={{ display: 'inline-block', p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
                    <Box
                      component="img"
                      src={imagePreview}
                      alt="Preview"
                      sx={{ height: 120, borderRadius: 1 }}
                    />
                    {isEditing && !(formData.image instanceof File) && (
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                        Current image will be kept unless you select a new one
                      </Typography>
                    )}
                  </Box>
                </Grid>
              )}
            </Grid>

            {/* Form Actions */}
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                type="button"
                onClick={resetForm}
                variant="outlined"
                color="inherit"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
              >
                {isEditing ? 'Update Task' : 'Create Task'}
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Tasks List */}
        {tasks.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="text.secondary">No tasks found.</Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {tasks.map((task) => (
              <Grid item xs={12} sm={6} lg={4} key={task.id}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    border: 1,
                    borderColor: task.status ? 'success.light' : 'warning.light',
                    transition: 'all 0.3s',
                    '&:hover': {
                      boxShadow: 6
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                      <Checkbox
                        checked={task.status}
                        onChange={() => handleToggleStatus(task.id)}
                        size="small"
                      />
                      <Typography 
                        variant="h6" 
                        component="h3"
                        sx={{
                          ml: 1,
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
                        mt: 1,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {task.description}
                    </Typography>
                    
                    {/* Tags Display */}
                    {task.tags && (
                      <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
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
                    
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', height: 120 }}>
                      {task.image_path ? (
                        <CardMedia
                          component="img"
                          image={`http://localhost:8000/${task.image_path}`}
                          alt="Task"
                          sx={{ height: 120, width: 'auto', borderRadius: 1 }}
                        />
                      ) : (
                        <Box sx={{ 
                          height: 120, 
                          width: '100%', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          bgcolor: 'grey.100',
                          borderRadius: 1
                        }}>
                          <ImageIcon sx={{ fontSize: 64, color: 'text.disabled' }} />
                        </Box>
                      )}
                    </Box>
                  </CardContent>
                  
                  <Divider />
                  
                  <CardActions sx={{ bgcolor: 'grey.50', justifyContent: 'space-between', px: 2 }}>
                    <Button
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => handleEdit(task)}
                      variant="outlined"
                      color="primary"
                    >
                      Edit
                    </Button>
                    
                    <Button
                      size="small"
                      startIcon={task.status ? <UndoIcon /> : <CheckCircleIcon />}
                      onClick={() => handleToggleStatus(task.id)}
                      variant="contained"
                      color={task.status ? "warning" : "success"}
                    >
                      {task.status ? 'Undo' : 'Done'}
                    </Button>
                    
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(task.id)}
                      color="error"
                      aria-label="delete"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
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