import Head from 'src/components/_head.js'

import React, { useRef, useState } from 'react'
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei';
import { EffectComposer, Outline, Vignette, Select, Selection } from '@react-three/postprocessing'
// import { OutlineEffect } from 'postprocessing';

const Scene = () => {
  return (
    <>
      <color args={['#ff66cc']} attach="background" />
      <hemisphereLight args={['red', 'white']} intensity={0.6} />
      <directionalLight />
      <Selection>
        <EffectComposer autoClear={false}>
          <Outline hiddenEdgeColor="#99c4ac" blur edgeStrength={100} />
        </EffectComposer>
        <Select enabled>
          <mesh position={[0, 0, 0]}>
            <boxBufferGeometry />
            <meshStandardMaterial color="green" />
          </mesh>
        </Select>
      </Selection>
    </>
  )
}

export default function() {
  return (
    <>
      <Head title="PLAYGROUND" />
      <Canvas camera={{position: [0, 2, 5]}}>
        <Scene />
        <OrbitControls />
      </Canvas>
    </>
  )
}

