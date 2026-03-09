import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import type * as THREE from "three";

/* ── floating particle field ── */
function ParticleField() {
  const meshRef = useRef<THREE.Points>(null);
  const count = 900;

  const [positions, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 28;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 18;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 14;
      sz[i] = Math.random() * 2.5 + 0.5;
    }
    return [pos, sz];
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    meshRef.current.rotation.y = t * 0.04;
    meshRef.current.rotation.x = Math.sin(t * 0.02) * 0.15;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#d4a832"
        transparent
        opacity={0.55}
        sizeAttenuation
      />
    </points>
  );
}

/* ── glowing ring ── */
function GlowRing({
  radius,
  color,
  speed,
  tiltX = 0,
  tiltZ = 0,
}: {
  radius: number;
  color: string;
  speed: number;
  tiltX?: number;
  tiltZ?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.z = clock.getElapsedTime() * speed;
  });
  return (
    <mesh ref={ref} rotation={[tiltX, 0, tiltZ]}>
      <torusGeometry args={[radius, 0.025, 16, 120]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1.8}
        transparent
        opacity={0.7}
      />
    </mesh>
  );
}

/* ── slowly rotating icosahedron ── */
function CenterOrb() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.x = t * 0.3;
    ref.current.rotation.y = t * 0.5;
    ref.current.scale.setScalar(1 + Math.sin(t * 1.2) * 0.06);
  });
  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[0.9, 1]} />
      <meshStandardMaterial
        color="#d4a832"
        emissive="#e0660a"
        emissiveIntensity={0.9}
        wireframe
        transparent
        opacity={0.85}
      />
    </mesh>
  );
}

/* ── floating shards ── */
function FloatingShard({
  pos,
  rotSpeed,
  color,
}: {
  pos: [number, number, number];
  rotSpeed: number;
  color: string;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.x = t * rotSpeed;
    ref.current.rotation.y = t * rotSpeed * 0.7;
    ref.current.position.y = pos[1] + Math.sin(t * 0.8 + pos[0]) * 0.3;
  });
  return (
    <mesh ref={ref} position={pos}>
      <tetrahedronGeometry args={[0.18, 0]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1.2}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}

/* ── camera drift ── */
function CameraDrift() {
  const { camera } = useThree();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    camera.position.x = Math.sin(t * 0.18) * 0.6;
    camera.position.y = Math.cos(t * 0.12) * 0.35;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

/* ── 3D Scene ── */
function Scene3D() {
  const shards: {
    id: string;
    pos: [number, number, number];
    speed: number;
    color: string;
  }[] = useMemo(
    () => [
      { id: "s1", pos: [-3.5, 1.2, -2], speed: 0.6, color: "#d4a832" },
      { id: "s2", pos: [3.2, -1.0, -1.5], speed: 0.45, color: "#e0660a" },
      { id: "s3", pos: [-2.0, -2.2, -3], speed: 0.8, color: "#cc3344" },
      { id: "s4", pos: [2.8, 2.0, -2.5], speed: 0.55, color: "#d4a832" },
      { id: "s5", pos: [0.5, 2.8, -1], speed: 0.7, color: "#e0660a" },
      { id: "s6", pos: [-3.8, -0.5, -2], speed: 0.5, color: "#cc3344" },
      { id: "s7", pos: [1.5, -2.8, -1.5], speed: 0.65, color: "#d4a832" },
      { id: "s8", pos: [-1.2, 3.0, -3], speed: 0.4, color: "#e0660a" },
    ],
    [],
  );

  return (
    <>
      <CameraDrift />
      <ambientLight intensity={0.15} />
      <pointLight position={[5, 5, 5]} intensity={1.5} color="#d4a832" />
      <pointLight position={[-5, -3, 3]} intensity={1.0} color="#e0660a" />
      <pointLight position={[0, 0, 6]} intensity={0.8} color="#cc3344" />

      <ParticleField />
      <CenterOrb />

      <GlowRing radius={2.2} color="#d4a832" speed={0.35} tiltX={Math.PI / 6} />
      <GlowRing
        radius={3.0}
        color="#e0660a"
        speed={-0.22}
        tiltX={Math.PI / 3}
        tiltZ={Math.PI / 8}
      />
      <GlowRing
        radius={1.5}
        color="#cc3344"
        speed={0.55}
        tiltX={-Math.PI / 4}
        tiltZ={Math.PI / 5}
      />

      {shards.map((s) => (
        <FloatingShard
          key={s.id}
          pos={s.pos}
          rotSpeed={s.speed}
          color={s.color}
        />
      ))}
    </>
  );
}

/* ── scanline overlay ── */
function ScanLines() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-10"
      style={{
        backgroundImage:
          "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)",
      }}
    />
  );
}

