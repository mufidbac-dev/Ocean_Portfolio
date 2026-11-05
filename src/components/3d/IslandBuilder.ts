/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';

// --- Shared PBR Materials with Cozy Golden & Weathered Tones ---

const sandMaterial = new THREE.MeshStandardMaterial({
  color: 0xf6d776, // Warm golden sand
  roughness: 0.92,
  metalness: 0.02,
  flatShading: true,
});

const grassMaterial = new THREE.MeshStandardMaterial({
  color: 0x228742, // Lush vibrant mossy green
  roughness: 0.88,
  metalness: 0.0,
  flatShading: true,
});

const rockMaterial = new THREE.MeshStandardMaterial({
  color: 0x64748b, // Coastal slate rock
  roughness: 0.95,
  metalness: 0.05,
  flatShading: true,
});

const warmWoodMaterial = new THREE.MeshStandardMaterial({
  color: 0xb47834, // Cozy golden-brown weathered cedar/teak
  roughness: 0.76,
  metalness: 0.02,
});

const wetWoodMaterial = new THREE.MeshStandardMaterial({
  color: 0x3d2314, // Submerged / water-logged dark wood with mossy undertone
  roughness: 0.88,
  metalness: 0.04,
});

const mossyBaseMaterial = new THREE.MeshStandardMaterial({
  color: 0x2e4228, // Wet algae/moss on timber piles at waterline
  roughness: 0.95,
  metalness: 0.0,
});

const ropeMaterial = new THREE.MeshStandardMaterial({
  color: 0xd6a872, // Warm hemp nautical rope
  roughness: 0.9,
  metalness: 0.0,
});

const ironCleatMaterial = new THREE.MeshStandardMaterial({
  color: 0x1e293b, // Cast iron mooring cleat
  roughness: 0.45,
  metalness: 0.75,
});

const shorelineFoamMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  transparent: true,
  opacity: 0.45,
  depthWrite: false,
  side: THREE.DoubleSide,
});

/**
 * Creates natural deformed island terrain:
 * - Organic non-cylindrical perimeter with harmonic radial noise
 * - Warm golden sandy shoreline shelf extending smoothly under the sea
 * - Elevated mossy green grassy plateau with natural mound curvature
 * - Shoreline foam ring and faceted coastal boulders
 */
