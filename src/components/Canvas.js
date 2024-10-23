import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DragControls } from 'three/examples/jsm/controls/DragControls';
import { TextField, Typography } from '@mui/material';

const Canvas = ({ shapes, onClose }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const [selectedShape, setSelectedShape] = useState(null);
  const [shapeSize, setShapeSize] = useState(1);
  const orbitControlsRef = useRef(null);
  const dragControlsRef = useRef(null);
  const objectsRef = useRef([]);
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());

  // Initialize Three.js scene, camera, and renderer
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

  const createShapes = useCallback((shapes, scene) => {
    const sortedShapes = [...shapes].sort((a, b) => a.id - b.id);
    const spacing = 2.5;
    const totalWidth = (sortedShapes.length - 1) * spacing;

    objectsRef.current = sortedShapes.map((shape, index) => {
      const { geometry, yOffset } = getShapeGeometry(shape.type);
      const material = new THREE.MeshStandardMaterial({ 
        color: Math.random() * 0xffffff,
        metalness: 0.1,
        roughness: 0.5
      });
      const mesh = new THREE.Mesh(geometry, material);
      
      mesh.position.set(index * spacing - totalWidth / 2, yOffset, 0);
      mesh.userData = shape;

      scene.add(mesh);
      return mesh;
    });

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

  // Helper function to set up scene lighting
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

  const setupDragControls = (objects, camera, renderer, orbitControls) => {
    const dragControls = new DragControls(objects, camera, renderer.domElement);
    dragControlsRef.current = dragControls;

    dragControls.addEventListener('dragstart', () => orbitControls.enabled = false);
    dragControls.addEventListener('dragend', () => orbitControls.enabled = true);

    return dragControls;
  };

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

  const createAnimationLoop = (scene, camera, renderer, orbitControls) => {
    return function animate() {
      requestAnimationFrame(animate);
      orbitControls.update();
      renderer.render(scene, camera);
    };
  };

  const createResizeHandler = (camera, renderer) => {
    return () => {
      camera.aspect = window.innerWidth / (window.innerHeight - 60);
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight - 60);
    };
  };

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
      <div ref={mountRef} className="flex-grow"></div>
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
