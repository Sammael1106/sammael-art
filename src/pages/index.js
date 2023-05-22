import Head from 'src/components/_head.js'
import styles from 'src/styles/Improbable.module.css'
import { clsx } from 'clsx';

import React, { useRef, useEffect, useState } from 'react'
import * as THREE from 'three';
import { RGBELoader } from 'three-stdlib'
import { Canvas, useLoader, useFrame, useThree } from '@react-three/fiber'
import {
  Center,
  Html,
  Float,
  useGLTF,
  Plane,
  useCursor,
  Instances,
  Environment,
  Lightformer,
  OrbitControls,
  RandomizedLight,
  AccumulativeShadows,
  MeshTransmissionMaterial,
  ScrollControls,
  Scroll,
  useScroll,
  Image
} from '@react-three/drei'
import gsap from 'gsap'
import { Perf } from 'r3f-perf'
import { Leva, useControls, button } from 'leva'
import { EffectComposer, HueSaturation, BrightnessContrast } from '@react-three/postprocessing'

const fontUrl = '/fonts/BebasNeue-Regular.ttf'



export default function App() {
  const config = useControls({
    zoom: { value: 65, min: 0, max: 100, step: 1 },
    backside: true,
    backsideThickness: { value: 0.3, min: 0, max: 2 },
    samples: { value: 16, min: 1, max: 32, step: 1 },
    resolution: { value: 1024, min: 64, max: 2048, step: 64 },
    transmission: { value: 1, min: 0, max: 1 },
    clearcoat: { value: 0, min: 0.1, max: 1 },
    clearcoatRoughness: { value: 0.0, min: 0, max: 1 },
    thickness: { value: 0.3, min: 0, max: 5 },
    chromaticAberration: { value: 5, min: 0, max: 5 },
    anisotropy: { value: 0.9, min: 0, max: 1, step: 0.01 },
    roughness: { value: 0, min: 0, max: 1, step: 0.01 },
    distortion: { value: 1, min: 0, max: 4, step: 0.01 },
    distortionScale: { value: 1, min: 0.01, max: 1, step: 0.01 },
    temporalDistortion: { value: .2, min: 0, max: 1, step: 0.01 },
    ior: { value: 0, min: 0, max: 2, step: 0.01 },
    scale: { value: 3, min: 0, max: 50, step: 0.01 },
    color: '#ff9cf5',
    gColor: '#ff7eb3',
    shadow: '#750d57',
  })

  const texture = useLoader(RGBELoader, 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/aerodynamics_workshop_1k.hdr')
  config.background = texture

  const overlay = useRef()

  const [stage, setStage] = useState(1)

  const changeStage = (newstage) => {
    gsap.to(overlay.current.style, {
      opacity: 1,
      duration: 0.3,
      ease: "power3.out",
      onComplete: () => setStage(newstage)
    })
  }

  useEffect(() => {
    overlay.current.style.opacity = 1;
    gsap.to(overlay.current.style, {
      opacity: 0,
      duration: 0.5,
      ease: "power3.out",
      delay: 0.2
    })
  }, [stage])

  const stageClass = {
    [styles.stage1]: stage === 1,
    [styles.stage2]: stage === 2,
    [styles.stage3]: stage === 3,
    [styles.stage4]: stage === 4,
    [styles.stage5]: stage === 5,
  }

  return (
    <>
      <Head title="Impropbable" />
      <div  className={clsx(stageClass, styles.page)}>
      <Canvas shadows orthographic camera={{ position: [0, 20, 0], zoom: config.zoom, near: 0, far: 1000 }} gl={{ preserveDrawingBuffer: true }}>
        {/* <Perf /> */}

        {stage === 1 && <StageOne config={config} setStage={changeStage} overlay={overlay}/>}
        {(stage === 2 || stage === 3) && <StageTwo config={config} setStage={changeStage} stage={stage} overlay={overlay}/>}
        {stage === 4 && <StageFour config={config} setStage={changeStage} overlay={overlay}/>}
        {stage === 5 && <StageFive config={config} setStage={changeStage} overlay={overlay}/>}

        <Environment resolution={32}>
          <group rotation={[-Math.PI / 4, -0.3, 0]}>
            <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[10, 2, 1]} />
            <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={[10, 2, 1]} />
            <Lightformer intensity={2} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={[20, 2, 1]} />
            <Lightformer type="ring" intensity={2} rotation-y={Math.PI / 2} position={[-0.1, -1, -5]} scale={10} />
          </group>
        </Environment>
        <AccumulativeShadows frames={100} color={config.shadow} colorBlend={5} toneMapped={true} alphaTest={0.8} opacity={0.8} scale={30} position={[0, 0, 0]}>
          <RandomizedLight amount={4} radius={15} ambient={0.5} intensity={1} position={[0, 10, -10]} size={15} mapSize={1024} bias={0.0001} />
        </AccumulativeShadows>
      </Canvas>
      </div>
      <div ref={overlay} className={styles.overlay}></div>
      <div className={clsx(stageClass, styles.pageIndicator)}>
        <div className={styles.pageIndicatorProgress} style={{width: `${stage*20}%`}}></div>
      </div>
    </>
  )
}

