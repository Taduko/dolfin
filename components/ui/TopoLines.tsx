// Signature motif: topographic contour lines of twin volcanic peaks —
// a cartographic nod to Guatemala's landscape and to guiding travelers
// across its terrain. Decorative; color is set by the parent via currentColor.
export default function TopoLines({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 800 400"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {/* Peak 1 */}
      <ellipse cx="285" cy="250" rx="58" ry="32" />
      <ellipse cx="285" cy="250" rx="108" ry="60" />
      <ellipse cx="285" cy="250" rx="162" ry="90" />
      <ellipse cx="285" cy="250" rx="222" ry="124" />
      <ellipse cx="285" cy="250" rx="288" ry="160" />
      <ellipse cx="285" cy="250" rx="360" ry="200" />
      {/* Peak 2 */}
      <ellipse cx="545" cy="205" rx="46" ry="27" />
      <ellipse cx="545" cy="205" rx="90" ry="52" />
      <ellipse cx="545" cy="205" rx="140" ry="80" />
      <ellipse cx="545" cy="205" rx="196" ry="112" />
      <ellipse cx="545" cy="205" rx="258" ry="148" />
    </svg>
  )
}
