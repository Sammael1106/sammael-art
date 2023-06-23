import * as THREE from 'three'
import { forwardRef } from 'react'
import { extend, MaterialNode } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import portalVertexShader from '../glsl/portal/vertex.glsl'
import portalFragmentShader from '../glsl/portal/fragment.glsl'

const PortalMaterial = shaderMaterial(
  {
    uTime: 0,
    uColorStart: new THREE.Color('#ffffff'),
    uColorEnd: new THREE.Color('#000000')
  },
  portalVertexShader,
  portalFragmentShader
)

export { PortalMaterial }