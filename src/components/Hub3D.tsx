import Turntable from './Turntable'
// A 3D integration hub: four source systems on a tilted platform, each linked
// to a central KaoinAI block. Drawn with CSS 3D. No 3D library.
const sources = [
  { name: 'PostgreSQL', pos: 'hub-tl' },
  { name: 'Snowflake', pos: 'hub-tr' },
  { name: 'NetSuite', pos: 'hub-bl' },
  { name: 'BigQuery', pos: 'hub-br' },
]

export default function Hub3D() {
  return (
    <Turntable>
    <div aria-hidden="true" className="hub-scene">
      <div className="hub-platform">
        {sources.map((s) => (
          <span key={s.name} className={`hub-source ${s.pos}`}>
            {s.name}
          </span>
        ))}
        <svg className="hub-svg" viewBox="0 0 460 240" aria-hidden="true">
          <defs>
            <linearGradient id="hub-line-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#bfdbfe" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.25" />
            </linearGradient>
          </defs>
          {[[55, 18], [405, 18], [55, 222], [405, 222]].map(([x, y]) => (
            <line key={`${x}-${y}`} x1="230" y1="120" x2={x} y2={y} stroke="url(#hub-line-grad)" strokeWidth="2" />
          ))}
        </svg>
        <span className="hub-core">KaoinAI</span>
      </div>
    </div>
    </Turntable>
  )
}
