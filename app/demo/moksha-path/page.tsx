'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
    OrbitControls, 
    PerspectiveCamera, 
    Sparkles, 
    ScrollControls, 
    Scroll, 
    useScroll, 
    MeshDistortMaterial, 
    Float,
    RoundedBox
} from '@react-three/drei';
import * as THREE from 'three';

// --- Stylized Human Walker (Pallbearer) ---
const Pallbearer = ({ position, side }: { position: [number, number, number], side: 'left' | 'right' }) => {
    const group = useRef<THREE.Group>(null);
    const leftLeg = useRef<THREE.Mesh>(null);
    const rightLeg = useRef<THREE.Mesh>(null);
    const head = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (group.current) {
            const time = state.clock.elapsedTime * 6;
            // Walk cycle
            if (leftLeg.current) leftLeg.current.rotation.x = Math.sin(time) * 0.4;
            if (rightLeg.current) rightLeg.current.rotation.x = Math.cos(time) * 0.4;
            // Subtle head bobbing
            if (head.current) head.current.position.y = 1.6 + Math.sin(time * 0.5) * 0.05;
            // Body sway
            group.current.rotation.z = Math.sin(time * 0.3) * 0.02;
        }
    });

    return (
        <group ref={group} position={position}>
            {/* Body (Kurta style) */}
            <mesh position={[0, 1.1, 0]}>
                <boxGeometry args={[0.5, 1, 0.3]} />
                <meshStandardMaterial color="#ffffff" />
            </mesh>
            {/* Head */}
            <mesh ref={head} position={[0, 1.7, 0]}>
                <sphereGeometry args={[0.18, 16, 16]} />
                <meshStandardMaterial color="#d2b48c" />
            </mesh>
            {/* Shoulders / Support for pole */}
            <mesh position={[side === 'left' ? 0.3 : -0.3, 1.4, 0]}>
                <boxGeometry args={[0.6, 0.1, 0.1]} />
                <meshStandardMaterial color="#ffffff" />
            </mesh>
            {/* Legs */}
            <mesh ref={leftLeg} position={[-0.15, 0.3, 0]}>
                <boxGeometry args={[0.15, 0.8, 0.15]} />
                <meshStandardMaterial color="#ffffff" />
            </mesh>
            <mesh ref={rightLeg} position={[0.15, 0.3, 0]}>
                <boxGeometry args={[0.15, 0.8, 0.15]} />
                <meshStandardMaterial color="#ffffff" />
            </mesh>
        </group>
    );
};

// --- Traditional Arthi with Carriers ---
const ArthiWithCarriers = ({ position }: { position: [number, number, number] }) => {
    const mainGroup = useRef<THREE.Group>(null);
    
    useFrame((state) => {
        if (mainGroup.current) {
            // Overall movement synced with camera
            mainGroup.current.position.z = position[2];
            // Subtle overall vibration
            mainGroup.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.05;
        }
    });

    return (
        <group ref={mainGroup} position={[0, 0, 0]}>
            {/* The Pallbearers (Kaandhis) - 4 People */}
            <Pallbearer position={[-1.2, 0, 1]} side="right" />
            <Pallbearer position={[1.2, 0, 1]} side="left" />
            <Pallbearer position={[-1.2, 0, -1]} side="right" />
            <Pallbearer position={[1.2, 0, -1]} side="left" />

            {/* The Arthi Structure */}
            <group position={[0, 1.4, 0]}>
                {/* Bamboo Poles */}
                <mesh position={[1, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.05, 0.05, 4.5]} />
                    <meshStandardMaterial color="#8d6e63" />
                </mesh>
                <mesh position={[-1, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.05, 0.05, 4.5]} />
                    <meshStandardMaterial color="#8d6e63" />
                </mesh>
                {/* Bed Planks */}
                {[...Array(6)].map((_, i) => (
                    <mesh key={i} position={[0, 0, (i - 2.5) * 0.6]}>
                        <boxGeometry args={[2, 0.05, 0.2]} />
                        <meshStandardMaterial color="#5d4037" />
                    </mesh>
                ))}
                
                {/* The Individual (Saffron Shroud) */}
                <mesh position={[0, 0.2, 0]}>
                    <capsuleGeometry args={[0.3, 1.8, 8, 16]} />
                    <meshStandardMaterial color="#ff9800" emissive="#ff5722" emissiveIntensity={0.2} />
                </mesh>
                <Sparkles count={150} scale={3} size={4} speed={0.5} color="#ffd700" />
            </group>
            
            <pointLight position={[0, 2, 0]} intensity={10} color="#ff9933" distance={15} />
        </group>
    );
};

