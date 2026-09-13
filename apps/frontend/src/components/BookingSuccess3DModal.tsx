'use client';

import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle2, Sparkles, X, ArrowRight } from 'lucide-react';

interface BookingSuccess3DModalProps {
  bookingCode: string;
  serviceTitle: string;
  onClose: () => void;
}

export default function BookingSuccess3DModal({
  bookingCode,
  serviceTitle,
  onClose,
}: BookingSuccess3DModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState<boolean>(false);
  const [webglSupported, setWebglSupported] = useState<boolean>(true);
  const animFrameRef = useRef<number | null>(null);
  const rendererRef = useRef<any>(null);

  useEffect(() => {
    setMounted(true);
    let isMounted = true;

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

    const init3DSuccess = async () => {
      try {
        const THREE = await import('three');
        if (!isMounted || !containerRef.current) return;

        const container = containerRef.current;
        const width = container.clientWidth || 320;
        const height = container.clientHeight || 200;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
        camera.position.z = 6;

        const renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: true,
          powerPreference: 'low-power',
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

        while (container.firstChild) {
          container.removeChild(container.firstChild);
        }
        container.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0x10b981, 4, 20);
        pointLight.position.set(0, 0, 4);
        scene.add(pointLight);

        // 3D Floating Checkmark Mesh
        const checkGroup = new THREE.Group();

        // 3D Outer Ring
        const ringGeo = new THREE.TorusGeometry(1.2, 0.12, 16, 64);
        const ringMat = new THREE.MeshStandardMaterial({
          color: 0x10b981,
          emissive: 0x059669,
          roughness: 0.2,
          metalness: 0.8,
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        checkGroup.add(ringMesh);

        // 3D Checkmark Wings
        const checkMat = new THREE.MeshStandardMaterial({
          color: 0x34d399,
          emissive: 0x10b981,
          roughness: 0.1,
          metalness: 0.9,
        });

        const stem1Geo = new THREE.CylinderGeometry(0.12, 0.12, 0.8, 16);
        const stem1 = new THREE.Mesh(stem1Geo, checkMat);
        stem1.position.set(-0.3, -0.1, 0);
        stem1.rotation.z = -Math.PI / 4;
        checkGroup.add(stem1);

        const stem2Geo = new THREE.CylinderGeometry(0.12, 0.12, 1.5, 16);
        const stem2 = new THREE.Mesh(stem2Geo, checkMat);
        stem2.position.set(0.25, 0.15, 0);
        stem2.rotation.z = Math.PI / 4;
        checkGroup.add(stem2);

        scene.add(checkGroup);

        // Particle confetti
        const particlesCount = 40;
        const particleGeo = new THREE.BufferGeometry();
        const positions = new Float32Array(particlesCount * 3);

        for (let i = 0; i < particlesCount * 3; i += 3) {
          positions[i] = (Math.random() - 0.5) * 8;
          positions[i + 1] = (Math.random() - 0.5) * 8;
          positions[i + 2] = (Math.random() - 0.5) * 4;
        }

        particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const particleMat = new THREE.PointsMaterial({
          color: 0x34d399,
          size: 0.1,
          transparent: true,
          opacity: 0.8,
        });

        const particles = new THREE.Points(particleGeo, particleMat);
        scene.add(particles);

        let time = 0;
        const animate = () => {
          if (!isMounted) return;
          time += 0.02;

          checkGroup.rotation.y = Math.sin(time) * 0.4;
          checkGroup.position.y = Math.sin(time * 2) * 0.15;

          particles.rotation.y = time * 0.2;

          renderer.render(scene, camera);
          animFrameRef.current = requestAnimationFrame(animate);
        };

        animate();
      } catch (err) {
        console.warn('Booking 3D Modal WebGL failed', err);
        setWebglSupported(false);
      }
    };

    init3DSuccess();

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
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-emerald-500/40 p-6 sm:p-8 text-white shadow-2xl space-y-6 glow-cyan-emerald">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 3D Canvas or fallback */}
        <div className="relative w-full h-44 rounded-2xl bg-slate-950/80 overflow-hidden border border-emerald-500/20 flex items-center justify-center">
          {webglSupported ? (
            <div ref={containerRef} className="w-full h-full" />
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-4">
              <CheckCircle2 className="w-16 h-16 text-emerald-400 animate-bounce mb-2" />
              <span className="text-xs font-bold text-emerald-300">Booking Confirmed!</span>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Booking #{bookingCode}</span>
          </div>

          <h3 className="text-xl font-extrabold text-white">Booking Placed Successfully!</h3>
          <p className="text-xs text-slate-300">
            Your request for <strong className="text-teal-300">{serviceTitle}</strong> has been received. A CNIC-verified artisan in your city is preparing for dispatch.
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-xl transition-all flex items-center justify-center space-x-2"
        >
          <span>View My Bookings</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
