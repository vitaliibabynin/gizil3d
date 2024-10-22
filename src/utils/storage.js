const SHAPES_STORAGE_KEY = 'shapes';

export const saveShapes = (shapes) => {
  localStorage.setItem(SHAPES_STORAGE_KEY, JSON.stringify(shapes));
};

export const getShapes = () => {
  const shapes = localStorage.getItem(SHAPES_STORAGE_KEY);
  return shapes ? JSON.parse(shapes) : [];
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
