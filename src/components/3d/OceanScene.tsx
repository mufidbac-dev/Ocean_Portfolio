/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { DOCK_TRIGGER_RADIUS, ISLANDS } from '../../config/islands';
import { IslandId } from '../../types/content';
import {
  createCinematicWoodenPier,
  createPalmTree,
  createProceduralIslandTerrain,
  createVolumetricGodRays,
} from './IslandBuilder';

interface OceanSceneProps {
  oceanTime: 'day' | 'golden' | 'night';
  activeIsland: IslandId | null;
  onDock: (islandId: IslandId) => void;
  onUndock: () => void;
  targetIsland: IslandId | null;
  onClearTarget: () => void;
  onSpeedChange?: (knots: number) => void;
  onCompassChange?: (headingDeg: number) => void;
}

// Module-level pre-allocated scratch math objects to ensure zero GC in animation loop
const _targetPos = new THREE.Vector3();
const _camPos = new THREE.Vector3();

export const OceanScene: React.FC<OceanSceneProps> = ({
  oceanTime,
  activeIsland,
  onDock,
  onUndock,
  targetIsland,
  onClearTarget,
  onSpeedChange,
  onCompassChange,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // Store mutable state and callbacks in refs to decouple React UI updates from Three.js WebGL lifecycle
  const activeIslandRef = useRef<IslandId | null>(activeIsland);
  activeIslandRef.current = activeIsland;

  const targetIslandRef = useRef<IslandId | null>(targetIsland);
  targetIslandRef.current = targetIsland;

  const onDockRef = useRef(onDock);
  onDockRef.current = onDock;

  const onUndockRef = useRef(onUndock);
  onUndockRef.current = onUndock;

  const onClearTargetRef = useRef(onClearTarget);
  onClearTargetRef.current = onClearTarget;

  const onSpeedChangeRef = useRef(onSpeedChange);
  onSpeedChangeRef.current = onSpeedChange;

  const onCompassChangeRef = useRef(onCompassChange);
  onCompassChangeRef.current = onCompassChange;

  // Atmosphere update trigger ref
  const updateAtmosphereFnRef = useRef<((time: 'day' | 'golden' | 'night') => void) | null>(null);

  useEffect(() => {
    if (updateAtmosphereFnRef.current) {
      updateAtmosphereFnRef.current(oceanTime);
    }
  }, [oceanTime]);

  // Stable WebGL Mount: Initialize ONCE
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Detect software WebGL safely
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return false;
      }
    })();

    // 2. Setup Scene, Camera, Renderer with ACESFilmicToneMapping
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1200
    );

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15; // Cozy filmic warm exposure
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      console.warn('WebGL Context Lost - waiting for restore.');
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost, false);

    // 3. Studio Environment Reflection via RoomEnvironment
    try {
      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
      pmremGenerator.dispose();
    } catch (e) {
      console.warn('RoomEnvironment setup fallback:', e);
    }

    // 4. Lighting Rig (Cozy warm sunlight + oceanic fill)
    const hemiLight = new THREE.HemisphereLight(0xfffbeb, 0x0f766e, 0.75);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xffedd5, 1.85); // Warm golden sun
    sunLight.position.set(65, 85, 55);
    if (!isSoftwareGl) {
      sunLight.castShadow = true;
      sunLight.shadow.mapSize.width = 1024;
      sunLight.shadow.mapSize.height = 1024;
      sunLight.shadow.camera.near = 10;
      sunLight.shadow.camera.far = 320;
      const d = 110;
      sunLight.shadow.camera.left = -d;
      sunLight.shadow.camera.right = d;
      sunLight.shadow.camera.top = d;
      sunLight.shadow.camera.bottom = -d;
      sunLight.shadow.bias = -0.0005;
      sunLight.shadow.normalBias = 0.02;
    }
    scene.add(sunLight);

    // Volumetric Cinematic God Rays
    const godRays = createVolumetricGodRays(isSoftwareGl);
    scene.add(godRays);

    // 5. Atmosphere Sky & Fog
    const updateAtmosphere = (time: 'day' | 'golden' | 'night') => {
      if (time === 'night') {
        scene.background = new THREE.Color(0x030712);
        scene.fog = new THREE.FogExp2(0x080e22, 0.0075);
        renderer.toneMappingExposure = 0.9;
        hemiLight.color.setHex(0x1e293b);
        hemiLight.groundColor.setHex(0x020617);
        hemiLight.intensity = 0.35;
        sunLight.color.setHex(0x38bdf8);
        sunLight.intensity = 0.45;
        sunLight.position.set(-40, 60, -30);
        godRays.visible = false;
      } else if (time === 'golden') {
        scene.background = new THREE.Color(0xfdba74);
        scene.fog = new THREE.FogExp2(0xfb923c, 0.0068);
        renderer.toneMappingExposure = 1.3;
        hemiLight.color.setHex(0xfef08a);
        hemiLight.groundColor.setHex(0x115e59);
        hemiLight.intensity = 0.95;
        sunLight.color.setHex(0xff7849);
        sunLight.intensity = 2.2;
        sunLight.position.set(80, 25, 40);
        godRays.visible = !isSoftwareGl;
      } else {
        scene.background = new THREE.Color(0x7dd3fc); // Soft coastal turquoise sky
        scene.fog = new THREE.FogExp2(0x38bdf8, 0.0058);
        renderer.toneMappingExposure = 1.15;
        hemiLight.color.setHex(0xfffbeb);
        hemiLight.groundColor.setHex(0x0f766e);
        hemiLight.intensity = 0.8;
        sunLight.color.setHex(0xffedd5);
        sunLight.intensity = 1.85;
        sunLight.position.set(65, 85, 55);
        godRays.visible = !isSoftwareGl;
      }
    };
    updateAtmosphereFnRef.current = updateAtmosphere;
    updateAtmosphere(oceanTime);

    // 6. Procedural Ocean Water Plane
    const segments = isSoftwareGl ? 32 : 64;
    const oceanGeom = new THREE.PlaneGeometry(1000, 1000, segments, segments);
    oceanGeom.rotateX(-Math.PI / 2);

    const oceanMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x0d9488, // Turquoise sea
      roughness: 0.14,
      metalness: 0.08,
      transmission: isSoftwareGl ? 0 : 0.38,
      transparent: true,
      opacity: 0.94,
      ior: 1.333,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    });
    const oceanMesh = new THREE.Mesh(oceanGeom, oceanMaterial);
    oceanMesh.receiveShadow = !isSoftwareGl;
    scene.add(oceanMesh);

    const originalPos = oceanGeom.attributes.position.clone();

    // 7. Procedural Sailboat (Composite 6-part THREE.Group)
    const boatGroup = new THREE.Group();

    // Hull
    const hullShape = new THREE.Shape();
    hullShape.moveTo(0, 3.2);
    hullShape.bezierCurveTo(1.3, 2.0, 1.4, -1.8, 1.1, -2.8);
    hullShape.lineTo(-1.1, -2.8);
    hullShape.bezierCurveTo(-1.4, -1.8, -1.3, 2.0, 0, 3.2);

    const hullExtrude = new THREE.ExtrudeGeometry(hullShape, {
      depth: 1.1,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.2,
      bevelThickness: 0.2,
    });
    hullExtrude.rotateX(Math.PI / 2);
    hullExtrude.center();

    const hullMat = new THREE.MeshStandardMaterial({
      color: 0x78350f,
      roughness: 0.6,
      metalness: 0.05,
    });
    const hullMesh = new THREE.Mesh(hullExtrude, hullMat);
    hullMesh.position.y = 0.55;
    hullMesh.castShadow = !isSoftwareGl;
    hullMesh.receiveShadow = !isSoftwareGl;
    boatGroup.add(hullMesh);

    // Deck
    const deckGeom = new THREE.BoxGeometry(2.1, 0.15, 4.8);
    const deckMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.5,
      metalness: 0.02,
    });
    const deckMesh = new THREE.Mesh(deckGeom, deckMat);
    deckMesh.position.set(0, 1.05, -0.2);
    boatGroup.add(deckMesh);

    // Mast
    const mastGeom = new THREE.CylinderGeometry(0.08, 0.12, 6.4, 8);
    const mastMat = new THREE.MeshStandardMaterial({
      color: 0x451a03,
      roughness: 0.7,
    });
    const mastMesh = new THREE.Mesh(mastGeom, mastMat);
    mastMesh.position.set(0, 4.1, 0.3);
    mastMesh.castShadow = !isSoftwareGl;
    boatGroup.add(mastMesh);

    // Main Sail
    const sailGeom = new THREE.PlaneGeometry(2.6, 4.2, 6, 6);
    const sailPos = sailGeom.attributes.position;
    for (let i = 0; i < sailPos.count; i++) {
      const y = sailPos.getY(i);
      const x = sailPos.getX(i);
      const billow = Math.sin((y + 2.1) / 4.2 * Math.PI) * 0.45;
      sailPos.setZ(i, sailPos.getZ(i) + billow * (1 - (x + 1.3) / 2.6));
    }
    sailGeom.computeVertexNormals();

    const sailMat = new THREE.MeshStandardMaterial({
      color: 0xfef3c7,
      roughness: 0.9,
      metalness: 0.0,
      side: THREE.DoubleSide,
    });
    const sailMesh = new THREE.Mesh(sailGeom, sailMat);
    sailMesh.position.set(1.2, 4.3, 0.2);
    sailMesh.castShadow = !isSoftwareGl;
    boatGroup.add(sailMesh);

    // Jib
    const jibGeom = new THREE.BufferGeometry();
    const jibVertices = new Float32Array([
      0, 1.2, 2.5,
      0, 6.2, 0.3,
      0, 1.5, 0.3,
    ]);
    jibGeom.setAttribute('position', new THREE.BufferAttribute(jibVertices, 3));
    jibGeom.computeVertexNormals();
    const jibMesh = new THREE.Mesh(jibGeom, sailMat);
    boatGroup.add(jibMesh);

    // Bowsprit Brass Lantern
    const lanternGeom = new THREE.CylinderGeometry(0.12, 0.12, 0.3, 6);
    const lanternMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.9,
      roughness: 0.2,
      emissive: 0xfbbf24,
      emissiveIntensity: 0.8,
    });
    const lanternMesh = new THREE.Mesh(lanternGeom, lanternMat);
    lanternMesh.position.set(0, 1.25, 2.9);
    boatGroup.add(lanternMesh);

    const lanternLight = new THREE.PointLight(0xfef08a, 1.2, 12);
    lanternLight.position.set(0, 1.4, 3.0);
    boatGroup.add(lanternLight);

    // Tiller
    const tillerGeom = new THREE.BoxGeometry(0.1, 0.1, 1.2);
    const tillerMesh = new THREE.Mesh(tillerGeom, mastMat);
    tillerMesh.position.set(0, 1.3, -2.4);
    boatGroup.add(tillerMesh);

    boatGroup.position.set(0, 0, 0);
    scene.add(boatGroup);

    // 8. Archipelago Islands with Integrated Wooden Piers & Pulsing Docking Rings
    const islandMeshes: Record<IslandId, THREE.Group> = {
      studio: new THREE.Group(),
      gallery: new THREE.Group(),
      library: new THREE.Group(),
      signal: new THREE.Group(),
    };

    const shorelineFoamMeshes: THREE.Mesh[] = [];
    const dockingRingMeshes: {
      islandId: IslandId;
      outer: THREE.Mesh;
      inner: THREE.Mesh;
      worldX: number;
      worldZ: number;
    }[] = [];

    // 8A. Studio Island
    {
      const group = islandMeshes.studio;
      const conf = ISLANDS.studio;
      group.position.set(conf.coords[0], 0, conf.coords[1]);

      const { terrainGroup, foamMesh } = createProceduralIslandTerrain(
        14.5,
        3.6,
        1,
        isSoftwareGl
      );
      group.add(terrainGroup);
      shorelineFoamMeshes.push(foamMesh);

      const { dockGroup, dockingRingMesh, dockingRingInner } = createCinematicWoodenPier(
        conf.dockAngle,
        8.5,
        conf.dockLength,
        3.2,
        5.4,
        isSoftwareGl
      );
      group.add(dockGroup);

      dockingRingMeshes.push({
        islandId: 'studio',
        outer: dockingRingMesh,
        inner: dockingRingInner,
        worldX: conf.dockingPoint[0],
        worldZ: conf.dockingPoint[1],
      });

      // Bamboo Studio Cabana Pavilion
      const pavilion = new THREE.Group();
      const roof = new THREE.Mesh(
        new THREE.ConeGeometry(5.2, 2.6, 6),
        new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.85 })
      );
      roof.position.y = 7.0;
      roof.castShadow = !isSoftwareGl;
      pavilion.add(roof);

      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2;
        const post = new THREE.Mesh(
          new THREE.CylinderGeometry(0.18, 0.18, 3.6, 6),
          new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.6 })
        );
        post.position.set(Math.cos(angle) * 3.2, 4.4, Math.sin(angle) * 3.2);
        pavilion.add(post);
      }
      group.add(pavilion);

      // 3 Palms
      const palm1 = createPalmTree(1.1, 0.22, isSoftwareGl);
      palm1.position.set(-5.5, 2.2, -3.5);
      group.add(palm1);

      const palm2 = createPalmTree(0.9, -0.28, isSoftwareGl);
      palm2.position.set(4.8, 2.0, -5.2);
      group.add(palm2);

      const palm3 = createPalmTree(1.0, 0.18, isSoftwareGl);
      palm3.position.set(-3.2, 1.8, 6.4);
      group.add(palm3);

      scene.add(group);
    }

    // 8B. Gallery Island
    {
      const group = islandMeshes.gallery;
      const conf = ISLANDS.gallery;
      group.position.set(conf.coords[0], 0, conf.coords[1]);

      const { terrainGroup, foamMesh } = createProceduralIslandTerrain(
        14.8,
        3.8,
        2,
        isSoftwareGl
      );
      group.add(terrainGroup);
      shorelineFoamMeshes.push(foamMesh);

      const { dockGroup, dockingRingMesh, dockingRingInner } = createCinematicWoodenPier(
        conf.dockAngle,
        8.5,
        conf.dockLength,
        3.2,
        5.4,
        isSoftwareGl
      );
      group.add(dockGroup);

      dockingRingMeshes.push({
        islandId: 'gallery',
        outer: dockingRingMesh,
        inner: dockingRingInner,
        worldX: conf.dockingPoint[0],
        worldZ: conf.dockingPoint[1],
      });

      // Modernist Archway & Kinetic Torus
      const arch = new THREE.Group();
      const colMat = new THREE.MeshStandardMaterial({
        color: 0xf8fafc,
        roughness: 0.3,
        metalness: 0.1,
      });

      const leftCol = new THREE.Mesh(new THREE.BoxGeometry(1.2, 7.5, 1.2), colMat);
      leftCol.position.set(-3.2, 6.8, 0);
      leftCol.castShadow = !isSoftwareGl;
      arch.add(leftCol);

      const rightCol = new THREE.Mesh(new THREE.BoxGeometry(1.2, 7.5, 1.2), colMat);
      rightCol.position.set(3.2, 6.8, 0);
      rightCol.castShadow = !isSoftwareGl;
      arch.add(rightCol);

      const lintel = new THREE.Mesh(new THREE.BoxGeometry(8.2, 1.2, 1.4), colMat);
      lintel.position.set(0, 10.6, 0);
      lintel.castShadow = !isSoftwareGl;
      arch.add(lintel);

      const torus = new THREE.Mesh(
        new THREE.TorusGeometry(1.8, 0.25, 12, 24),
        new THREE.MeshStandardMaterial({
          color: 0x38bdf8,
          metalness: 0.9,
          roughness: 0.1,
          emissive: 0x0284c7,
          emissiveIntensity: 0.4,
        })
      );
      torus.position.set(0, 7.0, 0);
      arch.add(torus);
      group.add(arch);

      // Coastal palms
      const palm1 = createPalmTree(1.0, 0.25, isSoftwareGl);
      palm1.position.set(6.2, 1.8, 3.8);
      group.add(palm1);

      const palm2 = createPalmTree(0.85, -0.2, isSoftwareGl);
      palm2.position.set(-5.8, 1.9, -4.5);
      group.add(palm2);

      scene.add(group);
    }

    // 8C. Library Island
    let lighthouseLightBeam: THREE.Mesh | null = null;
    {
      const group = islandMeshes.library;
      const conf = ISLANDS.library;
      group.position.set(conf.coords[0], 0, conf.coords[1]);

      const { terrainGroup, foamMesh } = createProceduralIslandTerrain(
        14.5,
        4.2,
        3,
        isSoftwareGl
      );
      group.add(terrainGroup);
      shorelineFoamMeshes.push(foamMesh);

      const { dockGroup, dockingRingMesh, dockingRingInner } = createCinematicWoodenPier(
        conf.dockAngle,
        8.5,
        conf.dockLength,
        3.2,
        5.4,
        isSoftwareGl
      );
      group.add(dockGroup);

      dockingRingMeshes.push({
        islandId: 'library',
        outer: dockingRingMesh,
        inner: dockingRingInner,
        worldX: conf.dockingPoint[0],
        worldZ: conf.dockingPoint[1],
      });

      // Lighthouse
      const towerGeom = new THREE.CylinderGeometry(1.6, 2.5, 12, 10);
      const towerMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
      const tower = new THREE.Mesh(towerGeom, towerMat);
      tower.position.y = 9.5;
      tower.castShadow = !isSoftwareGl;
      group.add(tower);

      const bandGeom = new THREE.CylinderGeometry(1.9, 2.1, 2.4, 10);
      const bandMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.4 });
      const band = new THREE.Mesh(bandGeom, bandMat);
      band.position.y = 9.8;
      group.add(band);

      const lanternRoom = new THREE.Mesh(
        new THREE.CylinderGeometry(1.8, 1.8, 2.2, 8),
        new THREE.MeshPhysicalMaterial({
          color: 0xfef08a,
          roughness: 0.1,
          transmission: 0.7,
          transparent: true,
          opacity: 0.85,
        })
      );
      lanternRoom.position.y = 16.2;
      group.add(lanternRoom);

      const coneGeom = new THREE.ConeGeometry(5.0, 32, 12);
      coneGeom.rotateX(Math.PI / 2);
      coneGeom.translate(0, 0, 16);
      const coneMat = new THREE.MeshBasicMaterial({
        color: 0xfde047,
        transparent: true,
        opacity: 0.28,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      lighthouseLightBeam = new THREE.Mesh(coneGeom, coneMat);
      lighthouseLightBeam.position.set(0, 16.2, 0);
      group.add(lighthouseLightBeam);

      const palm = createPalmTree(1.15, -0.3, isSoftwareGl);
      palm.position.set(5.2, 2.4, -4.2);
      group.add(palm);

      scene.add(group);
    }

    // 8D. Signal Island
    const signalRings: THREE.Mesh[] = [];
    {
      const group = islandMeshes.signal;
      const conf = ISLANDS.signal;
      group.position.set(conf.coords[0], 0, conf.coords[1]);

      const { terrainGroup, foamMesh } = createProceduralIslandTerrain(
        14.5,
        3.5,
        4,
        isSoftwareGl
      );
      group.add(terrainGroup);
      shorelineFoamMeshes.push(foamMesh);

      const { dockGroup, dockingRingMesh, dockingRingInner } = createCinematicWoodenPier(
        conf.dockAngle,
        8.5,
        conf.dockLength,
        3.2,
        5.4,
        isSoftwareGl
      );
      group.add(dockGroup);

      dockingRingMeshes.push({
        islandId: 'signal',
        outer: dockingRingMesh,
        inner: dockingRingInner,
        worldX: conf.dockingPoint[0],
        worldZ: conf.dockingPoint[1],
      });

      // Radio Mast
      const tower = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 1.8, 14, 4),
        new THREE.MeshStandardMaterial({
          color: 0xe11d48,
          metalness: 0.8,
          roughness: 0.3,
        })
      );
      tower.position.y = 10.2;
      tower.castShadow = !isSoftwareGl;
      group.add(tower);

      const transmitter = new THREE.Mesh(
        new THREE.SphereGeometry(0.8, 12, 12),
        new THREE.MeshStandardMaterial({
          color: 0xf43f5e,
          emissive: 0xf43f5e,
          emissiveIntensity: 1.2,
        })
      );
      transmitter.position.y = 17.5;
      group.add(transmitter);

      for (let r = 0; r < 3; r++) {
        const ring = new THREE.Mesh(
          new THREE.RingGeometry(1.2 + r * 1.5, 1.4 + r * 1.5, 20),
          new THREE.MeshBasicMaterial({
            color: 0xfb7185,
            transparent: true,
            opacity: 0.5 - r * 0.15,
            side: THREE.DoubleSide,
          })
        );
        ring.rotation.x = Math.PI / 2;
        ring.position.y = 17.5;
        group.add(ring);
        signalRings.push(ring);
      }

      const palm1 = createPalmTree(1.1, 0.25, isSoftwareGl);
      palm1.position.set(-4.5, 2.0, -5.0);
      group.add(palm1);

      const palm2 = createPalmTree(0.95, -0.35, isSoftwareGl);
      palm2.position.set(5.2, 1.9, -3.8);
      group.add(palm2);

      scene.add(group);
    }

    // 9. Interactive Sailboat Kinematics & Physics
    let boatSpeed = 0;
    let boatAngularSpeed = 0;
    let boatHeading = 0;
    let lastReportedKnots = -1;
    let lastReportedCompass = -1;
    const keysPressed: Record<string, boolean> = {};

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;
      keysPressed[e.key.toLowerCase()] = true;
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowleft', 'arrowdown', 'arrowright'].includes(e.key.toLowerCase())) {
        e.preventDefault();
        if (activeIslandRef.current) {
          onUndockRef.current();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // 10. Animation Loop
    let frameId = 0;
    const clock = new THREE.Clock();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    const tick = () => {
      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();

      // A. Procedural Water Wave Animation
      const posAttr = oceanGeom.attributes.position;
      const waveFreq = 0.08;
      const waveSpeed = 1.4;
      for (let i = 0; i < posAttr.count; i++) {
        const ox = originalPos.getX(i);
        const oz = originalPos.getZ(i);
        const wave =
          Math.sin(ox * waveFreq + elapsed * waveSpeed) * 0.45 +
          Math.cos(oz * waveFreq * 1.2 + elapsed * waveSpeed * 0.9) * 0.35 +
          Math.sin((ox + oz) * 0.04 + elapsed * 0.7) * 0.3;
        posAttr.setY(i, wave);
      }
      posAttr.needsUpdate = true;

      // Pulse shoreline foam froth
      shorelineFoamMeshes.forEach((mesh) => {
        const mat = mesh.material as THREE.MeshBasicMaterial;
        mat.opacity = 0.35 + Math.sin(elapsed * 2.2) * 0.12;
      });

      // B. Animated Visual Docking Rings (Pulse & Distance Fade)
      dockingRingMeshes.forEach((ringItem) => {
        const dist = Math.hypot(
          boatGroup.position.x - ringItem.worldX,
          boatGroup.position.z - ringItem.worldZ
        );

        // Smooth distance fade-in: invisible at > 38 units, fully visible at < 20 units
        const visibility = THREE.MathUtils.clamp(1.0 - (dist - 12.0) / 26.0, 0.0, 1.0);
        const pulse = 1.0 + Math.sin(elapsed * 2.5) * 0.04;
        const glowOpacity = visibility * (0.45 + Math.sin(elapsed * 2.8) * 0.18);

        const outerMat = ringItem.outer.material as THREE.MeshBasicMaterial;
        outerMat.opacity = glowOpacity;
        ringItem.outer.scale.set(pulse, pulse, pulse);

        const innerMat = ringItem.inner.material as THREE.MeshBasicMaterial;
        innerMat.opacity = glowOpacity * 0.75;
      });

      // Beacon & Animation Updates
      if (lighthouseLightBeam) {
        lighthouseLightBeam.rotation.y = elapsed * 0.8;
      }
      signalRings.forEach((ring, idx) => {
        const scale = 1 + ((elapsed * 0.8 + idx * 0.5) % 2.5);
        ring.scale.set(scale, scale, scale);
      });

      // C. Sailboat Movement & Autopilot Steering
      const isNavigatingToTarget = Boolean(targetIslandRef.current);

      if (isNavigatingToTarget && targetIslandRef.current) {
        const targetIslandConf = ISLANDS[targetIslandRef.current];
        const [dockX, dockZ] = targetIslandConf.dockingPoint;
        _targetPos.set(dockX, 0, dockZ);

        const dx = _targetPos.x - boatGroup.position.x;
        const dz = _targetPos.z - boatGroup.position.z;
        const distToDock = Math.sqrt(dx * dx + dz * dz);

        const desiredHeading = Math.atan2(dx, dz);
        let angleDiff = desiredHeading - boatHeading;
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

        boatHeading += angleDiff * Math.min(delta * 2.5, 1.0);
        boatSpeed = THREE.MathUtils.damp(boatSpeed, Math.min(distToDock * 0.6, 9.5), 2.8, delta);

        // Soft docking zone arrival inside the ring
        if (distToDock < DOCK_TRIGGER_RADIUS) {
          const reachedIsland = targetIslandRef.current;
          boatSpeed = THREE.MathUtils.damp(boatSpeed, 0, 4.0, delta);
          onClearTargetRef.current();
          onDockRef.current(reachedIsland);
        }
      } else {
        // Manual Sailing
        const forward = keysPressed['w'] || keysPressed['arrowup'];
        const backward = keysPressed['s'] || keysPressed['arrowdown'];
        const turnLeft = keysPressed['a'] || keysPressed['arrowleft'];
        const turnRight = keysPressed['d'] || keysPressed['arrowright'];

        let targetSpeed = 0;
        if (forward) targetSpeed = 10.5;
        if (backward) targetSpeed = -3.5;

        boatSpeed = THREE.MathUtils.damp(boatSpeed, targetSpeed, 2.2, delta);

        let targetAngular = 0;
        if (turnLeft) targetAngular = 1.35;
        if (turnRight) targetAngular = -1.35;

        boatAngularSpeed = THREE.MathUtils.damp(boatAngularSpeed, targetAngular, 4.0, delta);
        boatHeading += boatAngularSpeed * (Math.abs(boatSpeed) > 0.2 ? 1 : 0.3) * delta;
      }

      // Update position along heading
      boatGroup.position.x += Math.sin(boatHeading) * boatSpeed * delta;
      boatGroup.position.z += Math.cos(boatHeading) * boatSpeed * delta;
      boatGroup.rotation.y = boatHeading;

      // D. Strict Island Collision Boundary Check (NEVER penetrate island terrain)
      const boatRadius = 1.8;
      (Object.keys(ISLANDS) as IslandId[]).forEach((id) => {
        const island = ISLANDS[id];
        const [ix, iz] = island.coords;
        const dx = boatGroup.position.x - ix;
        const dz = boatGroup.position.z - iz;
        const distFromCenter = Math.hypot(dx, dz);

        const safeRadius = island.collisionRadius + boatRadius;

        if (distFromCenter < safeRadius && distFromCenter > 0.01) {
          // Boat is approaching too close to the island landmass:
          // Soft elastic push-back along the normal vector
          const normalX = dx / distFromCenter;
          const normalZ = dz / distFromCenter;

          boatGroup.position.x = ix + normalX * safeRadius;
          boatGroup.position.z = iz + normalZ * safeRadius;

          // Dampen speed on impact & prevent continuous inward clipping
          boatSpeed = Math.min(boatSpeed * 0.12, 0.3);
        }
      });

      // E. Soft Docking Zone Detection (ONLY at the wooden pier head)
      if (!isNavigatingToTarget) {
        let dockedIsland: IslandId | null = null;
        let minDockDist = Infinity;

        (Object.keys(ISLANDS) as IslandId[]).forEach((id) => {
          const island = ISLANDS[id];
          const [dockX, dockZ] = island.dockingPoint;
          const distToPier = Math.hypot(boatGroup.position.x - dockX, boatGroup.position.z - dockZ);

          if (distToPier < DOCK_TRIGGER_RADIUS && distToPier < minDockDist) {
            minDockDist = distToPier;
            dockedIsland = id;
          }
        });

        if (dockedIsland) {
          // Inside glowing soft docking zone ring at the pier head
          boatSpeed = THREE.MathUtils.damp(boatSpeed, 0, 2.2, delta); // Gentle friction near dock
          if (activeIslandRef.current !== dockedIsland) {
            onDockRef.current(dockedIsland);
          }
        } else if (activeIslandRef.current) {
          // Boat sailed away from dock
          onUndockRef.current();
        }
      }

      // Wave pitch & roll
      const boatWaveY =
        Math.sin(boatGroup.position.x * waveFreq + elapsed * waveSpeed) * 0.45 +
        Math.cos(boatGroup.position.z * waveFreq * 1.2 + elapsed * waveSpeed * 0.9) * 0.35;
      boatGroup.position.y = THREE.MathUtils.damp(boatGroup.position.y, boatWaveY, 4, delta);

      const roll = -boatAngularSpeed * 0.22 + Math.sin(elapsed * 2.2) * 0.05;
      const pitch = (boatSpeed / 10.5) * 0.08 + Math.cos(elapsed * 1.8) * 0.04;
      boatGroup.rotation.z = roll;
      boatGroup.rotation.x = pitch;

      // Telemetry Callbacks (throttled)
      const currentKnots = Math.max(0, Math.round(boatSpeed * 1.2));
      if (currentKnots !== lastReportedKnots && onSpeedChangeRef.current) {
        lastReportedKnots = currentKnots;
        onSpeedChangeRef.current(currentKnots);
      }

      const currentCompass = Math.round((((boatHeading * 180) / Math.PI) % 360 + 360) % 360);
      if (currentCompass !== lastReportedCompass && onCompassChangeRef.current) {
        lastReportedCompass = currentCompass;
        onCompassChangeRef.current(currentCompass);
      }

      // Damped Chase Camera
      const camDistance = 16.5;
      const camHeight = 7.5;
      _camPos.set(
        boatGroup.position.x - Math.sin(boatHeading) * camDistance,
        boatGroup.position.y + camHeight,
        boatGroup.position.z - Math.cos(boatHeading) * camDistance
      );

      camera.position.lerp(_camPos, 0.06);
      _targetPos.set(boatGroup.position.x, boatGroup.position.y + 1.8, boatGroup.position.z);
      camera.lookAt(_targetPos);

      // Render
      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    };

    tick();

    // 11. Handle Viewport Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
      if (isSoftwareGl) {
        clearTimeout(frameId);
      } else {
        cancelAnimationFrame(frameId);
      }
      renderer.dispose();
      oceanGeom.dispose();
      oceanMaterial.dispose();
    };
  }, []); // Mounts strictly ONCE

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full overflow-hidden select-none pointer-events-auto"
      style={{ touchAction: 'none' }}
    />
  );
};
