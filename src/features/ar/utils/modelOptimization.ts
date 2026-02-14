import * as THREE from 'three';

/**
 * Model optimization utilities for improving 3D model performance
 */

export interface OptimizationOptions {
  /**
   * Merge geometries to reduce draw calls
   * @default true
   */
  mergeGeometries?: boolean;
  /**
   * Simplify geometry by reducing vertex count
   * @default false
   */
  simplifyGeometry?: boolean;
  /**
   * Target vertex reduction ratio (0-1)
   * @default 0.5
   */
  simplificationRatio?: number;
  /**
   * Dispose of original geometries after optimization
   * @default true
   */
  disposeOriginal?: boolean;
  /**
   * Compute vertex normals for smooth shading
   * @default true
   */
  computeNormals?: boolean;
}

/**
 * Optimize a 3D model by merging geometries and reducing complexity
 */
export function optimizeModel(
  scene: THREE.Object3D,
  options: OptimizationOptions = {}
): THREE.Object3D {
  const {
    mergeGeometries = true,
    simplifyGeometry = false,
    simplificationRatio = 0.5,
    disposeOriginal = true,
    computeNormals = true,
  } = options;

  const optimizedScene = scene.clone();

  if (mergeGeometries) {
    mergeMeshes(optimizedScene);
  }

  if (simplifyGeometry) {
    simplifyMeshes(optimizedScene, simplificationRatio);
  }

  if (computeNormals) {
    computeMeshNormals(optimizedScene);
  }

  if (disposeOriginal) {
    disposeScene(scene);
  }

  return optimizedScene;
}

/**
 * Merge meshes with the same material to reduce draw calls
 */
function mergeMeshes(scene: THREE.Object3D): void {
  const meshGroups = new Map<string, THREE.Mesh[]>();

  // Group meshes by material
  scene.traverse((child) => {
    if (child instanceof THREE.Mesh && child.geometry && child.material) {
      const materialKey = getMaterialKey(child.material);
      if (!meshGroups.has(materialKey)) {
        meshGroups.set(materialKey, []);
      }
      meshGroups.get(materialKey)!.push(child);
    }
  });

  // Merge each group
  meshGroups.forEach((meshes, materialKey) => {
    if (meshes.length > 1) {
      const geometries: THREE.BufferGeometry[] = [];
      const material = meshes[0].material;

      meshes.forEach((mesh) => {
        const geometry = mesh.geometry.clone();
        mesh.updateWorldMatrix(true, false);
        geometry.applyMatrix4(mesh.matrixWorld);
        geometries.push(geometry);
      });

      // Merge geometries
      const mergedGeometry = mergeBufferGeometries(geometries);
      if (mergedGeometry) {
        const mergedMesh = new THREE.Mesh(mergedGeometry, material);
        scene.add(mergedMesh);

        // Remove original meshes
        meshes.forEach((mesh) => {
          mesh.parent?.remove(mesh);
          mesh.geometry.dispose();
        });
      }

      // Dispose temporary geometries
      geometries.forEach((geo) => geo.dispose());
    }
  });
}

/**
 * Simplify mesh geometries by reducing vertex count
 */
function simplifyMeshes(scene: THREE.Object3D, ratio: number): void {
  scene.traverse((child) => {
    if (child instanceof THREE.Mesh && child.geometry) {
      const simplified = simplifyGeometry(child.geometry, ratio);
      if (simplified) {
        child.geometry.dispose();
        child.geometry = simplified;
      }
    }
  });
}

/**
 * Compute vertex normals for all meshes
 */
function computeMeshNormals(scene: THREE.Object3D): void {
  scene.traverse((child) => {
    if (child instanceof THREE.Mesh && child.geometry) {
      child.geometry.computeVertexNormals();
    }
  });
}

/**
 * Get a unique key for a material
 */
function getMaterialKey(material: THREE.Material | THREE.Material[]): string {
  if (Array.isArray(material)) {
    return material.map((m) => m.uuid).join('-');
  }
  return material.uuid;
}

/**
 * Merge multiple buffer geometries into one
 */
