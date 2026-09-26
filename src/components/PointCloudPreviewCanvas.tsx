import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ParsedPointCloud } from '../utils/pointCloudParser';
import { Layers, Maximize2, RotateCcw, Palette } from 'lucide-react';

interface PointCloudPreviewCanvasProps {
  pointCloud: ParsedPointCloud | null;
  className?: string;
}

export const PointCloudPreviewCanvas: React.FC<PointCloudPreviewCanvasProps> = ({
  pointCloud,
  className = 'h-52 w-full',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const pointsMeshRef = useRef<THREE.Points | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const [colorMode, setColorMode] = useState<'elevation' | 'classification'>('elevation');
  const [pointSize, setPointSize] = useState<number>(0.2);
  const [isRotating, setIsRotating] = useState(true);

  // Mouse interaction state
  const isDraggingRef = useRef(false);
  const prevMouseRef = useRef({ x: 0, y: 0 });
  const sphericalRef = useRef({ radius: 35, theta: 0.8, phi: 1.1 });

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

    // 3. Grid Helper
    const grid = new THREE.GridHelper(40, 20, 0x38bdf8, 0x1e293b);
    grid.position.y = 0;
    scene.add(grid);

    // 4. Update Camera Position from Spherical Coordinates
    const updateCamera = () => {
      const { radius, theta, phi } = sphericalRef.current;
      camera.position.x = radius * Math.sin(phi) * Math.sin(theta);
      camera.position.y = radius * Math.cos(phi);
      camera.position.z = radius * Math.sin(phi) * Math.cos(theta);
      camera.lookAt(0, 5, 0);
    };
    updateCamera();

    // 5. Render Loop
    const animate = () => {
      if (isRotating && !isDraggingRef.current) {
        sphericalRef.current.theta += 0.005;
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

  // Update Points Geometry when pointCloud or colorMode changes
  useEffect(() => {
    if (!sceneRef.current || !pointCloud) return;

    if (pointsMeshRef.current) {
      sceneRef.current.remove(pointsMeshRef.current);
      pointsMeshRef.current.geometry.dispose();
      (pointsMeshRef.current.material as THREE.Material).dispose();
      pointsMeshRef.current = null;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(pointCloud.positions, 3));

    const colors = colorMode === 'elevation' ? pointCloud.colorsElevation : pointCloud.colorsClassification;
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: pointSize,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });

    const mesh = new THREE.Points(geometry, material);
    sceneRef.current.add(mesh);
    pointsMeshRef.current = mesh;
  }, [pointCloud, colorMode, pointSize]);

  // Mouse handlers for 3D rotation & zooming
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
    cameraRef.current.lookAt(0, 5, 0);
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!cameraRef.current) return;
    sphericalRef.current.radius = Math.max(10, Math.min(80, sphericalRef.current.radius + e.deltaY * 0.05));
    const { radius, theta, phi } = sphericalRef.current;
    cameraRef.current.position.x = radius * Math.sin(phi) * Math.sin(theta);
    cameraRef.current.position.y = radius * Math.cos(phi);
    cameraRef.current.position.z = radius * Math.sin(phi) * Math.cos(theta);
    cameraRef.current.lookAt(0, 5, 0);
  };

  return (
    <div className={`relative rounded-xl overflow-hidden border border-slate-700 bg-slate-950 ${className}`}>
      {/* 3D Canvas Container */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      />

      {/* Point Cloud HUD Overlay */}
      <div className="absolute top-2 left-2 flex items-center gap-1.5 z-10">
        <span className="px-2 py-0.5 rounded bg-slate-900/80 backdrop-blur-xs text-cyan-400 font-mono text-[10px] border border-cyan-500/30 flex items-center gap-1">
          <Layers className="w-3 h-3 text-cyan-400" />
          <span>LiDAR: {pointCloud ? `${pointCloud.renderedPoints.toLocaleString()} pts` : 'Awaiting Scan'}</span>
        </span>
      </div>

      {/* Control Pills */}
      <div className="absolute top-2 right-2 flex items-center gap-1 z-10">
        <button
          type="button"
          onClick={() => setColorMode(colorMode === 'elevation' ? 'classification' : 'elevation')}
          className="px-2 py-1 rounded bg-slate-900/80 hover:bg-slate-800 text-slate-200 text-[10px] font-mono border border-slate-700 flex items-center gap-1 transition-all cursor-pointer"
          title="Toggle Elevation vs. ASPRS Classification colors"
        >
          <Palette className="w-3 h-3 text-amber-400" />
          <span>{colorMode === 'elevation' ? 'Elevation Ramp' : 'ASPRS Classes'}</span>
        </button>

        <button
          type="button"
          onClick={() => setIsRotating(!isRotating)}
          className={`p-1 rounded text-[10px] border transition-all cursor-pointer ${
            isRotating ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' : 'bg-slate-900/80 text-slate-400 border-slate-700'
          }`}
          title="Auto-rotate 3D point cloud"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>

      {/* Elevation Legend */}
      {pointCloud && colorMode === 'elevation' && (
        <div className="absolute bottom-2 left-2 z-10 bg-slate-900/80 backdrop-blur-xs p-1.5 rounded border border-slate-800 text-[9px] font-mono text-slate-300 flex items-center gap-2">
          <span>DEM {pointCloud.demAmsl}m</span>
          <div className="w-20 h-2 rounded-xs bg-linear-to-r from-blue-600 via-cyan-400 via-yellow-400 to-red-500" />
          <span>DSM {pointCloud.dsmAmsl}m</span>
        </div>
      )}

      {/* Classification Legend */}
      {pointCloud && colorMode === 'classification' && (
        <div className="absolute bottom-2 left-2 z-10 bg-slate-900/80 backdrop-blur-xs p-1.5 rounded border border-slate-800 text-[9px] font-mono text-slate-300 flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#a67a59]" /> Ground
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#1f87e6]" /> Building
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#33b34d]" /> Foliage
          </span>
        </div>
      )}

      {/* Hint */}
      <div className="absolute bottom-2 right-2 text-[9px] font-mono text-slate-400 select-none pointer-events-none">
        Drag to Orbit &bull; Scroll to Zoom
      </div>
    </div>
  );
};
