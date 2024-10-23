import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  FormHelperText,
} from '@mui/material';

const SHAPE_TYPES = ['Sphere', 'Cylinder', 'Cube', 'Cone'];
const MAX_NAME_LENGTH = 16;

const ShapeModal = ({ open, onClose, onCreateShape }) => {
  const [formData, setFormData] = useState({ name: '', type: '' });
  const [errors, setErrors] = useState({ name: '', type: '' });
  const nameInputRef = useRef(null);

  const resetForm = useCallback(() => {
    setFormData({ name: '', type: '' });
    setErrors({ name: '', type: '' });
  }, []);

  const focusNameInput = useCallback(() => {
    setTimeout(() => nameInputRef.current?.focus(), 0);
  }, []);

  useEffect(() => {
    if (open) {
      resetForm();
      focusNameInput();
    }
  }, [open, resetForm, focusNameInput]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'name' ? value.slice(0, MAX_NAME_LENGTH) : value
    }));
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {
      name: formData.name.trim() ? '' : 'Name is required',
      type: formData.type ? '' : 'Shape type is required'
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  }, [formData]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (validateForm()) {
      onCreateShape(formData);
      onClose();
    }
  }, [formData, validateForm, onCreateShape, onClose]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create New Shape</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Shape Name"
            type="text"
            fullWidth
            value={formData.name}
            onChange={handleInputChange}
            error={!!errors.name}
            helperText={errors.name || `${formData.name.length}/${MAX_NAME_LENGTH} characters`}
            inputProps={{ maxLength: MAX_NAME_LENGTH }}
            inputRef={nameInputRef}
          />
          <FormControl fullWidth margin="dense" error={!!errors.type}>
            <InputLabel>Shape Type</InputLabel>
            <Select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              label="Shape Type"
            >
              {SHAPE_TYPES.map(type => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </Select>
            {errors.type && <FormHelperText>{errors.type}</FormHelperText>}
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ShapeModal;
