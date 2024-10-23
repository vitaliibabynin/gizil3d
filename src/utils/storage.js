const SHAPES_STORAGE_KEY = 'shapes';

/**
 * Saves the shapes array to local storage.
 * This function is used to persist the shapes data between sessions.
 * @param {Array} shapes - The array of shape objects to be saved.
 */
export const saveShapes = (shapes) => {
  try {
    localStorage.setItem(SHAPES_STORAGE_KEY, JSON.stringify(shapes));
  } catch (error) {
    console.error('Error saving shapes to localStorage:', error);
  }
};

/**
 * Retrieves the shapes array from local storage.
 * This function is used to load previously saved shapes when the app starts.
 * @returns {Array} The array of shape objects retrieved from local storage, or an empty array if none exist.
 */
export const getShapes = () => {
  try {
    const shapes = localStorage.getItem(SHAPES_STORAGE_KEY);
    return shapes ? JSON.parse(shapes) : [];
  } catch (error) {
    console.error('Error retrieving shapes from localStorage:', error);
    return [];
  }
};

/**
 * Adds a new shape to the existing shapes in local storage.
 * This function is used when creating a new shape in the app.
 * @param {Object} shape - The new shape object to be added.
 */
export const addShape = (shape) => {
  const shapes = getShapes();
  shapes.push(shape);
  saveShapes(shapes);
};

/**
 * Deletes a shape from the shapes stored in local storage.
 * This function is used when removing a shape from the app.
 * @param {number} id - The ID of the shape to be deleted.
 */
export const deleteShape = (id) => {
  const shapes = getShapes();
  const updatedShapes = shapes.filter(shape => shape.id !== id);
  saveShapes(updatedShapes);
};