const StageOne = ({ config, setStage }) => {
  const { camera } = useThree()
  const { nodes } = useGLTF("models/improbable.glb");
  const [hovered, setHover] = useState(false)
  const [clicked, setClicked] = useState(false)
  const material = useRef()
  const materialPoperties = config;
  const iorLimits = [0.6, 0]
  useCursor(hovered)

  useEffect(() => {
    gsap.to(material.current, {
      ior: hovered || clicked ? iorLimits[0] : iorLimits[1],
      duration: 1,
      ease: "power3.out",
    });

    if (clicked) {
      gsap.to(camera, {
        zoom: 2200,
        duration: 1,
        ease: "power4.in",
        onUpdate: function() {
          camera.updateProjectionMatrix();
        },
        onComplete: function() {
          setStage(2)
        }
      });
    }
  }, [hovered, clicked]);

  return (
    <>
      <color attach="background" args={['#f2f2f5']} />
      <Grid />

      <Html position={[-6, 0, -6]} className={styles.cell} distanceFactor={0.014}>
        <h1 className={`${styles.heading} ${styles.alignRight} ${styles.alignBottom}`}><Heading>I'm Ready for the <span className={styles.emph}>Metaverse</span></Heading></h1>
      </Html>

      <Html position={[3, 0, 0]} className={styles.doubleCell} distanceFactor={0.014}>
        <p>Welcome! I'm <span className={styles.emph}>Daria Yudina</span>, a Technical Art Generalist with a passion for virtual worlds and an extensive background in web development, visual design, and 3D artistry.</p>
        <div className={styles.arrowLeft} onClick={() => setClicked(true)}><span>let's dive deeper</span></div>
      </Html>

      <group position={[0,0.3,0]} scale={[3, 3, 3]} dispose={null}>
        <Center>
          <mesh
            castShadow
            geometry={nodes.Cylinder.geometry}
            onPointerOver={() => setHover(true)}
            onPointerLeave={() => setHover(false)}
            onClick={() => setClicked(true)}
            >
              <MeshTransmissionMaterial ref={material} {...materialPoperties} />
          </mesh>
        </Center>
      </group>

    </>
  )
}

const StageTwo = ({ config, setStage, stage }) => {
  const { camera, viewport, scene } = useThree()

  camera.zoom = config.zoom;
  camera.updateProjectionMatrix();

  const materialPoperties = config;
  materialPoperties.ior = 0.5;
  materialPoperties.color = new THREE.Color('#46e3cb')

  useEffect(() => {
    const scrollElement = document.getElementsByTagName('canvas')[0].nextSibling
    if (stage === 3) {
      scrollElement.scrollTo({ top: 2000, left: 0, behavior: 'smooth' })
    }
    if (stage === 2) {
      scrollElement.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    }
  })

  return (
    <ScrollControls pages={2}>
      <color attach="background" args={['#000']} />
      <ScrollableGroups materialPoperties={materialPoperties}/>

      <Html position={[-9, 0, -3]} className={styles.trippleCell}>
        <h2 className={`${styles.heading} ${styles.alignBottom}`}><Heading>Born in the Digital Realm</Heading></h2>
      </Html>
      <Html position={[-9, 0, 0]} className={styles.trippleCell} >
        <p  style={{marginTop: 16}}>I discovered my passion for digital worlds at an early age, a passion that led me to a career in web development and visual design. Today, I use my skills to create immersive experiences, believing that these worlds can provide us with a sense of fulfillment and endless opportunities for creativity.</p>
        <div className={styles.row}>
          <div className={`${styles.arrowLeft} ${styles.inactive}`} onClick={() => setStage(1)}><span>Back</span></div>
          <div className={styles.arrowRight} onClick={() => setStage(3)}><span>Next</span></div>
        </div>
      </Html>
      <Html position={[-1, 0, 20]} className={styles.trippleCell}>
        <h2 className={`${styles.heading} ${styles.alignBottom} ${styles.alignRight}`}>Skills and Expertise to Navigate the Metaverse</h2>
      </Html>
      <Html position={[-1, 0, 24]} className={styles.trippleCell}>
        <p style={{marginTop: 16}} className={`${styles.alignRight}`}>Throughout my career, I've honed a diverse set of skills, from JavaScript to Unreal Engine, to bring my visions to life. I specialize in optimizing 2D & 3D assets, implementing them into game engines, and designing unique user interfaces.</p>
        <div className={styles.row} >
          <div className={`${styles.arrowLeft} ${styles.inactive}`} style={{marginLeft: 'auto'}} onClick={() => setStage(2)}><span>Back</span></div>
          <div className={styles.arrowRight} onClick={() => setStage(4)}><span>Next</span></div>
        </div>
      </Html>
    </ScrollControls>
  )
}

