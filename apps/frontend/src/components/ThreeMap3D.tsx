'use client';

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { PAKISTAN_CITIES_FULL, SAMPLE_PROVIDERS } from '@/lib/mockData';
import { MapPin, Navigation, Compass, Layers, RotateCw, ZoomIn, ZoomOut, CheckCircle2, Star, Phone, Sparkles, Crosshair } from 'lucide-react';

export interface ThreeMap3DProps {
  selectedCity?: string;
  onCitySelect?: (cityName: string) => void;
  className?: string;
  compact?: boolean;
}

export interface Location3D {
  name: string;
  x: number;
  y: number;
  z: number;
  height: number;
  providers: number;
  rating: number;
  province: string;
}

// 3D Coordinates mapped to realistic Pakistani geographic positioning
const PAKISTAN_3D_LOCATIONS: Location3D[] = [
  { name: 'Karachi', x: -2.8, y: 0.15, z: -1.8, height: 1.5, providers: 420, rating: 4.9, province: 'Sindh' },
  { name: 'Hyderabad', x: -2.3, y: 0.12, z: -1.4, height: 0.9, providers: 110, rating: 4.8, province: 'Sindh' },
  { name: 'Sukkur', x: -1.7, y: 0.1, z: -0.8, height: 0.7, providers: 65, rating: 4.7, province: 'Sindh' },
  { name: 'Quetta', x: -3.2, y: 0.55, z: 0.1, height: 1.1, providers: 85, rating: 4.7, province: 'Balochistan' },
  { name: 'Multan', x: -0.6, y: 0.2, z: 0.2, height: 1.0, providers: 140, rating: 4.8, province: 'Punjab' },
  { name: 'Faisalabad', x: 0.1, y: 0.25, z: 0.8, height: 1.3, providers: 210, rating: 4.9, province: 'Punjab' },
  { name: 'Lahore', x: 0.8, y: 0.22, z: 0.9, height: 1.7, providers: 380, rating: 4.9, province: 'Punjab' },
  { name: 'Rawalpindi', x: 0.3, y: 0.45, z: 1.6, height: 1.2, providers: 230, rating: 4.8, province: 'Punjab' },
  { name: 'Islamabad', x: 0.5, y: 0.52, z: 1.8, height: 1.6, providers: 290, rating: 4.9, province: 'ICT' },
  { name: 'Peshawar', x: -0.4, y: 0.58, z: 1.9, height: 1.1, providers: 175, rating: 4.8, province: 'KPK' },
];

