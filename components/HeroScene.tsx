"use client";

/**
 * HeroScene: the interactive WebGL part of the hero.
 *
 *  - Five real extruded 3D words (three.js TextGeometry via drei <Text3D>) are placed along the Z axis.
 *  - The camera flies through them. Its position comes from the scroll timeline in lib/heroTimeline.ts,
 *    which GSAP ScrollTrigger scrubs (see HeroSection.tsx).
 *  - Each word rotates, scales and fades as a function of its distance from the camera.
 *  - Mouse movement adds parallax to the camera and a gentle tilt to the focused word.
 *  - Floating geometry, tunnel rings and particles give depth cues.
 */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Center, Text3D, useFont } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { HERO_WORDS, type HeroWord } from "@/lib/data";
import { WORD_COUNT, cameraS, clamp, smoothstep } from "@/lib/heroTimeline";

const FONT = "/fonts/helvetiker_bold.typeface.json";
useFont.preload(FONT);

const GAP = 15; // distance between words along Z
const FOCUS = 9; // camera distance from a word while it is being read
const LINE_H = 1.32;
const SIDE_COLORS = ["#ED3038", "#b81d25", "#a99f00", "#ED3038", "#ED3038"];

type Ref<T> = React.MutableRefObject<T>;
interface Shared {
  progress: Ref<number>;
  pointer: Ref<{ x: number; y: number }>;
  s: Ref<number>;
}

/* ------------------------------ camera + lights ----------------------------- */
function Rig({ shared }: { shared: Shared }) {
  const { camera } = useThree();
  const lights = useRef<THREE.Group>(null!);
  const smooth = useRef({ x: 0, y: 0 });
  const sun = useRef<THREE.DirectionalLight>(null!);

  // A directional light aims at its *target*, which lives at world origin by default.
  // Parent the target to the rig so the key light keeps shining toward the words as the camera travels.
  useEffect(() => {
    const light = sun.current;
    const rig = lights.current;
    light.target.position.set(0, 0, -10);
    rig.add(light.target);
    return () => {
      rig.remove(light.target);
    };
  }, []);

  useFrame(() => {
    const s = cameraS(shared.progress.current);
    shared.s.current = s;
    const camZ = FOCUS - s * GAP;

    const k = smooth.current;
    k.x += (shared.pointer.current.x - k.x) * 0.06;
    k.y += (shared.pointer.current.y - k.y) * 0.06;

    camera.position.set(k.x * 0.9, k.y * 0.55 + Math.sin(s * 1.7) * 0.18, camZ);
    camera.lookAt(k.x * 0.3, k.y * 0.2, camZ - 10);
    camera.rotateZ(Math.sin(s * 1.25) * 0.035 - k.x * 0.015); // cinematic roll

    lights.current.position.z = camZ;
  });

  return (
    <group ref={lights}>
      <ambientLight intensity={0.65} />
      <hemisphereLight args={["#ffffff", "#303030", 0.6]} />
      <directionalLight ref={sun} position={[4, 6, 8]} intensity={2.2} />
      <pointLight position={[-7, -2, 3]} intensity={90} distance={40} color="#ED3038" />
      <pointLight position={[7, 3, 5]} intensity={90} distance={40} color="#FFF000" />
    </group>
  );
}

