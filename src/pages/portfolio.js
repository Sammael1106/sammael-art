import Head from 'src/components/_head.js'

import React, { useRef, useEffect, useMemo } from 'react'
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber'
import { Box, OrbitControls, Sampler, Line, Points, useSurfaceSampler, Point} from '@react-three/drei';
import { EffectComposer, Outline, Vignette, Select, Selection } from '@react-three/postprocessing'
import { Perf } from 'r3f-perf'

import { MeModel } from '../models/me'
import { Room } from '../models/room'


const cameraDefaults = { position: [5, 5, -20], fov: 45, zoom: 1.5 }
const tempPosition = new THREE.Vector3();
const tempObject = new THREE.Object3D();
const particlesCount = 300


export default function Home() {
  return (
    <>
      <Head title="PORTFOLIO" />
      <Canvas camera={cameraDefaults}>
        <Scene />
        <Line points={[[0, 0, 0], [0, 4, 0]]} color={'red'} lineWidth={1}/>
        <Line points={[[0, 0, 0], [4, 0, 0]]} color={'blue'} lineWidth={1}/>
        <Line points={[[0, 0, 0], [0, 0, 4]]} color={'green'} lineWidth={1}/>
        <OrbitControls />
        <Perf />
      </Canvas>
    </>
  )
}

const Scene = () => {

  const geomRef = useRef()
  const particlesRef = useRef()
  const samplerRef = useRef()
  const sampler = useSurfaceSampler(geomRef, particlesCount)

  console.log(sampler)

  useEffect(() => {
    // console.log(sampler)
    // particlesRef.current.geometry.applyMatrix4(new THREE.Matrix4().makeRotationX(Math.PI / 2))
    // particlesRef.current.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, 0.5))
  }, [])


  useFrame(({clock}) => {
  //   if (geomRef.current) {
  //     geomRef.current.rotation.y += 0.01;
  //     console.log(samplerRef)
  //   }
  })

  // const particlesTransformation = (args) => {
  //   const { position, normal, dummy: object } = args
  //   // object.position.set(position.x, position.y, position.z);
  //   // object.updateMatrix();
  //   // console.log(object)
  //   return object
  // }

  return (
    <>
      <color args={['#ff66cc']} attach="background" />
      <hemisphereLight args={['red', 'white']} intensity={0.6} />
      <directionalLight />
        <instancedMesh ref={particlesRef} args={[undefined, undefined, particlesCount]}>
          <sphereBufferGeometry args={[0.05, 6, 6]} name="particle" />
          <meshBasicMaterial color="#00ff00" />
        </instancedMesh>

        <PointsCloud />

        <Box args={[1,1,1]} ref={geomRef}>
          <meshBasicMaterial color="#f3f3f3" wireframe />
        </Box>
        {/* <Sampler
          ref={samplerRef}
          count={particlesCount}
          transform={particlesTransformation}
          mesh={geomRef}
          instances={particlesRef}
        /> */}

        {/* <MeModel scale={ 0.2 } position={[10,-15,0]}/> */}
        {/* <Room /> */}
    </>
  )
}



const PointsCloud = ({ count = 1000, size = 1 }) => {
  const points = useMemo(() => {
    const tempPoints = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * size;
      const y = (Math.random() - 0.5) * size;
      const z = (Math.random() - 0.5) * size;
      tempPoints.push(x, y, z);
    }
    return new Float32Array(tempPoints);
  }, [count, size]);

  return (
    <Points positions={points} count={points.length / 3}>
      <pointsMaterial size={0.1} color={'red'} />
    </Points>
  );
};

