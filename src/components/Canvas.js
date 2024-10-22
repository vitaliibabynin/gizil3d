import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const Canvas = ({ shapes, onClose }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    // Set up scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);

    // Set up lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Position camera
    camera.position.z = 5;

    // Render shapes
    shapes.forEach((shape) => {
      let geometry;
      switch (shape.type) {
        case 'Sphere':
          geometry = new THREE.SphereGeometry(1, 32, 32);
          break;
        case 'Cylinder':
          geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
          break;
        case 'Cube':
          geometry = new THREE.BoxGeometry(1, 1, 1);
          break;
        case 'Cone':
          geometry = new THREE.ConeGeometry(1, 2, 32);
          break;
        default:
          geometry = new THREE.BoxGeometry(1, 1, 1);
      }
      const material = new THREE.MeshPhongMaterial({ color: Math.random() * 0xffffff });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(Math.random() * 4 - 2, Math.random() * 4 - 2, Math.random() * 4 - 2);
      scene.add(mesh);
    });

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current.removeChild(renderer.domElement);
    };
  }, [shapes]);

  return (
    <div ref={mountRef} className="fixed inset-0 z-10">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded"
      >
        Close
      </button>
    </div>
  );
};

export default Canvas;
