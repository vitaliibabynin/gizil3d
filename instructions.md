**# Product Requirements Document (PRD)**

**Project Title:** 3D Shape Visualization and Control App  
**Objective:** Build a web app that allows users to create, view, and manipulate 3D shapes through a user-friendly interface using React, Three.js, and Material UI.

---

### **Overview**

This application allows users to manage 3D shapes through a table interface and visualize them in a 3D canvas. Users can create new shape records, render all or specific shapes, and adjust their dimensions and positions directly on the canvas.

### **Step-by-Step Feature Development**

The project has been divided into a series of tasks to ensure a smooth and structured development process. Each task builds on the previous one to achieve the desired functionality.

---

### **Task 1: Project Setup**

- **Description:** Initialize the project and set up the basic environment.
- **Instructions:**
  1. Create a new React project using `create-react-app`.
  2. Set up Tailwind CSS for styling.
  3. Install and configure Material UI.
  4. Install Three.js for 3D rendering capabilities.
  5. Create a `.env.local` file and add it to `.gitignore` for environment variables.
- **Outcome:** A basic React project with all required libraries and styles configured.

---

### **Task 2: Create Shape Table Component**

- **Description:** Develop a table to display shape records and include buttons for creating and rendering shapes.
- **Instructions:**
  1. Create a `ShapeTable.js` component that displays shape records with the following columns:
     ID, Name, Shape Type, Actions
  2. Add a "Create" button above the table that will open a modal for adding new shapes.
  3. Add a "Render All" button above the table that will render all shapes on a canvas.
  4. Add a "Render" button in each row in the action column to render a shape on a canvas.
  5. Add a "Delete" button in each row in the action column, to the left of render, to remove a shape record.
  6. Implement the delete functionality to remove a shape from the table and local storage.
  7. Use Material-UI components for the table and buttons.
  8. Style the component using Tailwind CSS classes for spacing and layout.
- **Outcome:** A table displaying shape records with controls for adding, deleting, and rendering shapes, styled with Material-UI and Tailwind CSS.

---

### **Task 3: Develop Shape Creation Modal**

- **Description:** Implement a modal that allows users to input shape details and create a new shape record.
- **Instructions:**
  1. Create a `Modal.js` component using Material UI's dialog components.
  2. Add form fields for shape attributes:
  Name,
  A selectable Shape Type:
  - Sphere
  - Cylinder
  - Cube
  - Cone
  3. Validate user inputs (make sure shape is selected and name is not empty). Visually show errors by highlighting the fields in red, and writing an error message below the input field.
  4. Store the new shape record in local storage upon submission.
  5. Refresh the table with the updated list of shapes after submission.
- **Outcome:** A functional modal that allows users to add new shape records, with data stored in local storage.

---

### **Task 4: Implement Local Storage Management**

- **Description:** Ensure shape records are saved and loaded from local storage.
- **Instructions:**
  1. Create utility functions in a `storage.js` file to handle saving, retrieving, and deleting shape records from local storage.
  2. Use these utility functions in `ShapeTable.js` to load existing shapes when the app starts.
  3. Update the local storage whenever a shape is added or deleted.
- **Outcome:** Shape records persist between browser sessions, with data saved and retrieved from local storage.

---

### **Task 5: Build 3D Canvas Component**

- **Description:** Create a canvas that renders all shapes in 3D using Three.js.
- **Instructions:**
  1. Create a `Canvas.js` component that initializes a Three.js scene, camera, and renderer.
  2. Add logic to render all shapes from the table onto the canvas.
  3. Toggle the visibility of the table and the canvas when the "Render All" button is clicked.
  4. Add a "Close" button to hide the canvas and show the table again.
- **Outcome:** A 3D canvas that displays all shapes from the table when the "Render All" button is pressed.

---

### **Task 6: Implement Single Shape Rendering**

- **Description:** Allow users to render a specific shape from the table.
- **Instructions:**
  1. Add a "Render" button in each table row to render the specific shape in `Canvas.js`.
  2. Update `Canvas.js` to accept a shape ID or record and render only that shape.
  3. Ensure that the same interactions (view, scale, position) are available as in the full rendering mode.
- **Outcome:** Users can render and interact with individual shapes directly from the table.

---

### **Task 7: Add Shape Interaction on Canvas**

- **Description:** Allow users to interact with shapes in the 3D environment.
- **Instructions:**
  1. Add event listeners in `Canvas.js` to detect when a shape is clicked.
  2. Display the name of the selected shape at the top of the canvas.
  3. Create input fields or sliders to adjust the dimensions (width, height, depth) of the selected shape.
  4. Allow users to move the selected shape along the x, y, and z axes.
- **Outcome:** Users can select, view, adjust, and move shapes in the 3D canvas.

---

### **Task 8: Finalize User Interface & Responsiveness**

- **Description:** Polish the UI and ensure it is responsive and user-friendly.
- **Instructions:**
  1. Refine the layout and styles using Tailwind CSS and Material UI to ensure a clean design.
  2. Add tooltips or instructions where necessary (e.g., above the shape creation form fields).
  3. Test the app across different screen sizes to ensure responsiveness.
- **Outcome:** A polished, user-friendly interface that looks good on various devices.

---

### **Task 9: Review and Refactor Code**

- **Description:** Review the codebase for any improvements and ensure best practices are followed.
- **Instructions:**
  1. Refactor any duplicated logic or overly complex functions.
  2. Ensure all sensitive information is managed through environment variables.
  3. Check for any unused dependencies or files.
  4. Add comments and documentation where necessary.
- **Outcome:** Clean, maintainable code that adheres to best practices.

---

### **Task 10: Prepare for Deployment and Add README**

- **Description:** Finalize the project for deployment and add instructions in the README.
- **Instructions:**
  1. Update the `README.md` file with instructions on how to run the project locally and in production.
  2. Add any additional notes for the reviewer (e.g., known issues, areas for future improvement).
  3. Deploy the app to a platform like Vercel.
  4. Test the deployed app to ensure it functions as expected.
- **Outcome:** A fully functional, deployed application with a complete README.

---

**End of PRD**