export function createProceduralIslandTerrain(
  baseRadius = 14.5,
  height = 3.8,
  seed = 1,
  isSoftwareGl = false
): { terrainGroup: THREE.Group; foamMesh: THREE.Mesh } {
  const terrainGroup = new THREE.Group();

  const segments = isSoftwareGl ? 28 : 48;

  // 1. Organic Sandy Shoreline Shelf
  const sandGeom = new THREE.CylinderGeometry(
    baseRadius * 0.82,
    baseRadius * 1.35,
    3.2,
    segments,
    3
  );

  const sandPos = sandGeom.attributes.position;
  for (let i = 0; i < sandPos.count; i++) {
    const x = sandPos.getX(i);
    const y = sandPos.getY(i);
    const z = sandPos.getZ(i);

    const angle = Math.atan2(z, x);
    const radius = Math.sqrt(x * x + z * z);

    // Natural coastal deform harmonic noise
    const wobble =
      Math.sin(angle * 3 + seed) * 0.14 +
      Math.cos(angle * 5 + seed * 2) * 0.08 +
      Math.sin(angle * 7 + seed * 1.5) * 0.04;

    const newRadius = radius * (1 + wobble);
    const heightPerturb = Math.sin(angle * 4 + seed) * 0.25;

    sandPos.setXYZ(
      i,
      Math.cos(angle) * newRadius,
      y + heightPerturb,
      Math.sin(angle) * newRadius
    );
  }
  sandGeom.computeVertexNormals();

  const sandMesh = new THREE.Mesh(sandGeom, sandMaterial);
  sandMesh.position.y = 0.5;
  sandMesh.receiveShadow = !isSoftwareGl;
  terrainGroup.add(sandMesh);

  // 2. Grassy / Mossy Elevated Plateau with natural mound
  const grassGeom = new THREE.CylinderGeometry(
    baseRadius * 0.62,
    baseRadius * 0.85,
    height,
    segments,
    3
  );

  const grassPos = grassGeom.attributes.position;
  for (let i = 0; i < grassPos.count; i++) {
    const x = grassPos.getX(i);
    const y = grassPos.getY(i);
    const z = grassPos.getZ(i);

    const angle = Math.atan2(z, x);
    const radius = Math.sqrt(x * x + z * z);

    const wobble =
      Math.sin(angle * 3 + seed + 0.5) * 0.12 +
      Math.cos(angle * 4 + seed) * 0.07;

    const newRadius = radius * (1 + wobble);
    const mound = Math.max(0, 1 - newRadius / (baseRadius * 0.75)) * 1.1;

    grassPos.setXYZ(
      i,
      Math.cos(angle) * newRadius,
      y + mound,
      Math.sin(angle) * newRadius
    );
  }
  grassGeom.computeVertexNormals();

  const grassMesh = new THREE.Mesh(grassGeom, grassMaterial);
  grassMesh.position.y = height * 0.5 + 1.25;
  grassMesh.receiveShadow = !isSoftwareGl;
  terrainGroup.add(grassMesh);

  // 3. Shoreline Foam Froth Ring (Lapping gentle waves)
  const foamGeom = new THREE.RingGeometry(
    baseRadius * 1.05,
    baseRadius * 1.36,
    segments
  );
  foamGeom.rotateX(-Math.PI / 2);
  const foamMesh = new THREE.Mesh(foamGeom, shorelineFoamMaterial);
  foamMesh.position.y = 0.09;
  terrainGroup.add(foamMesh);

  // 4. Shoreline Boulders and Coastal Rocks (Cluster of 5-7 low poly rocks)
  const rockCount = 6;
  for (let r = 0; r < rockCount; r++) {
    const rAngle = (r / rockCount) * Math.PI * 2 + seed * 0.8;
    const rDist = baseRadius * (1.02 + (r % 3) * 0.1);
    const rockGeom = new THREE.DodecahedronGeometry(0.75 + (r % 2) * 0.45, 0);

    const rockPos = rockGeom.attributes.position;
    for (let k = 0; k < rockPos.count; k++) {
      rockPos.setXYZ(
        k,
        rockPos.getX(k) * (0.8 + Math.random() * 0.35),
        rockPos.getY(k) * (0.65 + Math.random() * 0.3),
        rockPos.getZ(k) * (0.8 + Math.random() * 0.35)
      );
    }
    rockGeom.computeVertexNormals();

    const rock = new THREE.Mesh(rockGeom, rockMaterial);
    rock.position.set(
      Math.cos(rAngle) * rDist,
      0.35 + (r % 2) * 0.2,
      Math.sin(rAngle) * rDist
    );
    rock.rotation.set(r * 0.4, r * 1.1, r * 0.5);
    rock.castShadow = !isSoftwareGl;
    rock.receiveShadow = !isSoftwareGl;
    terrainGroup.add(rock);
  }

  return { terrainGroup, foamMesh };
}

/**
 * Creates a fully integrated cinematic wooden pier:
 * - Starts seamlessly from the island's sandy shore (startDistance ~ 8.5)
 * - Extends into the water to endDistance (~ 21.0)
 * - Widened docking platform at the pier head (T-head wharf)
 * - Submerged pilings with waterline moss & cross-bracing
 * - Weathered individual planks with subtle tint variations & nail accents
 * - Low post railings with sagging rope catenaries
 * - Iron mooring bollards & coiled dock ropes
 * - Warm post-mounted brass lantern
 * - Animated glowing turquoise docking zone ring on the water!
 */
