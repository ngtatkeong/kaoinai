// A rotating 3D cube built from CSS faces. Each face names one part of the
// product. No 3D library is used. The spin stops for reduced motion (index.css).
const defaultLabels = ['Tables', 'Columns', 'PII', 'RoPA', 'DPIA', 'Records']

export default function Cube3D({ size = 160, labels = defaultLabels }: { size?: number; labels?: string[] }) {
  const half = size / 2
  const faces = [
    { cls: 'cube-face-front', tf: `translateZ(${half}px)` },
    { cls: 'cube-face-back', tf: `rotateY(180deg) translateZ(${half}px)` },
    { cls: 'cube-face-right', tf: `rotateY(90deg) translateZ(${half}px)` },
    { cls: 'cube-face-left', tf: `rotateY(-90deg) translateZ(${half}px)` },
    { cls: 'cube-face-top', tf: `rotateX(90deg) translateZ(${half}px)` },
    { cls: 'cube-face-bottom', tf: `rotateX(-90deg) translateZ(${half}px)` },
  ]
  return (
    <div aria-hidden="true" className="cube-scene" style={{ width: size, height: size }}>
      <div className="cube">
        {faces.map((f, i) => (
          <div key={f.cls} className={`cube-face ${f.cls}`} style={{ transform: f.tf }}>
            <span className="cube-label" style={{ fontSize: Math.round(size / 9) }}>
              {labels[i % labels.length]}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
