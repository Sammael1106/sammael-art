import * as THREE from 'three';
import _ from 'lodash';

import React, { useRef, useEffect } from "react";
import { useGLTF, useAnimations, useTexture, } from "@react-three/drei";

export function MeModel(props) {

  // const modelMaterial = new THREE.MeshStandardMaterial({color: '#cccccc', envMapIntensity: props.envMapIntensity})
  const modelMaterial = new THREE.MeshBasicMaterial({
    color: 0x66ccff,
    wireframe: true
  });

  const group = useRef();
  const { nodes, materials, animations } = useGLTF('../models/me.glb');
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
      actions.Typing.play()
      // actions['A-pose'].play()
  }, [])

  _.map(materials, (material) => material.envMapIntensity = props.envMapIntensity || 1)

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="Armature" rotation={[Math.PI / 2, 0, Math.PI]}>
          <primitive object={nodes.mixamorigHips} />
          <skinnedMesh
            name="ME_eyes"
            geometry={nodes.ME_eyes.geometry}
            material={modelMaterial}
            skeleton={nodes.ME_eyes.skeleton}
            castShadow={false}
            receiveShadow={true}
            frustumCulled={false}
          />
          <skinnedMesh
            name="ME_body"
            geometry={nodes.ME_body.geometry}
            material={modelMaterial}
            skeleton={nodes.ME_body.skeleton}
            castShadow={true}
            receiveShadow={true}
            frustumCulled={false}
          />
        </group>
      </group>
    </group>
  );
}


useGLTF.preload('../models/me.glb');
