import { createElement } from 'react'
import '@google/model-viewer'

// A Blender model (GLB) shown with the Google model-viewer element. Visitors can
// drag to turn it and pinch or scroll to zoom. It turns slowly on its own until
// they interact. Motion stops for reduced-motion users.
// Labels are HTML hotspots pinned to points on the model. They stay upright and
// readable whichever way the model turns.
export type Hotspot = { position: string; text: string }

export default function ModelView({ src, alt, height = 360, hotspots = [], orbit = '-40deg 72deg 10.5m', orbitMobile }: { src: string; alt: string; height?: number; hotspots?: Hotspot[]; orbit?: string; orbitMobile?: string }) {
  const isPhone = typeof window !== 'undefined' && window.matchMedia('(max-width: 639px)').matches
  const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const spots = hotspots.map((h, i) =>
    createElement('button', { key: i, slot: `hotspot-${i}`, 'data-position': h.position, 'data-normal': '0 1 0', className: 'hotspot-label', type: 'button' }, h.text)
  )
  return createElement('model-viewer', {
    src,
    alt,
    'camera-controls': true,
    'touch-action': 'pan-y',
    'auto-rotate': !reduce,
    'auto-rotate-delay': 0,
    'rotation-per-second': '18deg',
    'shadow-intensity': '0.6',
    'camera-orbit': isPhone && orbitMobile ? orbitMobile : orbit,
    'min-camera-orbit': 'auto auto 6m',
    'max-camera-orbit': 'auto auto 14m',
    'field-of-view': '28deg',
    exposure: '1.1',
    'environment-image': 'neutral',
    style: { width: '100%', height: `${height}px`, background: 'transparent', outline: 'none' },
  }, ...spots)
}
