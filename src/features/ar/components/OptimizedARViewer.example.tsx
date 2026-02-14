import { Canvas } from '@react-three/fiber';
import { Suspense, useState } from 'react';
import { ARScene } from './ARScene';
import { ARControls } from './ARControls';
import { ProgressiveModel } from './ProgressiveModel';
import { AutoLODModel } from './AutoLODModel';
import { CachedModel } from './CachedModel';
import { ModelProgress } from './ModelProgress';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Loader2, Zap, Layers, Database } from 'lucide-react';
import type { LoadProgress } from '../utils/progressiveLoader';
import { getModelCacheStats } from '../utils/modelCache';

/**
 * OptimizedARViewer Example
 * 
 * Demonstrates all three optimization techniques:
 * 1. Progressive Loading - Load preview first, then full quality
 * 2. LOD (Level of Detail) - Automatic quality switching based on distance
 * 3. Model Caching - LRU cache to reduce network requests
 */
export function OptimizedARViewerExample() {
  const [activeTab, setActiveTab] = useState<'progressive' | 'lod' | 'cached'>('progressive');
  const [loadProgress, setLoadProgress] = useState<LoadProgress | null>(null);
  const [cacheStats, setCacheStats] = useState(getModelCacheStats());

  const handleProgressUpdate = (progress: LoadProgress) => {
    setLoadProgress(progress);
  };

  const updateCacheStats = () => {
    setCacheStats(getModelCacheStats());
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">3D Model Loading Optimization</h1>
        <p className="text-muted-foreground">
          Advanced techniques for optimizing 3D model loading and rendering performance
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progressive Loading</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loadProgress ? `${Math.round(loadProgress.progress)}%` : '0%'}
            </div>
            <p className="text-xs text-muted-foreground">
              Stage: {loadProgress?.stage || 'idle'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">LOD System</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3 Levels</div>
            <p className="text-xs text-muted-foreground">
              Automatic quality switching
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cache Hit Rate</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(cacheStats.hitRate * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {cacheStats.entries} models cached
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="progressive">
            <Zap className="h-4 w-4 mr-2" />
            Progressive Loading
          </TabsTrigger>
          <TabsTrigger value="lod">
            <Layers className="h-4 w-4 mr-2" />
            LOD System
          </TabsTrigger>
          <TabsTrigger value="cached">
            <Database className="h-4 w-4 mr-2" />
            Model Caching
          </TabsTrigger>
        </TabsList>

        {/* Progressive Loading Tab */}
        <TabsContent value="progressive" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Progressive Loading</CardTitle>
              <CardDescription>
                Load a low-quality preview first, then stream the full-quality model
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-[500px] bg-muted rounded-lg overflow-hidden">
                <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
                  <ARScene>
                    <Suspense fallback={<ModelProgress />}>
                      <ProgressiveModel
                        modelUrl="/models/dish-full.glb"
                        previewUrl="/models/dish-preview.glb"
                        position={[0, 0, 0]}
                        scale={1}
                        loadOptions={{
                          useDraco: true,
                          loadPreview: true,
                          enableStreaming: true,
                          priority: 8,
                        }}
                        onProgress={handleProgressUpdate}
                      />
                    </Suspense>
                    <ARControls />
                  </ARScene>
                </Canvas>
              </div>

              {loadProgress && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Loading Progress</span>
                    <Badge variant={loadProgress.stage === 'complete' ? 'default' : 'secondary'}>
                      {loadProgress.stage}
                    </Badge>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${loadProgress.progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {loadProgress.loaded > 0 && loadProgress.total > 0
                      ? `${(loadProgress.loaded / 1024 / 1024).toFixed(2)} MB / ${(loadProgress.total / 1024 / 1024).toFixed(2)} MB`
                      : 'Preparing...'}
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <h4 className="font-semibold">How it works:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Stage 1: Load low-quality preview model (fast)</li>
                  <li>Stage 2: Stream full-quality model in background</li>
                  <li>Stage 3: Seamlessly swap to full quality when ready</li>
                  <li>Supports Draco compression for smaller file sizes</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* LOD Tab */}
        <TabsContent value="lod" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Level of Detail (LOD)</CardTitle>
              <CardDescription>
                Automatically switch between quality levels based on camera distance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-[500px] bg-muted rounded-lg overflow-hidden">
                <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
                  <ARScene>
                    <Suspense fallback={<ModelProgress />}>
                      <AutoLODModel
                        id="dish-lod"
                        model={new THREE.Object3D()} // In real app, load actual model
                        preset="balanced"
                        position={[0, 0, 0]}
                        scale={1}
                        showDebug={true}
                        onLODChange={(level) => {
                          console.log('LOD level changed:', level);
                        }}
                      />
                    </Suspense>
                    <ARControls />
                  </ARScene>
                </Canvas>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">LOD Levels:</h4>
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-3 border rounded-lg">
                    <div className="font-semibold text-sm">Level 0</div>
                    <div className="text-xs text-muted-foreground">High Quality</div>
                    <div className="text-xs mt-1">Distance: 0-5m</div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="font-semibold text-sm">Level 1</div>
                    <div className="text-xs text-muted-foreground">Medium Quality</div>
                    <div className="text-xs mt-1">Distance: 5-15m</div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="font-semibold text-sm">Level 2</div>
                    <div className="text-xs text-muted-foreground">Low Quality</div>
                    <div className="text-xs mt-1">Distance: 15m+</div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Benefits:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Maintains 60 FPS by reducing detail at distance</li>
                  <li>Automatic quality switching based on camera position</li>
                  <li>Configurable distance thresholds and quality levels</li>
                  <li>Reduces GPU load and memory usage</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Caching Tab */}
        <TabsContent value="cached" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Model Caching</CardTitle>
              <CardDescription>
                LRU cache with memory management and persistent storage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-[500px] bg-muted rounded-lg overflow-hidden">
                <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
                  <ARScene>
                    <Suspense fallback={<ModelProgress />}>
                      <CachedModel
                        modelUrl="/models/dish.glb"
                        priority={7}
                        position={[0, 0, 0]}
                        scale={1}
                        onLoad={() => {
                          updateCacheStats();
                        }}
                      />
                    </Suspense>
                    <ARControls />
                  </ARScene>
                </Canvas>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Cache Statistics:</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cached Models:</span>
                      <span className="font-medium">{cacheStats.entries}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cache Size:</span>
                      <span className="font-medium">
                        {(cacheStats.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Hit Rate:</span>
                      <span className="font-medium">
                        {Math.round(cacheStats.hitRate * 100)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Hits / Misses:</span>
                      <span className="font-medium">
                        {cacheStats.hits} / {cacheStats.misses}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">Cache Features:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>LRU eviction policy</li>
                    <li>Priority-based caching</li>
                    <li>Memory monitoring</li>
                    <li>IndexedDB persistence</li>
                    <li>Automatic cleanup</li>
                  </ul>
                </div>
              </div>

              <Button onClick={updateCacheStats} className="w-full">
                <Database className="h-4 w-4 mr-2" />
                Refresh Cache Stats
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Performance Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center">
                <Zap className="h-4 w-4 mr-2" />
                Progressive Loading
              </h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Use for initial page load</li>
                <li>Create preview models at 25% quality</li>
                <li>Enable Draco compression</li>
                <li>Set appropriate priorities</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold flex items-center">
                <Layers className="h-4 w-4 mr-2" />
                LOD System
              </h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Use for scenes with multiple models</li>
                <li>Configure distance thresholds</li>
                <li>Test on target devices</li>
                <li>Monitor FPS and adjust</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold flex items-center">
                <Database className="h-4 w-4 mr-2" />
                Model Caching
              </h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Preload frequently used models</li>
                <li>Set cache size limits</li>
                <li>Use priority for important models</li>
                <li>Monitor cache hit rate</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
