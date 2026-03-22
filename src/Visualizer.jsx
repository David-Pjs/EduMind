// ─── EduMind Visualizations ───────────────────────────────────────

// ══════════════════════════════════════════════
// ATOM VISUALIZER (Chemistry)
// ══════════════════════════════════════════════
const ELECTRON_CONFIG = {
  1:[1],2:[2],3:[2,1],4:[2,2],5:[2,3],6:[2,4],7:[2,5],8:[2,6],9:[2,7],10:[2,8],
  11:[2,8,1],12:[2,8,2],13:[2,8,3],14:[2,8,4],15:[2,8,5],16:[2,8,6],17:[2,8,7],18:[2,8,8],
  19:[2,8,8,1],20:[2,8,8,2],26:[2,8,14,2],29:[2,8,18,1],30:[2,8,18,2],35:[2,8,18,7],36:[2,8,18,8],
}
const CAT_COLORS = {
  alkali:'#ef4444', alkaline:'#f97316', transition:'#eab308', post:'#22c55e',
  metalloid:'#10b981', nonmetal:'#3b82f6', halogen:'#8b5cf6', noble:'#94a3b8',
}

export function AtomVisualizer({ element, onClose }) {
  const shells = ELECTRON_CONFIG[element.num] || [1]
  const color  = CAT_COLORS[element.cat] || '#22c55e'
  const cx = 200, cy = 200, shellRadii = [50, 85, 120, 155]

  return (
    <div className="atom-overlay" onClick={onClose}>
      <div className="atom-modal" onClick={e => e.stopPropagation()}>
        <div className="atom-header">
          <div className="atom-sym" style={{ color }}>{element.sym}</div>
          <div>
            <div className="atom-name">{element.name}</div>
            <div className="atom-sub">Atomic No. {element.num} · Mass {element.mass} · Click to ask AI</div>
          </div>
          <button className="ptable-close" onClick={onClose}>✕</button>
        </div>
        <svg viewBox="0 0 400 400" className="atom-svg">
          <circle cx={cx} cy={cy} r={34} fill={color} opacity="0.15"/>
          <circle cx={cx} cy={cy} r={24} fill={color} opacity="0.35"/>
          <circle cx={cx} cy={cy} r={17} fill={color}/>
          <text x={cx} y={cy+5} textAnchor="middle" fill="white" fontSize="12" fontWeight="900">{element.sym}</text>
          {shells.map((count, si) => {
            const r = shellRadii[si] || 155 + si * 35
            return (
              <g key={si}>
                <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="1.2" opacity="0.2" strokeDasharray="5 4"/>
                {Array.from({ length: count }).map((_, ei) => {
                  const a = (2*Math.PI*ei/count) - Math.PI/2
                  const ex = cx + r*Math.cos(a), ey = cy + r*Math.sin(a)
                  return (
                    <circle key={ei} cx={ex} cy={ey} r={6} fill={color} opacity="0.9">
                      <animateTransform attributeName="transform" type="rotate"
                        from={`0 ${cx} ${cy}`} to={`360 ${cx} ${cy}`}
                        dur={`${1.8 + si*1.3}s`} repeatCount="indefinite"/>
                    </circle>
                  )
                })}
                <text x={cx+r+8} y={cy+4} fill={color} fontSize="10" opacity="0.6">{count}e⁻</text>
              </g>
            )
          })}
        </svg>
        <div className="atom-shells-label">
          Shell config: [{shells.join(', ')}] · {shells.reduce((a,b)=>a+b,0)} electrons total
        </div>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════
// MOLECULE CARDS (Chemistry)
// ══════════════════════════════════════════════
const MOLECULES = {
  H2O: { name:'Water', formula:'H₂O', type:'Polar Covalent', bonds:'O–H single bonds · Bent · 104.5°', color:'#3b82f6',
    svg:<svg viewBox="0 0 200 140" className="mol-svg">
      <circle cx="100" cy="58" r="24" fill="#ef4444" opacity="0.85"/>
      <text x="100" y="64" textAnchor="middle" fill="white" fontSize="15" fontWeight="900">O</text>
      <circle cx="42" cy="102" r="17" fill="#94a3b8" opacity="0.85"/>
      <text x="42" y="107" textAnchor="middle" fill="white" fontSize="12" fontWeight="700">H</text>
      <circle cx="158" cy="102" r="17" fill="#94a3b8" opacity="0.85"/>
      <text x="158" y="107" textAnchor="middle" fill="white" fontSize="12" fontWeight="700">H</text>
      <line x1="80" y1="74" x2="56" y2="90" stroke="#94a3b8" strokeWidth="3"/>
      <line x1="120" y1="74" x2="144" y2="90" stroke="#94a3b8" strokeWidth="3"/>
      <circle cx="87" cy="40" r="3" fill="#ef4444"/><circle cx="95" cy="36" r="3" fill="#ef4444"/>
      <circle cx="105" cy="36" r="3" fill="#ef4444"/><circle cx="113" cy="40" r="3" fill="#ef4444"/>
      <text x="100" y="130" textAnchor="middle" fill="#64748b" fontSize="11">104.5° — Bent Shape</text>
    </svg>
  },
  CO2: { name:'Carbon Dioxide', formula:'CO₂', type:'Non-polar Covalent', bonds:'C=O double bonds · Linear · 180°', color:'#10b981',
    svg:<svg viewBox="0 0 240 100" className="mol-svg">
      <circle cx="28" cy="50" r="24" fill="#ef4444" opacity="0.85"/>
      <text x="28" y="56" textAnchor="middle" fill="white" fontSize="14" fontWeight="900">O</text>
      <circle cx="120" cy="50" r="22" fill="#1e293b" stroke="#22c55e" strokeWidth="2.5"/>
      <text x="120" y="56" textAnchor="middle" fill="#22c55e" fontSize="14" fontWeight="900">C</text>
      <circle cx="212" cy="50" r="24" fill="#ef4444" opacity="0.85"/>
      <text x="212" y="56" textAnchor="middle" fill="white" fontSize="14" fontWeight="900">O</text>
      <line x1="53" y1="44" x2="97" y2="44" stroke="#94a3b8" strokeWidth="2.5"/>
      <line x1="53" y1="56" x2="97" y2="56" stroke="#94a3b8" strokeWidth="2.5"/>
      <line x1="143" y1="44" x2="187" y2="44" stroke="#94a3b8" strokeWidth="2.5"/>
      <line x1="143" y1="56" x2="187" y2="56" stroke="#94a3b8" strokeWidth="2.5"/>
      <text x="120" y="92" textAnchor="middle" fill="#64748b" fontSize="11">Linear — 180°</text>
    </svg>
  },
  CH4: { name:'Methane', formula:'CH₄', type:'Non-polar Covalent', bonds:'4 × C–H single bonds · Tetrahedral · 109.5°', color:'#8b5cf6',
    svg:<svg viewBox="0 0 200 200" className="mol-svg">
      <circle cx="100" cy="100" r="22" fill="#1e293b" stroke="#8b5cf6" strokeWidth="2.5"/>
      <text x="100" y="106" textAnchor="middle" fill="#8b5cf6" fontSize="14" fontWeight="900">C</text>
      <circle cx="100" cy="32" r="16" fill="#94a3b8" opacity="0.85"/>
      <text x="100" y="37" textAnchor="middle" fill="white" fontSize="12" fontWeight="700">H</text>
      <circle cx="158" cy="132" r="16" fill="#94a3b8" opacity="0.85"/>
      <text x="158" y="137" textAnchor="middle" fill="white" fontSize="12" fontWeight="700">H</text>
      <circle cx="42" cy="132" r="16" fill="#94a3b8" opacity="0.85"/>
      <text x="42" y="137" textAnchor="middle" fill="white" fontSize="12" fontWeight="700">H</text>
      <circle cx="100" cy="165" r="16" fill="#94a3b8" opacity="0.85"/>
      <text x="100" y="170" textAnchor="middle" fill="white" fontSize="12" fontWeight="700">H</text>
      <line x1="100" y1="78" x2="100" y2="50" stroke="#94a3b8" strokeWidth="2.5"/>
      <line x1="118" y1="112" x2="144" y2="122" stroke="#94a3b8" strokeWidth="2.5"/>
      <line x1="82" y1="112" x2="56" y2="122" stroke="#94a3b8" strokeWidth="2.5"/>
      <line x1="100" y1="122" x2="100" y2="149" stroke="#94a3b8" strokeWidth="2.5"/>
      <text x="100" y="190" textAnchor="middle" fill="#64748b" fontSize="11">Tetrahedral — 109.5°</text>
    </svg>
  },
  NaCl: { name:'Sodium Chloride (Table Salt)', formula:'NaCl', type:'Ionic Bond', bonds:'Na⁺ transfers electron → Cl⁻', color:'#f97316',
    svg:<svg viewBox="0 0 230 120" className="mol-svg">
      <circle cx="62" cy="60" r="30" fill="#f97316" opacity="0.8"/>
      <text x="62" y="56" textAnchor="middle" fill="white" fontSize="14" fontWeight="800">Na</text>
      <text x="62" y="72" textAnchor="middle" fill="white" fontSize="11">⁺</text>
      <circle cx="168" cy="60" r="36" fill="#8b5cf6" opacity="0.8"/>
      <text x="168" y="56" textAnchor="middle" fill="white" fontSize="14" fontWeight="800">Cl</text>
      <text x="168" y="72" textAnchor="middle" fill="white" fontSize="11">⁻</text>
      <path d="M 95 44 Q 115 22 135 44" stroke="#eab308" strokeWidth="2.5" fill="none"/>
      <polygon points="135,44 128,38 140,36" fill="#eab308"/>
      <text x="115" y="20" textAnchor="middle" fill="#eab308" fontSize="10" fontWeight="700">e⁻ transfer</text>
      <text x="115" y="112" textAnchor="middle" fill="#64748b" fontSize="11">Ionic Bond — electrostatic attraction</text>
    </svg>
  },
  O2: { name:'Oxygen (Diatomic)', formula:'O₂', type:'Non-polar Covalent', bonds:'O=O double bond', color:'#3b82f6',
    svg:<svg viewBox="0 0 180 100" className="mol-svg">
      <circle cx="52" cy="50" r="28" fill="#ef4444" opacity="0.85"/>
      <text x="52" y="56" textAnchor="middle" fill="white" fontSize="16" fontWeight="900">O</text>
      <circle cx="128" cy="50" r="28" fill="#ef4444" opacity="0.85"/>
      <text x="128" y="56" textAnchor="middle" fill="white" fontSize="16" fontWeight="900">O</text>
      <line x1="81" y1="43" x2="99" y2="43" stroke="#94a3b8" strokeWidth="3"/>
      <line x1="81" y1="57" x2="99" y2="57" stroke="#94a3b8" strokeWidth="3"/>
      <text x="90" y="92" textAnchor="middle" fill="#64748b" fontSize="11">Double Bond</text>
    </svg>
  },
  H2SO4: { name:'Sulfuric Acid', formula:'H₂SO₄', type:'Polar Covalent', bonds:'S=O double bonds + S–OH single bonds', color:'#ef4444',
    svg:<svg viewBox="0 0 260 160" className="mol-svg">
      <circle cx="130" cy="80" r="26" fill="#eab308" opacity="0.9"/>
      <text x="130" y="86" textAnchor="middle" fill="white" fontSize="14" fontWeight="900">S</text>
      <circle cx="130" cy="24" r="20" fill="#ef4444" opacity="0.85"/>
      <text x="130" y="30" textAnchor="middle" fill="white" fontSize="13" fontWeight="800">O</text>
      <circle cx="130" cy="136" r="20" fill="#ef4444" opacity="0.85"/>
      <text x="130" y="142" textAnchor="middle" fill="white" fontSize="13" fontWeight="800">O</text>
      <circle cx="60" cy="80" r="20" fill="#ef4444" opacity="0.85"/>
      <text x="60" y="86" textAnchor="middle" fill="white" fontSize="13" fontWeight="800">O</text>
      <circle cx="200" cy="80" r="20" fill="#ef4444" opacity="0.85"/>
      <text x="200" y="86" textAnchor="middle" fill="white" fontSize="13" fontWeight="800">O</text>
      <circle cx="26" cy="80" r="14" fill="#94a3b8" opacity="0.85"/>
      <text x="26" y="85" textAnchor="middle" fill="white" fontSize="11" fontWeight="700">H</text>
      <circle cx="234" cy="80" r="14" fill="#94a3b8" opacity="0.85"/>
      <text x="234" y="85" textAnchor="middle" fill="white" fontSize="11" fontWeight="700">H</text>
      <line x1="130" y1="54" x2="130" y2="46" stroke="#94a3b8" strokeWidth="2.5"/>
      <line x1="127" y1="54" x2="127" y2="46" stroke="#94a3b8" strokeWidth="2.5"/>
      <line x1="130" y1="106" x2="130" y2="114" stroke="#94a3b8" strokeWidth="2.5"/>
      <line x1="127" y1="106" x2="127" y2="114" stroke="#94a3b8" strokeWidth="2.5"/>
      <line x1="104" y1="80" x2="82" y2="80" stroke="#94a3b8" strokeWidth="2.5"/>
      <line x1="156" y1="80" x2="178" y2="80" stroke="#94a3b8" strokeWidth="2.5"/>
      <line x1="42" y1="80" x2="40" y2="80" stroke="#94a3b8" strokeWidth="2.5"/>
      <line x1="214" y1="80" x2="220" y2="80" stroke="#94a3b8" strokeWidth="2.5"/>
    </svg>
  },
}

export function detectMolecule(text) {
  const p = [
    { key:'H2O',   r:/\bH₂O\b|\bwater\b|\bH2O\b/i },
    { key:'CO2',   r:/\bCO₂\b|\bcarbon dioxide\b|\bCO2\b/i },
    { key:'CH4',   r:/\bCH₄\b|\bmethane\b|\bCH4\b/i },
    { key:'NaCl',  r:/\bNaCl\b|\bsodium chloride\b|\btable salt\b/i },
    { key:'O2',    r:/\bO₂\b|\boxygen gas\b/i },
    { key:'H2SO4', r:/\bH₂SO₄\b|\bsulfuric acid\b|\bsulphuric acid\b/i },
  ]
  for (const x of p) if (x.r.test(text)) return MOLECULES[x.key]
  return null
}

export function MoleculeCard({ mol }) {
  return (
    <div className="mol-card" style={{ '--mol-color': mol.color }}>
      <div className="mol-card-header">
        <span className="mol-formula" style={{ color: mol.color }}>{mol.formula}</span>
        <span className="mol-name">{mol.name}</span>
        <span className="mol-type">{mol.type}</span>
      </div>
      {mol.svg}
      <div className="mol-bonds">🔗 {mol.bonds}</div>
    </div>
  )
}

// ══════════════════════════════════════════════
// PHYSICS VISUALIZATIONS
// ══════════════════════════════════════════════

// Animated sine wave for waves/frequency/sound/light
function WaveViz() {
  return (
    <div className="phys-card" style={{'--phys-color':'#3b82f6'}}>
      <div className="phys-title">🌊 Wave Properties</div>
      <svg viewBox="0 0 400 120" className="phys-svg">
        <defs>
          <style>{`
            @keyframes wave-shift { from{stroke-dashoffset:0} to{stroke-dashoffset:-80} }
          `}</style>
        </defs>
        {/* Wave */}
        <path d="M0,60 C20,20 40,20 60,60 C80,100 100,100 120,60 C140,20 160,20 180,60 C200,100 220,100 240,60 C260,20 280,20 300,60 C320,100 340,100 360,60 C380,20 400,20 420,60"
          stroke="#3b82f6" strokeWidth="3" fill="none" strokeDasharray="800"
          style={{animation:'wave-shift 1.2s linear infinite'}}/>
        {/* Labels */}
        <line x1="60" y1="15" x2="180" y2="15" stroke="#eab308" strokeWidth="1.5" strokeDasharray="4 3"/>
        <text x="120" y="11" textAnchor="middle" fill="#eab308" fontSize="10">← wavelength (λ) →</text>
        <line x1="10" y1="20" x2="10" y2="100" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="4 3"/>
        <text x="14" y="62" fill="#22c55e" fontSize="10">A</text>
        <text x="14" y="73" fill="#22c55e" fontSize="9">↕</text>
        <text x="200" y="115" textAnchor="middle" fill="#64748b" fontSize="10">v = fλ &nbsp;|&nbsp; f = 1/T</text>
      </svg>
    </div>
  )
}

// Newton's Laws force diagram
function NewtonViz() {
  return (
    <div className="phys-card" style={{'--phys-color':'#f97316'}}>
      <div className="phys-title">⚡ Newton's Laws — Force Diagram</div>
      <svg viewBox="0 0 380 160" className="phys-svg">
        {/* Object box */}
        <rect x="140" y="60" width="100" height="50" rx="8" fill="#1e293b" stroke="#f97316" strokeWidth="2"/>
        <text x="190" y="90" textAnchor="middle" fill="#f97316" fontSize="13" fontWeight="700">OBJECT</text>
        <text x="190" y="104" textAnchor="middle" fill="#94a3b8" fontSize="10">mass = m</text>
        {/* Force arrows */}
        <line x1="60" y1="85" x2="138" y2="85" stroke="#22c55e" strokeWidth="3"/>
        <polygon points="138,80 150,85 138,90" fill="#22c55e"/>
        <text x="95" y="76" textAnchor="middle" fill="#22c55e" fontSize="11" fontWeight="700">F applied</text>
        <line x1="242" y1="85" x2="320" y2="85" stroke="#ef4444" strokeWidth="3"/>
        <polygon points="320,80 308,85 320,90" fill="#ef4444"/>
        <text x="282" y="76" textAnchor="middle" fill="#ef4444" fontSize="11" fontWeight="700">Friction</text>
        {/* Weight down */}
        <line x1="190" y1="112" x2="190" y2="148" stroke="#8b5cf6" strokeWidth="3"/>
        <polygon points="185,148 190,160 195,148" fill="#8b5cf6"/>
        <text x="210" y="148" fill="#8b5cf6" fontSize="11" fontWeight="700">Weight (mg)</text>
        {/* Normal up */}
        <line x1="190" y1="58" x2="190" y2="22" stroke="#eab308" strokeWidth="3"/>
        <polygon points="185,22 190,10 195,22" fill="#eab308"/>
        <text x="210" y="22" fill="#eab308" fontSize="11" fontWeight="700">Normal (N)</text>
        <text x="190" y="155" textAnchor="middle" fill="#64748b" fontSize="10">F = ma &nbsp;|&nbsp; Every action has equal & opposite reaction</text>
      </svg>
    </div>
  )
}

// Ohm's Law circuit
function OhmViz() {
  return (
    <div className="phys-card" style={{'--phys-color':'#eab308'}}>
      <div className="phys-title">⚡ Ohm's Law — V = IR</div>
      <svg viewBox="0 0 380 160" className="phys-svg">
        {/* Circuit loop */}
        <rect x="30" y="40" width="320" height="90" rx="10" fill="none" stroke="#64748b" strokeWidth="2" strokeDasharray="6 4"/>
        {/* Battery */}
        <rect x="45" y="72" width="30" height="36" rx="4" fill="#1e293b" stroke="#22c55e" strokeWidth="2"/>
        <line x1="54" y1="80" x2="54" y2="100" stroke="#22c55e" strokeWidth="3"/>
        <line x1="62" y1="76" x2="62" y2="104" stroke="#22c55e" strokeWidth="5"/>
        <text x="60" y="126" textAnchor="middle" fill="#22c55e" fontSize="10" fontWeight="700">V (volts)</text>
        {/* Resistor */}
        <rect x="160" y="74" width="70" height="32" rx="5" fill="#1e293b" stroke="#ef4444" strokeWidth="2"/>
        <text x="195" y="95" textAnchor="middle" fill="#ef4444" fontSize="12" fontWeight="700">R (Ω)</text>
        {/* Wires */}
        <line x1="75" y1="60" x2="370" y2="60" stroke="#eab308" strokeWidth="3"/>
        <line x1="75" y1="110" x2="160" y2="110" stroke="#eab308" strokeWidth="3"/>
        <line x1="230" y1="110" x2="370" y2="110" stroke="#eab308" strokeWidth="3"/>
        <line x1="370" y1="60" x2="370" y2="110" stroke="#eab308" strokeWidth="3"/>
        {/* Current arrows */}
        <polygon points="200,56 212,60 200,64" fill="#eab308"/>
        <text x="120" y="52" fill="#eab308" fontSize="10">I →</text>
        {/* Formula */}
        <text x="190" y="150" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="700">V = IR &nbsp;|&nbsp; I = V/R &nbsp;|&nbsp; R = V/I</text>
      </svg>
    </div>
  )
}

// Projectile motion
function ProjectileViz() {
  return (
    <div className="phys-card" style={{'--phys-color':'#22c55e'}}>
      <div className="phys-title">🚀 Projectile Motion</div>
      <svg viewBox="0 0 380 160" className="phys-svg">
        <defs>
          <style>{`@keyframes ball-fly {
            0%  { transform: translate(0px, 0px); }
            50% { transform: translate(150px, -60px); }
            100%{ transform: translate(300px, 0px); }
          }`}</style>
        </defs>
        {/* Ground */}
        <line x1="20" y1="130" x2="360" y2="130" stroke="#64748b" strokeWidth="2"/>
        {/* Arc path */}
        <path d="M 40,130 Q 190,20 340,130" stroke="#22c55e" strokeWidth="2" fill="none" strokeDasharray="6 4"/>
        {/* Ball */}
        <circle cx="40" cy="130" r="10" fill="#22c55e" opacity="0.9"
          style={{animation:'ball-fly 2.5s ease-in-out infinite'}}/>
        {/* Arrows */}
        <line x1="40" y1="128" x2="72" y2="100" stroke="#eab308" strokeWidth="2"/>
        <polygon points="72,100 65,108 76,112" fill="#eab308"/>
        <text x="78" y="96" fill="#eab308" fontSize="10">v₀</text>
        <line x1="40" y1="128" x2="70" y2="128" stroke="#3b82f6" strokeWidth="2"/>
        <polygon points="70,123 82,128 70,133" fill="#3b82f6"/>
        <text x="50" y="145" fill="#3b82f6" fontSize="10">vₓ = v₀cosθ</text>
        <line x1="340" y1="128" x2="340" y2="98" stroke="#ef4444" strokeWidth="2"/>
        <polygon points="335,98 340,86 345,98" fill="#ef4444"/>
        <text x="284" y="96" fill="#ef4444" fontSize="10">vy = gt</text>
        <text x="188" y="15" textAnchor="middle" fill="#94a3b8" fontSize="10">H = v₀²sin²θ / 2g &nbsp;|&nbsp; R = v₀²sin2θ / g</text>
      </svg>
    </div>
  )
}

// Electromagnetic spectrum
function EMSpectrumViz() {
  const bands = [
    { label:'Radio', color:'#8b5cf6', w:60 },
    { label:'Micro', color:'#6c63ff', w:45 },
    { label:'IR',    color:'#ef4444', w:40 },
    { label:'Visible',color:'linear-gradient(90deg,#8b5cf6,#3b82f6,#22c55e,#eab308,#f97316,#ef4444)', w:65 },
    { label:'UV',    color:'#a855f7', w:40 },
    { label:'X-ray', color:'#06b6d4', w:45 },
    { label:'Gamma', color:'#10b981', w:45 },
  ]
  return (
    <div className="phys-card" style={{'--phys-color':'#a855f7'}}>
      <div className="phys-title">🌈 Electromagnetic Spectrum</div>
      <div className="em-spectrum">
        {bands.map((b,i) => (
          <div key={i} className="em-band" style={{ flex: b.w, background: b.color }}>
            <span>{b.label}</span>
          </div>
        ))}
      </div>
      <div className="em-labels">
        <span>← Low frequency · Long wavelength</span>
        <span>High frequency · Short wavelength →</span>
      </div>
      <div className="em-note">All travel at c = 3×10⁸ m/s in vacuum</div>
    </div>
  )
}

// ══════════════════════════════════════════════
// BIOLOGY VISUALIZATIONS
// ══════════════════════════════════════════════

function CellViz() {
  return (
    <div className="phys-card" style={{'--phys-color':'#10b981'}}>
      <div className="phys-title">🧬 Animal Cell Structure</div>
      <svg viewBox="0 0 380 220" className="phys-svg">
        {/* Cell membrane */}
        <ellipse cx="190" cy="110" rx="170" ry="100" fill="rgba(16,185,129,0.06)" stroke="#10b981" strokeWidth="2.5" strokeDasharray="6 3"/>
        {/* Nucleus */}
        <ellipse cx="175" cy="105" rx="55" ry="45" fill="rgba(59,130,246,0.15)" stroke="#3b82f6" strokeWidth="2"/>
        <text x="175" y="100" textAnchor="middle" fill="#3b82f6" fontSize="11" fontWeight="700">Nucleus</text>
        {/* Nucleolus */}
        <circle cx="175" cy="112" r="14" fill="rgba(59,130,246,0.4)" stroke="#3b82f6" strokeWidth="1.5"/>
        <text x="175" y="116" textAnchor="middle" fill="white" fontSize="8">Nucleolus</text>
        {/* Mitochondria */}
        <ellipse cx="300" cy="80" rx="28" ry="16" fill="rgba(239,68,68,0.2)" stroke="#ef4444" strokeWidth="1.5"/>
        <text x="300" y="84" textAnchor="middle" fill="#ef4444" fontSize="9" fontWeight="700">Mitochondria</text>
        {/* Golgi */}
        <path d="M 280,130 Q 310,130 310,145 Q 310,155 280,155" stroke="#eab308" strokeWidth="2.5" fill="none"/>
        <path d="M 275,125 Q 308,125 308,142 Q 308,160 275,160" stroke="#eab308" strokeWidth="2" fill="none"/>
        <text x="320" y="148" fill="#eab308" fontSize="9" fontWeight="700">Golgi</text>
        {/* ER */}
        <path d="M 100,150 Q 120,140 140,155 Q 160,170 180,155" stroke="#8b5cf6" strokeWidth="2" fill="none"/>
        <text x="100" y="178" fill="#8b5cf6" fontSize="9" fontWeight="700">Endoplasmic Reticulum</text>
        {/* Ribosome dots */}
        {[60,80,90,110,95].map((y,i) => (
          <circle key={i} cx={70+i*8} cy={y} r="3" fill="#f97316" opacity="0.8"/>
        ))}
        <text x="60" y="130" fill="#f97316" fontSize="9">Ribosomes</text>
        {/* Labels */}
        <text x="190" y="214" textAnchor="middle" fill="#64748b" fontSize="10">Cell Membrane (outer boundary)</text>
      </svg>
    </div>
  )
}

function DNAViz() {
  const points = Array.from({length:10},(_,i)=>i)
  return (
    <div className="phys-card" style={{'--phys-color':'#8b5cf6'}}>
      <div className="phys-title">🧬 DNA Double Helix</div>
      <svg viewBox="0 0 380 180" className="phys-svg">
        {points.map(i => {
          const x1 = 30 + i*34, x2 = 30 + i*34
          const y1 = 40 + 70*Math.sin(i*0.65)
          const y2 = 140 - 70*Math.sin(i*0.65)
          return (
            <g key={i}>
              <circle cx={x1} cy={y1} r={9} fill={i%2===0?'#3b82f6':'#ef4444'} opacity="0.85"/>
              <circle cx={x2} cy={y2} r={9} fill={i%2===0?'#ef4444':'#3b82f6'} opacity="0.85"/>
              <line x1={x1} y1={y1+9} x2={x2} y2={y2-9} stroke="#94a3b8" strokeWidth="1.5" opacity="0.5"/>
            </g>
          )
        })}
        {/* Backbone curves */}
        <path d={`M30,${40+70*Math.sin(0)} ${points.map(i=>`L${30+i*34},${40+70*Math.sin(i*0.65)}`).join(' ')}`}
          stroke="#3b82f6" strokeWidth="3" fill="none" strokeLinecap="round"/>
        <path d={`M30,${140-70*Math.sin(0)} ${points.map(i=>`L${30+i*34},${140-70*Math.sin(i*0.65)}`).join(' ')}`}
          stroke="#ef4444" strokeWidth="3" fill="none" strokeLinecap="round"/>
        <text x="190" y="175" textAnchor="middle" fill="#64748b" fontSize="10">A–T and G–C base pairs · Sugar-phosphate backbone</text>
      </svg>
    </div>
  )
}

// ══════════════════════════════════════════════
// MATH VISUALIZATIONS
// ══════════════════════════════════════════════

function PythagorasViz() {
  return (
    <div className="phys-card" style={{'--phys-color':'#6c63ff'}}>
      <div className="phys-title">📐 Pythagoras Theorem — a² + b² = c²</div>
      <svg viewBox="0 0 320 200" className="phys-svg">
        {/* Triangle */}
        <polygon points="40,160 260,160 260,40" fill="rgba(108,99,255,0.1)" stroke="#6c63ff" strokeWidth="2.5"/>
        {/* Right angle */}
        <rect x="245" y="145" width="15" height="15" fill="none" stroke="#6c63ff" strokeWidth="1.5"/>
        {/* Labels */}
        <text x="150" y="180" textAnchor="middle" fill="#22c55e" fontSize="14" fontWeight="800">b (base)</text>
        <text x="278" y="105" fill="#ef4444" fontSize="14" fontWeight="800">a</text>
        <text x="138" y="90" textAnchor="middle" fill="#eab308" fontSize="14" fontWeight="800">c (hypotenuse)</text>
        {/* Squares */}
        <rect x="40" y="160" width="80" height="30" fill="rgba(34,197,94,0.15)" stroke="#22c55e" strokeWidth="1.5"/>
        <text x="80" y="180" textAnchor="middle" fill="#22c55e" fontSize="10">b²</text>
        <rect x="262" y="40" width="36" height="120" fill="rgba(239,68,68,0.15)" stroke="#ef4444" strokeWidth="1.5"/>
        <text x="280" y="105" textAnchor="middle" fill="#ef4444" fontSize="10">a²</text>
        <text x="160" y="155" textAnchor="middle" fill="#94a3b8" fontSize="11">a²+b²=c² &nbsp;→&nbsp; c=√(a²+b²)</text>
      </svg>
    </div>
  )
}

function QuadraticViz() {
  // Plot y = x² - 2x - 3
  const pts = []
  for (let x=-2; x<=4; x+=0.2) {
    const y = x*x - 2*x - 3
    pts.push(`${80+x*40},${100-y*10}`)
  }
  return (
    <div className="phys-card" style={{'--phys-color':'#6c63ff'}}>
      <div className="phys-title">📐 Quadratic Graph — y = x² − 2x − 3</div>
      <svg viewBox="0 0 320 180" className="phys-svg">
        {/* Axes */}
        <line x1="20" y1="100" x2="300" y2="100" stroke="#64748b" strokeWidth="1.5"/>
        <line x1="80" y1="10" x2="80" y2="170" stroke="#64748b" strokeWidth="1.5"/>
        {/* Curve */}
        <polyline points={pts.join(' ')} stroke="#6c63ff" strokeWidth="2.5" fill="none"/>
        {/* Roots at x=-1 and x=3 */}
        <circle cx="40" cy="100" r="5" fill="#22c55e"/>
        <text x="40" y="116" textAnchor="middle" fill="#22c55e" fontSize="10">x=−1</text>
        <circle cx="200" cy="100" r="5" fill="#22c55e"/>
        <text x="200" y="116" textAnchor="middle" fill="#22c55e" fontSize="10">x=3</text>
        {/* Vertex */}
        <circle cx="120" cy="60" r="5" fill="#eab308"/>
        <text x="120" y="52" textAnchor="middle" fill="#eab308" fontSize="10">vertex (1,−4)</text>
        <text x="160" y="170" textAnchor="middle" fill="#64748b" fontSize="10">x = (−b ± √(b²−4ac)) / 2a</text>
      </svg>
    </div>
  )
}

// ══════════════════════════════════════════════
// SMART DETECTION
// ══════════════════════════════════════════════
export function detectVisual(text, subject) {
  const t = text.toLowerCase()

  if (subject === 'chemistry') {
    const mol = detectMolecule(text)
    if (mol) return { type: 'molecule', data: mol }
  }

  if (subject === 'physics') {
    if (/wave|frequency|wavelength|amplitude|sound|light wave/i.test(t)) return { type: 'wave' }
    if (/newton|force|friction|acceleration|mass.*accel/i.test(t)) return { type: 'newton' }
    if (/ohm|circuit|resistance|voltage|current.*resist/i.test(t)) return { type: 'ohm' }
    if (/projectile|trajectory|launch|parabolic/i.test(t)) return { type: 'projectile' }
    if (/electromagnetic|spectrum|radio|infrared|ultraviolet|gamma|x.ray/i.test(t)) return { type: 'emspectrum' }
  }

  if (subject === 'biology') {
    if (/\bcell\b|organelle|nucleus|mitochondria|ribosome/i.test(t)) return { type: 'cell' }
    if (/dna|double helix|base pair|nucleotide|adenine|guanine/i.test(t)) return { type: 'dna' }
  }

  if (subject === 'math' || subject === 'physics') {
    if (/pythagoras|hypotenuse|right.angle triangle/i.test(t)) return { type: 'pythagoras' }
    if (/quadratic|parabola|x\^2|ax\^2/i.test(t)) return { type: 'quadratic' }
  }

  return null
}

export function VisualCard({ visual }) {
  if (!visual) return null
  switch (visual.type) {
    case 'molecule':   return <MoleculeCard mol={visual.data} />
    case 'wave':       return <WaveViz />
    case 'newton':     return <NewtonViz />
    case 'ohm':        return <OhmViz />
    case 'projectile': return <ProjectileViz />
    case 'emspectrum': return <EMSpectrumViz />
    case 'cell':       return <CellViz />
    case 'dna':        return <DNAViz />
    case 'pythagoras': return <PythagorasViz />
    case 'quadratic':  return <QuadraticViz />
    default:           return null
  }
}
