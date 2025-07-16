'use client'

import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Sphere, Line, Text, Float, MeshDistortMaterial } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing'
import * as THREE from 'three'
import { useSpring, animated } from '@react-spring/three'

interface Props {
  complexity: 'low' | 'medium' | 'high'
  interactive: boolean
}

// Represents phase spaces in the universal field
function PhaseSpace({ position, color, label, scale = 1 }: any) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  
  const { scale: animScale } = useSpring({
    scale: hovered ? scale * 1.2 : scale,
    config: { tension: 300, friction: 20 }
  })

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <animated.mesh
        ref={meshRef}
        position={position}
        scale={animScale}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[1, 32, 32]} />
        <MeshDistortMaterial
          color={color}
          transparent
          opacity={0.7}
          roughness={0.2}
          metalness={0.8}
          distort={0.3}
          speed={2}
        />
      </animated.mesh>
      {hovered && (
        <Text
          position={[position[0], position[1] + 2, position[2]]}
          fontSize={0.5}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {label}
        </Text>
      )}
    </Float>
  )
}

// Represents connections between phase spaces
function Connection({ start, end, strength }: any) {
  const points = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(...start),
      new THREE.Vector3(
        (start[0] + end[0]) / 2,
        (start[1] + end[1]) / 2 + Math.sin(strength * Math.PI) * 2,
        (start[2] + end[2]) / 2
      ),
      new THREE.Vector3(...end)
    ])
    return curve.getPoints(50)
  }, [start, end, strength])

  return (
    <Line
      points={points}
      color={`hsl(${strength * 360}, 70%, 50%)`}
      lineWidth={strength * 3}
      transparent
      opacity={0.6}
    />
  )
}

// Central terminal object representing unity
function TerminalObject() {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.1
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.15
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.2
    }
  })

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <dodecahedronGeometry args={[0.5, 0]} />
      <meshStandardMaterial
        color="#FFD700"
        emissive="#FFD700"
        emissiveIntensity={0.5}
        roughness={0.2}
        metalness={0.8}
      />
    </mesh>
  )
}

// Particle field representing the universal substrate
function ParticleField({ count }: { count: number }) {
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20
      
      colors[i * 3] = Math.random() * 0.5 + 0.5
      colors[i * 3 + 1] = Math.random() * 0.5 + 0.5
      colors[i * 3 + 2] = Math.random() * 0.5 + 0.5
    }
    
    return { positions, colors }
  }, [count])

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.positions.length / 3}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particles.colors.length / 3}
          array={particles.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} vertexColors transparent opacity={0.6} />
    </points>
  )
}

function Scene({ complexity, interactive }: Props) {
  const particleCount = complexity === 'low' ? 500 : complexity === 'medium' ? 1000 : 2000
  
  const phaseSpaces = [
    { position: [-3, 0, 0], color: '#4F46E5', label: 'Physical Reality' },
    { position: [3, 0, 0], color: '#7C3AED', label: 'Consciousness' },
    { position: [0, 3, 0], color: '#EC4899', label: 'Quantum Realm' },
    { position: [0, -3, 0], color: '#10B981', label: 'Information' },
    { position: [2, 2, 2], color: '#F59E0B', label: 'Emergence' },
    { position: [-2, -2, -2], color: '#EF4444', label: 'Entropy' }
  ]

  const connections = [
    { start: [-3, 0, 0], end: [3, 0, 0], strength: 0.8 },
    { start: [0, 3, 0], end: [0, -3, 0], strength: 0.6 },
    { start: [2, 2, 2], end: [-2, -2, -2], strength: 0.4 },
    { start: [-3, 0, 0], end: [0, 3, 0], strength: 0.7 },
    { start: [3, 0, 0], end: [0, -3, 0], strength: 0.5 }
  ]

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      
      {/* Background particle field */}
      <ParticleField count={particleCount} />
      
      {/* Central unity */}
      <TerminalObject />
      
      {/* Phase spaces */}
      {phaseSpaces.map((space, i) => (
        <PhaseSpace key={i} {...space} />
      ))}
      
      {/* Connections */}
      {complexity !== 'low' && connections.map((conn, i) => (
        <Connection key={i} {...conn} />
      ))}
      
      {/* Interactive controls */}
      {interactive && <OrbitControls enableZoom={true} enablePan={false} />}
      
      {/* Post-processing effects */}
      {complexity === 'high' && (
        <EffectComposer>
          <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.9} height={300} />
          <ChromaticAberration offset={[0.001, 0.001]} />
        </EffectComposer>
      )}
    </>
  )
}

export default function UniversalFieldVisualization({ complexity, interactive }: Props) {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={['#000011']} />
        <fog attach="fog" args={['#000011', 5, 25]} />
        <Scene complexity={complexity} interactive={interactive} />
      </Canvas>
    </div>
  )
}