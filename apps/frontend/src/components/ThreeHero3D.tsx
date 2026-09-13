'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, MapPin, Orbit, ArrowUpRight } from 'lucide-react';
import dynamic from 'next/dynamic';

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
  const rendererRef = useRef<any>(null);
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

    const initThree = async () => {
      try {
        const THREE = await import('three');
        if (!isMounted || !containerRef.current) return;

        const container = containerRef.current;
        const width = container.clientWidth || 600;
        const height = container.clientHeight || 380;
        const isMobile = window.innerWidth < 768;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        camera.position.set(0, 0, 9);

        const renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: !isMobile,
          powerPreference: 'high-performance',
          precision: isMobile ? 'mediump' : 'highp',
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(isMobile ? 1.0 : Math.min(window.devicePixelRatio, 1.5));

        while (container.firstChild) {
          container.removeChild(container.firstChild);
        }
        container.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Lighting
        const ambientLight = new THREE.AmbientLight(0x0f172a, 1.8);
        scene.add(ambientLight);

        const keyLight = new THREE.DirectionalLight(0x06b6d4, 3);
        keyLight.position.set(5, 8, 5);
        scene.add(keyLight);

        const fillLight = new THREE.PointLight(0x10b981, 3.5, 20);
        fillLight.position.set(-6, -4, 4);
        scene.add(fillLight);

        // Core Group
        const coreGroup = new THREE.Group();

        const coreGeo = new THREE.IcosahedronGeometry(1.6, 2);
        const coreMat = new THREE.MeshStandardMaterial({
          color: 0x10b981,
          emissive: 0x059669,
          wireframe: true,
          transparent: true,
          opacity: 0.45,
          roughness: 0.2,
        });
        const coreMesh = new THREE.Mesh(coreGeo, coreMat);
        coreGroup.add(coreMesh);

        const innerGeo = new THREE.SphereGeometry(0.9, 24, 24);
        const innerMat = new THREE.MeshStandardMaterial({
          color: 0x06b6d4,
          emissive: 0x0891b2,
          roughness: 0.1,
          metalness: 0.9,
          transparent: true,
          opacity: 0.85,
        });
        const innerMesh = new THREE.Mesh(innerGeo, innerMat);
        coreGroup.add(innerMesh);

        scene.add(coreGroup);

        // Floating Service Objects Group
        const serviceGroup = new THREE.Group();
        const serviceObjects: any[] = [];

        const SERVICE_DEFINITIONS = [
          { id: 'electrician', name: 'Electrician', category: 'electrician', color: 0xf59e0b, orbitRadius: 3.8, speed: 0.005, angle: 0, yOffset: 0.5 },
          { id: 'plumber', name: 'Plumber', category: 'plumber', color: 0x0284c7, orbitRadius: 4.1, speed: 0.004, angle: Math.PI / 3, yOffset: -0.4 },
          { id: 'ac-repair', name: 'AC Technician', category: 'ac-repair', color: 0x14b8a6, orbitRadius: 3.6, speed: 0.006, angle: (Math.PI * 2) / 3, yOffset: 0.8 },
          { id: 'carpenter', name: 'Carpenter', category: 'carpenter', color: 0xd97706, orbitRadius: 4.3, speed: 0.004, angle: Math.PI, yOffset: -0.6 },
          { id: 'web-dev', name: 'IT & Laptop Tech', category: 'web-dev', color: 0x6366f1, orbitRadius: 4.2, speed: 0.005, angle: (Math.PI * 4) / 3, yOffset: -0.3 },
          { id: 'cleaning', name: 'Home Care', category: 'cleaning', color: 0x10b981, orbitRadius: 3.7, speed: 0.006, angle: (Math.PI * 5) / 3, yOffset: 0.6 },
        ];

        SERVICE_DEFINITIONS.forEach((def) => {
          const objGroup = new THREE.Group();
          const mat = new THREE.MeshStandardMaterial({
            color: def.color,
            emissive: def.color,
            emissiveIntensity: 0.3,
            roughness: 0.2,
            metalness: 0.8,
          });

          const geo = new THREE.IcosahedronGeometry(0.35, 1);
          const mesh = new THREE.Mesh(geo, mat);
          objGroup.add(mesh);

          objGroup.position.set(Math.cos(def.angle) * def.orbitRadius, def.yOffset, Math.sin(def.angle) * def.orbitRadius);
          objGroup.userData = { ...def, targetScale: 1 };
          serviceGroup.add(objGroup);
          serviceObjects.push(objGroup);
        });

        scene.add(serviceGroup);

        // Interaction
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        const handleMouseMove = (e: MouseEvent) => {
          if (!container) return;
          const rect = container.getBoundingClientRect();
          mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
          mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

          camera.position.x += (mouse.x * 0.8 - camera.position.x) * 0.05;
          camera.position.y += (mouse.y * 0.8 - camera.position.y) * 0.05;

          raycaster.setFromCamera(mouse, camera);
          const intersects = raycaster.intersectObjects(serviceGroup.children, true);

          if (intersects.length > 0) {
            let hitObj = intersects[0].object;
            while (hitObj.parent && hitObj.parent !== serviceGroup) {
              hitObj = hitObj.parent;
            }
            if (hitObj.userData && hitObj.userData.name) {
              container.style.cursor = 'pointer';
              setHoveredLabel(hitObj.userData.name);
              return;
            }
          }
          container.style.cursor = 'grab';
          setHoveredLabel(null);
        };

        const handleClick = () => {
          if (hoveredLabel) {
            const found = SERVICE_DEFINITIONS.find((s) => s.name === hoveredLabel);
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
        let time = 0;
        const animate = () => {
          if (!isMounted) return;

          if (isIntersectingRef.current && !document.hidden) {
            time += 0.015;

            if (!motionQuery.matches) {
              coreMesh.rotation.y += 0.005;
              coreMesh.rotation.x += 0.003;
              innerMesh.rotation.y -= 0.008;

              serviceObjects.forEach((so) => {
                so.userData.angle += so.userData.speed;
                so.position.x = Math.cos(so.userData.angle) * so.userData.orbitRadius;
                so.position.z = Math.sin(so.userData.angle) * so.userData.orbitRadius;
                so.position.y = so.userData.yOffset + Math.sin(time * 2 + so.userData.angle) * 0.15;
                so.rotation.y += 0.015;
              });

              camera.lookAt(scene.position);
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

  if (!mounted) {
    return (
      <div className="w-full h-80 sm:h-[400px] rounded-3xl bg-slate-900 border border-slate-800 animate-pulse flex items-center justify-center text-slate-500 text-xs">
        Loading 3D Experience...
      </div>
    );
  }

  return (
    <div className="relative w-full h-80 sm:h-[400px] rounded-3xl overflow-hidden border border-emerald-500/30 bg-slate-950/80 shadow-2xl glow-cyan-emerald group">
      {viewMode === 'map' ? (
        <ThreeMap3D compact={false} className="w-full h-full" />
      ) : (
        <>
          {/* 3D WebGL Canvas Container */}
          <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

          {/* Floating Hover Label Badge */}
          {hoveredLabel && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/50 text-cyan-300 text-xs font-bold shadow-lg flex items-center space-x-1.5 backdrop-blur-md animate-fadeIn">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
              <span>Category: {hoveredLabel}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
            </div>
          )}
        </>
      )}

      {/* Mode Control Bar */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs pointer-events-auto z-20">
        <div className="flex items-center space-x-1 p-1 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-md shadow-2xl">
          <button
            onClick={() => setViewMode('orbit')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center space-x-1.5 ${
              viewMode === 'orbit'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Orbit className="w-3.5 h-3.5" />
            <span>3D Marketplace Orbit</span>
          </button>

          <button
            onClick={() => setViewMode('map')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center space-x-1.5 ${
              viewMode === 'map'
                ? 'bg-teal-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Realistic 3D Map</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-[11px] text-slate-400 backdrop-blur-md shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>SkillConnect 3D WebGL Engine</span>
        </div>
      </div>
    </div>
  );
}
