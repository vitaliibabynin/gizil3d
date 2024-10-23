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

  /**
   * Resets the form data and errors to their initial state.
   * This function is used to clear the form when the modal is opened or closed.
   */
  const resetForm = useCallback(() => {
    setFormData({ name: '', type: '' });
    setErrors({ name: '', type: '' });
  }, []);

  /**
   * Focuses the name input field when the modal opens.
   * This function improves user experience by automatically placing the cursor in the name field.
   */
  const focusNameInput = useCallback(() => {
    setTimeout(() => nameInputRef.current?.focus(), 0);
  }, []);

  /**
   * Effect hook to reset the form and focus the name input when the modal opens.
   * This ensures that the form is in a clean state each time the user opens the modal.
   */
  useEffect(() => {
    if (open) {
      resetForm();
      focusNameInput();
    }
  }, [open, resetForm, focusNameInput]);

  /**
   * Handles changes to the input fields.
   * This function updates the form data state when the user types in the name or selects a shape type.
   * @param {Event} e - The input change event.
   */
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'name' ? value.slice(0, MAX_NAME_LENGTH) : value
    }));
  }, []);

  /**
   * Validates the form data.
   * This function checks if the name and shape type fields are filled out correctly.
   * @returns {boolean} True if the form is valid, false otherwise.
   */
  const validateForm = useCallback(() => {
    const newErrors = {
      name: formData.name.trim() ? '' : 'Name is required',
      type: formData.type ? '' : 'Shape type is required'
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  }, [formData]);

  /**
   * Handles the form submission.
   * This function validates the form and calls the onCreateShape prop if the form is valid.
   * @param {Event} e - The form submit event.
   */
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
