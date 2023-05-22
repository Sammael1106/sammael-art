import Head from 'src/components/_head.js'

import React, { useRef, useState } from 'react'
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Image, useMatcapTexture, useGLTF, Text, Plane } from '@react-three/drei';
import { EffectComposer, Outline, Vignette, Select, Selection } from '@react-three/postprocessing'

import styles from 'src/styles/Promo.module.css'

const BGImageURL = '/promo_images/LEV_bg1.png'
const OverlayUrl = '/promo_images/overlay.png'
const CharImageURL = '/promo_images/LEV_char2.png'
const LogoURL = '/promo_images/logo.png'
const fontUrl = '/fonts/SourceSansPro-Black.ttf'

const Scene = () => {

  const refChar = useRef()
  const refBG = useRef()
  const refLogo = useRef()
  const refOverlay = useRef()

  useFrame((state, delta) => {
    // refBG.current.material.blending = THREE.CustomBlending;
    refOverlay.current.material.blending = THREE.CustomBlending;
    refChar.current.material.blending = THREE.CustomBlending;
    refLogo.current.material.blending = THREE.CustomBlending;
  })


  const [ silverMatcap ] = useMatcapTexture('9B9994_E1E0DB_474643_544C4C', 256)
  const [ goldenMatcap ] = useMatcapTexture('E6BF3C_5A4719_977726_FCFC82', 256)

  return (
    <>
      {/* <Image url={BGImageURL} ref={refBG} scale={[13, 13, 13]} position={[0, 0, 0]} /> */}
      <Image url={OverlayUrl} ref={refOverlay} scale={[13, 13, 13]} position={[0, 0, 0.1]} />
      <Image url={CharImageURL} ref={refChar} scale={[9, 9, 1]} position={[0, 0.5, 0.2]} />
      <Heart position={[3, 3, 1]} scale={0.6} rotation={[-0.8, 2.2, 0.4]} />
      <Heart position={[-2, 4.5, 1]} scale={0.4} rotation={[0.8, -1.4, -0.5]}/>
      <Heart position={[-4, 2, 1]} scale={0.6} rotation={[1.4, 1,  1.4]}/>
      <Heart position={[4, 0, 1]} scale={0.4} rotation={[-1.4, -1, 2]}/>
      <Image url={LogoURL} ref={refLogo} scale={[1.2, 1.2, 1]} position={[4.5, 4.5, 2]} />
      <Text
          font={fontUrl}
          fontSize={ 1.2 }
          position={ [ 0, -2.2, 3 ] }
          maxWidth={ 10 }
          rotation={[-0.01, 0, 0]}
          outlineColor={0x000000}
          outlineBlur={0.2}
          outlineWidth={0.02}
          outlineOpacity={0.8}
          strokeColor={0xe0e8ee}
          strokeWidth={0.02}
          >
          КОРОЛИ МОРЯ
          <meshMatcapMaterial matcap={silverMatcap} />
      </Text>
      <Text
          font={fontUrl}
          fontSize={ 1 }
          rotation={[0.07, 0, 0]}
          position={ [ 0, -3.2, 3 ] }
          maxWidth={ 10 }
          outlineColor={0x000000}
          outlineBlur={0.2}
          outlineWidth={0.01}
          outlineOpacity={0.8}
          strokeColor={0xe5bd03}
          strokeWidth={0.02}>
          100% + 70 fs
          <meshMatcapMaterial matcap={goldenMatcap} />
      </Text>
      <Text
          font={fontUrl}
          fontSize={ 0.3 }
          position={ [ 0, -4.2, 3 ] }
          maxWidth={ 10 }
          color={0xb9bacb}>
          23 ИЮЛЯ - 25 ИЮЛЯ
      </Text>
    </>
  )
}

export default function() {

  function save() {
    var dataURL = document.getElementsByTagName('canvas')[0].toDataURL();
    var link = document.createElement("a");
    link.download = "demo.png";
    link.href = dataURL;
    link.target = "_blank";
    link.click();

  }

  return (
    <>
      <Head title="Casino promo generator" />
      <div className={styles.container}>

        <Canvas className={styles.canvas}
                flat
                style={{width: 500, height: 500, backgroundImage: `url(${BGImageURL})`}}
                gl={{ antialias: true, preserveDrawingBuffer: true }}
                dpr={[1, 1.5]}
                camera={{position: [0, 0, 17.7], fov: 40}}
                >
          <Scene />
          <OrbitControls />
        </Canvas>

        <div>
          <button onClick={save}>Save image</button>
          <textarea></textarea>
          <textarea></textarea>
          <textarea></textarea>
        </div>
      </div>
    </>
  )
}


export function Heart(props) {
  const { nodes, materials } = useGLTF("models/heart.glb");
  const [ matcapTexture ] = useMatcapTexture('422509_C89536_824512_0A0604', 256)
  const material = new THREE.MeshMatcapMaterial({matcap: matcapTexture })
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane.geometry}
        material={material}
      />
    </group>
  );
}


useGLTF.preload("models/heart.glb");