'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function StageVisualizer3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x07070c, 0.035);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 3, 10);
    camera.lookAt(0, 1.5, 0);

    // Renderer setup with performance optimizations
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.appendChild(renderer.domElement);

    // Grid Floor
    const gridHelper = new THREE.GridHelper(30, 30, 0x00f0ff, 0x1f1f3a);
    gridHelper.position.y = 0;
    scene.add(gridHelper);

    // Light Beam Beacons (Spotlights for concert vibe)
    const createSpotlightBeam = (colorHex: number, xPos: number) => {
      const group = new THREE.Group();
      group.position.set(xPos, 7, -2);

      // Light source
      const spotLight = new THREE.SpotLight(colorHex, 8, 20, Math.PI / 6, 0.5, 1);
      spotLight.position.set(0, 0, 0);
      spotLight.target.position.set(xPos * 0.5, 0, 2);
      scene.add(spotLight.target);
      group.add(spotLight);

      // Volumetric beam cone visual representation
      const coneGeo = new THREE.ConeGeometry(1.5, 8, 16, 1, true);
      const coneMat = new THREE.MeshBasicMaterial({
        color: colorHex,
        transparent: true,
        opacity: 0.18,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
      });
      const cone = new THREE.Mesh(coneGeo, coneMat);
      cone.position.set(0, -4, 1);
      cone.rotation.x = Math.PI / 8;
      group.add(cone);

      return { group, spotLight, cone };
    };

    const beam1 = createSpotlightBeam(0x00f0ff, -3.5); // Cyan
    const beam2 = createSpotlightBeam(0xff007f, 0);    // Magenta
    const beam3 = createSpotlightBeam(0x7000ff, 3.5);  // Purple
    scene.add(beam1.group, beam2.group, beam3.group);

    // Ambient Floating Particles (Stage Dust / Haze)
    const particleCount = 180;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 16;
      positions[i + 1] = Math.random() * 8;
      positions[i + 2] = (Math.random() - 0.5) * 12;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0x00f0ff,
      size: 0.08,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    setIsLoaded(true);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Sweeping light beams movement
      beam1.group.rotation.z = Math.sin(time * 0.8) * 0.25;
      beam1.group.rotation.x = Math.cos(time * 0.6) * 0.15;

      beam2.group.rotation.z = Math.cos(time * 1.1) * 0.3;

      beam3.group.rotation.z = Math.sin(time * 0.7 + 1.5) * 0.25;
      beam3.group.rotation.x = Math.sin(time * 0.5) * 0.15;

      // Particle floating movement
      const posArr = particleGeo.attributes.position.array as Float32Array;
      for (let i = 1; i < particleCount * 3; i += 3) {
        posArr[i] -= 0.005;
        if (posArr[i] < 0) posArr[i] = 8;
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Subtle camera sway
      camera.position.x = Math.sin(time * 0.3) * 0.4;
      camera.lookAt(0, 1.5, 0);

      renderer.render(scene, camera);
    };

    animate();

    // Window resize handler
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[380px] overflow-hidden rounded-2xl border border-white/10 glass-panel">
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-womb-dark/80 text-womb-cyan text-sm">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-womb-cyan mr-3"></div>
          Initializing 3D Stage Visualizer...
        </div>
      )}
      <div ref={mountRef} className="w-full h-full min-h-[380px]" />
      
      {/* Overlay Badge */}
      <div className="absolute bottom-4 left-4 z-10 px-3 py-1.5 rounded-full bg-womb-dark/70 border border-womb-cyan/40 backdrop-blur-md text-xs font-mono text-womb-cyan flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-womb-cyan animate-ping"></span>
        3D LIGHTING & SOUND ENGINE ACTIVE
      </div>
    </div>
  );
}
