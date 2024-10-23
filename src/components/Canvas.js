import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DragControls } from 'three/examples/jsm/controls/DragControls';
import { TextField, Typography } from '@mui/material';

// The Canvas component is responsible for rendering and managing the 3D scene
const Canvas = ({ shapes, onClose }) => {
  // Refs for managing Three.js objects and DOM elements
  const mountRef = useRef(null);  // Ref for the DOM element where the canvas will be mounted
  const sceneRef = useRef(null);  // Ref for the Three.js scene
  const rendererRef = useRef(null);  // Ref for the Three.js renderer
  const orbitControlsRef = useRef(null);  // Ref for OrbitControls
  const dragControlsRef = useRef(null);  // Ref for DragControls
  const objectsRef = useRef([]);  // Ref for storing the 3D objects in the scene
  const raycasterRef = useRef(new THREE.Raycaster());  // Ref for the raycaster used in object selection
  const mouseRef = useRef(new THREE.Vector2());  // Ref for storing mouse coordinates

  // State for managing selected shape and its size
  const [selectedShape, setSelectedShape] = useState(null);
  const [shapeSize, setShapeSize] = useState(1);

  /**
   * Initializes the Three.js scene, camera, and renderer.
   * This function sets up the basic 3D environment for rendering shapes.
   * @param {HTMLElement} mountNode - The DOM element to which the renderer will be attached.
   * @returns {Object} An object containing the initialized scene, camera, renderer, and orbit controls.
   */
  const initializeScene = useCallback((mountNode) => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    sceneRef.current = scene;

    // Set up perspective camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 10);
    camera.lookAt(0, 0, 0);

    // Create WebGL renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    rendererRef.current = renderer;
    renderer.setSize(window.innerWidth, window.innerHeight - 120);
    mountNode.appendChild(renderer.domElement);

    // Add orbit controls for camera manipulation
    const orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControlsRef.current = orbitControls;

    // Set up lighting for the scene
    setupLighting(scene);

    return { scene, camera, renderer, orbitControls };
  }, []);

  /**
   * Creates 3D shapes based on the provided shape data and adds them to the scene.
   * This function is responsible for generating the visual representation of each shape.
   * @param {Array} shapes - An array of shape objects containing shape data.
   * @param {THREE.Scene} scene - The Three.js scene to which the shapes will be added.
   * @returns {Array} An array of Three.js Mesh objects representing the created shapes.
   */
  const createShapes = useCallback((shapes, scene) => {
    // Sort shapes by ID to ensure consistent ordering
    const sortedShapes = [...shapes].sort((a, b) => a.id - b.id);
    const spacing = 2.5;  // Space between shapes
    const totalWidth = (sortedShapes.length - 1) * spacing;

    objectsRef.current = sortedShapes.map((shape, index) => {
      // Get the appropriate geometry and vertical offset for the shape type
      const { geometry, yOffset } = getShapeGeometry(shape.type);
      
      // Create a material with a random color
      const material = new THREE.MeshStandardMaterial({ 
        color: Math.random() * 0xffffff,
        metalness: 0.1,
        roughness: 0.5
      });
      
      // Create the mesh (3D object) with the geometry and material
      const mesh = new THREE.Mesh(geometry, material);
      
      // Position the mesh in the scene
      mesh.position.set(index * spacing - totalWidth / 2, yOffset, 0);
      mesh.userData = shape;  // Store the shape data in the mesh's userData

      scene.add(mesh);
      return mesh;
    });

    // Add a grid to the scene for better spatial reference
    const gridHelper = new THREE.GridHelper(20, 20, 0x888888, 0x888888);
    scene.add(gridHelper);

    return objectsRef.current;
  }, []);

  useEffect(() => {
    const mountNode = mountRef.current;
    const { scene, camera, renderer, orbitControls } = initializeScene(mountNode);
    const objects = createShapes(shapes, scene);
    const dragControls = setupDragControls(objects, camera, renderer, orbitControls);

    setupEventListeners(renderer, camera, objects, orbitControls, dragControls);

    const animate = createAnimationLoop(scene, camera, renderer, orbitControls);
    animate();

    const handleResize = createResizeHandler(camera, renderer);
    window.addEventListener('resize', handleResize);

    return createCleanupFunction(mountNode, renderer, scene, dragControls, handleResize);
  }, [shapes, initializeScene, createShapes]);

  /**
   * Sets up the lighting for the 3D scene.
   * This function adds various light sources to enhance the visual appearance of the shapes.
   * @param {THREE.Scene} scene - The Three.js scene to which the lights will be added.
   */
  const setupLighting = (scene) => {
    // Add ambient light for overall scene illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    // Add hemisphere light for sky and ground colors
    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
    scene.add(hemisphereLight);

    // Add directional light for shadows and highlights
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);
  };

  /**
   * Determines the appropriate geometry and vertical offset for a given shape type.
   * This function is used to create the correct 3D geometry for each shape.
   * @param {string} shapeType - The type of shape (e.g., 'Sphere', 'Cylinder', 'Cube', 'Cone').
   * @returns {Object} An object containing the geometry and vertical offset for the shape.
   */
  const getShapeGeometry = (shapeType) => {
    switch (shapeType) {
      case 'Sphere':
        return { geometry: new THREE.SphereGeometry(1, 32, 32), yOffset: 1 };
      case 'Cylinder':
        return { geometry: new THREE.CylinderGeometry(0.5, 0.5, 2, 32), yOffset: 1 };
      case 'Cube':
        return { geometry: new THREE.BoxGeometry(1, 1, 1), yOffset: 0.5 };
      case 'Cone':
        return { geometry: new THREE.ConeGeometry(0.5, 2, 32), yOffset: 1 };
      default:
        return { geometry: new THREE.BoxGeometry(1, 1, 1), yOffset: 0.5 };
    }
  };

  /**
   * Sets up drag controls for the 3D objects in the scene.
   * This function enables user interaction for moving shapes within the 3D environment.
   * @param {Array} objects - An array of Three.js objects that can be dragged.
   * @param {THREE.Camera} camera - The camera used in the scene.
   * @param {THREE.Renderer} renderer - The renderer used for the scene.
   * @param {OrbitControls} orbitControls - The orbit controls for camera manipulation.
   * @returns {DragControls} The initialized drag controls.
   */
  const setupDragControls = (objects, camera, renderer, orbitControls) => {
    const dragControls = new DragControls(objects, camera, renderer.domElement);
    dragControlsRef.current = dragControls;

    dragControls.addEventListener('dragstart', () => orbitControls.enabled = false);
    dragControls.addEventListener('dragend', () => orbitControls.enabled = true);

    return dragControls;
  };

  /**
   * Sets up event listeners for user interactions with the 3D scene.
   * This function handles click events to select shapes and update the UI accordingly.
   * @param {THREE.Renderer} renderer - The renderer used for the scene.
   * @param {THREE.Camera} camera - The camera used in the scene.
   * @param {Array} objects - An array of Three.js objects in the scene.
   * @param {OrbitControls} orbitControls - The orbit controls for camera manipulation.
   * @param {DragControls} dragControls - The drag controls for object manipulation.
   */
  const setupEventListeners = (renderer, camera, objects, orbitControls, dragControls) => {
    const handleClick = (event) => {
      event.preventDefault();

      const rect = renderer.domElement.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, camera);

      const intersects = raycasterRef.current.intersectObjects(objects);

      if (intersects.length > 0) {
        const selectedObject = intersects[0].object;
        setSelectedShape(selectedObject.userData);
        setShapeSize(selectedObject.scale.x);
      } else {
        setSelectedShape(null);
        setShapeSize(1);
      }
    };

    renderer.domElement.addEventListener('click', handleClick);
  };

  /**
   * Creates the animation loop for continuous rendering of the 3D scene.
   * This function ensures that the scene is updated and rendered on each frame.
   * @param {THREE.Scene} scene - The Three.js scene to be rendered.
   * @param {THREE.Camera} camera - The camera used in the scene.
   * @param {THREE.Renderer} renderer - The renderer used for the scene.
   * @param {OrbitControls} orbitControls - The orbit controls for camera manipulation.
   * @returns {Function} The animation function to be called on each frame.
   */
  const createAnimationLoop = (scene, camera, renderer, orbitControls) => {
    return function animate() {
      requestAnimationFrame(animate);
      orbitControls.update();
      renderer.render(scene, camera);
    };
  };

  /**
   * Creates a handler for window resize events.
   * This function ensures that the 3D scene is properly resized when the browser window changes size.
   * @param {THREE.Camera} camera - The camera used in the scene.
   * @param {THREE.Renderer} renderer - The renderer used for the scene.
   * @returns {Function} The resize handler function.
   */
  const createResizeHandler = (camera, renderer) => {
    return () => {
      camera.aspect = window.innerWidth / (window.innerHeight - 60);
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight - 60);
    };
  };

  /**
   * Creates a cleanup function to be called when the component unmounts.
   * This function ensures that all Three.js resources are properly disposed of to prevent memory leaks.
   * @param {HTMLElement} mountNode - The DOM element to which the renderer was attached.
   * @param {THREE.Renderer} renderer - The renderer used for the scene.
   * @param {THREE.Scene} scene - The Three.js scene.
   * @param {DragControls} dragControls - The drag controls for object manipulation.
   * @param {Function} handleResize - The resize handler function.
   * @returns {Function} The cleanup function to be called on component unmount.
   */
  const createCleanupFunction = (mountNode, renderer, scene, dragControls, handleResize) => {
    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountNode && renderer.domElement) {
        mountNode.removeChild(renderer.domElement);
      }
      if (scene) {
        scene.clear();
      }
      if (renderer) {
        renderer.dispose();
      }
      if (dragControls) {
        dragControls.dispose();
      }
    };
  };

  /**
   * Handles changes to the size of the selected shape.
   * This function updates the scale of the selected 3D object when the user adjusts the size input.
   * @param {Event} event - The input change event.
   */
  const handleSizeChange = (event) => {
    const newSize = parseFloat(event.target.value);
    setShapeSize(newSize);
    if (selectedShape) {
      const selectedObject = objectsRef.current.find(obj => obj.userData.id === selectedShape.id);
      if (selectedObject) {
        selectedObject.scale.set(newSize, newSize, newSize);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-10 flex flex-col">
      {/* Header section with shape information and size control */}
      <div className="h-[120px] bg-white shadow-md flex flex-col justify-center items-center px-4">
        <div className="text-2xl font-bold mb-2">
          {selectedShape ? selectedShape.name : "Click on a 3D Shape to select it"}
        </div>
        {selectedShape ? (
          <div className="flex flex-col items-center">
            <div className="flex items-center space-x-4 mb-2">
              <TextField
                label="Size"
                type="number"
                value={shapeSize}
                onChange={handleSizeChange}
                inputProps={{ step: 0.1, min: 0.1, max: 5 }}
                style={{ width: '100px' }}
                size="small"
              />
            </div>
            <Typography variant="body2" color="textSecondary">
              Click and hold to move shape
            </Typography>
          </div>
        ) : (
          <Typography variant="body2" color="textSecondary">
            Select a shape to adjust its size and position
          </Typography>
        )}
      </div>
      {/* The div where the Three.js scene will be mounted */}
      <div ref={mountRef} className="flex-grow"></div>
      {/* Close button to exit the 3D view */}
      <button
        onClick={onClose}
        className="absolute top-[130px] right-4 bg-red-500 text-white px-4 py-2 rounded"
      >
        Close
      </button>
    </div>
  );
};

export default Canvas;