/* ----------------------------------- words ---------------------------------- */
function WordBlock({ word, index, compact, shared }: { word: HeroWord; index: number; compact: boolean; shared: Shared }) {
  const group = useRef<THREE.Group>(null!);
  const lineGroups = useRef<(THREE.Group | null)[]>([]);
  const mats = useRef<THREE.MeshStandardMaterial[]>([]);
  const lines = compact ? word.compact : word.lines;
  const widths = useRef<number[]>(lines.map(() => 0));
  const { camera, size } = useThree();
  const dir = index % 2 === 0 ? 1 : -1;

  useFrame(() => {
    const g = group.current;
    if (!g) return;
    const d = shared.s.current - index; // <0: still ahead of the camera, >0: already passed

    const vis = d < 0 ? 1 - smoothstep(0.18, 1.0, -d) : 1 - smoothstep(0.04, 0.5, d);
    const measured = widths.current.every((w) => w > 0);
    g.visible = vis > 0.01 && measured;
    if (!g.visible) return;

    // Fit the block to the viewport at the focus distance
    const fov = (camera as THREE.PerspectiveCamera).fov;
    const visH = 2 * Math.tan(THREE.MathUtils.degToRad(fov / 2)) * FOCUS;
    const visW = visH * (size.width / size.height);
    const maxW = Math.max(...widths.current);
    const fit = Math.min((visW * (compact ? 0.72 : 0.76)) / maxW, (visH * 0.6) / (lines.length * LINE_H));

    const focus = 1 - clamp(Math.abs(d) * 2.2);
    const px = shared.pointer.current.x;
    const py = shared.pointer.current.y;

    g.position.set(0, 0, -index * GAP);
    g.rotation.set(d * 0.42 - py * 0.16 * focus, dir * -d * 1.15 + px * 0.24 * focus, -dir * d * 0.2);
    g.scale.setScalar(fit * (1 + Math.max(d, 0) * 0.9));

    lineGroups.current.forEach((lg, li) => {
      if (!lg) return;
      const side = li % 2 === 0 ? -1 : 1;
      lg.position.x = side * d * 2.2; // lines slide apart in opposite directions
      lg.rotation.y = side * d * 0.32;
    });
    mats.current.forEach((m) => m && (m.opacity = vis));
  });

  return (
    <group ref={group} visible={false}>
      {lines.map((line, li) => (
        <group key={li + line} ref={(el) => {
            lineGroups.current[li] = el;
          }} position={[0, ((lines.length - 1) / 2 - li) * LINE_H, 0]}>
          <Center
            onCentered={({ width }) => {
              widths.current[li] = width;
            }}
          >
            <Text3D font={FONT} size={1} height={0.42} curveSegments={5} bevelEnabled bevelThickness={0.03} bevelSize={0.022} bevelSegments={2} letterSpacing={0.035}>
              {line}
              <meshStandardMaterial
                attach="material-0"
                ref={(m: THREE.MeshStandardMaterial | null) => {
                  if (m) mats.current[li * 2] = m;
                }}
                color={word.color}
                emissive={word.color}
                emissiveIntensity={0.14}
                roughness={0.38}
                metalness={0.25}
                transparent
              />
              <meshStandardMaterial
                attach="material-1"
                ref={(m: THREE.MeshStandardMaterial | null) => {
                  if (m) mats.current[li * 2 + 1] = m;
                }}
                color={SIDE_COLORS[index]}
                emissive={SIDE_COLORS[index]}
                emissiveIntensity={0.25}
                roughness={0.5}
                metalness={0.3}
                transparent
              />
            </Text3D>
          </Center>
        </group>
      ))}
    </group>
  );
}

/* ------------------------- floating geometry + depth cues ------------------- */
function mulberry(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SHAPES = ["ico", "oct", "torus", "knot", "box", "cone"] as const;

function Floaters({ count, shared }: { count: number; shared: Shared }) {
  const items = useMemo(() => {
    const rnd = mulberry(7);
    const depth = WORD_COUNT * GAP + 14;
    return Array.from({ length: count }, (_, i) => {
      const a = rnd() * Math.PI * 2;
      const r = 4.6 + rnd() * 5.5;
      return {
        shape: SHAPES[i % SHAPES.length],
        pos: [Math.cos(a) * r * 1.25, Math.sin(a) * r * 0.75, 6 - rnd() * depth] as [number, number, number],
        scale: 0.55 + rnd() * 0.9,
        spin: [0.2 + rnd() * 0.5, 0.2 + rnd() * 0.5] as [number, number],
        phase: rnd() * 6.28,
        mat: i % 3, // 0 red, 1 yellow, 2 wire
      };
    });
  }, [count]);

  const refs = useRef<(THREE.Mesh | null)[]>([]);
  const mats = useMemo(
    () => [
      new THREE.MeshStandardMaterial({ color: "#ED3038", roughness: 0.35, metalness: 0.4, emissive: "#ED3038", emissiveIntensity: 0.15 }),
      new THREE.MeshStandardMaterial({ color: "#FFF000", roughness: 0.35, metalness: 0.4, emissive: "#FFF000", emissiveIntensity: 0.12 }),
      new THREE.MeshBasicMaterial({ color: "#ffffff", wireframe: true, transparent: true, opacity: 0.4 }),
    ],
    [],
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const s = shared.s.current;
    refs.current.forEach((m, i) => {
      if (!m) return;
      const it = items[i];
      m.rotation.x = t * it.spin[0] + s * 1.4 + it.phase;
      m.rotation.y = t * it.spin[1] - s * 0.9;
      m.position.y = it.pos[1] + Math.sin(t * 0.8 + it.phase) * 0.35;
    });
  });

  return (
    <>
      {items.map((it, i) => (
        <mesh key={i} ref={(el) => {
            refs.current[i] = el;
          }} position={it.pos} scale={it.scale} material={mats[it.mat]}>
          {it.shape === "ico" && <icosahedronGeometry args={[1, 0]} />}
          {it.shape === "oct" && <octahedronGeometry args={[1, 0]} />}
          {it.shape === "torus" && <torusGeometry args={[0.9, 0.28, 12, 32]} />}
          {it.shape === "knot" && <torusKnotGeometry args={[0.7, 0.2, 80, 10]} />}
          {it.shape === "box" && <boxGeometry args={[1.3, 1.3, 1.3]} />}
          {it.shape === "cone" && <coneGeometry args={[0.9, 1.6, 5]} />}
        </mesh>
      ))}
    </>
  );
}

