**# Project Overview**

This project aims to create a web application that allows users to visualize and interact with 3D shapes. Users can create, edit, and render shapes on a 3D canvas. The application is built using React.js, with Three.js handling the 3D rendering, and Material UI providing UI elements.

**# Core Functionality**

1. **Shape Management**:
   - A table is displayed with the records of created shapes.
   - Users can add new shape records through a modal form.
   - Shape records are saved in local storage, ensuring persistence across browser sessions.
   - Each record in the table can be deleted.
   
2. **3D Rendering**:
   - A "Render" button toggles the display between the table and a canvas element.
   - All shapes from the table are rendered in 3D on the canvas when the "Render" button is pressed.
   - Users can click on a shape in the 3D canvas to display its name, adjust dimensions, and move it along the x, y, and z axes.
   - A "Close" button hides the canvas and shows the table again.
   - Users can also render a specific shape directly from its table entry, which displays only that shape on the canvas.

3. **User Interactions**:
   - Shape dimensions can be adjusted through input controls.
   - User interface elements are designed to be user-friendly and responsive.
   - Validation is applied to user inputs in the modal for shape creation.
   - Tooltips or instructions are provided for better user guidance.

**# Docs**

- **State Management**: Uses React's `useState` and `useEffect` hooks for managing the application's state, including shape records and canvas visibility.
- **Storage**: Shape records are stored in the browser's local storage to ensure data persistence across sessions.
- **3D Rendering**: Uses Three.js for rendering shapes on the canvas, providing 3D interactions like scaling, positioning, and displaying shape details.

**# Current File Structure**

```
/src
  /components
    - Table.js         // Displays the shape records and controls
    - Modal.js         // Form for creating new shape records
    - Canvas.js        // Renders shapes in a 3D space using Three.js
  /utils
    - storage.js       // Utility functions for interacting with local storage
  App.js               // Main component that manages routing and global state
  index.js             // Entry point of the React app
.env.local             // Environment variables for local development (excluded in .gitignore)
```

**# Additional requirements**

1. **Project setup**
   - Use React.js for building the user interface.
   - Use Tailwind CSS for styling.
   - Use JavaScript as the programming language.
   - Use Three.js for 3D modeling and interactions.
   - Use Material UI for UI components like the modal and input elements.
   
2. **Environment Variables**:
   - Store all sensitive information (API keys, credentials) in environment variables.
   - Use a `.env.local` file for local development and ensure it's listed in `.gitignore`.
   - For production, set environment variables in the deployment platform (e.g., Vercel).
   - Access environment variables only in server-side code or API routes.

---
