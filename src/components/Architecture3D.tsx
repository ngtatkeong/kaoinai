import Turntable from './Turntable'
// A 3D architecture diagram in CSS 3D: three floors show how the product works,
// from your databases, through a metadata scan, to compliance records. Each
// floor holds labelled blocks, and vertical rods link the floors. No 3D library.
// Motion stops for reduced motion (see index.css).
const floors = [
  { name: 'Your databases', blocks: ['PostgreSQL', 'Snowflake', 'MySQL'] },
  { name: 'Metadata scan', blocks: ['Table names', 'Column types', 'PII tags'] },
  { name: 'Compliance records', blocks: ['RoPA', 'DPIA', 'Audit log'] },
]
const columns = [16, 50, 84]

export default function Architecture3D() {
  return (
    <Turntable>
    <div aria-hidden="true" className="arch-scene">
      <div className="arch">
        {floors.map((f, fi) => (
          <div key={f.name} className="arch-floor" style={{ ['--z' as string]: `${fi * 90}px` }}>
            <span className="arch-floor-name">{f.name}</span>
            {f.blocks.map((b, bi) => (
              <span key={b} className="arch-block" style={{ left: `${columns[bi]}%`, ['--i' as string]: fi * 3 + bi }}>
                {b}
              </span>
            ))}
          </div>
        ))}
        {[0, 1].map((level) =>
          columns.map((c) => (
            <span
              key={`${level}-${c}`}
              className="arch-rod"
              style={{ left: `${c}%`, ['--z' as string]: `${level * 90 + 30}px`, ['--d' as string]: `${(level * 3 + columns.indexOf(c)) * 0.5}s` }}
            />
          ))
        )}
      </div>
    </div>
    </Turntable>
  )
}