export default function ThreeMap3D({
  selectedCity = 'Karachi',
  onCitySelect,
  className = '',
  compact = false,
}: ThreeMap3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webglSupported, setWebglSupported] = useState<boolean>(true);
  const [mounted, setMounted] = useState<boolean>(false);
  const [hoveredLocation, setHoveredLocation] = useState<Location3D | null>(null);
  const [activeLocation, setActiveLocation] = useState<Location3D>(
    () => PAKISTAN_3D_LOCATIONS.find((l) => l.name === selectedCity) || PAKISTAN_3D_LOCATIONS[0]
  );
  
  // Angle indicators (throttled updates)
  const [pitch, setPitch] = useState<number>(55);
  const [yaw, setYaw] = useState<number>(20);

  // References for animation and control updates
  const threeStateRef = useRef<{
    scene?: any;
    camera?: any;
    renderer?: any;
    animFrameId?: number | null;
    isIntersecting?: boolean;
    updateCamera?: () => void;
    controlsAction?: (action: string) => void;
    updateActiveCity?: (cityName: string) => void;
    markerNodes?: Map<string, any>;
    beaconGroup?: any;
    pulseMeshList?: any[];
  }>({});

  // Sync state when selectedCity prop changes
  useEffect(() => {
    const loc = PAKISTAN_3D_LOCATIONS.find((l) => l.name === selectedCity);
    if (loc) {
      setActiveLocation(loc);
      if (threeStateRef.current.updateActiveCity) {
        threeStateRef.current.updateActiveCity(loc.name);
      }
    }
  }, [selectedCity]);

  useEffect(() => {
    setMounted(true);
    let isMounted = true;

    // WebGL Capability Check
    const checkWebGL = () => {
      try {
        const canvas = document.createElement('canvas');
        return !!(
          window.WebGLRenderingContext &&
          (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
        );
      } catch {
        return false;
      }
    };

    if (!checkWebGL()) {
      setWebglSupported(false);
      return;
    }

    const initMap = async () => {
      try {
        const THREE = await import('three');
        if (!isMounted || !containerRef.current) return;

        const container = containerRef.current;
        const width = container.clientWidth || 800;
        const height = container.clientHeight || 500;
        const isMobile = window.innerWidth < 768;

        // Scene
        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x060a12, 0.035);

        // Perspective Camera with initial 3D tilt perspective
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);

        // Renderer with optimized settings
        const renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: !isMobile,
          powerPreference: 'high-performance',
          precision: isMobile ? 'mediump' : 'highp',
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(isMobile ? 1.0 : Math.min(window.devicePixelRatio, 1.5));
        renderer.shadowMap.enabled = !isMobile;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Clean container
        while (container.firstChild) {
          container.removeChild(container.firstChild);
        }
        container.appendChild(renderer.domElement);

        // ==================== 1. REALISTIC 3D TOPOGRAPHY TERRAIN ====================
        const terrainWidth = 14;
        const terrainHeight = 12;
        const segments = isMobile ? 32 : 64;
        const terrainGeo = new THREE.PlaneGeometry(terrainWidth, terrainHeight, segments, segments);

        // Deform terrain for Realistic Pakistani Mountainous Elevation & Valleys
        const posAttr = terrainGeo.attributes.position;
        for (let i = 0; i < posAttr.count; i++) {
          const vx = posAttr.getX(i);
          const vy = posAttr.getY(i);
          
          // Mountainous elevation contour (higher in North/Z+, lower in South/Z-)
          const elevation =
            Math.sin(vx * 0.7) * Math.cos(vy * 0.7) * 0.35 +
            Math.sin(vx * 1.4 + vy * 1.1) * 0.18 +
            Math.cos(vx * 0.3) * 0.22 +
            (vy > 0 ? (vy / 6) * 0.4 : 0); // Elevation increase toward northern areas
          
          posAttr.setZ(i, Math.max(0, elevation));
        }
        terrainGeo.computeVertexNormals();

        // Dark Futuristic Tech Terrain Material
        const terrainMat = new THREE.MeshStandardMaterial({
          color: 0x0a1422,
          roughness: 0.75,
          metalness: 0.25,
          flatShading: true,
        });
        const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
        terrainMesh.rotation.x = -Math.PI / 2;
        terrainMesh.receiveShadow = !isMobile;
        scene.add(terrainMesh);

        // Subtle Contour Line Overlay
        const wireMat = new THREE.MeshBasicMaterial({
          color: 0x0d9488,
          wireframe: true,
          transparent: true,
          opacity: 0.15,
        });
        const wireMesh = new THREE.Mesh(terrainGeo, wireMat);
        wireMesh.rotation.x = -Math.PI / 2;
        wireMesh.position.y = 0.01;
        scene.add(wireMesh);

        // ==================== 2. GLOWING HIGHWAY & ROAD NETWORK ====================
        const roadGroup = new THREE.Group();

        // Main Highway Arc (Grand Trunk Road / Motorway Representation)
        const highwayCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(-2.8, 0.04, 1.8),  // Karachi
          new THREE.Vector3(-2.3, 0.04, 1.4),  // Hyderabad
          new THREE.Vector3(-1.7, 0.04, 0.8),  // Sukkur
          new THREE.Vector3(-0.6, 0.04, -0.2), // Multan
          new THREE.Vector3(0.1, 0.04, -0.8),  // Faisalabad
          new THREE.Vector3(0.8, 0.04, -0.9),  // Lahore
          new THREE.Vector3(0.3, 0.04, -1.6),  // Rawalpindi
          new THREE.Vector3(0.5, 0.04, -1.8),  // Islamabad
          new THREE.Vector3(-0.4, 0.04, -1.9), // Peshawar
        ]);
        const highwayGeo = new THREE.TubeGeometry(highwayCurve, 64, 0.04, 8, false);
        const highwayMat = new THREE.MeshBasicMaterial({ color: 0x14b8a6 });
        const highwayMesh = new THREE.Mesh(highwayGeo, highwayMat);
        roadGroup.add(highwayMesh);

        // Secondary Arterial Grid
        const gridHelper = new THREE.GridHelper(12, 24, 0x14b8a6, 0x1e293b);
        gridHelper.position.y = 0.02;
        (gridHelper.material as any).transparent = true;
        (gridHelper.material as any).opacity = 0.22;
        roadGroup.add(gridHelper);

        scene.add(roadGroup);

        // ==================== 3. 3D BUILDINGS & CITY DISTRICTS ====================
        const buildingsGroup = new THREE.Group();

        // Shared Geometries & Materials for minimal GPU draw calls
        const bMatStandard = new THREE.MeshStandardMaterial({
          color: 0x111c2e,
          emissive: 0x09202f,
          roughness: 0.3,
          metalness: 0.7,
        });

        const roofMatEmerald = new THREE.MeshBasicMaterial({ color: 0x10b981 });
        const roofMatCyan = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });

        PAKISTAN_3D_LOCATIONS.forEach((loc) => {
          const clusterCount = Math.floor(loc.height * 4) + 2;

          for (let b = 0; b < clusterCount; b++) {
            const bWidth = 0.1 + Math.random() * 0.14;
            const bDepth = 0.1 + Math.random() * 0.14;
            const bHeight = (0.2 + Math.random() * 0.5) * loc.height;

            const bGeo = new THREE.BoxGeometry(bWidth, bHeight, bDepth);
            const bMesh = new THREE.Mesh(bGeo, bMatStandard);

            const offsetX = (Math.random() - 0.5) * 0.5;
            const offsetZ = (Math.random() - 0.5) * 0.5;

            bMesh.position.set(loc.x + offsetX, bHeight / 2 + 0.02, -loc.z + offsetZ);
            bMesh.castShadow = !isMobile;
            bMesh.receiveShadow = !isMobile;

            // Rooftop Light Accents
            const roofGeo = new THREE.BoxGeometry(bWidth * 0.8, 0.02, bDepth * 0.8);
            const roofMesh = new THREE.Mesh(roofGeo, b % 2 === 0 ? roofMatEmerald : roofMatCyan);
            roofMesh.position.y = bHeight / 2 + 0.01;
            bMesh.add(roofMesh);

            buildingsGroup.add(bMesh);
          }
        });

        scene.add(buildingsGroup);

        // ==================== 4. 3D LOCATION MARKERS ====================
        const markersGroup = new THREE.Group();
        const markerNodesMap = new Map<string, any>();
        const pulseMeshList: any[] = [];

        PAKISTAN_3D_LOCATIONS.forEach((loc) => {
          const markerNode = new THREE.Group();
          const isSelected = loc.name === selectedCity;

          // 3D Extruded Metallic Pin
          const pinGeo = new THREE.ConeGeometry(0.18, 0.38, 16);
          const pinMat = new THREE.MeshStandardMaterial({
            color: isSelected ? 0x10b981 : 0x06b6d4,
            emissive: isSelected ? 0x059669 : 0x0891b2,
            roughness: 0.2,
            metalness: 0.8,
          });
          const pinMesh = new THREE.Mesh(pinGeo, pinMat);
          pinMesh.rotation.x = Math.PI; // Point down
          pinMesh.position.y = 0.7;
          markerNode.add(pinMesh);

          // Top Glowing Orb
          const orbGeo = new THREE.SphereGeometry(0.11, 16, 16);
          const orbMat = new THREE.MeshBasicMaterial({
            color: isSelected ? 0x34d399 : 0x38bdf8,
          });
          const orbMesh = new THREE.Mesh(orbGeo, orbMat);
          orbMesh.position.y = 0.95;
          markerNode.add(orbMesh);

          // Pulsating Ground Aura Ring
          const ringGeo = new THREE.RingGeometry(0.08, 0.32, 24);
          const ringMat = new THREE.MeshBasicMaterial({
            color: isSelected ? 0x10b981 : 0x06b6d4,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.7,
          });
          const ringMesh = new THREE.Mesh(ringGeo, ringMat);
          ringMesh.rotation.x = -Math.PI / 2;
          ringMesh.position.y = 0.04;
          markerNode.add(ringMesh);
          pulseMeshList.push(ringMesh);

          markerNode.position.set(loc.x, 0, -loc.z);
          markerNode.userData = { locData: loc, orbMesh, ringMesh, pinMesh, isSelected };

          markersGroup.add(markerNode);
          markerNodesMap.set(loc.name, markerNode);
        });

        scene.add(markersGroup);

        // ==================== 5. ACTIVE CITY VERTICAL LIGHT BEACON ====================
        const beaconGroup = new THREE.Group();
        const beaconGeo = new THREE.CylinderGeometry(0.02, 0.25, 3.5, 16, 1, true);
        const beaconMat = new THREE.MeshBasicMaterial({
          color: 0x34d399,
          transparent: true,
          opacity: 0.45,
          side: THREE.DoubleSide,
        });
        const beaconMesh = new THREE.Mesh(beaconGeo, beaconMat);
        beaconMesh.position.y = 1.75;
        beaconGroup.add(beaconMesh);

        // Position beacon at initial selected city
        const initialLoc = PAKISTAN_3D_LOCATIONS.find((l) => l.name === selectedCity) || PAKISTAN_3D_LOCATIONS[0];
        beaconGroup.position.set(initialLoc.x, 0, -initialLoc.z);
        scene.add(beaconGroup);

        // ==================== 6. LIGHTING ====================
        const ambientLight = new THREE.AmbientLight(0x0a1422, 1.8);
        scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0x38bdf8, 2.5);
        dirLight.position.set(6, 12, 8);
        dirLight.castShadow = !isMobile;
        scene.add(dirLight);

        const fillLight = new THREE.PointLight(0x10b981, 2.5, 20);
        fillLight.position.set(-6, 4, -4);
        scene.add(fillLight);

        // ==================== 7. INTERACTION & CAMERA ORBIT CONTROLS ====================
        let currentZoom = 12;
        let targetYaw = 20;
        let targetPitch = 55;
        let targetCamX = 0;
        let targetCamZ = 0;
        let isDragging = false;
        let previousMouseX = 0;
        let previousMouseY = 0;

        const updateCameraPosition = () => {
          const radYaw = (targetYaw * Math.PI) / 180;
          const radPitch = (targetPitch * Math.PI) / 180;

          camera.position.x = targetCamX + currentZoom * Math.sin(radYaw) * Math.cos(radPitch);
          camera.position.y = currentZoom * Math.sin(radPitch);
          camera.position.z = targetCamZ + currentZoom * Math.cos(radYaw) * Math.cos(radPitch);

          camera.lookAt(targetCamX, 0, targetCamZ);
        };

        updateCameraPosition();

        // Function to update active city visuals cleanly without teardown
        const updateActiveCity = (cityName: string) => {
          const loc = PAKISTAN_3D_LOCATIONS.find((l) => l.name === cityName);
          if (!loc) return;

          markerNodesMap.forEach((node, name) => {
            const isSel = name === cityName;
            const pinMat = node.userData.pinMesh.material as any;
            const orbMat = node.userData.orbMesh.material as any;
            const ringMat = node.userData.ringMesh.material as any;

            if (isSel) {
              pinMat.color.setHex(0x10b981);
              pinMat.emissive.setHex(0x059669);
              orbMat.color.setHex(0x34d399);
              ringMat.color.setHex(0x10b981);
              node.scale.set(1.35, 1.35, 1.35);
            } else {
              pinMat.color.setHex(0x06b6d4);
              pinMat.emissive.setHex(0x0891b2);
              orbMat.color.setHex(0x38bdf8);
              ringMat.color.setHex(0x06b6d4);
              node.scale.set(1.0, 1.0, 1.0);
            }
          });

          // Move Light Beacon smoothly
          beaconGroup.position.set(loc.x, 0, -loc.z);

          // Focus Camera Target
          targetCamX = loc.x * 0.4;
          targetCamZ = -loc.z * 0.4;
          updateCameraPosition();
        };

        // Raycasting for interactive marker clicks/hovers
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        const onPointerDown = (e: MouseEvent) => {
          isDragging = true;
          previousMouseX = e.clientX;
          previousMouseY = e.clientY;
        };

        let lastAngleUpdate = 0;
        const onPointerMove = (e: MouseEvent) => {
          const rect = container.getBoundingClientRect();
          mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
          mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

          if (isDragging) {
            const deltaX = e.clientX - previousMouseX;
            const deltaY = e.clientY - previousMouseY;

            targetYaw -= deltaX * 0.35;
            targetPitch = Math.max(20, Math.min(80, targetPitch + deltaY * 0.3));

            previousMouseX = e.clientX;
            previousMouseY = e.clientY;

            updateCameraPosition();

            // Throttled React state updates for indicators
            const now = Date.now();
            if (now - lastAngleUpdate > 80) {
              lastAngleUpdate = now;
              setYaw(Math.round(targetYaw % 360));
              setPitch(Math.round(targetPitch));
            }
            return;
          }

          // Raycast markers on hover
          raycaster.setFromCamera(mouse, camera);
          const intersects = raycaster.intersectObjects(markersGroup.children, true);

          if (intersects.length > 0) {
            let hit = intersects[0].object;
            while (hit.parent && hit.parent !== markersGroup) {
              hit = hit.parent;
            }
            if (hit.userData && hit.userData.locData) {
              container.style.cursor = 'pointer';
              setHoveredLocation(hit.userData.locData);

              markerNodesMap.forEach((node) => {
                if (node === hit) {
                  node.scale.set(1.4, 1.4, 1.4);
                } else if (node.userData.locData.name !== activeLocation?.name) {
                  node.scale.set(1.0, 1.0, 1.0);
                }
              });
              return;
            }
          } else {
            container.style.cursor = 'grab';
            setHoveredLocation(null);
            markerNodesMap.forEach((node) => {
              if (node.userData.locData.name === activeLocation?.name) {
                node.scale.set(1.35, 1.35, 1.35);
              } else {
                node.scale.set(1.0, 1.0, 1.0);
              }
            });
          }
        };

        const onPointerUp = () => {
          isDragging = false;
        };

        const onPointerClick = (e: MouseEvent) => {
          const rect = container.getBoundingClientRect();
          mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
          mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

          raycaster.setFromCamera(mouse, camera);
          const intersects = raycaster.intersectObjects(markersGroup.children, true);

          if (intersects.length > 0) {
            let hit = intersects[0].object;
            while (hit.parent && hit.parent !== markersGroup) {
              hit = hit.parent;
            }
            if (hit.userData && hit.userData.locData) {
              const loc = hit.userData.locData;
              setActiveLocation(loc);
              updateActiveCity(loc.name);
              if (onCitySelect) onCitySelect(loc.name);
            }
          }
        };

        // Scroll Zoom
        const onWheel = (e: WheelEvent) => {
          e.preventDefault();
          currentZoom = Math.max(5, Math.min(22, currentZoom + e.deltaY * 0.01));
          updateCameraPosition();
        };

        // Manual controls
        const controlsAction = (action: string) => {
          if (action === 'zoomIn') {
            currentZoom = Math.max(5, currentZoom - 1.5);
          } else if (action === 'zoomOut') {
            currentZoom = Math.min(22, currentZoom + 1.5);
          } else if (action === 'rotateLeft') {
            targetYaw -= 30;
          } else if (action === 'rotateRight') {
            targetYaw += 30;
          } else if (action === 'focusCity') {
            if (activeLocation) {
              targetCamX = activeLocation.x * 0.4;
              targetCamZ = -activeLocation.z * 0.4;
            }
          } else if (action === 'reset') {
            currentZoom = 12;
            targetYaw = 20;
            targetPitch = 55;
            targetCamX = 0;
            targetCamZ = 0;
          }
          setYaw(Math.round(targetYaw % 360));
          setPitch(Math.round(targetPitch));
          updateCameraPosition();
        };

        container.addEventListener('mousedown', onPointerDown);
        window.addEventListener('mousemove', onPointerMove);
        window.addEventListener('mouseup', onPointerUp);
        container.addEventListener('click', onPointerClick);
        container.addEventListener('wheel', onWheel, { passive: false });

        // Save refs for state and control integration
        threeStateRef.current = {
          scene,
          camera,
          renderer,
          isIntersecting: true,
          updateCamera: updateCameraPosition,
          controlsAction,
          updateActiveCity,
          markerNodes: markerNodesMap,
          beaconGroup,
          pulseMeshList,
        };

        // ==================== 8. HIGH-PERFORMANCE RENDER LOOP ====================
        let time = 0;
        let animFrameId: number | null = null;

        const animate = () => {
          if (!isMounted) return;

          // Skip rendering if not visible or document hidden
          if (threeStateRef.current.isIntersecting && !document.hidden) {
            time += 0.015;

            // Animate Ground Pulse Rings
            pulseMeshList.forEach((ring, idx) => {
              const scale = 1 + Math.sin(time * 2.5 + idx) * 0.22;
              ring.scale.set(scale, scale, scale);
            });

            // Animate Beacon Beam Rotation
            if (beaconGroup) {
              beaconGroup.rotation.y = time * 0.5;
            }

            renderer.render(scene, camera);
          }

          animFrameId = requestAnimationFrame(animate);
          threeStateRef.current.animFrameId = animFrameId;
        };

        animate();

        // ==================== 9. INTERSECTION OBSERVER FOR GPU AUTO-PAUSE ====================
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              threeStateRef.current.isIntersecting = entry.isIntersecting;
            });
          },
          { threshold: 0.1 }
        );
        observer.observe(container);

        // Resize Listener
        const handleResize = () => {
          if (!isMounted || !container || !renderer || !camera) return;
          const w = container.clientWidth;
          const h = container.clientHeight;
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        };

        window.addEventListener('resize', handleResize);

        // Initial City Focus setup
        updateActiveCity(selectedCity);

        return () => {
          observer.disconnect();
          container.removeEventListener('mousedown', onPointerDown);
          window.removeEventListener('mousemove', onPointerMove);
          window.removeEventListener('mouseup', onPointerUp);
          container.removeEventListener('click', onPointerClick);
          container.removeEventListener('wheel', onWheel);
          window.removeEventListener('resize', handleResize);
        };
      } catch (err) {
        console.warn('3D Map WebGL initialization error:', err);
        setWebglSupported(false);
      }
    };

    initMap();

    return () => {
      isMounted = false;
      if (threeStateRef.current.animFrameId) {
        cancelAnimationFrame(threeStateRef.current.animFrameId);
      }
      if (threeStateRef.current.renderer && containerRef.current) {
        try {
          threeStateRef.current.renderer.dispose();
          if (containerRef.current.firstChild) {
            containerRef.current.removeChild(containerRef.current.firstChild);
          }
        } catch {
          // Dispose completed
        }
      }
    };
  }, []);

  const handleControlAction = useCallback((action: string) => {
    if (threeStateRef.current.controlsAction) {
      threeStateRef.current.controlsAction(action);
    }
  }, []);

  if (!mounted) {
    return (
      <div className={`w-full ${compact ? 'h-72' : 'h-[460px]'} rounded-3xl bg-slate-900 border border-slate-800 animate-pulse flex items-center justify-center text-slate-500 text-xs ${className}`}>
        Initializing 3D Map Engine...
      </div>
    );
  }

  if (!webglSupported) {
    return (
      <div className={`w-full ${compact ? 'h-72' : 'h-[460px]'} rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 border border-teal-500/20 p-6 flex flex-col justify-center items-center text-center relative overflow-hidden ${className}`}>
        <MapPin className="w-12 h-12 text-teal-400 mb-2 animate-bounce" />
        <h3 className="font-extrabold text-white text-base">SkillConnect Interactive Map</h3>
        <p className="text-xs text-slate-400 max-w-sm mt-1">
          399 Pakistani cities covered with CNIC-verified technicians.
        </p>
      </div>
    );
  }

  return (
    <div className={`relative w-full ${compact ? 'h-80' : 'h-[480px]'} rounded-3xl overflow-hidden border border-teal-500/30 bg-[#060a12] shadow-2xl glow-cyan-emerald group ${className}`}>
      {/* Three.js Canvas Container */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Floating Badge */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
        <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-teal-500/40 text-teal-300 text-xs font-bold shadow-xl backdrop-blur-md pointer-events-auto">
          <Sparkles className="w-3.5 h-3.5 text-teal-400" />
          <span>SkillConnect 3D Map • {activeLocation?.name || selectedCity}</span>
          <span className="text-slate-600">|</span>
          <span className="text-[10px] text-emerald-400 font-mono">{activeLocation?.providers} Artisans</span>
        </div>

        {/* Orbit Angle Display */}
        <div className="hidden sm:flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-[10px] font-mono text-slate-400 backdrop-blur-md">
          <Compass className="w-3 h-3 text-teal-400" />
          <span>Pitch: {pitch}° | Yaw: {yaw}°</span>
        </div>
      </div>

      {/* Active City Location Card Drawer */}
      {activeLocation && (
        <div className="absolute bottom-16 left-4 max-w-xs p-4 rounded-2xl bg-slate-900/95 border border-teal-500/40 text-white text-xs shadow-2xl space-y-2.5 backdrop-blur-md animate-fadeIn pointer-events-auto z-10">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-sm text-teal-300 flex items-center space-x-1.5">
              <MapPin className="w-4 h-4 text-teal-400" />
              <span>{activeLocation.name}, {activeLocation.province}</span>
            </h4>
            <span className="flex items-center space-x-1 text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
              <Star className="w-3 h-3 fill-current" />
              <span>{activeLocation.rating}</span>
            </span>
          </div>

          <p className="text-[11px] text-slate-300 leading-relaxed">
            {activeLocation.providers} CNIC-verified background-checked technicians active in this sector.
          </p>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => {
                if (onCitySelect) onCitySelect(activeLocation.name);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-[11px] flex items-center space-x-1.5 shadow-md shadow-teal-500/20 transition-all"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Select {activeLocation.name}</span>
            </button>
            <span className="text-[10px] text-emerald-400 font-semibold flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>Live Dispatch</span>
            </span>
          </div>
        </div>
      )}

      {/* Floating 3D Map Control Toolbar */}
      <div className="absolute bottom-4 right-4 flex items-center space-x-1 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-md pointer-events-auto z-10">
        <button
          onClick={() => handleControlAction('zoomIn')}
          title="Zoom In"
          className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <button
          onClick={() => handleControlAction('zoomOut')}
          title="Zoom Out"
          className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <button
          onClick={() => handleControlAction('rotateLeft')}
          title="Rotate Left"
          className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
        >
          <RotateCw className="w-4 h-4 -scale-x-100" />
        </button>

        <button
          onClick={() => handleControlAction('rotateRight')}
          title="Rotate Right"
          className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
        >
          <RotateCw className="w-4 h-4" />
        </button>

        <button
          onClick={() => handleControlAction('focusCity')}
          title="Center Active City"
          className="p-2 rounded-xl text-slate-300 hover:text-teal-300 hover:bg-slate-800 transition-all"
        >
          <Crosshair className="w-4 h-4" />
        </button>

        <div className="w-px h-4 bg-slate-800 my-auto mx-0.5" />

        <button
          onClick={() => handleControlAction('reset')}
          title="Reset View"
          className="px-3 py-1.5 rounded-xl bg-teal-500/20 text-teal-300 hover:bg-teal-500/30 text-xs font-bold transition-all"
        >
          Reset 3D
        </button>
      </div>
    </div>
  );
}