export function createCinematicWoodenPier(
  directionAngle: number,
  startDistance = 8.5,
  endDistance = 21.0,
  gangwayWidth = 3.2,
  headWidth = 5.6,
  isSoftwareGl = false
): {
  dockGroup: THREE.Group;
  dockingRingMesh: THREE.Mesh;
  dockingRingInner: THREE.Mesh;
  beaconLight: THREE.PointLight;
} {
  const dockGroup = new THREE.Group();

  const totalLength = endDistance - startDistance;
  const rampHeight = 1.35; // Beach elevation at pier root
  const seaDeckHeight = 1.15; // Deck clearance above water
  const headStartDistance = endDistance - 5.2;

  // --- 1. Natural Sand Ramp / Shore Anchor Bed ---
  // A small wooden threshold bed that sinks naturally into the sand
  const shoreBedGeom = new THREE.BoxGeometry(gangwayWidth * 1.15, 0.4, 2.2);
  const shoreBed = new THREE.Mesh(shoreBedGeom, warmWoodMaterial);
  shoreBed.position.set(0, rampHeight - 0.25, startDistance + 0.8);
  shoreBed.receiveShadow = !isSoftwareGl;
  dockGroup.add(shoreBed);

  // --- 2. Submerged Pilings (Piles / Stilts) with Wet Waterline Moss ---
  const pileSpacing = 2.6;
  const numPilePairs = Math.floor(totalLength / pileSpacing);
  const pileRadius = 0.22;
  const pileSubmergedDepth = 3.8;

  for (let p = 0; p <= numPilePairs; p++) {
    const zPos = startDistance + 1.2 + p * pileSpacing;
    const isAtHead = zPos >= headStartDistance - 0.5;
    const currentWidth = isAtHead ? headWidth : gangwayWidth;

    const deckY = THREE.MathUtils.lerp(
      rampHeight,
      seaDeckHeight,
      (zPos - startDistance) / totalLength
    );

    // Pilings on left and right (+ center support if at wide head)
    const sides = isAtHead ? [-1, 0, 1] : [-1, 1];

    for (const side of sides) {
      const xPos = side * (currentWidth * 0.44);

      // Upper dry weathered pile
      const upperPile = new THREE.Mesh(
        new THREE.CylinderGeometry(pileRadius, pileRadius * 1.05, deckY + 0.2, 8),
        warmWoodMaterial
      );
      upperPile.position.set(xPos, (deckY + 0.2) * 0.5, zPos);
      upperPile.castShadow = !isSoftwareGl;
      upperPile.receiveShadow = !isSoftwareGl;
      dockGroup.add(upperPile);

      // Lower submerged pile (dark & wet)
      const lowerPile = new THREE.Mesh(
        new THREE.CylinderGeometry(pileRadius * 1.05, pileRadius * 1.1, pileSubmergedDepth, 8),
        wetWoodMaterial
      );
      lowerPile.position.set(xPos, -pileSubmergedDepth * 0.5, zPos);
      dockGroup.add(lowerPile);

      // Waterline moss collar ring
      const mossRing = new THREE.Mesh(
        new THREE.CylinderGeometry(pileRadius * 1.18, pileRadius * 1.18, 0.4, 8),
        mossyBaseMaterial
      );
      mossRing.position.set(xPos, 0.1, zPos);
      dockGroup.add(mossRing);

      // Small waterline splash foam skirt
      const foamSkirt = new THREE.Mesh(
        new THREE.RingGeometry(pileRadius * 1.1, pileRadius * 2.2, 8),
        shorelineFoamMaterial
      );
      foamSkirt.rotateX(-Math.PI / 2);
      foamSkirt.position.set(xPos, 0.05, zPos);
      dockGroup.add(foamSkirt);

      // Railing post extending above deck (only along outer edges, not in middle)
      if (side !== 0 && zPos < endDistance - 0.8) {
        const post = new THREE.Mesh(
          new THREE.CylinderGeometry(pileRadius * 0.85, pileRadius * 0.9, 1.1, 6),
          warmWoodMaterial
        );
        post.position.set(xPos, deckY + 0.55, zPos);
        post.castShadow = !isSoftwareGl;
        dockGroup.add(post);
      }
    }

    // Cross-brace timber between left and right piles under deck
    if (zPos > startDistance + 2.5) {
      const braceGeom = new THREE.BoxGeometry(currentWidth * 0.88, 0.18, 0.18);
      const brace = new THREE.Mesh(braceGeom, wetWoodMaterial);
      brace.position.set(0, deckY - 0.5, zPos);
      dockGroup.add(brace);
    }
  }

  // --- 3. Longitudinal Support Stringers ---
  const stringerGeom = new THREE.BoxGeometry(0.3, 0.35, totalLength);
  for (const side of [-1, 1]) {
    const stringer = new THREE.Mesh(stringerGeom, wetWoodMaterial);
    stringer.position.set(
      side * (gangwayWidth * 0.42),
      seaDeckHeight - 0.18,
      startDistance + totalLength * 0.5
    );
    stringer.castShadow = !isSoftwareGl;
    dockGroup.add(stringer);
  }

  // --- 4. Individual Wooden Deck Planks ---
  const plankThickness = 0.12;
  const plankWidth = 0.42;
  const plankGap = 0.05;
  const numPlanks = Math.floor(totalLength / (plankWidth + plankGap));

  for (let i = 0; i < numPlanks; i++) {
    const zPos = startDistance + i * (plankWidth + plankGap) + plankWidth * 0.5;
    const isAtHead = zPos >= headStartDistance;
    const width = isAtHead ? headWidth : gangwayWidth;

    const deckY = THREE.MathUtils.lerp(
      rampHeight,
      seaDeckHeight,
      (zPos - startDistance) / totalLength
    );

    const plankGeom = new THREE.BoxGeometry(width, plankThickness, plankWidth);

    // Weathering color variance
    const plankMat = warmWoodMaterial.clone();
    const variance = 0.9 + Math.sin(i * 2.3) * 0.08 + Math.cos(i * 1.7) * 0.04;
    plankMat.color.multiplyScalar(variance);

    const plank = new THREE.Mesh(plankGeom, plankMat);
    // Subtle organic offset on planks
    const jitterX = Math.sin(i * 3.7) * 0.03;
    plank.position.set(jitterX, deckY, zPos);
    plank.castShadow = !isSoftwareGl;
    plank.receiveShadow = !isSoftwareGl;
    dockGroup.add(plank);

    // Nail / bolt heads on plank edges
    for (const side of [-1, 1]) {
      const nail = new THREE.Mesh(
        new THREE.CylinderGeometry(0.025, 0.025, 0.04, 4),
        ironCleatMaterial
      );
      nail.position.set(
        side * (width * 0.45) + jitterX,
        deckY + plankThickness * 0.5 + 0.01,
        zPos
      );
      dockGroup.add(nail);
    }
  }

  // --- 5. Sagging Nautical Rope Railings ---
  for (const side of [-1, 1]) {
    for (let p = 0; p < numPilePairs - 1; p++) {
      const z1 = startDistance + 1.2 + p * pileSpacing;
      const z2 = startDistance + 1.2 + (p + 1) * pileSpacing;

      // Don't put railing at the very front opening of the docking head
      if (z2 > endDistance - 1.2) continue;

      const isAtHead1 = z1 >= headStartDistance - 0.5;
      const isAtHead2 = z2 >= headStartDistance - 0.5;
      const w1 = isAtHead1 ? headWidth : gangwayWidth;
      const w2 = isAtHead2 ? headWidth : gangwayWidth;

      const y1 = THREE.MathUtils.lerp(rampHeight, seaDeckHeight, (z1 - startDistance) / totalLength) + 0.95;
      const y2 = THREE.MathUtils.lerp(rampHeight, seaDeckHeight, (z2 - startDistance) / totalLength) + 0.95;

      const p1 = new THREE.Vector3(side * (w1 * 0.44), y1, z1);
      const p2 = new THREE.Vector3(side * (w2 * 0.44), y2, z2);
      const mid = new THREE.Vector3(
        (p1.x + p2.x) * 0.5,
        (p1.y + p2.y) * 0.5 - 0.16, // Sagging catenary curve
        (p1.z + p2.z) * 0.5
      );

      const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
      const ropeGeom = new THREE.TubeGeometry(curve, 6, 0.035, 5, false);
      const ropeMesh = new THREE.Mesh(ropeGeom, ropeMaterial);
      ropeMesh.castShadow = !isSoftwareGl;
      dockGroup.add(ropeMesh);
    }
  }

  // --- 6. Iron Mooring Cleats & Coiled Ropes on Dock Head ---
  const cleatLocations = [
    { x: -headWidth * 0.44, z: endDistance - 0.6 },
    { x: headWidth * 0.44, z: endDistance - 0.6 },
    { x: -headWidth * 0.44, z: headStartDistance + 0.6 },
    { x: headWidth * 0.44, z: headStartDistance + 0.6 },
  ];

  for (const loc of cleatLocations) {
    const cleat = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.12, 0.35, 8),
      ironCleatMaterial
    );
    cleat.position.set(loc.x, seaDeckHeight + 0.18, loc.z);
    dockGroup.add(cleat);

    // Crossbar on cleat
    const cleatBar = new THREE.Mesh(
      new THREE.BoxGeometry(0.38, 0.07, 0.09),
      ironCleatMaterial
    );
    cleatBar.position.set(loc.x, seaDeckHeight + 0.32, loc.z);
    dockGroup.add(cleatBar);

    // Coiled dock rope sitting next to the cleat
    const coil = new THREE.Mesh(
      new THREE.TorusGeometry(0.24, 0.06, 6, 12),
      ropeMaterial
    );
    coil.rotateX(Math.PI / 2);
    coil.position.set(loc.x * 0.85, seaDeckHeight + 0.08, loc.z);
    dockGroup.add(coil);
  }

  // --- 7. Cozy Warm Brass Post Lantern at Pier Head Corner ---
  const lanternPost = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.12, 2.2, 6),
    warmWoodMaterial
  );
  lanternPost.position.set(headWidth * 0.44, seaDeckHeight + 1.1, endDistance - 0.4);
  lanternPost.castShadow = !isSoftwareGl;
  dockGroup.add(lanternPost);

  const lanternArm = new THREE.Mesh(
    new THREE.BoxGeometry(0.4, 0.08, 0.08),
    ironCleatMaterial
  );
  lanternArm.position.set(headWidth * 0.44 - 0.18, seaDeckHeight + 2.05, endDistance - 0.4);
  dockGroup.add(lanternArm);

  const lanternLamp = new THREE.Mesh(
    new THREE.BoxGeometry(0.36, 0.48, 0.36),
    new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xfbbf24,
      emissiveIntensity: 1.0,
      metalness: 0.85,
      roughness: 0.2,
    })
  );
  lanternLamp.position.set(headWidth * 0.44 - 0.32, seaDeckHeight + 1.85, endDistance - 0.4);
  dockGroup.add(lanternLamp);

  const beaconLight = new THREE.PointLight(0xfef08a, 1.8, 18);
  beaconLight.position.set(headWidth * 0.44 - 0.32, seaDeckHeight + 1.85, endDistance - 0.4);
  dockGroup.add(beaconLight);

  // --- 8. Glowing Turquoise Soft Docking Zone Ring (On Water) ---
  // Outer glowing pulse ring
  const ringGeom = new THREE.RingGeometry(6.6, 7.5, 36);
  ringGeom.rotateX(-Math.PI / 2);

  const dockingRingMaterial = new THREE.MeshBasicMaterial({
    color: 0x2dd4bf, // Glowing turquoise / cyan
    transparent: true,
    opacity: 0.0, // Managed dynamically in render loop based on boat proximity
    depthWrite: false,
    side: THREE.DoubleSide,
  });

  const dockingRingMesh = new THREE.Mesh(ringGeom, dockingRingMaterial);
  dockingRingMesh.position.set(0, 0.12, endDistance + 0.5);
  dockGroup.add(dockingRingMesh);

  // Inner dotted concentric ripple ring
  const innerRingGeom = new THREE.RingGeometry(4.2, 4.8, 36);
  innerRingGeom.rotateX(-Math.PI / 2);

  const innerRingMaterial = new THREE.MeshBasicMaterial({
    color: 0x5eead4,
    transparent: true,
    opacity: 0.0,
    depthWrite: false,
    side: THREE.DoubleSide,
  });

  const dockingRingInner = new THREE.Mesh(innerRingGeom, innerRingMaterial);
  dockingRingInner.position.set(0, 0.13, endDistance + 0.5);
  dockGroup.add(dockingRingInner);

  // Rotate dock assembly to point in specified direction
  dockGroup.rotation.y = directionAngle;

  return { dockGroup, dockingRingMesh, dockingRingInner, beaconLight };
}

