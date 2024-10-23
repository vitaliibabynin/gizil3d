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
import { getShapes, saveShapes, deleteShape } from '../utils/storage';
import Canvas from './Canvas';

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
  // State for managing shapes, modal visibility, selected row, and canvas visibility
  const [shapes, setShapes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [showCanvas, setShowCanvas] = useState(false);
  const [selectedShapeId, setSelectedShapeId] = useState(null);
  
  // Theme and responsive design hooks
  const theme = useTheme();
  const isMobileOrTablet = useMediaQuery(theme.breakpoints.down('md'));

  /**
   * Effect hook to load shapes from local storage when the component mounts.
   * This ensures that the table is populated with previously saved shapes.
   */
  useEffect(() => {
    setShapes(getShapes());
  }, []);

  /**
   * Handles the creation of a new shape.
   * This function adds the new shape to the state and saves it to local storage.
   * @param {Object} newShape - The new shape object to be added.
   */
  const handleCreateShape = (newShape) => {
    const updatedShapes = [...shapes, { ...newShape, id: Date.now() }];
    setShapes(updatedShapes);
    saveShapes(updatedShapes);
  };

  /**
   * Handles the deletion of a shape.
   * This function removes the shape from the state and local storage.
   * @param {number} id - The ID of the shape to be deleted.
   */
  const handleDeleteShape = (id) => {
    const updatedShapes = shapes.filter(shape => shape.id !== id);
    setShapes(updatedShapes);
    deleteShape(id);
    if (selectedRow === id) setSelectedRow(null);
  };

  /**
   * Handles rendering all shapes in the 3D canvas.
   * This function sets up the canvas to display all shapes.
   */
  const handleRenderAll = () => {
    setSelectedShapeId(null);
    setShowCanvas(true);
  };

  /**
   * Handles rendering a specific shape in the 3D canvas.
   * This function sets up the canvas to display a single shape.
   * @param {number} id - The ID of the shape to be rendered.
   */
  const handleRenderShape = (id) => {
    setSelectedShapeId(id);
    setShowCanvas(true);
  };

  /**
   * Handles closing the 3D canvas.
   * This function resets the canvas state and returns to the table view.
   */
  const handleCloseCanvas = () => {
    setShowCanvas(false);
    setSelectedShapeId(null);
  };

  /**
   * Toggles the expansion of a row in the mobile view.
   * This function controls which row is currently expanded in the mobile table.
   * @param {number} id - The ID of the row to be toggled.
   */
  const toggleRow = (id) => {
    setSelectedRow(prevSelected => prevSelected === id ? null : id);
  };

  /**
   * Renders a button with consistent styling for both mobile and desktop views.
   * This component is used to create uniform buttons throughout the table.
   * @param {Object} props - The props for the button, including onClick and children.
   * @returns {JSX.Element} A styled button component.
   */
  const RenderButton = ({ onClick, children }) => (
    <Button 
      variant="outlined" 
      color="primary" 
      onClick={onClick}
      fullWidth={isMobileOrTablet}
    >
      {children}
    </Button>
  );

  /**
   * Renders a delete button with consistent styling for both mobile and desktop views.
   * This component is used to create uniform delete buttons throughout the table.
   * @param {Object} props - The props for the button, including onClick and children.
   * @returns {JSX.Element} A styled delete button component.
   */
  const DeleteButton = ({ onClick, children }) => (
    <Button 
      variant="outlined" 
      color="error" 
      onClick={onClick}
      fullWidth={isMobileOrTablet}
    >
      {children}
    </Button>
  );

  /**
   * Renders the mobile version of the shape table.
   * This function creates a collapsible table layout optimized for mobile devices.
   * @returns {JSX.Element} The mobile table component.
   */
  const renderMobileTable = () => (
    <TableContainer component={Paper} className="rounded-none">
      <Table>
        <StyledTableHead>
          <TableRow>
            <TableCell style={{ width: '48px', padding: '8px' }} />
            <TableCell>Name</TableCell>
          </TableRow>
        </StyledTableHead>
        <TableBody>
          {shapes.map((shape, index) => (
            <React.Fragment key={shape.id}>
              <StyledTableRow 
                onClick={() => toggleRow(shape.id)}
                isEven={index % 2 === 0}
                isSelected={selectedRow === shape.id}
              >
                <TableCell style={{ width: '48px', padding: '8px' }}>
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
                <TableCell>{shape.name}</TableCell>
              </StyledTableRow>
              <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                  <Collapse in={selectedRow === shape.id} timeout="auto" unmountOnExit>
                    <Box sx={{ padding: 2 }}>
                      <Table size="small" aria-label="details">
                        <TableBody>
                          <TableRow>
                            <TableCell component="th" scope="row">ID:</TableCell>
                            <TableCell>{shape.id}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell component="th" scope="row">Shape Type:</TableCell>
                            <TableCell>{shape.type}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell component="th" scope="row">Actions:</TableCell>
                            <TableCell>
                              <div className="flex flex-col space-y-2">
                                <DeleteButton onClick={() => handleDeleteShape(shape.id)}>
                                  Delete
                                </DeleteButton>
                                <RenderButton onClick={() => handleRenderShape(shape.id)}>
                                  Render
                                </RenderButton>
                              </div>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </Box>
                  </Collapse>
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  /**
   * Renders the desktop version of the shape table.
   * This function creates a full table layout optimized for larger screens.
   * @returns {JSX.Element} The desktop table component.
   */
  const renderDesktopTable = () => (
    <TableContainer component={Paper}>
      <Table>
        <StyledTableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Shape Type</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </StyledTableHead>
        <TableBody>
          {shapes.map((shape, index) => (
            <StyledTableRow 
              key={shape.id}
              isEven={index % 2 === 0}
              isSelected={selectedRow === shape.id}
            >
              <TableCell>{shape.id}</TableCell>
              <TableCell>{shape.name}</TableCell>
              <TableCell>{shape.type}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <DeleteButton onClick={() => handleDeleteShape(shape.id)}>
                    Delete
                  </DeleteButton>
                  <RenderButton onClick={() => handleRenderShape(shape.id)}>
                    Render
                  </RenderButton>
                </div>
              </TableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <div className={`${isMobileOrTablet ? 'p-0' : 'p-4'} flex justify-center`}>
      {showCanvas ? (
        // Render the 3D canvas when showCanvas is true
        <Canvas 
          shapes={selectedShapeId ? shapes.filter(shape => shape.id === selectedShapeId) : shapes} 
          onClose={handleCloseCanvas} 
        />
      ) : (
        // Render the shape table when showCanvas is false
        <div className={`w-full ${isMobileOrTablet ? 'max-w-full' : 'max-w-[1000px]'}`}>
          {/* Buttons for creating shapes and rendering all shapes */}
          <div className={`mb-4 flex justify-between ${isMobileOrTablet ? 'px-0' : ''}`}>
            <Button variant="contained" color="primary" onClick={() => setIsModalOpen(true)}>
              Create Shape
            </Button>
            <Button variant="contained" color="secondary" onClick={handleRenderAll}>
              Render All
            </Button>
          </div>
          {/* Render either mobile or desktop table based on screen size */}
          {isMobileOrTablet ? renderMobileTable() : renderDesktopTable()}
          {/* Shape creation modal */}
          <ShapeModal
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onCreateShape={handleCreateShape}
          />
        </div>
      )}
    </div>
  );
};

export default ShapeTable;
