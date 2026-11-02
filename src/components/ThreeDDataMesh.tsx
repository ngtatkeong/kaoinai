import { useState, useRef, useEffect } from 'react'
import { Database, ShieldCheck, Cpu, ArrowRight, Layers, Sparkles, Lock, GitBranch } from 'lucide-react'

interface Node3D {
  id: string
  name: string
  type: 'warehouse' | 'postgres' | 'catalog' | 'knowledgebase' | 'governance' | 'pii'
  x: number // -100 to 100
  y: number // -100 to 100
  z: number // -100 to 100
  size: number
  color: string
  glowColor: string
  tables: string
  status: string
  schemaSnippet: string
}

const NODES: Node3D[] = [
  {
    id: 'pg-prod',
    name: 'prod_billing (PostgreSQL)',
    type: 'postgres',
    x: -55,
    y: -30,
    z: 35,
    size: 42,
    color: '#9333ea', // teal-600
    glowColor: 'rgba(13, 148, 136, 0.45)',
    tables: '34 Tables • 420k Rows',
    status: 'Catalog Synced',
    schemaSnippet: 'invoices (id, customer_id, arr_usd, tax_rate)'
  },
  {
    id: 'snowflake-dw',
    name: 'analytics_dw (Snowflake)',
    type: 'warehouse',
    x: 60,
    y: -40,
    z: -20,
    size: 46,
    color: '#0284c7', // sky-600
    glowColor: 'rgba(2, 132, 199, 0.45)',
    tables: '128 Tables • 18M Rows',
    status: 'Lineage Active',
    schemaSnippet: 'marts_revenue (cohort_month, ltv, churn_flag)'
  },
  {
    id: 'db-kb',
    name: 'AI DB Knowledgebase',
    type: 'knowledgebase',
    x: 0,
    y: 5,
    z: 70,
    size: 54,
    color: '#10b981', // emerald-500
    glowColor: 'rgba(16, 185, 129, 0.55)',
    tables: 'Living Semantic Glossary',
    status: '99.8% Resolution',
    schemaSnippet: 'Verified join: invoices.customer_id ↔ cohorts.user_id'
  },
  {
    id: 'pii-mesh',
    name: 'PII Vault & RoPA Masking',
    type: 'pii',
    x: -60,
    y: 45,
    z: -30,
    size: 38,
    color: '#f59e0b', // amber-500
    glowColor: 'rgba(245, 158, 11, 0.45)',
    tables: 'SG PDPA • MAS TRM',
    status: 'Dynamic SHA-256',
    schemaSnippet: 'Masked: nric_hash, masked_email, card_token'
  },
  {
    id: 'lineage-hub',
    name: 'Active Column Lineage DAG',
    type: 'governance',
    x: 55,
    y: 40,
    z: 25,
    size: 40,
    color: '#ec4899', // pink-500
    glowColor: 'rgba(236, 72, 153, 0.45)',
    tables: 'dbt Models Synthesized',
    status: 'Zero-Egress Mesh',
    schemaSnippet: 'Upstream: raw_events ➔ staging ➔ mart_retention'
  }
]

const EDGES = [
  { from: 'pg-prod', to: 'db-kb', label: 'CDC Metadata Mesh' },
  { from: 'snowflake-dw', to: 'db-kb', label: 'Semantic Context' },
  { from: 'pg-prod', to: 'pii-mesh', label: 'SHA-256 Masking' },
  { from: 'snowflake-dw', to: 'lineage-hub', label: 'Column Lineage DAG' },
  { from: 'db-kb', to: 'lineage-hub', label: 'Autonomous Verification' }
]

