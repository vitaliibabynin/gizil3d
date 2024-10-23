const SHAPES_STORAGE_KEY = 'shapes';

export const saveShapes = (shapes) => {
  try {
    localStorage.setItem(SHAPES_STORAGE_KEY, JSON.stringify(shapes));
  } catch (error) {
    console.error('Error saving shapes to localStorage:', error);
  }
};

export const getShapes = () => {
  try {
    const shapes = localStorage.getItem(SHAPES_STORAGE_KEY);
    return shapes ? JSON.parse(shapes) : [];
  } catch (error) {
    console.error('Error retrieving shapes from localStorage:', error);
    return [];
  }
};

export const addShape = (shape) => {
  const shapes = getShapes();
  shapes.push(shape);
  saveShapes(shapes);
};

export const deleteShape = (id) => {
  const shapes = getShapes();
  const updatedShapes = shapes.filter(shape => shape.id !== id);
  saveShapes(updatedShapes);
};