const ScrollableGroups = ({materialPoperties}) => {
  const { viewport } = useThree()

  const floatProps = {
    speed: 1,
    rotationIntensity: 3,
    floatingRange: [1, 1],
  }
  const floatingGroup = useRef()
  const imagesGroup = useRef()
  const scroll = useScroll()

  useFrame(() => {
    floatingGroup.current.children.forEach((child, index) => {
      child.position.z = scroll.scroll.current * 4 * (index+2) * (index % 2 - 0.5)
      child.position.x = scroll.scroll.current * 4 / (index+1) * (index % 2 - 0.5)
    })

    imagesGroup.current.children.forEach((child, index) => {
      child.material.opacity = scroll.scroll.current * 1.1
      child.position.z = scroll.scroll.current * (index % 2 - 1) * -1
    })
  })

  return (
    <>
      <group position={[0,0,0]} ref={floatingGroup}>
        <Float {...floatProps} floatIntensity={Math.random() * 2}>
          <mesh scale={3} position={[3, -3, -2]}>
            <dodecahedronGeometry args={[0.5, 0]} />
            <MeshTransmissionMaterial {...materialPoperties} />
          </mesh>
        </Float>
        <Float {...floatProps} floatIntensity={Math.random() * 2}>
          <mesh scale={1} position={[4, -3, -3]}>
            <octahedronGeometry args={[0.3, 0]} />
            <MeshTransmissionMaterial {...materialPoperties} />
          </mesh>
        </Float>
        <Float {...floatProps} floatIntensity={Math.random() * 2}>
          <mesh scale={1.5} position={[7, -3, 1]}>
            <octahedronGeometry args={[0.3, 0]} />
            <MeshTransmissionMaterial {...materialPoperties} />
          </mesh>
        </Float>
        <Float {...floatProps} floatIntensity={Math.random() * 2}>
          <mesh scale={1.2} position={[0, -3, -3]}>
            <octahedronGeometry args={[0.3, 0]} />
            <MeshTransmissionMaterial {...materialPoperties} />
          </mesh>
        </Float>
        <Float {...floatProps} floatIntensity={Math.random() * 2}>
          <mesh scale={2} position={[5, -3, -1]}>
            <torusGeometry args={[1.2, 0.2, 8, 24]} />
            <MeshTransmissionMaterial {...materialPoperties} />
          </mesh>
        </Float>
      </group>

      <group ref={imagesGroup}>
        <Image url="improbable/bug.png" rotation={[Math.PI/-2, 0, 0]} scale={8}  position={[-4, -5, viewport.height/2]} transparent={true} opacity={0}/>
        <Image url="improbable/vscode.png" rotation={[Math.PI/-3, 0, 1]} scale={10} position={[-8, -8, viewport.height/-2 + 3]} transparent={true} opacity={0}/>
      </group>
    </>
  )
}

const Grid = ({ number = 23, lineWidth = 0.026, height = 0.5 }) => (
  // Renders a grid and crosses as instances
  <Instances position={[0, 0, 0]} scale={3}>
    <planeGeometry args={[lineWidth, height]} />
    <meshBasicMaterial color="#ff9999" />
    <gridHelper args={[100, 100, '#999', '#999']} position={[0, -0.01, 0]} />
  </Instances>
)

