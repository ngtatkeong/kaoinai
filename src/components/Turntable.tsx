import { useRef, useState, type PointerEvent, type ReactNode } from 'react'

// Lets a visitor turn a 3D diagram with the mouse or a finger. Drag sideways to
// turn, drag up or down to tip, double-click to reset. Vertical page scrolling
// still works on touch screens (touch-action: pan-y).
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

export default function Turntable({ children }: { children: ReactNode }) {
  const [rot, setRot] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const start = useRef<{ x: number; y: number; rx: number; ry: number } | null>(null)

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    start.current = { x: e.clientX, y: e.clientY, rx: rot.x, ry: rot.y }
    setDragging(true)
  }
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const s = start.current
    if (!s) return
    setRot({
      x: clamp(s.rx - (e.clientY - s.y) * 0.3, -60, 60),
      y: s.ry + (e.clientX - s.x) * 0.4,
    })
  }
  const endDrag = () => {
    start.current = null
    setDragging(false)
  }

  return (
    <div className="turntable-wrap">
      <div
        className="turntable"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onDoubleClick={() => setRot({ x: 0, y: 0 })}
        style={{
          transform: `rotateX(${rot.x}deg) rotateY(${rot.y}deg)`,
          transition: dragging ? 'none' : 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        {children}
      </div>
      <p aria-hidden="true" className="turntable-hint">Drag to turn · double-click to reset</p>
    </div>
  )
}
