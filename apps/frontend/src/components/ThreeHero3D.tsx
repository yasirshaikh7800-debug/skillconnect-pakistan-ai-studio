'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, MapPin, Orbit, ArrowUpRight } from 'lucide-react';
import dynamic from 'next/dynamic';
import * as THREE from 'three';

const ThreeMap3D = dynamic(() => import('./ThreeMap3D'), { ssr: false });

export default function ThreeHero3D() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState<boolean>(false);
  const [webglSupported, setWebglSupported] = useState<boolean>(true);
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'orbit' | 'map'>('orbit');
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);

  const animFrameRef = useRef<number | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const isIntersectingRef = useRef<boolean>(true);

  useEffect(() => {
    setMounted(true);
    let isMounted = true;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(motionQuery.matches);

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

    const initThree = () => {
      try {
        if (!isMounted || !containerRef.current) return;

        const container = containerRef.current;
        const width = container.clientWidth || 600;
        const height = container.clientHeight || 380;
        const isMobile = window.innerWidth < 768;

        const scene = new THREE.Scene();
        // Soft fog to blend with the white background
        scene.fog = new THREE.FogExp2(0xffffff, 0.015);

        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        camera.position.set(0, 0, 8.5);

        const renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: !isMobile,
          powerPreference: 'high-performance',
          precision: isMobile ? 'mediump' : 'highp',
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(isMobile ? 1.0 : Math.min(window.devicePixelRatio, 2.0));
        renderer.setClearColor(0xffffff, 0); // Transparent to show pure white CSS bg

        while (container.firstChild) {
          container.removeChild(container.firstChild);
        }
        container.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Lighting: Elegant realistic setup
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
        scene.add(ambientLight);

        const mainLight = new THREE.DirectionalLight(0xffffff, 2);
        mainLight.position.set(5, 10, 7);
        scene.add(mainLight);

        const fillLight = new THREE.DirectionalLight(0x2563eb, 3.5); // Royal Blue
        fillLight.position.set(-5, 0, -5);
        scene.add(fillLight);

        const coreLight = new THREE.PointLight(0x1e3a8a, 4, 15); // Deep Blue
        coreLight.position.set(0, 0, 0);
        scene.add(coreLight);

        const globeGroup = new THREE.Group();
        scene.add(globeGroup);

        // 1. Premium Glass Globe
        const globeGeo = new THREE.SphereGeometry(2, 64, 64);
        const globeMat = new THREE.MeshPhysicalMaterial({
          color: 0x1e3a8a, // Deep blue base
          metalness: 0.1,
          roughness: 0.1,
          transmission: 0.9, // glass effect
          thickness: 2.0,
          ior: 1.5,
          transparent: true,
          opacity: 1,
          clearcoat: 1.0,
          clearcoatRoughness: 0.1,
          emissive: 0x1e3a8a,
          emissiveIntensity: 0.15,
        });
        const globe = new THREE.Mesh(globeGeo, globeMat);
        globeGroup.add(globe);

        // Inner Core to give depth and reflections
        const coreGeo = new THREE.IcosahedronGeometry(0.9, 1);
        const coreMat = new THREE.MeshBasicMaterial({
          color: 0x2563eb,
          wireframe: true,
          transparent: true,
          opacity: 0.25
        });
        const core = new THREE.Mesh(coreGeo, coreMat);
        globeGroup.add(core);

        const innerSolidGeo = new THREE.SphereGeometry(0.7, 32, 32);
        const innerSolidMat = new THREE.MeshBasicMaterial({
          color: 0x1e3a8a,
          transparent: true,
          opacity: 0.4
        });
        const innerSolid = new THREE.Mesh(innerSolidGeo, innerSolidMat);
        globeGroup.add(innerSolid);

        // 2. Orbital Lines & Nodes
        const nodeMeshes: THREE.Mesh[] = [];
        const nodePivots: { pivot: THREE.Group, speed: number }[] = [];
        
        const SERVICES = [
          { id: 'electrician', name: 'Electrician', category: 'electrician' },
          { id: 'plumber', name: 'Plumber', category: 'plumber' },
          { id: 'ac-repair', name: 'AC Technician', category: 'ac-repair' },
          { id: 'carpenter', name: 'Carpenter', category: 'carpenter' },
          { id: 'web-dev', name: 'IT & Tech', category: 'web-dev' },
          { id: 'cleaning', name: 'Home Care', category: 'cleaning' },
          { id: 'painter', name: 'Painter', category: 'painter' },
          { id: 'mechanic', name: 'Mechanic', category: 'mechanic' },
        ];

        const orbitRadius = 2.45;
        const ringGeo = new THREE.TorusGeometry(orbitRadius, 0.006, 16, 100);
        const ringMat = new THREE.MeshBasicMaterial({ color: 0x2563eb, transparent: true, opacity: 0.35 });
        
        const nodeGeo = new THREE.SphereGeometry(0.12, 32, 32);
        const hitBoxGeo = new THREE.SphereGeometry(0.5, 16, 16);
        const hitBoxMat = new THREE.MeshBasicMaterial({ visible: false });

        SERVICES.forEach((service, index) => {
          const pivot = new THREE.Group();
          
          // Distribute orbits beautifully
          pivot.rotation.x = (Math.PI / 4) * index + Math.random() * 0.3;
          pivot.rotation.y = (Math.PI / 3) * index + Math.random() * 0.3;
          
          // Add orbital ring
          const ring = new THREE.Mesh(ringGeo, ringMat);
          pivot.add(ring);

          // Node Visuals
          const nGroup = new THREE.Group();
          // Position on the ring
          const angle = Math.random() * Math.PI * 2;
          nGroup.position.set(Math.cos(angle) * orbitRadius, Math.sin(angle) * orbitRadius, 0);
          
          // Node Core
          const nMat = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            emissive: 0x2563eb,
            emissiveIntensity: 0.8,
            roughness: 0.1,
            metalness: 0.8
          });
          const nMesh = new THREE.Mesh(nodeGeo, nMat);
          
          // Node Glow Halo
          const haloGeo = new THREE.SphereGeometry(0.2, 16, 16);
          const haloMat = new THREE.MeshBasicMaterial({ color: 0x2563eb, transparent: true, opacity: 0.3 });
          const halo = new THREE.Mesh(haloGeo, haloMat);
          
          nGroup.add(nMesh);
          nGroup.add(halo);

          // Hitbox for raycasting
          const hitBox = new THREE.Mesh(hitBoxGeo, hitBoxMat);
          hitBox.userData = { 
            name: service.name, 
            category: service.category,
            mesh: nMesh,
            halo: halo,
            targetScale: 1
          };
          nGroup.add(hitBox);
          nodeMeshes.push(hitBox);
          
          pivot.add(nGroup);
          globeGroup.add(pivot);
          
          nodePivots.push({
            pivot,
            speed: (Math.random() * 0.002 + 0.001) * (index % 2 === 0 ? 1 : -1)
          });
        });

        // 3. Ambient Particles
        const pGeo = new THREE.BufferGeometry();
        const pCount = 120;
        const pPos = new Float32Array(pCount * 3);
        for(let i=0; i<pCount*3; i++) {
          pPos[i] = (Math.random() - 0.5) * 15;
        }
        pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
        const pMat = new THREE.PointsMaterial({
          color: 0x2563eb,
          size: 0.05,
          transparent: true,
          opacity: 0.5
        });
        const particles = new THREE.Points(pGeo, pMat);
        scene.add(particles);

        // Interaction & Parallax
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2(0, 0);
        const targetRotation = new THREE.Vector2(0, 0);

        const handleMouseMove = (e: MouseEvent) => {
          if (!container) return;
          const rect = container.getBoundingClientRect();
          mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
          mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

          // Target rotation for parallax
          targetRotation.x = mouse.y * 0.15;
          targetRotation.y = mouse.x * 0.25;

          raycaster.setFromCamera(mouse, camera);
          const intersects = raycaster.intersectObjects(nodeMeshes, false);

          let foundHover = false;
          // Reset all nodes
          nodeMeshes.forEach(hitBox => {
            hitBox.userData.targetScale = 1;
            (hitBox.userData.mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.8;
          });

          if (intersects.length > 0) {
            const hitObj = intersects[0].object;
            if (hitObj.userData && hitObj.userData.name) {
              foundHover = true;
              container.style.cursor = 'pointer';
              setHoveredLabel(hitObj.userData.name);
              hitObj.userData.targetScale = 1.6;
              (hitObj.userData.mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 1.5;
            }
          }

          if (!foundHover) {
            container.style.cursor = 'default';
            setHoveredLabel(null);
          }
        };

        const handleClick = () => {
          if (hoveredLabel) {
            const found = SERVICES.find((s) => s.name === hoveredLabel);
            if (found) {
              router.push(`/search?category=${found.category}`);
            }
          }
        };

        container.addEventListener('mousemove', handleMouseMove);
        container.addEventListener('click', handleClick);

        // IntersectionObserver for GPU auto-pause when out of viewport
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              isIntersectingRef.current = entry.isIntersecting;
            });
          },
          { threshold: 0.1 }
        );
        observer.observe(container);

        // Animation Loop
        const animate = () => {
          if (!isMounted) return;

          if (isIntersectingRef.current && !document.hidden) {
            if (!motionQuery.matches) {
              // Smooth parallax rotation
              globeGroup.rotation.x += (targetRotation.x - globeGroup.rotation.x) * 0.05;
              globeGroup.rotation.y += (targetRotation.y - globeGroup.rotation.y) * 0.05;

              // Gentle base rotation
              globeGroup.rotation.y += 0.001;
              core.rotation.y -= 0.002;
              core.rotation.x += 0.001;
              innerSolid.rotation.y += 0.001;

              // Orbits
              nodePivots.forEach(n => {
                n.pivot.rotation.z += n.speed;
              });

              // Node scaling (Hover)
              nodeMeshes.forEach(hitBox => {
                const data = hitBox.userData;
                const currentScale = data.mesh.scale.x;
                const target = data.targetScale;
                const newScale = currentScale + (target - currentScale) * 0.15;
                data.mesh.scale.set(newScale, newScale, newScale);
                data.halo.scale.set(newScale, newScale, newScale);
              });

              // Slowly rotate particles
              particles.rotation.y -= 0.0005;
            }

            renderer.render(scene, camera);
          }

          animFrameRef.current = requestAnimationFrame(animate);
        };

        animate();

        const handleResize = () => {
          if (!isMounted || !container || !renderer || !camera) return;
          const w = container.clientWidth;
          const h = container.clientHeight;
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        };

        window.addEventListener('resize', handleResize);

        return () => {
          observer.disconnect();
          container.removeEventListener('mousemove', handleMouseMove);
          container.removeEventListener('click', handleClick);
          window.removeEventListener('resize', handleResize);
        };
      } catch (err) {
        console.warn('Hero 3D Scene WebGL failed', err);
        setWebglSupported(false);
      }
    };

    if (viewMode === 'orbit') {
      initThree();
    }

    return () => {
      isMounted = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (rendererRef.current && containerRef.current) {
        try {
          rendererRef.current.dispose();
          if (containerRef.current.firstChild) {
            containerRef.current.removeChild(containerRef.current.firstChild);
          }
        } catch {
          // Cleaned
        }
      }
    };
  }, [viewMode, router]);

  if (!mounted || !webglSupported) {
    return (
      <div className="w-full h-80 sm:h-[400px] rounded-3xl bg-blue-50 border border-slate-200 animate-pulse flex items-center justify-center text-blue-600 text-xs shadow-inner">
        Loading 3D Experience...
      </div>
    );
  }

  return (
    <div className="relative w-full h-80 sm:h-[400px] rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-[0_15px_40px_-10px_rgba(37,99,235,0.15)] group">
      {viewMode === 'map' ? (
        <ThreeMap3D compact={false} className="w-full h-full" />
      ) : (
        <>
          {/* 3D WebGL Canvas Container */}
          <div ref={containerRef} className="w-full h-full cursor-default active:cursor-grabbing" />

          {/* Floating Hover Label Badge */}
          {hoveredLabel && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-900 text-xs font-bold shadow-lg shadow-blue-600/10 flex items-center space-x-1.5 backdrop-blur-md animate-fadeIn transition-all z-30 pointer-events-none">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-spin" />
              <span>Category: <span className="text-blue-600">{hoveredLabel}</span></span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
            </div>
          )}
        </>
      )}

      {/* Mode Control Bar */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs pointer-events-auto z-20">
        <div className="flex items-center space-x-1 p-1 rounded-xl bg-white border border-slate-200 backdrop-blur-md shadow-lg shadow-blue-900/5">
          <button
            onClick={() => setViewMode('orbit')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center space-x-1.5 ${
              viewMode === 'orbit'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Orbit className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Skill Network</span>
            <span className="sm:hidden">Network</span>
          </button>

          <button
            onClick={() => setViewMode('map')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center space-x-1.5 ${
              viewMode === 'map'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Coverage Map</span>
            <span className="sm:hidden">Map</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-[11px] font-semibold text-slate-500 backdrop-blur-md shadow-sm">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
          <span>Interactive 3D Engine</span>
        </div>
      </div>
    </div>
  );
}