function StageFour({ config, setStage }) {
  const { nodes } = useGLTF("models/improbable.glb");
  const { camera, mouse } = useThree()
  const material = useRef()
  const background = useRef()
  const materialPoperties = config;
  materialPoperties.ior = 0

  camera.zoom = config.zoom;
  camera.updateProjectionMatrix();

  useFrame(() => {
    gsap.to(material.current, {
      ior: 0.6,
      duration: 5,
      ease: "power3.out",
      delay: 0.5
    });
    gsap.to(background.current.rotation, {
      x: mouse.y > 0 ? -0.8 : -1,
      duration: 1,
      ease: "linear"
    });
  })

  return (
    <group dispose={null}>
      <Html position={[-6.7, 0, -6.2]} className={styles.cell}>
        <h1 className={`${styles.heading} ${styles.alignRight} ${styles.alignBottom}`}>Why Improbable?</h1>
      </Html>

      <Html position={[3, 0, -3.4]} className={styles.doubleCell}>
        <h3 className={`${styles.heading} ${styles.alignBottom}`}><Heading>An Alignment of Visions</Heading></h3>
      </Html>
      <Html position={[3, 0, -0.4]} className={styles.doubleCell}>
        <p>Improbable's commitment to developing deeply immersive, interconnected virtual worlds resonates with my own beliefs. Your pioneering work in the field, specifically the Morpheus technology, inspires me, and I'm excited to potentially contribute to your efforts.</p>
        <div className={styles.row} >
          <div className={`${styles.arrowLeft} ${styles.inactive}`} onClick={() => setStage(3)}><span>Back</span></div>
          <div className={styles.arrowRight} onClick={() => setStage(5)}><span>Next</span></div>
        </div>
      </Html>
      <Center>
        <mesh
          scale={3}
          castShadow
          geometry={nodes.Cylinder.geometry}
          >
            <meshBasicMaterial color={'white'} />
        </mesh>
        <mesh scale={40} rotation={[Math.PI/-3,0,0]} position={[0, -3, 0]} ref={background}>
          <planeGeometry />
          <MeshTransmissionMaterial {...config} ref={material} />
        </mesh>
        <AccumulativeShadows frames={100} color={config.shadow} colorBlend={5} toneMapped={true} alphaTest={0.8} opacity={0.8} scale={30} position={[0, 0, 0]}>
          <RandomizedLight amount={4} radius={15} ambient={0.5} intensity={1} position={[0, 10, -10]} size={15} mapSize={1024} bias={0.0001} />
        </AccumulativeShadows>
      </Center>
    </group>
  );
}


const StageFive = ({ config, setStage, stage }) => {
  const { camera } = useThree()
  camera.zoom = config.zoom;
  camera.updateProjectionMatrix();

  return (
    <>
      <color attach="background" args={['#000']} />

      <Html position={[-9, 0, -4]} className={styles.trippleCell}>
        <h2 className={`${styles.heading} ${styles.alignBottom}`}><Heading>Thank you</Heading></h2>
      </Html>
      <Html position={[-9, 0, -1]} className={styles.trippleCell}>
        <p  style={{marginTop: 16}}>Let me thank you for the opportunity to be considered as a candidate for Improbable. I invite you to reach out to me. Let's explore how we can build unforgettable experiences together.</p>
        <div className={styles.row}>
          <div className={`${styles.arrowLeft} ${styles.inactive}`} style={{marginRight: 24}} onClick={() => setStage(4)}><span>Back</span></div>
          <a target='_blank' href="https://www.linkedin.com/in/sammael1106/" className={styles.socialLink}>
            <img src="improbable/linkedin-boerder-svgrepo-com.svg" width={32} height={32}/>
          </a>
          <a target='_blank' href="https://www.behance.net/sammael1106" className={styles.socialLink}>
            <img src="improbable/behance-svgrepo-com.svg" width={32} height={32}/>
          </a>
          <a target='_blank' href="https://www.instagram.com/sammael_art/" className={styles.socialLink}>
            <img src="improbable/instagram-svgrepo-com.svg" width={32} height={32}/>
          </a>
          <a target='_blank' href="https://twitter.com/sammael_art" className={styles.socialLink}>
            <img src="improbable/twitter-svgrepo-com.svg" width={32} height={32}/>
          </a>
        </div>
      </Html>

    </>
  )
}



function Heading ({ children }) {
  let chars = []
  if (typeof(children) === 'object') {
    children.map((child) => {
      if (typeof(child) === 'string') child.split('').map(chr => chars.push(chr))
      if (typeof(child) === 'object') {
        child.props.children.split('').map(chr => chars.push(<span className={child.props.className}>{chr}</span>))
      }
    })
  } else {
    chars = children.split('')
  }
  const element = useRef()
  useEffect(() => {
    gsap.to(element.current.childNodes, {
      opacity: 1,
      stagger: 0.05,
      delay: 0.2,
      duration: 0.1,
      ease: "linear"
    });
  })

  return <span className={styles.chars} ref={element}>
    {chars.map((char, i) => <span className={styles.char} key={i}>{char}</span>)}
  </span>
}

useGLTF.preload("models/improbable.glb");