function mergeBufferGeometries(
  geometries: THREE.BufferGeometry[]
): THREE.BufferGeometry | null {
  if (geometries.length === 0) return null;
  if (geometries.length === 1) return geometries[0];

  // Check if all geometries have the same attributes
  const firstGeometry = geometries[0];
  const attributes = Object.keys(firstGeometry.attributes);

  const allCompatible = geometries.every((geo) => {
    const geoAttributes = Object.keys(geo.attributes);
    return (
      geoAttributes.length === attributes.length &&
      attributes.every((attr) => geoAttributes.includes(attr))
    );
  });

  if (!allCompatible) {
    console.warn('Cannot merge geometries with different attributes');
    return null;
  }

  // Calculate total vertex count
  let totalVertices = 0;
  let totalIndices = 0;

  geometries.forEach((geo) => {
    totalVertices += geo.attributes.position.count;
    if (geo.index) {
      totalIndices += geo.index.count;
    } else {
      totalIndices += geo.attributes.position.count;
    }
  });

  // Create merged geometry
  const mergedGeometry = new THREE.BufferGeometry();

  // Merge attributes
  attributes.forEach((attrName) => {
    const firstAttr = firstGeometry.attributes[attrName];
    const itemSize = firstAttr.itemSize;
    const mergedArray = new Float32Array(totalVertices * itemSize);

    let offset = 0;
    geometries.forEach((geo) => {
      const attr = geo.attributes[attrName];
      mergedArray.set(attr.array as Float32Array, offset);
      offset += attr.count * itemSize;
    });

    mergedGeometry.setAttribute(
      attrName,
      new THREE.BufferAttribute(mergedArray, itemSize)
    );
  });

  // Merge indices
  const mergedIndices = new Uint32Array(totalIndices);
  let indexOffset = 0;
  let vertexOffset = 0;

  geometries.forEach((geo) => {
    if (geo.index) {
      const indices = geo.index.array;
      for (let i = 0; i < indices.length; i++) {
        mergedIndices[indexOffset++] = indices[i] + vertexOffset;
      }
    } else {
      // Non-indexed geometry
      for (let i = 0; i < geo.attributes.position.count; i++) {
        mergedIndices[indexOffset++] = vertexOffset + i;
      }
    }
    vertexOffset += geo.attributes.position.count;
  });

  mergedGeometry.setIndex(new THREE.BufferAttribute(mergedIndices, 1));

  return mergedGeometry;
}

/**
 * Simplify geometry by reducing vertex count
 * Basic implementation - for production use a proper simplification library
 */
function simplifyGeometry(
  geometry: THREE.BufferGeometry,
  ratio: number
): THREE.BufferGeometry | null {
  if (ratio >= 1) return geometry;
  if (ratio <= 0) return null;

  // This is a basic implementation
  // For production, consider using libraries like three-mesh-bvh or simplify-modifier
  const positions = geometry.attributes.position;
  const vertexCount = positions.count;
  const targetCount = Math.floor(vertexCount * ratio);

  if (targetCount >= vertexCount) return geometry;

  // Simple decimation: keep every nth vertex
  const step = Math.ceil(vertexCount / targetCount);
  const newPositions: number[] = [];
  const newIndices: number[] = [];

  for (let i = 0; i < vertexCount; i += step) {
    newPositions.push(
      positions.getX(i),
      positions.getY(i),
      positions.getZ(i)
    );
  }

  // Rebuild indices
  const newVertexCount = newPositions.length / 3;
  for (let i = 0; i < newVertexCount - 2; i++) {
    newIndices.push(i, i + 1, i + 2);
  }

  const simplified = new THREE.BufferGeometry();
  simplified.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(newPositions, 3)
  );
  simplified.setIndex(newIndices);
  simplified.computeVertexNormals();

  return simplified;
}

/**
 * Dispose of all resources in a scene
 */
export function disposeScene(scene: THREE.Object3D): void {
  scene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      if (child.geometry) {
        child.geometry.dispose();
      }
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((material) => disposeMaterial(material));
        } else {
          disposeMaterial(child.material);
        }
      }
    }
  });
}

/**
 * Dispose of a material and its textures
 */
function disposeMaterial(material: THREE.Material): void {
  if ('map' in material && material.map) {
    material.map.dispose();
  }
  if ('lightMap' in material && material.lightMap) {
    material.lightMap.dispose();
  }
  if ('bumpMap' in material && material.bumpMap) {
    material.bumpMap.dispose();
  }
  if ('normalMap' in material && material.normalMap) {
    material.normalMap.dispose();
  }
  if ('specularMap' in material && material.specularMap) {
    material.specularMap.dispose();
  }
  if ('envMap' in material && material.envMap) {
    material.envMap.dispose();
  }
  material.dispose();
}

/**
 * Calculate model statistics
 */
export interface ModelStats {
  vertices: number;
  triangles: number;
  meshes: number;
  materials: number;
  textures: number;
  drawCalls: number;
}

export function getModelStats(scene: THREE.Object3D): ModelStats {
  const stats: ModelStats = {
    vertices: 0,
    triangles: 0,
    meshes: 0,
    materials: 0,
    textures: 0,
    drawCalls: 0,
  };

  const materials = new Set<string>();
  const textures = new Set<string>();

  scene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      stats.meshes++;
      stats.drawCalls++;

      if (child.geometry) {
        const positions = child.geometry.attributes.position;
        if (positions) {
          stats.vertices += positions.count;
        }

        if (child.geometry.index) {
          stats.triangles += child.geometry.index.count / 3;
        } else if (positions) {
          stats.triangles += positions.count / 3;
        }
      }

      if (child.material) {
        const mats = Array.isArray(child.material)
          ? child.material
          : [child.material];
        mats.forEach((mat) => {
          materials.add(mat.uuid);

          // Count textures
          if ('map' in mat && mat.map) textures.add(mat.map.uuid);
          if ('normalMap' in mat && mat.normalMap)
            textures.add(mat.normalMap.uuid);
          if ('roughnessMap' in mat && mat.roughnessMap)
            textures.add(mat.roughnessMap.uuid);
          if ('metalnessMap' in mat && mat.metalnessMap)
            textures.add(mat.metalnessMap.uuid);
        });
      }
    }
  });

  stats.materials = materials.size;
  stats.textures = textures.size;

  return stats;
}
