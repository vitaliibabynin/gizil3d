import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Button 
} from '@mui/material';

const ShapeTable = () => {
  const [shapes, setShapes] = useState([]);

  const handleCreateShape = () => {
    // TODO: Implement shape creation modal
    console.log('Create shape clicked');
  };

  const handleRenderAll = () => {
    // TODO: Implement render all functionality
    console.log('Render all clicked');
  };

  const handleDelete = (id) => {
    // TODO: Implement delete functionality
    console.log('Delete clicked for shape with id:', id);
  };

  return (
    <div className="mt-4">
      <div className="mb-4">
        <Button variant="contained" color="primary" onClick={handleCreateShape} className="mr-2">
          Create
        </Button>
        <Button variant="contained" color="secondary" onClick={handleRenderAll}>
          Render All
        </Button>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shapes.map((shape) => (
              <TableRow key={shape.id}>
                <TableCell>{shape.name}</TableCell>
                <TableCell>
                  <Button 
                    variant="outlined" 
                    color="error" 
                    onClick={() => handleDelete(shape.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ShapeTable;
