# 3D Shape Visualization and Control App

This project is a web application that allows users to create, view, and manipulate 3D shapes through a user-friendly interface using React, Three.js, and Material UI.

## Features

- Create and manage 3D shapes (Sphere, Cylinder, Cube, Cone)
- View shapes in a table format
- Render shapes in a 3D canvas
- Interact with shapes (resize, move) in the 3D environment
- Responsive design for various screen sizes

## View online on Vercel

[3D Shape Visualization and Control App](https://gizil3d.vercel.app/)

## Prerequisites for running the application locally

Before you begin, ensure you have met the following requirements:

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/vitaliibabynin/gizil3d.git
   ```

2. Navigate to the project directory:
   ```
   cd gizil3d
   ```

3. Install the dependencies:
   ```
   npm install
   ```

## Running the Application Locally

To run the application in development mode:

1. Start the development server:
   ```
   npm start
   ```

2. Open your browser and visit `http://localhost:3000`

The page will reload if you make edits, and you will see any lint errors in the console.

## Building for Production

To build the app for production:

1. Create a production build:
   ```
   npm run build
   ```

This builds the app for production to the `build` folder. It correctly bundles React in production mode and optimizes the build for the best performance.

## Deployment

After building the app, you can deploy it to a static hosting service. Here are a few options:

1. **Vercel**: 
   - Install Vercel CLI: `npm i -g vercel`
   - Run `vercel` in the project directory

2. **Netlify**:
   - Install Netlify CLI: `npm install netlify-cli -g`
   - Run `netlify deploy` in the project directory

## Additional Notes for Reviewers

- The application uses local storage to persist shape data between sessions.
- The 3D rendering is handled by Three.js, which may have performance implications on lower-end devices.
- The UI is responsive, but for the best experience with the 3D canvas, a larger screen is recommended.
- Future improvements could include:
  - Adding more complex shape types
  - Implementing ability to save, new shape size and position, after user interactions
  - Adding dark mode toggle
  - Adding the ability to export/import shape data
  - Optimizing 3D rendering for better performance on mobile devices
