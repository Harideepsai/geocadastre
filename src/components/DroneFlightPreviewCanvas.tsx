import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { PhotogrammetryReconstructionResult } from '../utils/dronePhotogrammetry';
import { Camera, Navigation, RotateCcw, Crosshair } from 'lucide-react';

interface DroneFlightPreviewCanvasProps {
  mission: PhotogrammetryReconstructionResult | null;
  className?: string;
}

export const DroneFlightPreviewCanvas: React.FC<DroneFlightPreviewCanvasProps> = ({
  mission,
  className = 'h-52 w-full',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const [isRotating, setIsRotating] = useState(true);

  // Mouse interaction state
  const isDraggingRef = useRef(false);
  const prevMouseRef = useRef({ x: 0, y: 0 });
  const sphericalRef = useRef({ radius: 55, theta: 0.6, phi: 1.0 });

  useEffect(() => {
    if (!containerRef.current) return;
    const width = containerRef.current.clientWidth || 400;
    const height = containerRef.current.clientHeight || 200;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a); // Slate 900
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 500);
    cameraRef.current = camera;

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    containerRef.current.replaceChildren(renderer.domElement);

    // 3. Cadastral Ground Grid
    const grid = new THREE.GridHelper(60, 30, 0x10b981, 0x1e293b);
    grid.position.y = 0;
    scene.add(grid);

    // 4. Group for mission objects
    const group = new THREE.Group();
    scene.add(group);
    groupRef.current = group;

    const updateCamera = () => {
      const { radius, theta, phi } = sphericalRef.current;
      camera.position.x = radius * Math.sin(phi) * Math.sin(theta);
      camera.position.y = radius * Math.cos(phi);
      camera.position.z = radius * Math.sin(phi) * Math.cos(theta);
      camera.lookAt(0, 8, 0);
    };
    updateCamera();

    // 5. Render Loop
    const animate = () => {
      if (isRotating && !isDraggingRef.current) {
        sphericalRef.current.theta += 0.004;
        updateCamera();
      }
      renderer.render(scene, camera);
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      renderer.dispose();
    };
  }, []);

  // Populate Flight Path & Camera Frustums when mission updates
  useEffect(() => {
    if (!groupRef.current || !mission) return;
    const group = groupRef.current;

    // Clear previous elements
    while (group.children.length > 0) {
      const obj = group.children[0] as any;
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) obj.material.forEach((m: any) => m.dispose());
        else obj.material.dispose();
      }
      group.remove(obj);
    }

    const { width, length, estimatedHeight } = mission.calibratedFootprint;

    // A. Cadastral Parcel Footprint Plane & Envelope
    const footprintGeom = new THREE.BoxGeometry(width, estimatedHeight, length);
    const footprintEdges = new THREE.EdgesGeometry(footprintGeom);
    const lineMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, linewidth: 2 });
    const wireframe = new THREE.LineSegments(footprintEdges, lineMat);
    wireframe.position.set(0, estimatedHeight / 2, 0);
    group.add(wireframe);

    // Subtle translucent volume
    const volMat = new THREE.MeshBasicMaterial({ color: 0x0284c7, transparent: true, opacity: 0.15 });
    const volMesh = new THREE.Mesh(footprintGeom, volMat);
    volMesh.position.set(0, estimatedHeight / 2, 0);
    group.add(volMesh);

    // B. Flight Stations and Camera Frustums
    const flightPoints: THREE.Vector3[] = [];

    mission.cameraStations.forEach((station) => {
      const pos = new THREE.Vector3(station.x, station.altitudeAgl * 0.35, station.y);
      flightPoints.push(pos);

      // Camera Station Node Marker
      const sphereGeom = new THREE.SphereGeometry(station.isNadir ? 0.7 : 0.85, 8, 8);
      const sphereMat = new THREE.MeshBasicMaterial({
        color: station.isNadir ? 0x10b981 : 0xf59e0b, // Green for Nadir, Amber for Oblique
      });
      const sphere = new THREE.Mesh(sphereGeom, sphereMat);
      sphere.position.copy(pos);
      group.add(sphere);

      // Camera Frustum Pyramid (Ray Cones projecting to ground)
      const targetY = estimatedHeight;
      const targetPoint = new THREE.Vector3(station.x * 0.4, targetY, station.y * 0.4);

      const rayGeom = new THREE.BufferGeometry().setFromPoints([pos, targetPoint]);
      const rayMat = new THREE.LineDashedMaterial({
        color: station.isNadir ? 0x34d399 : 0xfbbf24,
        dashSize: 1,
        gapSize: 0.5,
        transparent: true,
        opacity: 0.45,
      });
      const ray = new THREE.Line(rayGeom, rayMat);
      ray.computeLineDistances();
      group.add(ray);
    });

    // C. Connecting Flight Path Line
    if (flightPoints.length > 1) {
      const pathGeom = new THREE.BufferGeometry().setFromPoints(flightPoints);
      const pathMat = new THREE.LineBasicMaterial({ color: 0x10b981, linewidth: 2 });
      const flightLine = new THREE.Line(pathGeom, pathMat);
      group.add(flightLine);
    }
  }, [mission]);

  // Mouse handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    prevMouseRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !cameraRef.current) return;
    const dx = e.clientX - prevMouseRef.current.x;
    const dy = e.clientY - prevMouseRef.current.y;
    prevMouseRef.current = { x: e.clientX, y: e.clientY };

    sphericalRef.current.theta -= dx * 0.01;
    sphericalRef.current.phi = Math.max(0.1, Math.min(Math.PI / 2 - 0.05, sphericalRef.current.phi - dy * 0.01));

    const { radius, theta, phi } = sphericalRef.current;
    cameraRef.current.position.x = radius * Math.sin(phi) * Math.sin(theta);
    cameraRef.current.position.y = radius * Math.cos(phi);
    cameraRef.current.position.z = radius * Math.sin(phi) * Math.cos(theta);
    cameraRef.current.lookAt(0, 8, 0);
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!cameraRef.current) return;
    sphericalRef.current.radius = Math.max(15, Math.min(100, sphericalRef.current.radius + e.deltaY * 0.05));
    const { radius, theta, phi } = sphericalRef.current;
    cameraRef.current.position.x = radius * Math.sin(phi) * Math.sin(theta);
    cameraRef.current.position.y = radius * Math.cos(phi);
    cameraRef.current.position.z = radius * Math.sin(phi) * Math.cos(theta);
    cameraRef.current.lookAt(0, 8, 0);
  };

  return (
    <div className={`relative rounded-xl overflow-hidden border border-slate-700 bg-slate-950 ${className}`}>
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      />

      {/* Flight HUD Overlay */}
      <div className="absolute top-2 left-2 flex items-center gap-1.5 z-10">
        <span className="px-2 py-0.5 rounded bg-slate-900/80 backdrop-blur-xs text-emerald-400 font-mono text-[10px] border border-emerald-500/30 flex items-center gap-1">
          <Navigation className="w-3 h-3 text-emerald-400 rotate-45" />
          <span>UAV Stations: {mission?.totalImages || 0} Photos &bull; {mission?.flightAltitudeAgl || 45}m AGL</span>
        </span>
      </div>

      <div className="absolute top-2 right-2 flex items-center gap-1 z-10">
        <button
          type="button"
          onClick={() => setIsRotating(!isRotating)}
          className={`p-1 rounded text-[10px] border transition-all cursor-pointer ${
            isRotating ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-slate-900/80 text-slate-400 border-slate-700'
          }`}
          title="Auto-rotate 3D drone trajectory"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>

      {/* Photogrammetry Station Legend */}
      <div className="absolute bottom-2 left-2 z-10 bg-slate-900/80 backdrop-blur-xs p-1.5 rounded border border-slate-800 text-[9px] font-mono text-slate-300 flex items-center gap-3">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500" /> Nadir (-90°)
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-amber-400" /> Oblique (-45° Facade)
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-xs border border-cyan-400" /> Cadastre Envelope
        </span>
      </div>

      <div className="absolute bottom-2 right-2 text-[9px] font-mono text-slate-400 select-none pointer-events-none">
        Drag to Orbit &bull; Scroll to Zoom
      </div>
    </div>
  );
};