/**
 * Creates 2–3 procedural stylized palm trees with curved trunks & organic leafy canopy
 */
export function createPalmTree(
  scale = 1.0,
  bendAngle = 0.2,
  isSoftwareGl = false
): THREE.Group {
  const palm = new THREE.Group();

  const numSegments = 6;
  const segHeight = 0.9 * scale;
  let currentY = 0;
  let currentZ = 0;

  for (let s = 0; s < numSegments; s++) {
    const bottomR = (0.34 - s * 0.02) * scale;
    const topR = (0.31 - s * 0.02) * scale;
    const segGeom = new THREE.CylinderGeometry(topR, bottomR, segHeight, 7);

    const trunkMat = new THREE.MeshStandardMaterial({
      color: s % 2 === 0 ? 0x78350f : 0x854d0e,
      roughness: 0.9,
      flatShading: true,
    });

    const segment = new THREE.Mesh(segGeom, trunkMat);
    segment.position.set(0, currentY + segHeight * 0.5, currentZ);
    segment.rotation.x = bendAngle * (s / numSegments);
    segment.castShadow = !isSoftwareGl;
    segment.receiveShadow = !isSoftwareGl;
    palm.add(segment);

    currentY += Math.cos(bendAngle * (s / numSegments)) * segHeight;
    currentZ += Math.sin(bendAngle * (s / numSegments)) * segHeight;
  }

  const frondCount = 7;
  const frondLength = 2.8 * scale;
  const frondWidth = 0.85 * scale;

  for (let f = 0; f < frondCount; f++) {
    const angle = (f / frondCount) * Math.PI * 2;
    const frondGeom = new THREE.PlaneGeometry(frondWidth, frondLength, 3, 4);

    const pos = frondGeom.attributes.position;
    for (let p = 0; p < pos.count; p++) {
      const y = pos.getY(p);
      const droop = Math.pow((y + frondLength * 0.5) / frondLength, 2) * (0.6 * scale);
      pos.setZ(p, pos.getZ(p) - droop);
    }
    frondGeom.computeVertexNormals();

    const frondMat = new THREE.MeshStandardMaterial({
      color: f % 2 === 0 ? 0x16a34a : 0x15803d,
      roughness: 0.75,
      side: THREE.DoubleSide,
      flatShading: true,
    });

    const frond = new THREE.Mesh(frondGeom, frondMat);
    frond.position.set(0, currentY, currentZ);
    frond.rotation.y = angle;
    frond.rotation.x = Math.PI * 0.35;
    frond.castShadow = !isSoftwareGl;
    palm.add(frond);
  }

  const coconutMat = new THREE.MeshStandardMaterial({
    color: 0x451a03,
    roughness: 0.8,
  });
  for (let c = 0; c < 3; c++) {
    const cAngle = (c / 3) * Math.PI * 2;
    const coconut = new THREE.Mesh(
      new THREE.SphereGeometry(0.24 * scale, 6, 6),
      coconutMat
    );
    coconut.position.set(
      Math.cos(cAngle) * 0.3 * scale,
      currentY - 0.2 * scale,
      currentZ + Math.sin(cAngle) * 0.3 * scale
    );
    palm.add(coconut);
  }

  return palm;
}

/**
 * Creates subtle cinematic volumetric sun shafts / god rays
 * Soft transparent warm golden light cones with additive blending
 */
export function createVolumetricGodRays(isSoftwareGl = false): THREE.Group {
  const godRaysGroup = new THREE.Group();
  if (isSoftwareGl) return godRaysGroup;

  const rayCount = 5;
  const rayMat = new THREE.MeshBasicMaterial({
    color: 0xfef08a, // Soft warm golden
    transparent: true,
    opacity: 0.08,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
  });

  for (let i = 0; i < rayCount; i++) {
    const coneGeom = new THREE.ConeGeometry(8 + i * 3, 140, 10, 1, true);
    coneGeom.translate(0, -70, 0);

    const ray = new THREE.Mesh(coneGeom, rayMat);
    ray.position.set(
      60 + (i - 2) * 18,
      95,
      50 + (i - 2) * 14
    );
    // Align with sun light direction: from (60, 80, 50) towards (0, 0, 0)
    ray.lookAt(new THREE.Vector3((i - 2) * 15, 0, (i - 2) * 12));
    godRaysGroup.add(ray);
  }

  return godRaysGroup;
}
