// A 3D stack of table layers, drawn with CSS 3D. Each layer is one table,
// with its personal data tag. No 3D library is used. Motion stops for reduced motion.
const layers = [
  { table: 'customers', tag: 'Contact details' },
  { table: 'orders', tag: 'Delivery address' },
  { table: 'invoices', tag: 'Payment record' },
  { table: 'staff', tag: 'National ID' },
]

export default function DataStack3D() {
  return (
    <div aria-hidden="true" className="stack-scene">
      <div className="stack">
        {layers.map((l, i) => (
          <div key={l.table} className="stack-layer" style={{ ['--i' as string]: i }}>
            <span className="stack-table">{l.table}</span>
            <span className="stack-tag">{l.tag}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