/* ── glitch text ── */
function GlitchTitle() {
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 150);
    }, 3200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative text-center mb-2 select-none">
      <h1
        className="font-display font-black uppercase tracking-[0.25em] text-3xl md:text-4xl"
        style={{
          color: "oklch(0.88 0.18 75)",
          textShadow: glitch
            ? "3px 0 #e0660a, -3px 0 #cc3344, 0 0 20px oklch(0.78 0.18 75)"
            : "0 0 24px oklch(0.78 0.18 75 / 0.9), 0 0 60px oklch(0.78 0.18 75 / 0.3)",
          transform: glitch ? "skewX(-4deg) translateX(3px)" : "none",
          transition: "transform 0.05s, text-shadow 0.05s",
        }}
      >
        RDX ESPORTS
      </h1>
      <p
        className="text-xs font-display uppercase tracking-[0.4em] mt-1"
        style={{ color: "oklch(0.65 0.12 75)" }}
      >
        Admin Access
      </p>
    </div>
  );
}

/* ── main export ── */
interface AdminLogin3DProps {
  onSuccess: () => void;
}

export function AdminLogin3D({ onSuccess }: AdminLogin3DProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    setTimeout(() => {
      if (username === "Bhuvi" && password === "1234") {
        setLoading(false);
        onSuccess();
      } else {
        setLoading(false);
        setError("Invalid credentials. Access denied.");
        setShake(true);
        setTimeout(() => setShake(false), 600);
        setPassword("");
      }
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* 3D canvas background */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0, 7], fov: 60 }}
          gl={{ antialias: true, alpha: false }}
          style={{ background: "oklch(0.06 0.01 270)" }}
        >
          <Scene3D />
        </Canvas>
      </div>

      <ScanLines />

      {/* vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 35%, oklch(0.05 0.01 270 / 0.85) 100%)",
        }}
      />

      {/* Login card */}
      <div className="absolute inset-0 z-20 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 22,
            delay: 0.3,
          }}
        >
          <motion.div
            animate={shake ? { x: [0, -12, 12, -8, 8, -4, 4, 0] } : { x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div
              className="w-full max-w-sm rounded-2xl p-8 relative"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.10 0.015 270 / 0.92), oklch(0.08 0.01 270 / 0.96))",
                border: "1px solid oklch(0.78 0.18 75 / 0.35)",
                boxShadow:
                  "0 0 60px oklch(0.78 0.18 75 / 0.12), 0 0 120px oklch(0.78 0.18 75 / 0.06), inset 0 1px 0 oklch(0.78 0.18 75 / 0.15)",
                backdropFilter: "blur(20px)",
              }}
            >
              {/* corner accents */}
              <div
                className="absolute top-0 left-0 w-6 h-6 rounded-tl-2xl"
                style={{
                  borderTop: "2px solid oklch(0.78 0.18 75 / 0.8)",
                  borderLeft: "2px solid oklch(0.78 0.18 75 / 0.8)",
                }}
              />
              <div
                className="absolute top-0 right-0 w-6 h-6 rounded-tr-2xl"
                style={{
                  borderTop: "2px solid oklch(0.78 0.18 75 / 0.8)",
                  borderRight: "2px solid oklch(0.78 0.18 75 / 0.8)",
                }}
              />
              <div
                className="absolute bottom-0 left-0 w-6 h-6 rounded-bl-2xl"
                style={{
                  borderBottom: "2px solid oklch(0.78 0.18 75 / 0.8)",
                  borderLeft: "2px solid oklch(0.78 0.18 75 / 0.8)",
                }}
              />
              <div
                className="absolute bottom-0 right-0 w-6 h-6 rounded-br-2xl"
                style={{
                  borderBottom: "2px solid oklch(0.78 0.18 75 / 0.8)",
                  borderRight: "2px solid oklch(0.78 0.18 75 / 0.8)",
                }}
              />

              {/* shield icon with pulse */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <motion.div
                    animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: "oklch(0.78 0.18 75 / 0.2)",
                      filter: "blur(8px)",
                    }}
                  />
                  <div
                    className="relative w-16 h-16 rounded-full flex items-center justify-center"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.78 0.18 75 / 0.2), oklch(0.78 0.18 75 / 0.05))",
                      border: "2px solid oklch(0.78 0.18 75 / 0.6)",
                    }}
                  >
                    <svg
                      className="w-8 h-8"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="oklch(0.88 0.18 75)"
                      strokeWidth="1.5"
                      role="img"
                      aria-label="Admin shield"
                    >
                      <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2Z" />
                      <path d="M9 12l2 2 4-4" />
                    </svg>
                  </div>
                </div>
              </div>

              <GlitchTitle />

              {/* divider */}
              <div className="relative my-6">
                <div
                  className="h-px w-full"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, oklch(0.78 0.18 75 / 0.4), transparent)",
                  }}
                />
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                {/* username */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="admin-username"
                    className="text-[10px] font-display uppercase tracking-[0.3em]"
                    style={{ color: "oklch(0.65 0.12 75)" }}
                  >
                    Username
                  </label>
                  <div className="relative">
                    <input
                      id="admin-username"
                      data-ocid="admin_login.username.input"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      autoComplete="off"
                      className="w-full px-4 py-3 rounded-lg text-sm font-display tracking-wider outline-none transition-all duration-200 placeholder:opacity-30"
                      style={{
                        background: "oklch(0.12 0.01 270)",
                        border: `1px solid ${username ? "oklch(0.78 0.18 75 / 0.5)" : "oklch(0.25 0.04 270)"}`,
                        color: "oklch(0.93 0.02 85)",
                        boxShadow: username
                          ? "0 0 12px oklch(0.78 0.18 75 / 0.15), inset 0 0 8px oklch(0.78 0.18 75 / 0.05)"
                          : "none",
                      }}
                      placeholder="Enter username"
                    />
                    <div
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full transition-all duration-300"
                      style={{
                        background: username
                          ? "oklch(0.78 0.18 75)"
                          : "oklch(0.35 0.04 270)",
                        boxShadow: username
                          ? "0 0 8px oklch(0.78 0.18 75)"
                          : "none",
                      }}
                    />
                  </div>
                </div>

                {/* password */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="admin-password"
                    className="text-[10px] font-display uppercase tracking-[0.3em]"
                    style={{ color: "oklch(0.65 0.12 75)" }}
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="admin-password"
                      data-ocid="admin_login.password.input"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      className="w-full px-4 py-3 rounded-lg text-sm font-display tracking-wider outline-none transition-all duration-200 placeholder:opacity-30"
                      style={{
                        background: "oklch(0.12 0.01 270)",
                        border: `1px solid ${password ? "oklch(0.78 0.18 75 / 0.5)" : "oklch(0.25 0.04 270)"}`,
                        color: "oklch(0.93 0.02 85)",
                        boxShadow: password
                          ? "0 0 12px oklch(0.78 0.18 75 / 0.15), inset 0 0 8px oklch(0.78 0.18 75 / 0.05)"
                          : "none",
                      }}
                      placeholder="Enter password"
                    />
                    <div
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full transition-all duration-300"
                      style={{
                        background: password
                          ? "oklch(0.78 0.18 75)"
                          : "oklch(0.35 0.04 270)",
                        boxShadow: password
                          ? "0 0 8px oklch(0.78 0.18 75)"
                          : "none",
                      }}
                    />
                  </div>
                </div>

                {/* error */}
                <AnimatePresence>
                  {error && (
                    <motion.p
                      data-ocid="admin_login.error_state"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-xs font-display uppercase tracking-widest text-center pt-1"
                      style={{ color: "oklch(0.65 0.22 27)" }}
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* submit */}
                <motion.button
                  data-ocid="admin_login.submit_button"
                  type="submit"
                  disabled={loading || !username || !password}
                  whileHover={!loading ? { scale: 1.02 } : {}}
                  whileTap={!loading ? { scale: 0.97 } : {}}
                  className="w-full py-3 rounded-lg font-display font-black uppercase tracking-[0.25em] text-sm relative overflow-hidden mt-2 transition-opacity"
                  style={{
                    background: loading
                      ? "oklch(0.22 0.04 270)"
                      : "linear-gradient(135deg, oklch(0.68 0.18 75), oklch(0.62 0.22 55))",
                    color: loading
                      ? "oklch(0.5 0.02 270)"
                      : "oklch(0.08 0.01 270)",
                    border: "1px solid oklch(0.78 0.18 75 / 0.4)",
                    boxShadow: loading
                      ? "none"
                      : "0 0 24px oklch(0.78 0.18 75 / 0.3), 0 4px 16px oklch(0.78 0.18 75 / 0.15)",
                    cursor:
                      loading || !username || !password
                        ? "not-allowed"
                        : "pointer",
                    opacity: !username || !password ? 0.5 : 1,
                  }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 0.8,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "linear",
                        }}
                        className="inline-block w-4 h-4 border-2 border-current rounded-full"
                        style={{ borderTopColor: "transparent" }}
                      />
                      Verifying...
                    </span>
                  ) : (
                    "Access Panel"
                  )}

                  {/* shimmer */}
                  {!loading && username && password && (
                    <motion.div
                      className="absolute inset-0 opacity-20"
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{
                        duration: 2.5,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                        repeatDelay: 1,
                      }}
                      style={{
                        background:
                          "linear-gradient(105deg, transparent 40%, white 50%, transparent 60%)",
                      }}
                    />
                  )}
                </motion.button>
              </form>

              {/* bottom tag */}
              <p
                className="text-center text-[9px] font-display uppercase tracking-[0.4em] mt-5"
                style={{ color: "oklch(0.35 0.04 270)" }}
              >
                INFERNO&apos;26 &#x2022; Secure Access
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
