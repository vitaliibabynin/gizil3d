import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const Canvas = ({ shapes, onClose }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const [selectedShape, setSelectedShape] = useState(null);

  useEffect(() => {
    // Set up scene, camera, and renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0); // Light gray background
    sceneRef.current = scene;
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    rendererRef.current = renderer;
    renderer.setSize(window.innerWidth, window.innerHeight - 60); // Adjust for banner height
    mountRef.current.appendChild(renderer.domElement);

    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);

    // Set up lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
    scene.add(hemisphereLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);

    // Position camera
    camera.position.z = 10;
    camera.position.y = 5;
    camera.lookAt(0, 0, 0);

    // Sort shapes by ID
    const sortedShapes = [...shapes].sort((a, b) => a.id - b.id);

    // Calculate total width of all shapes
    const spacing = 2.5; // Space between shapes
    const totalWidth = (sortedShapes.length - 1) * spacing;

    // Render shapes
    sortedShapes.forEach((shape, index) => {
      let geometry;
      let yOffset = 0;

      switch (shape.type) {
        case 'Sphere':
          geometry = new THREE.SphereGeometry(1, 32, 32);
          yOffset = 1;
          break;
        case 'Cylinder':
          geometry = new THREE.CylinderGeometry(0.5, 0.5, 2, 32);
          yOffset = 1;
          break;
        case 'Cube':
          geometry = new THREE.BoxGeometry(1, 1, 1);
          yOffset = 0.5;
          break;
        case 'Cone':
          geometry = new THREE.ConeGeometry(0.5, 2, 32);
          yOffset = 1;
          break;
        default:
          geometry = new THREE.BoxGeometry(1, 1, 1);
          yOffset = 0.5;
      }

      const material = new THREE.MeshStandardMaterial({ 
        color: Math.random() * 0xffffff,
        metalness: 0.1,
        roughness: 0.5
      });
      const mesh = new THREE.Mesh(geometry, material);
      
      // Position shapes along x-axis and set bottom to y=0
      mesh.position.set(index * spacing - totalWidth / 2, yOffset, 0);
      
      // Add shape data to the mesh's userData
      mesh.userData = shape;

      // Create a bounding box for the mesh
      const box = new THREE.Box3().setFromObject(mesh);
      const boxHelper = new THREE.Box3Helper(box, 0xffff00);
      boxHelper.visible = false; // Make the helper invisible
      boxHelper.userData = shape; // Add shape data to the boxHelper's userData

      scene.add(mesh);
      scene.add(boxHelper);
    });

    // Add a grid helper to visualize the ground plane
    const gridHelper = new THREE.GridHelper(20, 20, 0x888888, 0x888888);
    scene.add(gridHelper);

    // Add click event listener
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseClick = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      // Intersect with all objects, including bounding boxes
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        // Find the first intersected object that has userData
        const clickedObject = intersects.find(intersect => intersect.object.userData && intersect.object.userData.name);
        if (clickedObject) {
          setSelectedShape(clickedObject.object.userData);
        }
      } else {
        setSelectedShape(null);
      }
    };

    renderer.domElement.addEventListener('click', onMouseClick);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / (window.innerHeight - 60); // Adjust for banner height
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight - 60); // Adjust for banner height
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      renderer.domElement.removeEventListener('click', onMouseClick);
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && rendererRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
      if (sceneRef.current) {
        sceneRef.current.clear();
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, [shapes]);

  return (
    <div className="fixed inset-0 z-10 flex flex-col">
      <div className="h-[60px] bg-white shadow-md">
        <div className="flex justify-center items-center h-full text-2xl font-bold">
          {selectedShape ? selectedShape.name : "Click on 3D Shape to control it"}
        </div>
      </div>
      <div ref={mountRef} className="flex-grow"></div>
      <button
        onClick={onClose}
        className="absolute top-[70px] right-4 bg-red-500 text-white px-4 py-2 rounded"
      >
        Close
      </button>
    </div>
  );
};

export default Canvas;