function Tunnel() {
  const rings = useRef<(THREE.Mesh | null)[]>([]);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    rings.current.forEach((r, i) => r && (r.rotation.z = t * 0.06 * (i % 2 ? 1 : -1)));
  });
  return (
    <>
      {Array.from({ length: WORD_COUNT + 1 }, (_, i) => (
        <mesh key={i} ref={(el) => {
            rings.current[i] = el;
          }} position={[0, 0, -i * GAP + GAP / 2]}>
          <torusGeometry args={[7.2, 0.025, 8, 96]} />
          <meshBasicMaterial color={i % 2 ? "#ED3038" : "#FFF000"} transparent opacity={0.5} />
        </mesh>
      ))}
    </>
  );
}

function Particles({ count }: { count: number }) {
  const geo = useMemo(() => {
    const rnd = mulberry(21);
    const arr = new Float32Array(count * 3);
    const depth = WORD_COUNT * GAP + 30;
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (rnd() - 0.5) * 30;
      arr[i * 3 + 1] = (rnd() - 0.5) * 18;
      arr[i * 3 + 2] = 14 - rnd() * depth;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    return g;
  }, [count]);
  return (
    <points geometry={geo}>
      <pointsMaterial color="#ffffff" size={0.07} sizeAttenuation transparent opacity={0.55} depthWrite={false} />
    </points>
  );
}

/* ----------------------------------- scene ---------------------------------- */
function Scene({ progress, pointer }: { progress: Ref<number>; pointer: Ref<{ x: number; y: number }> }) {
  const { size } = useThree();
  const shared = useRef<Shared>({ progress, pointer, s: { current: -1.15 } }).current;
  const compact = size.width / size.height < 0.9;
  const small = size.width < 768;

  return (
    <>
      <fog attach="fog" args={["#242424", 14, 58]} />
      <Rig shared={shared} />
      <Floaters count={small ? 9 : 18} shared={shared} />
      <Tunnel />
      <Particles count={small ? 260 : 700} />
      <Suspense fallback={null}>
        {HERO_WORDS.map((w, i) => (
          <WordBlock key={`${i}-${compact}`} word={w} index={i} compact={compact} shared={shared} />
        ))}
      </Suspense>
    </>
  );
}

export default function HeroScene({
  progress,
  pointer,
  active,
  onReady,
}: {
  progress: Ref<number>;
  pointer: Ref<{ x: number; y: number }>;
  active: boolean;
  onReady?: () => void;
}) {
  return (
    <Canvas
      flat
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.75]}
      camera={{ fov: 50, near: 0.1, far: 120, position: [0, 0, FOCUS + 1.15 * GAP] }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={() => onReady?.()}
      aria-hidden="true"
    >
      <Scene progress={progress} pointer={pointer} />
    </Canvas>
  );
}
