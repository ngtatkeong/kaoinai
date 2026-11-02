import Turntable from './Turntable'
// Three tilted rings orbit a core, drawn with CSS 3D. Each ring is one kind of
// work the product does. The labels sit in a legend under the scene. No 3D library.
const rings = [
  { tilt: '70deg', spin: '14s', dot: 'PII scan' },
  { tilt: '50deg', spin: '18s', dot: 'Lineage' },
  { tilt: '84deg', spin: '22s', dot: 'RoPA' },
]

export default function Orbit3D() {
  return (
    <div className="flex flex-col items-center">
      <Turntable>
      <div aria-hidden="true" className="orbit-scene">
        <div className="orbit-core">KaoinAI</div>
        {rings.map((r, i) => (
          <div key={i} className="orbit-ring" style={{ ['--tilt' as string]: r.tilt, animationDuration: r.spin }}>
            <span className="orbit-dot" />
          </div>
        ))}
      </div>
      </Turntable>
      <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-blue-200">
        {rings.map((r) => r.dot).join('  ·  ')}
      </p>
    </div>
  )
}