export default function ThreeDDataMesh() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [rotX, setRotX] = useState<number>(-12)
  const [rotY, setRotY] = useState<number>(18)
  const [hoveredNode, setHoveredNode] = useState<Node3D | null>(NODES[2]) // Default to AI DB Knowledgebase
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true)

  // Smooth mouse-driven 3D parallax
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    setIsAutoRotating(false)
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    const targetY = (x / (rect.width / 2)) * 26
    const targetX = -(y / (rect.height / 2)) * 22
    setRotY(targetY)
    setRotX(targetX)
  }

  const handleMouseLeave = () => {
    setIsAutoRotating(true)
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current || e.touches.length === 0) return
    setIsAutoRotating(false)
    const touch = e.touches[0]
    const rect = containerRef.current.getBoundingClientRect()
    const x = touch.clientX - rect.left - rect.width / 2
    const y = touch.clientY - rect.top - rect.height / 2
    setRotY((x / (rect.width / 2)) * 32)
    setRotX(-(y / (rect.height / 2)) * 26)
  }

  const handleTouchEnd = () => {
    setIsAutoRotating(true)
  }

  // Gentle idle 3D orbital animation
  useEffect(() => {
    if (!isAutoRotating) return
    const timer = setInterval(() => {
      setRotY((prev) => (prev + 0.18) % 360)
    }, 30)
    return () => clearInterval(timer)
  }, [isAutoRotating])

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-b from-slate-950 via-[#0b0818] to-slate-950 border border-teal-500/25 shadow-2xl shadow-teal-950/40 p-5 sm:p-7 select-none">
      {/* 3D Ambient Lighting and Cyber Grid */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/4 -right-1/4 w-80 h-80 bg-teal-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/4 -left-1/4 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl" />
        <div 
          className="absolute inset-0 opacity-[0.07]" 
          style={{
            backgroundImage: `linear-gradient(#9333ea 1px, transparent 1px), linear-gradient(90deg, #9333ea 1px, transparent 1px)`,
            backgroundSize: '36px 36px'
          }} 
        />
      </div>

      {/* Header Bar */}
      <div className="relative z-20 flex items-center justify-between pb-4 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
          </div>
          <span className="ml-2 font-mono text-[11px] text-teal-300 font-semibold tracking-wide flex items-center gap-1">
            <Sparkles size={13} className="text-emerald-400" />
            3D Living Database Knowledge Graph
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-[10px] font-mono font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            LIVE METADATA MESH
          </span>
        </div>
      </div>

      {/* 3D Stage Viewport */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative h-[320px] sm:h-[360px] flex items-center justify-center cursor-grab active:cursor-grabbing perspective-[1000px] overflow-hidden"
      >
        {/* Orbital 3D Rings */}
        <div
          className="absolute w-[290px] h-[290px] rounded-full border border-teal-500/20 pointer-events-none transition-transform duration-300 ease-out"
          style={{
            transform: `rotateX(${rotX + 65}deg) rotateZ(${rotY * 0.8}deg)`,
            transformStyle: 'preserve-3d'
          }}
        />
        <div
          className="absolute w-[220px] h-[220px] rounded-full border border-dashed border-emerald-400/25 pointer-events-none transition-transform duration-300 ease-out"
          style={{
            transform: `rotateX(${rotX - 55}deg) rotateY(${rotY * 0.6}deg)`,
            transformStyle: 'preserve-3d'
          }}
        />

        {/* 3D Holographic Object Container */}
        <div
          className="relative w-full h-full flex items-center justify-center transition-transform duration-150 ease-out"
          style={{
            transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Central Holographic Core */}
          <div 
            className="absolute w-20 h-20 rounded-full bg-gradient-to-tr from-teal-600/30 via-emerald-500/25 to-sky-400/30 blur-md pointer-events-none animate-pulse"
            style={{ transform: 'translateZ(0px)' }}
          />

          {/* SVG Connection Lines in 3D Space */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
            {EDGES.map((edge, idx) => {
              const fromNode = NODES.find((n) => n.id === edge.from)
              const toNode = NODES.find((n) => n.id === edge.to)
              if (!fromNode || !toNode) return null
              // Convert 3D node coordinates into 2D SVG centers (50% center offset)
              const x1 = `calc(50% + ${fromNode.x * 1.5}px)`
              const y1 = `calc(50% + ${fromNode.y * 1.3}px)`
              const x2 = `calc(50% + ${toNode.x * 1.5}px)`
              const y2 = `calc(50% + ${toNode.y * 1.3}px)`

              return (
                <g key={idx}>
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="rgba(168, 85, 247, 0.35)"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    className="animate-pulse"
                  />
                </g>
              )
            })}
          </svg>

          {/* Interactive 3D Nodes */}
          {NODES.map((node) => {
            const isSelected = hoveredNode?.id === node.id
            return (
              <div
                key={node.id}
                onMouseEnter={() => setHoveredNode(node)}
                onClick={() => setHoveredNode(node)}
                className="absolute flex flex-col items-center cursor-pointer transition-all duration-300"
                style={{
                  transform: `translate3d(${node.x * 1.5}px, ${node.y * 1.3}px, ${node.z * 1.2}px)`,
                  transformStyle: 'preserve-3d'
                }}
              >
                {/* 3D Sphere / Node Mesh */}
                <div
                  className={`relative rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    isSelected ? 'scale-115 ring-2 ring-white shadow-xl' : 'hover:scale-105'
                  }`}
                  style={{
                    width: `${node.size}px`,
                    height: `${node.size}px`,
                    backgroundColor: node.color,
                    boxShadow: `0 0 24px ${node.glowColor}, inset 0 2px 6px rgba(255,255,255,0.4)`
                  }}
                >
                  {node.type === 'knowledgebase' && <Cpu size={22} className="text-white animate-pulse" />}
                  {node.type === 'postgres' && <Database size={20} className="text-white" />}
                  {node.type === 'warehouse' && <Layers size={20} className="text-white" />}
                  {node.type === 'pii' && <Lock size={18} className="text-white" />}
                  {node.type === 'governance' && <GitBranch size={18} className="text-white" />}

                  {/* Pulsing Outer Ping Ring */}
                  {isSelected && (
                    <span
                      className="absolute -inset-1.5 rounded-2xl animate-ping opacity-35"
                      style={{ backgroundColor: node.color }}
                    />
                  )}
                </div>

                {/* Floating Node Label */}
                <div
                  className={`mt-2 px-2.5 py-1 rounded-md text-[10px] font-mono whitespace-nowrap transition-all duration-200 ${
                    isSelected
                      ? 'bg-white text-slate-950 font-bold shadow-lg scale-105'
                      : 'bg-slate-900/85 text-slate-300 border border-white/10 backdrop-blur-xs'
                  }`}
                >
                  {node.name.split(' ')[0]}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Selected Node Inspector Drawer (Live Metadata Peek) */}
      <div className="relative z-20 mt-2 bg-white/5 border border-white/10 rounded-2xl p-3.5 sm:p-4 backdrop-blur-md transition-all duration-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: hoveredNode?.color || '#10b981' }}
            />
            <span className="text-xs sm:text-sm font-bold text-white font-mono">
              {hoveredNode?.name}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              {hoveredNode?.status}
            </span>
          </div>
          <span className="text-[11px] font-mono text-teal-300/80">
            {hoveredNode?.tables}
          </span>
        </div>

        <div className="bg-black/40 rounded-xl p-2.5 border border-white/5 font-mono text-[11px] text-slate-300 flex items-center justify-between gap-2">
          <span className="text-teal-300 shrink-0">$ live_schema:</span>
          <span className="text-emerald-300 truncate">{hoveredNode?.schemaSnippet}</span>
          <span className="text-[10px] text-slate-500 shrink-0 hidden sm:inline">0ms replication</span>
        </div>

        <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-white/5 text-[10px] text-slate-400 font-mono">
          <span className="flex items-center gap-1 text-slate-400">
            <ShieldCheck size={12} className="text-emerald-400" />
            Zero-Egress Read-Only Metadata Mesh
          </span>
          <span className="text-teal-400 font-semibold cursor-pointer hover:underline flex items-center gap-1"
            onClick={() => {
              const el = document.getElementById('demo')
              el?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            Inspect in Live Sandbox <ArrowRight size={11} />
          </span>
        </div>
      </div>
    </div>
  )
}