// --- Architectural Pillars ---
const HeritagePillar = ({ position }: { position: [number, number, number] }) => (
    <group position={position}>
        <mesh position={[0, 4, 0]}>
            <cylinderGeometry args={[0.5, 0.6, 8, 8]} />
            <meshStandardMaterial color="#2d1a10" roughness={0.3} />
        </mesh>
        <mesh position={[0, 8.2, 0]}>
            <coneGeometry args={[0.6, 1.2, 4]} />
            <meshStandardMaterial color="#ff9933" emissive="#ff3300" emissiveIntensity={2} />
        </mesh>
    </group>
);

// --- Fire Pyre (Sacred Agni) ---
const EternalAgni = ({ position, activate, progress }: { position: [number, number, number], activate: boolean, progress: number }) => {
    const fire = useRef<THREE.Group>(null);
    useFrame((state) => {
        if (fire.current && activate) {
            // Scale increases as we scroll through the cremation phase
            const phaseScale = 1.0 + progress * 0.8;
            fire.current.scale.y = phaseScale + Math.sin(state.clock.elapsedTime * 20) * 0.3;
            fire.current.rotation.y += 0.05;
        }
    });

    if (!activate) return null;

    return (
        <group position={position} ref={fire}>
            {/* Wooden Base of the Pyre */}
            <mesh position={[0, -0.2, 0]}>
                <boxGeometry args={[5, 0.8, 4]} />
                <meshStandardMaterial color="#1a120b" />
            </mesh>
            {/* The Main Sacred Fire */}
            <mesh position={[0, 2, 0]}>
                <coneGeometry args={[2.5, 6, 32]} />
                <MeshDistortMaterial 
                    color="#ff3d00" 
                    speed={10} 
                    distort={0.8} 
                    emissive="#ffca28" 
                    emissiveIntensity={3 + progress * 10} 
                />
            </mesh>
            {/* High Intensity Ritual Light */}
            <pointLight intensity={100 + progress * 400} color="#ff8f00" distance={80} />
            {/* Embers and Smoke Aura */}
            <Sparkles count={500} scale={12} size={6} speed={4} color="#ffab00" />
        </group>
    );
};

// --- Scene Logic ---
const MokshaJourney = () => {
    const scroll = useScroll();
    const [phase, setPhase] = useState('path');
    const [z, setZ] = useState(0);
    const [fireProgress, setFireProgress] = useState(0);

    useFrame((state) => {
        const offset = scroll.offset;
        
        // Progress: 0 to 0.6 = Path, 0.6 to 0.9 = Pyre, 0.9 to 1.0 = Ganga
        let currentZ = -offset * 180;
        
        // Lock Arthi on Pyre during cremation phase
        if (offset > 0.72 && offset < 0.92) {
            currentZ = -140; // Pin to pyre position
            setFireProgress((offset - 0.72) / 0.2); // 0 to 1
            setPhase('cremation');
        } else if (offset >= 0.92) {
            currentZ = -140 - (offset - 0.92) * 50; // Move into Ganga
            setPhase('ganga');
        } else {
            setPhase('path');
            setFireProgress(0);
        }
        
        setZ(currentZ);

        // Smooth Drone following the carriers
        const camY = 12 + Math.sin(offset * Math.PI) * 5;
        state.camera.position.lerp(new THREE.Vector3(15, camY, currentZ + 25), 0.1);
        state.camera.lookAt(0, 3, currentZ);
    });

    return (
        <>
            <ambientLight intensity={1.5} />
            <directionalLight position={[20, 50, 20]} intensity={3} castShadow />
            <color attach="background" args={['#fff8f0']} />
            <fog attach="fog" args={['#fff8f0', 30, 250]} />

            {/* Sacred Ground */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -50]} receiveShadow>
                <planeGeometry args={[40, 500]} />
                <meshStandardMaterial color="#efead8" />
            </mesh>

            {/* Heritage Landmarks */}
            {[0, -40, -80, -120].map((pz, i) => (
                <group key={i}>
                    <HeritagePillar position={[-10, 0, pz]} />
                    <HeritagePillar position={[10, 0, pz]} />
                </group>
            ))}

            {/* Pavitra Ganga Surface */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, -220]}>
                <planeGeometry args={[700, 400]} />
                <meshStandardMaterial color="#006064" opacity={0.6} transparent metalness={0.9} />
            </mesh>

            <ArthiWithCarriers position={[0, 1.2, z]} />
            <EternalAgni position={[0, 0, -140]} activate={phase === 'cremation' || phase === 'ganga'} progress={fireProgress} />
            
            <Sparkles count={1000} scale={200} size={2} speed={0.4} color="#ffd700" />
        </>
    );
};

