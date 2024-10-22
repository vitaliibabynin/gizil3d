import React, { useState } from 'react';
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

const ShapeModal = ({ open, onClose, onCreateShape }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [errors, setErrors] = useState({ name: '', type: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = { name: '', type: '' };

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!type) {
      newErrors.type = 'Shape type is required';
    }

    if (newErrors.name || newErrors.type) {
      setErrors(newErrors);
      return;
    }

    onCreateShape({ name, type });
    handleClose();
  };

  const handleClose = () => {
    setName('');
    setType('');
    setErrors({ name: '', type: '' });
    onClose();
  };

  const handleNameChange = (e) => {
    const value = e.target.value.slice(0, 16); // Limit to 16 characters
    setName(value);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Create New Shape</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Shape Name"
            type="text"
            fullWidth
            value={name}
            onChange={handleNameChange}
            error={!!errors.name}
            helperText={errors.name || `${name.length}/16 characters`}
            inputProps={{ maxLength: 16 }}
          />
          <FormControl fullWidth margin="dense" error={!!errors.type}>
            <InputLabel>Shape Type</InputLabel>
            <Select
              value={type}
              onChange={(e) => setType(e.target.value)}
              label="Shape Type"
            >
              <MenuItem value="Sphere">Sphere</MenuItem>
              <MenuItem value="Cylinder">Cylinder</MenuItem>
              <MenuItem value="Cube">Cube</MenuItem>
              <MenuItem value="Cone">Cone</MenuItem>
            </Select>
            {errors.type && <FormHelperText>{errors.type}</FormHelperText>}
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ShapeModal;
