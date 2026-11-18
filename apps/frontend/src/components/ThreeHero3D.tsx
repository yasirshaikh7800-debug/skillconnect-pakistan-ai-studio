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
        const height = container.clientHeight || 420;
        const isMobile = window.innerWidth < 768;

        const scene = new THREE.Scene();
        // Atmospheric dark space fog
        scene.fog = new THREE.FogExp2(0x050814, 0.02);

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
        renderer.setClearColor(0x050814, 0); // Transparent canvas

        while (container.firstChild) {
          container.removeChild(container.firstChild);
        }
        container.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Futuristic Studio Lighting Setup
        const ambientLight = new THREE.AmbientLight(0x101a38, 1.8);
        scene.add(ambientLight);

        const mainLight = new THREE.DirectionalLight(0x00f2fe, 3.2); // Neon Cyan Key
        mainLight.position.set(5, 10, 7);
        scene.add(mainLight);

        const fillLight = new THREE.DirectionalLight(0x8b5cf6, 3.5); // Electric Violet Fill
        fillLight.position.set(-6, -2, -5);
        scene.add(fillLight);

        const coreLight = new THREE.PointLight(0x00f2fe, 4.5, 15); // Luminous Core
        coreLight.position.set(0, 0, 0);
        scene.add(coreLight);

        const globeGroup = new THREE.Group();
        scene.add(globeGroup);

        // 1. Futuristic Glass Tech Globe
        const globeGeo = new THREE.SphereGeometry(2, 64, 64);
        const globeMat = new THREE.MeshPhysicalMaterial({
          color: 0x07112b,
          metalness: 0.2,
          roughness: 0.1,
          transmission: 0.88,
          thickness: 2.2,
          ior: 1.55,
          transparent: true,
          opacity: 0.95,
          clearcoat: 1.0,
          clearcoatRoughness: 0.1,
          emissive: 0x051b3d,
          emissiveIntensity: 0.4,
        });
        const globe = new THREE.Mesh(globeGeo, globeMat);
        globeGroup.add(globe);

        // Inner Geometric Core
        const coreGeo = new THREE.IcosahedronGeometry(0.95, 1);
        const coreMat = new THREE.MeshBasicMaterial({
          color: 0x00f2fe,
          wireframe: true,
          transparent: true,
          opacity: 0.35,
        });
        const core = new THREE.Mesh(coreGeo, coreMat);
        globeGroup.add(core);

        const innerSolidGeo = new THREE.SphereGeometry(0.65, 32, 32);
        const innerSolidMat = new THREE.MeshBasicMaterial({
          color: 0x8b5cf6,
          transparent: true,
          opacity: 0.45,
        });
        const innerSolid = new THREE.Mesh(innerSolidGeo, innerSolidMat);
        globeGroup.add(innerSolid);

        // 2. Orbital Lines & Nodes
        const nodeMeshes: THREE.Mesh[] = [];
        const nodePivots: { pivot: THREE.Group; speed: number }[] = [];

        const SERVICES = [
          { id: 'electrician', name: 'Electrician', category: 'technology-it', color: 0x00f2fe },
          { id: 'plumber', name: 'Plumber', category: 'home-repair', color: 0x38bdf8 },
          { id: 'ac-repair', name: 'HVAC & AC', category: 'home-repair', color: 0x60a5fa },
          { id: 'carpenter', name: 'Carpenter', category: 'construction-trades', color: 0x818cf8 },
          { id: 'web-dev', name: 'IT Specialists', category: 'technology-it', color: 0xa855f7 },
          { id: 'cleaning', name: 'Solar Energy', category: 'technology-it', color: 0x00f2fe },
          { id: 'painter', name: 'Finishes', category: 'construction-trades', color: 0xc084fc },
          { id: 'mechanic', name: 'Automotive', category: 'automotive', color: 0x38bdf8 },
        ];

        const orbitRadius = 2.45;
        const ringGeo = new THREE.TorusGeometry(orbitRadius, 0.008, 16, 100);

        const nodeGeo = new THREE.SphereGeometry(0.12, 32, 32);
        const hitBoxGeo = new THREE.SphereGeometry(0.5, 16, 16);
        const hitBoxMat = new THREE.MeshBasicMaterial({ visible: false });

        SERVICES.forEach((service, index) => {
          const pivot = new THREE.Group();

          pivot.rotation.x = (Math.PI / 4) * index + Math.random() * 0.3;
          pivot.rotation.y = (Math.PI / 3) * index + Math.random() * 0.3;

          const ringMat = new THREE.MeshBasicMaterial({
            color: index % 2 === 0 ? 0x00f2fe : 0x8b5cf6,
            transparent: true,
            opacity: 0.4,
          });
          const ring = new THREE.Mesh(ringGeo, ringMat);
          pivot.add(ring);

          const nGroup = new THREE.Group();
          const angle = Math.random() * Math.PI * 2;
          nGroup.position.set(Math.cos(angle) * orbitRadius, Math.sin(angle) * orbitRadius, 0);

          const nMat = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            emissive: service.color,
            emissiveIntensity: 1.2,
            roughness: 0.1,
            metalness: 0.8,
          });
          const nMesh = new THREE.Mesh(nodeGeo, nMat);

          const haloGeo = new THREE.SphereGeometry(0.24, 16, 16);
          const haloMat = new THREE.MeshBasicMaterial({
            color: service.color,
            transparent: true,
            opacity: 0.35,
          });
          const halo = new THREE.Mesh(haloGeo, haloMat);

          nGroup.add(nMesh);
          nGroup.add(halo);

          const hitBox = new THREE.Mesh(hitBoxGeo, hitBoxMat);
          hitBox.userData = {
            name: service.name,
            category: service.category,
            mesh: nMesh,
            halo: halo,
            targetScale: 1,
          };
          nGroup.add(hitBox);
          nodeMeshes.push(hitBox);

          pivot.add(nGroup);
          globeGroup.add(pivot);

          nodePivots.push({
            pivot,
            speed: (Math.random() * 0.002 + 0.001) * (index % 2 === 0 ? 1 : -1),
          });
        });

        // 3. Ambient Glowing Cyber Dust Particles
        const pGeo = new THREE.BufferGeometry();
        const pCount = 160;
        const pPos = new Float32Array(pCount * 3);
        for (let i = 0; i < pCount * 3; i++) {
          pPos[i] = (Math.random() - 0.5) * 15;
        }
        pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
        const pMat = new THREE.PointsMaterial({
          color: 0x00f2fe,
          size: 0.06,
          transparent: true,
          opacity: 0.65,
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

          targetRotation.x = mouse.y * 0.15;
          targetRotation.y = mouse.x * 0.25;

          raycaster.setFromCamera(mouse, camera);
          const intersects = raycaster.intersectObjects(nodeMeshes);

          if (intersects.length > 0) {
            const hit = intersects[0].object;
            const data = hit.userData;
            setHoveredLabel(data.name);
            container.style.cursor = 'pointer';
            data.targetScale = 1.6;
          } else {
            setHoveredLabel(null);
            container.style.cursor = 'default';
            nodeMeshes.forEach((mesh) => {
              mesh.userData.targetScale = 1;
            });
          }
        };

        const handleClick = (e: MouseEvent) => {
          if (!container) return;
          const rect = container.getBoundingClientRect();
          mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
          mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

          raycaster.setFromCamera(mouse, camera);
          const intersects = raycaster.intersectObjects(nodeMeshes);

          if (intersects.length > 0) {
            const data = intersects[0].object.userData;
            if (data.category) {
              router.push(`/services?category=${data.category}`);
            }
          }
        };

        container.addEventListener('mousemove', handleMouseMove);
        container.addEventListener('click', handleClick);

        // Visibility observer
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            isIntersectingRef.current = entry.isIntersecting;
          });
        });
        observer.observe(container);

        // Animation Loop
        let clock = new THREE.Clock();

        const animate = () => {
          animFrameRef.current = requestAnimationFrame(animate);

          if (!isIntersectingRef.current) return;

          const delta = clock.getDelta();

          if (!isReducedMotion) {
            globeGroup.rotation.y += delta * 0.12;
            core.rotation.x -= delta * 0.2;
            core.rotation.y -= delta * 0.25;

            nodePivots.forEach((np) => {
              np.pivot.rotation.z += np.speed;
            });

            nodeMeshes.forEach((hitBox) => {
              const mesh = hitBox.userData.mesh;
              const halo = hitBox.userData.halo;
              const target = hitBox.userData.targetScale;
              mesh.scale.lerp(new THREE.Vector3(target, target, target), 0.1);
              halo.scale.lerp(new THREE.Vector3(target, target, target), 0.1);
            });

            particles.rotation.y += delta * 0.03;
          }

          camera.position.x += (targetRotation.y - camera.position.x) * 0.05;
          camera.position.y += (-targetRotation.x - camera.position.y) * 0.05;
          camera.lookAt(0, 0, 0);

          renderer.render(scene, camera);
        };

        animate();

        const handleResize = () => {
          if (!containerRef.current || !renderer) return;
          const newW = containerRef.current.clientWidth;
          const newH = containerRef.current.clientHeight;
          camera.aspect = newW / newH;
          camera.updateProjectionMatrix();
          renderer.setSize(newW, newH);
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
  }, [viewMode, router, isReducedMotion]);

  if (!mounted || !webglSupported) {
    return (
      <div className="w-full h-80 sm:h-[420px] rounded-3xl bg-[#0a1024] border border-cyan-500/20 animate-pulse flex items-center justify-center text-cyan-300 text-xs shadow-inner">
        Loading 3D Experience...
      </div>
    );
  }

  return (
    <div className="relative w-full h-80 sm:h-[420px] rounded-3xl overflow-hidden border border-cyan-500/25 bg-[#050814]/90 backdrop-blur-xl shadow-[0_0_40px_rgba(0,242,254,0.12)] group">
      {viewMode === 'map' ? (
        <ThreeMap3D compact={false} className="w-full h-full" />
      ) : (
        <>
          {/* 3D WebGL Canvas Container */}
          <div ref={containerRef} className="w-full h-full cursor-default active:cursor-grabbing" />

          {/* Floating Hover Label Badge */}
          {hoveredLabel && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-[#0a1024]/90 border border-cyan-400 text-white text-xs font-bold shadow-[0_0_20px_rgba(0,242,254,0.4)] flex items-center space-x-1.5 backdrop-blur-md animate-fadeIn transition-all z-30 pointer-events-none">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
              <span>Skill Domain: <span className="text-cyan-300">{hoveredLabel}</span></span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
            </div>
          )}
        </>
      )}

      {/* Mode Control Bar */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs pointer-events-auto z-20">
        <div className="flex items-center space-x-1 p-1 rounded-xl bg-[#0a1024]/90 border border-cyan-500/30 backdrop-blur-md shadow-xl">
          <button
            onClick={() => setViewMode('orbit')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
              viewMode === 'orbit'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-[0_0_15px_rgba(0,242,254,0.4)]'
                : 'text-slate-300 hover:text-white hover:bg-slate-850'
            }`}
          >
            <Orbit className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Skill Network</span>
            <span className="sm:hidden">Network</span>
          </button>

          <button
            onClick={() => setViewMode('map')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
              viewMode === 'map'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-[0_0_15px_rgba(0,242,254,0.4)]'
                : 'text-slate-300 hover:text-white hover:bg-slate-850'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Pakistan 3D Map</span>
            <span className="sm:hidden">Map</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#0a1024]/85 border border-cyan-500/20 text-[10.5px] font-medium text-cyan-300 backdrop-blur-md shadow-sm">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>Live 3D Dispatch Network</span>
        </div>
      </div>
    </div>
  );
}