export default function MokshaPathWithHumans() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!mounted) return <div className="h-screen w-full bg-[#fdfaf5]" />;

    return (
        <div className="h-screen w-full bg-[#fdfaf5] relative overflow-hidden">
            {/* Cinematic HUD */}
            <div className="absolute inset-x-0 top-16 z-20 pointer-events-none flex flex-col items-center select-none">
                <div className="flex items-center gap-6 mb-6">
                    <div className="w-16 h-[2px] bg-red-900" />
                    <span className="text-red-950 font-black uppercase tracking-[0.8em] text-[10px]">Dharmik Animation Engine</span>
                    <div className="w-16 h-[2px] bg-red-900" />
                </div>
                <h1 className="text-navy-950 text-8xl font-black italic tracking-tighter uppercase leading-[0.7] drop-shadow-2xl text-center">
                    ANTIM <span className="text-orange-600">YATRA</span>
                </h1>
                <p className="mt-8 text-stone-500 font-bold text-[11px] tracking-[0.5em] uppercase">
                    Kaandh - The Final Honor of the Journey
                </p>
                <div className="mt-12 flex items-center gap-4 text-orange-950 font-black text-[10px] animate-bounce">
                    <span className="tracking-widest">SCROLL TO LEAD THE PALLBEARERS</span>
                </div>
            </div>

            {/* 3D Content Container */}
            <div className="absolute inset-0 z-10">
                <Canvas shadows dpr={[1, 2]} camera={{ position: [20, 20, 30], fov: 45 }}>
                    <ScrollControls pages={15} damping={0.25}>
                        <MokshaJourney />
                        <Scroll html>
                            <div className="w-screen select-none pointer-events-none uppercase">
                                <div className="h-[400vh] pl-20 flex flex-col justify-center">
                                    <h2 className="text-orange-950/[0.04] text-[15vw] font-black italic leading-none">Pariwar</h2>
                                </div>
                                <div className="h-[800vh] pr-20 flex flex-col justify-center items-end">
                                    <h2 className="text-red-950/[0.04] text-[15vw] font-black italic leading-none">Tyag</h2>
                                </div>
                            </div>
                        </Scroll>
                    </ScrollControls>
                    <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2.3} makeDefault />
                </Canvas>
            </div>

            {/* Bottom Status */}
            <div className="absolute bottom-16 inset-x-0 z-20 pointer-events-none flex justify-around px-40">
                <div className="flex flex-col items-center gap-2">
                    <span className="text-[12px] font-black text-navy-900">SACRED PATH</span>
                    <div className="w-2 h-2 rounded-full bg-orange-600 shadow-[0_0_10px_rgba(255,152,0,1)]" />
                </div>
                <div className="flex flex-col items-center gap-2">
                    <span className="text-[12px] font-black text-navy-900 opacity-20">FIRE RITE</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <span className="text-[12px] font-black text-navy-900 opacity-20">ETERNAL PEACE</span>
                </div>
            </div>
        </div>
    );
}
