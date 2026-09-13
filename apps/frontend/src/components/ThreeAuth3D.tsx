'use client';

import React, { useEffect, useRef, useState } from 'react';

interface ThreeAuth3DProps {
  isSuccess?: boolean;
  isError?: boolean;
  isVerifying?: boolean;
}

export default function ThreeAuth3D({ isSuccess, isError, isVerifying }: ThreeAuth3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webglSupported, setWebglSupported] = useState<boolean>(true);
  const animFrameRef = useRef<number | null>(null);
  const rendererRef = useRef<any>(null);
  const isIntersectingRef = useRef<boolean>(true);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const isSuccessRef = useRef(isSuccess);
  const isErrorRef = useRef(isError);
  const isVerifyingRef = useRef(isVerifying);

  useEffect(() => {
    isSuccessRef.current = isSuccess;
    isErrorRef.current = isError;
    isVerifyingRef.current = isVerifying;
  }, [isSuccess, isError, isVerifying]);

  useEffect(() => {
    let isMounted = true;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

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

    if (!checkWebGL() || motionQuery.matches) {
      setWebglSupported(false);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const initThree = async () => {
      try {
        const THREE = await import('three');
        if (!isMounted || !containerRef.current) return;

        const container = containerRef.current;
        const width = container.clientWidth || window.innerWidth;
        const height = container.clientHeight || window.innerHeight;
        const isMobile = window.innerWidth < 768;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
        camera.position.z = 12;

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
        const ambientLight = new THREE.AmbientLight(0x0a1329, 1.8);
        scene.add(ambientLight);

        const pointLightCyan = new THREE.PointLight(0x06b6d4, 3.5, 35);
        pointLightCyan.position.set(6, 6, 6);
        scene.add(pointLightCyan);

        const pointLightEmerald = new THREE.PointLight(0x10b981, 2.5, 35);
        pointLightEmerald.position.set(-6, -5, 4);
        scene.add(pointLightEmerald);

        const pointLightAccent = new THREE.PointLight(0x38bdf8, 2, 25);
        pointLightAccent.position.set(0, 8, -4);
        scene.add(pointLightAccent);

        // Floating Translucent Glass Panels & Shapes
        const glassGroup = new THREE.Group();
        const glassGeo = new THREE.BoxGeometry(2.4, 2.4, 0.12);
        const ringGeo = new THREE.TorusGeometry(1.5, 0.08, 16, 48);
        const count = isMobile ? 5 : 10;

        const glassMaterial = new THREE.MeshPhongMaterial({
          color: 0x0e2a38,
          emissive: 0x064e3b,
          specular: 0x38bdf8,
          shininess: 100,
          transparent: true,
          opacity: 0.38,
        });

        const accentGlassMaterial = new THREE.MeshPhongMaterial({
          color: 0x0284c7,
          emissive: 0x0284c7,
          specular: 0x7dd3fc,
          shininess: 120,
          transparent: true,
          opacity: 0.25,
        });

        const meshes: any[] = [];

        for (let i = 0; i < count; i++) {
          const isRing = i % 3 === 0;
          const mesh = new THREE.Mesh(isRing ? ringGeo : glassGeo, isRing ? accentGlassMaterial : glassMaterial);
          mesh.position.set(
            (Math.random() - 0.5) * 18,
            (Math.random() - 0.5) * 14,
            (Math.random() - 0.5) * 8 - 2
          );
          mesh.userData = {
            rotSpeedX: (Math.random() - 0.5) * 0.006,
            rotSpeedY: (Math.random() - 0.5) * 0.006,
            initialY: mesh.position.y,
            floatPhase: Math.random() * Math.PI * 2,
          };
          glassGroup.add(mesh);
          meshes.push(mesh);
        }

        scene.add(glassGroup);

        // Gentle Ambient Dust Particles
        const particleCount = isMobile ? 30 : 65;
        const particleGeo = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i += 3) {
          positions[i] = (Math.random() - 0.5) * 22;
          positions[i + 1] = (Math.random() - 0.5) * 16;
          positions[i + 2] = (Math.random() - 0.5) * 10;
        }

        particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const particleMat = new THREE.PointsMaterial({
          color: 0x34d399,
          size: 0.09,
          transparent: true,
          opacity: 0.55,
        });

        const particleSystem = new THREE.Points(particleGeo, particleMat);
        scene.add(particleSystem);

        // IntersectionObserver to auto-pause when offscreen
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
            time += 0.012;

            // Parallax Camera Interpolation
            const targetCamX = mouseRef.current.x * 0.8;
            const targetCamY = mouseRef.current.y * 0.5;
            camera.position.x += (targetCamX - camera.position.x) * 0.04;
            camera.position.y += (targetCamY - camera.position.y) * 0.04;
            camera.lookAt(0, 0, 0);

            // Animate 3D Shapes
            meshes.forEach((m) => {
              m.rotation.x += m.userData.rotSpeedX;
              m.rotation.y += m.userData.rotSpeedY;
              m.position.y = m.userData.initialY + Math.sin(time + m.userData.floatPhase) * 0.25;
            });

            // Status light adjustments
            if (isSuccessRef.current) {
              pointLightEmerald.intensity = 5;
              pointLightCyan.color.setHex(0x10b981);
              particleMat.color.setHex(0x34d399);
              particleSystem.rotation.y = time * 0.08;
            } else if (isErrorRef.current) {
              pointLightCyan.color.setHex(0xef4444);
              pointLightCyan.intensity = 4;
            } else if (isVerifyingRef.current) {
              pointLightCyan.color.setHex(0x38bdf8);
              pointLightCyan.intensity = 4.5;
            } else {
              pointLightCyan.color.setHex(0x06b6d4);
              pointLightCyan.intensity = 3.5;
              pointLightEmerald.intensity = 2.5;
              particleMat.color.setHex(0x34d399);
            }

            particleSystem.rotation.y = time * 0.015;
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
          window.removeEventListener('resize', handleResize);
        };
      } catch (err) {
        console.warn('ThreeAuth3D WebGL failed', err);
        setWebglSupported(false);
      }
    };

    initThree();

    return () => {
      isMounted = false;
      window.removeEventListener('mousemove', handleMouseMove);
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
  }, []);

  // WebGL Fallback / Reduced Motion 2D Glass Scene
  if (!webglSupported) {
    return (
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#070b14]">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-cyan-500/10 blur-[80px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-emerald-500/10 blur-[100px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:32px_32px] opacity-10" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none z-0 opacity-80 overflow-hidden"
    />
  );
}
