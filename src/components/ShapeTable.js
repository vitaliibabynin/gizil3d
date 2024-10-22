import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Button,
  Collapse,
  Box,
  useMediaQuery,
  useTheme,
  styled,
  IconButton
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ShapeModal from './ShapeModal';

// Styled components for custom table elements
const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  '& th': {
    color: theme.palette.common.white,
    fontWeight: 'bold',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme, isEven, isSelected }) => ({
  cursor: 'pointer',
  backgroundColor: isEven
    ? theme.palette.background.default
    : theme.palette.action.hover,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  ...(isSelected && {
    border: `2px solid ${theme.palette.primary.main}`,
  }),
}));

const ShapeTable = () => {
  const [shapes, setShapes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const theme = useTheme();
  const isMobileOrTablet = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    // Load shapes from local storage when component mounts
    const storedShapes = JSON.parse(localStorage.getItem('shapes') || '[]');
    setShapes(storedShapes);
  }, []);

  const handleCreateShape = (newShape) => {
    const updatedShapes = [...shapes, { ...newShape, id: Date.now() }];
    setShapes(updatedShapes);
    localStorage.setItem('shapes', JSON.stringify(updatedShapes));
  };

  const handleDeleteShape = (id) => {
    const updatedShapes = shapes.filter(shape => shape.id !== id);
    setShapes(updatedShapes);
    localStorage.setItem('shapes', JSON.stringify(updatedShapes));
    if (selectedRow === id) setSelectedRow(null);
  };

  const handleRenderAll = () => {
    // TODO: Implement rendering all shapes
    console.log("Render all shapes");
  };

  const handleRenderShape = (id) => {
    // TODO: Implement rendering a single shape
    console.log("Render shape with id:", id);
  };

  const toggleRow = (id) => {
    setSelectedRow(prevSelected => prevSelected === id ? null : id);
  };

  return (
    <div className="p-4 flex justify-center">
      <div className="w-full max-w-[1000px]">
        <div className="mb-4 flex justify-between">
          <Button variant="contained" color="primary" onClick={() => setIsModalOpen(true)}>
            Create Shape
          </Button>
          <Button variant="contained" color="secondary" onClick={handleRenderAll}>
            Render All
          </Button>
        </div>
        <TableContainer component={Paper}>
          <Table>
            <StyledTableHead>
              <TableRow>
                {isMobileOrTablet && <TableCell />}
                {!isMobileOrTablet && <TableCell>ID</TableCell>}
                <TableCell>Name</TableCell>
                <TableCell>Shape Type</TableCell>
                {!isMobileOrTablet && <TableCell>Actions</TableCell>}
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {shapes.map((shape, index) => (
                <React.Fragment key={shape.id}>
                  <StyledTableRow 
                    isEven={index % 2 === 0}
                    isSelected={isMobileOrTablet && selectedRow === shape.id}
                    onClick={() => isMobileOrTablet && toggleRow(shape.id)}
                  >
                    {isMobileOrTablet && (
                      <TableCell>
                        <IconButton
                          aria-label="expand row"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleRow(shape.id);
                          }}
                        >
                          {selectedRow === shape.id ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                      </TableCell>
                    )}
                    {!isMobileOrTablet && <TableCell>{shape.id}</TableCell>}
                    <TableCell>{shape.name}</TableCell>
                    <TableCell>{shape.type}</TableCell>
                    {!isMobileOrTablet && (
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outlined" 
                            color="error" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteShape(shape.id);
                            }}
                          >
                            Delete
                          </Button>
                          <Button 
                            variant="outlined" 
                            color="primary" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRenderShape(shape.id);
                            }}
                          >
                            Render
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </StyledTableRow>
                  {isMobileOrTablet && (
                    <TableRow>
                      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                        <Collapse in={selectedRow === shape.id} timeout="auto" unmountOnExit>
                          <Box sx={{ 
                            padding: 2,
                            border: selectedRow === shape.id ? `2px solid ${theme.palette.primary.main}` : 'none',
                            borderTop: 'none',
                          }}>
                            <Table size="small" aria-label="details">
                              <TableBody>
                                <TableRow>
                                  <TableCell component="th" scope="row">ID:</TableCell>
                                  <TableCell>{shape.id}</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell component="th" scope="row">Actions:</TableCell>
                                  <TableCell className="flex space-x-2">
                                    <Button 
                                      variant="outlined" 
                                      color="error" 
                                      onClick={() => handleDeleteShape(shape.id)}
                                      className="mr-2"
                                    >
                                      Delete
                                    </Button>
                                    <Button 
                                      variant="outlined" 
                                      color="primary" 
                                      onClick={() => handleRenderShape(shape.id)}
                                    >
                                      Render
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <ShapeModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreateShape={handleCreateShape}
        />
      </div>
    </div>
  );
};

export default ShapeTable;
