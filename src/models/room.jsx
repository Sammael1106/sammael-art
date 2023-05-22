import React, { useRef } from "react";
import * as THREE from 'three';
import _ from 'lodash';
import { useGLTF } from "@react-three/drei";

export function Room(props) {
  const { nodes, materials } = useGLTF("../models/m1.glb")

  _.map(materials, (material) => material.envMapIntensity = props.envMapIntensity)
  const outlineMaterial = new THREE.MeshBasicMaterial( { color: '#ffffff', side: THREE.DoubleSide } );

  return (
    <group {...props} dispose={null}>
      <group position={[0, -0.15, -0.59]}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.M1_screen.geometry}
          material={materials.M1_screen}
          position={[-1.38, 5.74, -2.54]}
          rotation={[-2.09, -0.02, 0.03]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.M1.geometry}
          material={materials.M1_metal}
          position={[-1.38, 5.78, -1.12]}
          rotation={[0, 0.03, 0]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.M1_top.geometry}
          material={materials.M1_metal}
          position={[-1.38, 5.73, -2.54]}
          rotation={[-2.09, -0.02, 0.03]}
        />
        <group
          position={[-3.97, -0.47, 10.42]}
          rotation={[0, 0.65, 0]}
          scale={12.32}
        >
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Chocofur_Flowers_36_1.geometry}
            material={materials["Chocofur_Flowers_36.001"]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Chocofur_Flowers_36_2.geometry}
            material={materials["Chocofur_Flowers_36.003"]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Chocofur_Flowers_36_3.geometry}
            material={materials["Chocofur_Flowers_36.002"]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Chocofur_Flowers_36_4.geometry}
            material={materials.Chocofur_Flowers_36}
          />
        </group>
        <group
          position={[2.72, 5.61, -1.92]}
          rotation={[0, 0.16, 0]}
          scale={13.51}
        >
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Mouse_1.geometry}
            material={materials.Chocofur_Free_Accessories_05}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Mouse_2.geometry}
            material={materials["Chocofur_Free_Accessories_05.002"]}
          />
        </group>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Seat.geometry}
          material={materials.Seat_plastic}
          position={[0, -0.62, 3.59]}
          rotation={[0, -1.57, 0]}
        />
      </group>
    </group>
  );
}

useGLTF.preload('../models/m1.glb');