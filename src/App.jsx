import { useState, useRef, useEffect, useCallback } from 'react'
import './App.css'
import { AtomVisualizer, VisualCard, detectVisual } from './Visualizer.jsx'

// ─── Subject config ───────────────────────────────────────────────
const SUBJECTS = [
  { id: 'math',      label: 'Mathematics', icon: '📐', color: '#6c63ff' },
  { id: 'science',   label: 'Science',     icon: '🔬', color: '#10b981' },
  { id: 'english',   label: 'English',     icon: '📖', color: '#f59e0b' },
  { id: 'history',   label: 'History',     icon: '🏛️', color: '#ef4444' },
  { id: 'physics',   label: 'Physics',     icon: '⚛️',  color: '#3b82f6' },
  { id: 'biology',   label: 'Biology',     icon: '🧬', color: '#8b5cf6' },
  { id: 'chemistry', label: 'Chemistry',   icon: '⚗️',  color: '#f97316' },
  { id: 'general',   label: 'General',     icon: '💡', color: '#94a3b8' },
]

const GRADES = ['Primary 1–3','Primary 4–6','JSS 1–3 / Grade 6–8','SSS 1–3 / Grade 9–12','University']

const QUICK_PROMPTS = {
  math:      ['Solve 3x² - 5x + 2 = 0','Explain Pythagoras theorem','What is BODMAS?','How do fractions work?'],
  science:   ['How does photosynthesis work?','Explain the water cycle','What is osmosis?','How do vaccines work?'],
  english:   ['Correct my grammar: "He go school"','What is a simile vs metaphor?','Help me write an essay intro','Active vs passive voice?'],
  history:   ['What caused World War 1?','Explain colonialism in Africa','Who was Kwame Nkrumah?','What was the Berlin Conference?'],
  physics:   ["Explain Newton's 3 laws","What is Ohm's law?","How does gravity work?","Velocity vs speed?"],
  biology:   ['Explain mitosis vs meiosis','How does the heart work?','What is DNA?','Explain the digestive system'],
  chemistry: ['Draw the structure of water (H₂O)','Explain covalent vs ionic bonds','Balance: H₂ + O₂ → H₂O','What is the pH scale?'],
  general:   ['How do I study effectively?','Explain this concept simply','Help me understand this topic','What should I learn next?'],
}

// ─── Periodic Table Data ──────────────────────────────────────────
const ELEMENTS = [
  // Period 1
  { num:1,  sym:'H',  name:'Hydrogen',    mass:'1.008',   cat:'nonmetal',   period:1, group:1  },
  { num:2,  sym:'He', name:'Helium',      mass:'4.003',   cat:'noble',      period:1, group:18 },
  // Period 2
  { num:3,  sym:'Li', name:'Lithium',     mass:'6.941',   cat:'alkali',     period:2, group:1  },
  { num:4,  sym:'Be', name:'Beryllium',   mass:'9.012',   cat:'alkaline',   period:2, group:2  },
  { num:5,  sym:'B',  name:'Boron',       mass:'10.81',   cat:'metalloid',  period:2, group:13 },
  { num:6,  sym:'C',  name:'Carbon',      mass:'12.01',   cat:'nonmetal',   period:2, group:14 },
  { num:7,  sym:'N',  name:'Nitrogen',    mass:'14.01',   cat:'nonmetal',   period:2, group:15 },
  { num:8,  sym:'O',  name:'Oxygen',      mass:'16.00',   cat:'nonmetal',   period:2, group:16 },
  { num:9,  sym:'F',  name:'Fluorine',    mass:'19.00',   cat:'halogen',    period:2, group:17 },
  { num:10, sym:'Ne', name:'Neon',        mass:'20.18',   cat:'noble',      period:2, group:18 },
  // Period 3
  { num:11, sym:'Na', name:'Sodium',      mass:'22.99',   cat:'alkali',     period:3, group:1  },
  { num:12, sym:'Mg', name:'Magnesium',   mass:'24.31',   cat:'alkaline',   period:3, group:2  },
  { num:13, sym:'Al', name:'Aluminium',   mass:'26.98',   cat:'post',       period:3, group:13 },
  { num:14, sym:'Si', name:'Silicon',     mass:'28.09',   cat:'metalloid',  period:3, group:14 },
  { num:15, sym:'P',  name:'Phosphorus',  mass:'30.97',   cat:'nonmetal',   period:3, group:15 },
  { num:16, sym:'S',  name:'Sulfur',      mass:'32.06',   cat:'nonmetal',   period:3, group:16 },
  { num:17, sym:'Cl', name:'Chlorine',    mass:'35.45',   cat:'halogen',    period:3, group:17 },
  { num:18, sym:'Ar', name:'Argon',       mass:'39.95',   cat:'noble',      period:3, group:18 },
  // Period 4
  { num:19, sym:'K',  name:'Potassium',   mass:'39.10',   cat:'alkali',     period:4, group:1  },
  { num:20, sym:'Ca', name:'Calcium',     mass:'40.08',   cat:'alkaline',   period:4, group:2  },
  { num:26, sym:'Fe', name:'Iron',        mass:'55.85',   cat:'transition', period:4, group:8  },
  { num:29, sym:'Cu', name:'Copper',      mass:'63.55',   cat:'transition', period:4, group:11 },
  { num:30, sym:'Zn', name:'Zinc',        mass:'65.38',   cat:'transition', period:4, group:12 },
  { num:35, sym:'Br', name:'Bromine',     mass:'79.90',   cat:'halogen',    period:4, group:17 },
  { num:36, sym:'Kr', name:'Krypton',     mass:'83.80',   cat:'noble',      period:4, group:18 },
]

const CAT_COLORS = {
  alkali:     '#ef4444',
  alkaline:   '#f97316',
  transition: '#eab308',
  post:       '#22c55e',
  metalloid:  '#10b981',
  nonmetal:   '#3b82f6',
  halogen:    '#8b5cf6',
  noble:      '#94a3b8',
}
const CAT_LABELS = {
  alkali:'Alkali Metal', alkaline:'Alkaline Earth', transition:'Transition Metal',
  post:'Post-Transition', metalloid:'Metalloid', nonmetal:'Non-metal',
  halogen:'Halogen', noble:'Noble Gas',
}

// ─── Periodic Table Component ─────────────────────────────────────
function PeriodicTable({ onSelect, onClose }) {
  return (
    <div className="ptable-overlay" onClick={onClose}>
      <div className="ptable-modal" onClick={e => e.stopPropagation()}>
        <div className="ptable-header">
          <span>⚗️ Interactive Periodic Table</span>
          <span className="ptable-hint">Click any element to ask about it</span>
          <button className="ptable-close" onClick={onClose}>✕</button>
        </div>
        <div className="ptable-legend">
          {Object.entries(CAT_LABELS).map(([k,v]) => (
            <span key={k} className="legend-item">
              <span className="legend-dot" style={{ background: CAT_COLORS[k] }} />{v}
            </span>
          ))}
        </div>
        <div className="ptable-grid">
          {ELEMENTS.map(el => (
            <button
              key={el.num}
              className="el-tile"
              style={{ '--el-color': CAT_COLORS[el.cat] }}
              onClick={() => onSelect(el)}
              title={`${el.name} — ${CAT_LABELS[el.cat]}`}
            >
              <span className="el-num">{el.num}</span>
              <span className="el-sym">{el.sym}</span>
              <span className="el-name">{el.name}</span>
              <span className="el-mass">{el.mass}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Groq API call ────────────────────────────────────────────────
const GROQ_URL          = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL        = 'llama-3.3-70b-versatile'
const GROQ_VISION_MODEL = 'llama-3.2-11b-vision-preview'

async function callGrok(apiKey, systemPrompt, messages) {
  const hasImage = messages.some(m => m.image)
  const model    = hasImage ? GROQ_VISION_MODEL : GROQ_MODEL

  const msgs = [
    { role: 'system', content: systemPrompt },
    ...messages.map(m => {
      if (m.role === 'user') {
        if (m.image) {
          return {
            role: 'user',
            content: [
              { type: 'image_url', image_url: { url: m.image } },
              { type: 'text', text: m.text || 'Please analyze this image and help me understand it.' }
            ]
          }
        }
        return { role: 'user', content: m.text }
      }
      return { role: 'assistant', content: m.text }
    })
  ]

  const res = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model, max_tokens: 1024, messages: msgs })
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    const msg = err.error?.message || `HTTP ${res.status}`
    if (res.status === 401) throw new Error('Invalid API key — get a new one at console.groq.com (free)')
    if (res.status === 429) throw new Error('Rate limit hit — wait a moment and try again')
    throw new Error(msg)
  }
  const data = await res.json()
  return data.choices[0].message.content
}

// ─── Quiz prompt ──────────────────────────────────────────────────
const buildQuizPrompt = (subject, grade) =>
  `Generate a short practice quiz for a ${grade} student on ${subject}.
Format EXACTLY like this:
**Quiz: [Topic Name]**

1. [Question]
   A) [option]  B) [option]  C) [option]  D) [option]
   ✅ Answer: [letter] — [brief explanation]

2. [Question]
   A) [option]  B) [option]  C) [option]  D) [option]
   ✅ Answer: [letter] — [brief explanation]

3. [Question]
   A) [option]  B) [option]  C) [option]  D) [option]
   ✅ Answer: [letter] — [brief explanation]

End with: "💪 How did you do? Tell me which ones you got wrong and I'll explain!"

Use real curriculum topics from Nigeria, Ghana, Kenya, or India.`

// ─── System prompt ────────────────────────────────────────────────
const buildPrompt = (subject, grade) => `You are EduMind — a warm, expert AI tutor for students in Africa and India.

Context:
- Many students have 50–100 classmates and rarely get 1-on-1 teacher attention. YOU are that attention.
- Students may study in their second or third language. Use simple, clear English first, then build up.
- Many families cannot afford private tutors. Be the tutor every student deserves.
- Power cuts and low bandwidth are real. Keep responses concise and impactful.

Current subject: ${subject}
Student level: ${grade}

Rules:
1. Adapt language difficulty exactly to the grade level.
2. ALWAYS use visual structure: numbered steps, bullet points, tables, and ASCII diagrams where helpful.
3. For Chemistry: write chemical formulas with proper notation (e.g. H₂O, CO₂, H₂SO₄). Draw ASCII bond structures when useful.
4. For Math/Physics: show working step by step — never skip steps.
5. End with ONE follow-up question to check understanding OR a motivational line.
6. Celebrate effort — many students feel invisible in large classes. Make this student feel SEEN.
7. Suggest the next topic to guide their learning path.
8. For visual learners: use box diagrams, arrows (→), and structure like:
   [Reactant A] + [Reactant B] → [Product] + [Energy]`

// ─── Helpers ─────────────────────────────────────────────────────
function formatTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// Render subscripts in chemical formulas: H2O → H₂O
const SUB_MAP = {'0':'₀','1':'₁','2':'₂','3':'₃','4':'₄','5':'₅','6':'₆','7':'₇','8':'₈','9':'₉'}
const SUP_MAP = {'+':'⁺','-':'⁻','2':'²','3':'³','4':'⁴'}
function chemFormat(text) {
  // Already unicode — just return as-is
  return text
}

function renderInline(text) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g)
  return parts.map((p, j) => {
    if (p.startsWith('**') && p.endsWith('**')) return <strong key={j}>{p.slice(2, -2)}</strong>
    if (p.startsWith('`') && p.endsWith('`')) return <code key={j} className="inline-code">{p.slice(1, -1)}</code>
    return p
  })
}

function renderText(text) {
  const lines = text.split('\n')
  const elements = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // Code / reaction block
    if (line.startsWith('```')) {
      const lang = line.slice(3).trim()
      const codeLines = []
      i++
      while (i < lines.length && !lines[i].startsWith('```')) { codeLines.push(lines[i]); i++ }
      elements.push(
        <pre key={i} className={`code-block ${lang === 'reaction' ? 'reaction-block' : ''}`}>
          {lang && <span className="code-lang">{lang === 'reaction' ? '⚗️ Reaction' : lang}</span>}
          <code>{codeLines.join('\n')}</code>
        </pre>
      )
      i++; continue
    }

    // Headers
    if (line.startsWith('### ')) { elements.push(<h3 key={i} className="md-h3">{renderInline(line.slice(4))}</h3>); i++; continue }
    if (line.startsWith('## '))  { elements.push(<h2 key={i} className="md-h2">{renderInline(line.slice(3))}</h2>); i++; continue }
    if (line.startsWith('# '))   { elements.push(<h2 key={i} className="md-h2">{renderInline(line.slice(2))}</h2>); i++; continue }

    // Bullet list
    if (line.match(/^[-*] /)) {
      const items = []
      while (i < lines.length && lines[i].match(/^[-*] /)) { items.push(<li key={i}>{renderInline(lines[i].slice(2))}</li>); i++ }
      elements.push(<ul key={`ul-${i}`} className="md-list">{items}</ul>)
      continue
    }

    // Numbered list
    if (line.match(/^\d+\. /)) {
      const items = []
      while (i < lines.length && lines[i].match(/^\d+\. /)) { items.push(<li key={i}>{renderInline(lines[i].replace(/^\d+\. /, ''))}</li>); i++ }
      elements.push(<ol key={`ol-${i}`} className="md-list">{items}</ol>)
      continue
    }

    // Horizontal rule
    if (line.match(/^---+$/)) { elements.push(<hr key={i} className="md-hr" />); i++; continue }

    // Blank line
    if (!line.trim()) { i++; continue }

    // Paragraph
    elements.push(<p key={i}>{renderInline(line)}</p>)
    i++
  }
  return elements
}

// ─── Main Component ───────────────────────────────────────────────
export default function App() {
  const [messages, setMessages]           = useState([])
  const [input, setInput]                 = useState('')
  const [loading, setLoading]             = useState(false)
  const [listening, setListening]         = useState(false)
  const [capturedImage, setCapturedImage] = useState(null)
  const [showCamera, setShowCamera]       = useState(false)
  const ACTIVE_KEY = import.meta.env.VITE_GROQ_KEY || localStorage.getItem('grok_key') || ''
  const [apiKey, setApiKey]               = useState(ACTIVE_KEY)
  const [showApiInput, setShowApiInput]   = useState(false)
  const [tempKey, setTempKey]             = useState('')
  const [speaking, setSpeaking]           = useState(false)
  const [activeSubject, setActiveSubject] = useState('chemistry')
  const [grade, setGrade]                 = useState('SSS 1–3 / Grade 9–12')
  const [sidebarOpen, setSidebarOpen]     = useState(false)
  const [copiedIdx, setCopiedIdx]         = useState(null)
  const [quizLoading, setQuizLoading]     = useState(false)
  const [showPTable, setShowPTable]       = useState(false)
  const [atomEl, setAtomEl]               = useState(null)
  const [voices, setVoices]               = useState([])
  const [selectedVoice, setSelectedVoice] = useState(null)
  const [showVoicePicker, setShowVoicePicker] = useState(false)
  const [stats, setStats]                 = useState(() => {
    const saved = localStorage.getItem('edu_stats')
    return saved ? JSON.parse(saved) : { questions: 0, streak: 0, sessions: 0 }
  })

  const videoRef       = useRef(null)
  const streamRef      = useRef(null)
  const recognitionRef = useRef(null)
  const messagesEndRef = useRef(null)
  const fileInputRef   = useRef(null)
  const textareaRef    = useRef(null)

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])
  useEffect(() => { localStorage.setItem('edu_stats', JSON.stringify(stats)) }, [stats])

  // Load voices — Nigerian & Indian voices prioritized
  useEffect(() => {
    const load = () => {
      const all = window.speechSynthesis.getVoices()
      if (!all.length) return
      // Priority: Nigerian → Indian → Microsoft English → Google → any English
      const nigerian = all.filter(v => v.lang === 'en-NG')
      const indian   = all.filter(v => v.lang === 'en-IN')
      const msEn     = all.filter(v => v.name.includes('Microsoft') && v.lang.startsWith('en') && v.lang !== 'en-NG' && v.lang !== 'en-IN')
      const goog     = all.filter(v => v.name.includes('Google') && v.lang.startsWith('en'))
      const rest     = all.filter(v => v.lang.startsWith('en') && !nigerian.includes(v) && !indian.includes(v) && !msEn.includes(v) && !goog.includes(v))
      const sorted   = [...nigerian, ...indian, ...msEn, ...goog, ...rest]
      setVoices(sorted)
      if (!selectedVoice && sorted.length) setSelectedVoice(sorted[0])
    }
    load()
    window.speechSynthesis.onvoiceschanged = load
  }, [])
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px'
    }
  }, [input])

  // ── Voice ──────────────────────────────────────────────────────
  const startListening = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) { alert('Use Chrome for voice support.'); return }
    const r = new SR()
    r.continuous = false; r.interimResults = false; r.lang = 'en-US'
    r.onstart  = () => setListening(true)
    r.onend    = () => setListening(false)
    r.onerror  = () => setListening(false)
    r.onresult = e => { const t = e.results[0][0].transcript; setInput(p => p ? p + ' ' + t : t) }
    recognitionRef.current = r; r.start()
  }, [])

  const stopListening = useCallback(() => { recognitionRef.current?.stop(); setListening(false) }, [])

  // ── TTS ────────────────────────────────────────────────────────
  const speak = useCallback((text) => {
    window.speechSynthesis.cancel()
    const clean = text.replace(/[*#`_]/g, '').replace(/\n+/g, '. ')
    const u = new SpeechSynthesisUtterance(clean)
    u.rate = 1.05; u.pitch = 1
    if (selectedVoice) u.voice = selectedVoice
    u.onstart = () => setSpeaking(true)
    u.onend   = () => setSpeaking(false)
    u.onerror = () => setSpeaking(false)
    window.speechSynthesis.speak(u)
  }, [selectedVoice])

  const stopSpeaking = useCallback(() => { window.speechSynthesis.cancel(); setSpeaking(false) }, [])

  const copyText = useCallback((text, idx) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIdx(idx); setTimeout(() => setCopiedIdx(null), 2000)
    })
  }, [])

  // ── Periodic table element click ───────────────────────────────
  const handleElementClick = useCallback((el) => {
    setShowPTable(false)
    setAtomEl(el)
  }, [])

  // ── Quiz ───────────────────────────────────────────────────────
  const startQuiz = useCallback(async () => {
    if (!apiKey) { setShowApiInput(true); return }
    setQuizLoading(true); setSidebarOpen(false)
    const subjectLabel = SUBJECTS.find(s => s.id === activeSubject)?.label || 'General'
    setMessages(p => [...p, { role: 'user', text: `Give me a practice quiz on ${subjectLabel}`, time: new Date(), subject: subjectLabel }])
    try {
      const reply = await callGrok(apiKey, buildPrompt(subjectLabel, grade), [{ role: 'user', text: buildQuizPrompt(subjectLabel, grade) }])
      setMessages(p => [...p, { role: 'assistant', text: reply, time: new Date() }])
      setStats(p => ({ ...p, questions: p.questions + 1 }))
    } catch (err) {
      setMessages(p => [...p, { role: 'assistant', text: `Quiz error: ${err.message}`, time: new Date(), isError: true }])
    } finally { setQuizLoading(false) }
  }, [apiKey, activeSubject, grade])

  // ── Camera ─────────────────────────────────────────────────────
  const openCamera = async () => {
    setShowCamera(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      streamRef.current = stream
      if (videoRef.current) videoRef.current.srcObject = stream
    } catch { alert('Camera blocked. Try uploading an image instead.'); setShowCamera(false) }
  }

  const capturePhoto = () => {
    const c = document.createElement('canvas')
    c.width = videoRef.current.videoWidth; c.height = videoRef.current.videoHeight
    c.getContext('2d').drawImage(videoRef.current, 0, 0)
    setCapturedImage(c.toDataURL('image/jpeg', 0.85)); closeCamera()
  }

  const closeCamera = () => { streamRef.current?.getTracks().forEach(t => t.stop()); setShowCamera(false) }

  const handleFileUpload = e => {
    const file = e.target.files[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setCapturedImage(ev.target.result)
    reader.readAsDataURL(file); e.target.value = ''
  }

  // ── Send message ───────────────────────────────────────────────
  const sendMessage = async () => {
    const text = input.trim()
    if (!text && !capturedImage) return
    if (!apiKey) { setShowApiInput(true); return }

    const subjectLabel = SUBJECTS.find(s => s.id === activeSubject)?.label || 'General'
    const userMsg = { role: 'user', text, image: capturedImage, time: new Date(), subject: subjectLabel }
    const newMsgs = [...messages, userMsg]
    setMessages(newMsgs); setInput(''); setCapturedImage(null); setLoading(true); setSidebarOpen(false)

    try {
      const reply  = await callGrok(apiKey, buildPrompt(subjectLabel, grade), newMsgs)
      const visual = detectVisual(reply, activeSubject)
      setMessages(p => [...p, { role: 'assistant', text: reply, time: new Date(), visual }])
      setStats(p => ({ questions: p.questions + 1, streak: p.streak + 1, sessions: p.sessions }))
      speak(reply)
    } catch (err) {
      setMessages(p => [...p, { role: 'assistant', text: `Error: ${err.message}`, time: new Date(), isError: true }])
      setStats(p => ({ ...p, streak: 0 }))
    } finally { setLoading(false) }
  }

  const saveApiKey = () => {
    const k = tempKey.trim(); if (!k) return
    localStorage.setItem('grok_key', k)
    setApiKey(k); setShowApiInput(false); setTempKey('')
    setStats(p => ({ ...p, sessions: p.sessions + 1 }))
  }


  const handleKeyDown = e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }

  const subjectData = SUBJECTS.find(s => s.id === activeSubject)
  const prompts     = QUICK_PROMPTS[activeSubject] || QUICK_PROMPTS.general
  const isChemistry = activeSubject === 'chemistry'

  return (
    <div className="app">

      {/* ── PERIODIC TABLE ────────────────────────────── */}
      {showPTable && <PeriodicTable onSelect={handleElementClick} onClose={() => setShowPTable(false)} />}

      {/* ── ATOM VISUALIZER ───────────────────────────── */}
      {atomEl && <AtomVisualizer element={atomEl} onClose={() => {
        const q = `Explain ${atomEl.name} (${atomEl.sym}, atomic number ${atomEl.num}): its properties, common uses, and why it matters in chemistry.`
        setAtomEl(null)
        setInput(q)
        textareaRef.current?.focus()
      }} />}

      {/* ── API KEY MODAL ─────────────────────────────── */}
      {showApiInput && (
        <div className="overlay" onClick={() => apiKey && setShowApiInput(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-badge">FREE AI EDUCATION</div>
            <div className="modal-icon">🎓</div>
            <h2>Connect Your AI Tutor</h2>
            <p>
              1 in 3 African students has no access to a quality teacher.<br />
              EduMind changes that — one question at a time.
            </p>
            <input
              type="password"
              placeholder="gsk_..."
              value={tempKey}
              onChange={e => setTempKey(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && saveApiKey()}
              autoFocus
            />
            <small>Get your free key at console.groq.com</small>
            <button className="btn-primary" onClick={saveApiKey}>Start Learning Free</button>
            {apiKey && <button className="btn-ghost" onClick={() => setShowApiInput(false)}>Cancel</button>}
          </div>
        </div>
      )}

      {/* ── CAMERA MODAL ──────────────────────────────── */}
      {showCamera && (
        <div className="overlay">
          <div className="camera-modal">
            <p className="cam-hint">Point at your textbook, notes, or homework question</p>
            <video ref={videoRef} autoPlay playsInline className="cam-feed" />
            <div className="cam-controls">
              <button className="btn-primary" onClick={capturePhoto}>📸 Capture</button>
              <button className="btn-ghost" onClick={closeCamera}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ── SIDEBAR ───────────────────────────────────── */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <span className="sidebar-logomark">E</span>
          <div>
            <div className="sidebar-appname">EduMind</div>
            <div className="sidebar-tagline">AI Tutor for Africa & India</div>
          </div>
        </div>

        <div className="sidebar-section">
          <label className="sidebar-label">YOUR GRADE</label>
          <select className="grade-select" value={grade} onChange={e => { setGrade(e.target.value); setMessages([]) }}>
            {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>

        <div className="sidebar-section">
          <label className="sidebar-label">SUBJECT</label>
          <nav className="subject-list">
            {SUBJECTS.map(s => (
              <button
                key={s.id}
                className={`subject-btn ${activeSubject === s.id ? 'active' : ''}`}
                style={activeSubject === s.id ? { '--s-color': s.color } : {}}
                onClick={() => { setActiveSubject(s.id); setMessages([]); setSidebarOpen(false) }}
              >
                <span className="s-icon">{s.icon}</span>
                <span>{s.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="sidebar-stats">
          <div className="s-stat"><span className="s-stat-num">{stats.questions}</span><span className="s-stat-label">Questions Asked</span></div>
          <div className="s-stat"><span className="s-stat-num">{stats.streak}</span><span className="s-stat-label">Answer Streak</span></div>
          <div className="s-stat"><span className="s-stat-num">{stats.sessions}</span><span className="s-stat-label">Sessions</span></div>
        </div>

        <div className="impact-card">
          <div className="impact-icon">🌍</div>
          <p>Built for 300M+ students in Africa & India who lack access to quality teachers.</p>
        </div>

        {/* Voice Picker */}
        <div className="sidebar-section">
          <label className="sidebar-label">🎙️ TUTOR VOICE</label>
          <div className="voice-list">
            {voices.length === 0 && <div className="voice-empty">Loading voices...</div>}
            {voices.map((v, i) => {
              const isNG = v.lang === 'en-NG'
              const isIN = v.lang === 'en-IN'
              const shortName = v.name.replace(' Online (Natural)', '').replace('Microsoft ', '').replace(' (Natural)', '')
              return (
                <button
                  key={i}
                  className={`voice-row ${selectedVoice?.name === v.name ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedVoice(v)
                    window.speechSynthesis.cancel()
                    const u = new SpeechSynthesisUtterance('Hello! I am your EduMind tutor.')
                    u.voice = v; window.speechSynthesis.speak(u)
                  }}
                >
                  <span>{isNG ? '🇳🇬' : isIN ? '🇮🇳' : '🌐'}</span>
                  <span className="voice-row-name">{shortName}</span>
                  {(isNG || isIN) && <span className="voice-badge">{isNG ? 'NG' : 'IN'}</span>}
                  {selectedVoice?.name === v.name && <span className="voice-active-dot" />}
                </button>
              )
            })}
          </div>
        </div>

        <button className="api-btn" onClick={() => setShowApiInput(true)}>
          <span className={`dot ${apiKey ? 'green' : 'red'}`} />
          {apiKey ? 'AI Connected' : 'Connect AI'}
        </button>
      </aside>

      {sidebarOpen && <div className="backdrop" onClick={() => setSidebarOpen(false)} />}

      {/* ── MAIN CHAT ─────────────────────────────────── */}
      <main className="chat-main">

        <header className="topbar">
          <button className="menu-btn" onClick={() => setSidebarOpen(p => !p)}>
            <span /><span /><span />
          </button>
          <div className="topbar-left">
            <div className="topbar-brand">EduMind</div>
            <div className="topbar-subject" style={{ '--s-color': subjectData?.color }}>
              <span>{subjectData?.icon}</span>
              <span>{subjectData?.label}</span>
            </div>
          </div>
          <div className="topbar-grade">{grade}</div>
          {isChemistry && (
            <button className="ptable-btn" onClick={() => setShowPTable(true)}>🧪 Periodic Table</button>
          )}
          <button className="quiz-btn" onClick={startQuiz} disabled={quizLoading}>
            {quizLoading ? '⏳' : '🧠 Quiz Me'}
          </button>
          <div className="topbar-streak">🔥 {stats.streak}</div>
        </header>

        {/* ── MOBILE SUBJECT TABS ───────────────────── */}
        <div className="mobile-tabs">
          {SUBJECTS.map(s => (
            <button
              key={s.id}
              className={`mobile-tab ${activeSubject === s.id ? 'active' : ''}`}
              style={activeSubject === s.id ? { '--s-color': s.color } : {}}
              onClick={() => { setActiveSubject(s.id); setMessages([]) }}
            >
              <span className="mobile-tab-icon">{s.icon}</span>
              <span className="mobile-tab-label">{s.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Voice picker dropdown - REMOVED, now in sidebar */}
        {false && (
          <div className="voice-dropdown" onClick={() => setShowVoicePicker(false)}>
            <div className="voice-drop-inner" onClick={e=>e.stopPropagation()}>
              {voices.map((v,i) => {
                const isNG = v.lang === 'en-NG'
                const isIN = v.lang === 'en-IN'
                return (
                  <button
                    key={i}
                    className={`voice-opt ${selectedVoice?.name === v.name ? 'active' : ''}`}
                    onClick={() => { setSelectedVoice(v); setShowVoicePicker(false) }}
                  >
                    <span className="voice-flag">{isNG ? '🇳🇬' : isIN ? '🇮🇳' : '🌐'}</span>
                    <span className="voice-vname">{v.name.replace(' Online (Natural)','').replace('Microsoft ','')}</span>
                    <span className="voice-lang">{v.lang}</span>
                    {(isNG||isIN) && <span className="voice-badge">{isNG?'Nigerian':'Indian'}</span>}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Messages */}
        <section className="messages">
          {messages.length === 0 && (
            <div className="welcome">
              <div className="welcome-glow" style={{ background: subjectData?.color }} />
              <div className="welcome-icon">{subjectData?.icon}</div>
              <h2>Ready to learn {subjectData?.label}?</h2>
              <p>
                Your personal AI teacher — available 24/7, infinitely patient,
                and built for students who deserve better access to education.
              </p>
              <div className="pills">
                <div className="pill">🎤 Speak your question</div>
                <div className="pill">📷 Show your textbook</div>
                <div className="pill">💬 Type anything</div>
                <div className="pill">🔊 Hear the answer</div>
                {isChemistry && (
                  <button className="pill pill-ptable" onClick={() => setShowPTable(true)}>
                    🧪 Periodic Table
                  </button>
                )}
                <button className="pill pill-quiz" onClick={startQuiz} disabled={quizLoading}>
                  {quizLoading ? '⏳ Generating...' : '🧠 Practice Quiz'}
                </button>
              </div>
              <div className="quick-grid">
                {prompts.map(p => (
                  <button
                    key={p}
                    className="quick-card"
                    style={{ '--s-color': subjectData?.color }}
                    onClick={() => { setInput(p); textareaRef.current?.focus() }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`msg-row ${msg.role}`}>
              <div className="msg-avatar">
                {msg.role === 'user' ? <div className="av-user">U</div> : <div className="av-ai">E</div>}
              </div>
              <div className="msg-body">
                {msg.role === 'user' && msg.subject && (
                  <div className="msg-meta">{msg.subject} · {formatTime(msg.time)}</div>
                )}
                {msg.image && <img src={msg.image} alt="Attached" className="msg-img" />}
                {msg.text && (
                  <div className={`bubble ${msg.role} ${msg.isError ? 'error' : ''}`}>
                    {renderText(msg.text)}
                  </div>
                )}
                {msg.visual && <VisualCard visual={msg.visual} />}
                {msg.role === 'assistant' && !msg.isError && (
                  <div className="msg-actions">
                    <button className="action-btn" onClick={() => speaking ? stopSpeaking() : speak(msg.text)}>
                      {speaking ? '⏹ Stop' : '🔊 Listen'}
                    </button>
                    <button className="action-btn" onClick={() => copyText(msg.text, i)}>
                      {copiedIdx === i ? '✅ Copied' : '📋 Copy'}
                    </button>
                    <span className="msg-time">{formatTime(msg.time)}</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="msg-row assistant">
              <div className="msg-avatar"><div className="av-ai">E</div></div>
              <div className="msg-body">
                <div className="bubble assistant thinking"><span /><span /><span /></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </section>

        {/* Input */}
        <footer className="inputbar">
          {capturedImage && (
            <div className="img-preview">
              <img src={capturedImage} alt="preview" />
              <button className="rm-img" onClick={() => setCapturedImage(null)}>✕</button>
            </div>
          )}

          {/* Tool row (mobile: above text) */}
          <div className="tool-row">
            <button className="tool-btn" onClick={openCamera}>📷</button>
            <button className="tool-btn" onClick={() => fileInputRef.current?.click()}>🖼️</button>
            <input type="file" ref={fileInputRef} accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
            {isChemistry && (
              <button className="tool-btn" onClick={() => setShowPTable(true)}>🧪</button>
            )}
            <button className="tool-btn" onClick={startQuiz} disabled={quizLoading}>
              {quizLoading ? '⏳' : '🧠'}
            </button>
            <div className="tool-spacer" />
            <span className="tool-streak">🔥 {stats.streak}</span>
          </div>

          {/* Main input row */}
          <div className="input-row">
            <textarea
              ref={textareaRef}
              className="iText"
              placeholder={listening ? '🎤 Listening...' : `Ask ${subjectData?.label}...`}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
            />
            <button
              className={`iBtn mic ${listening ? 'active' : ''}`}
              onMouseDown={startListening}
              onMouseUp={stopListening}
              onTouchStart={e => { e.preventDefault(); startListening() }}
              onTouchEnd={e => { e.preventDefault(); stopListening() }}
            >🎤</button>
            <button
              className="iBtn send"
              onClick={sendMessage}
              disabled={loading || (!input.trim() && !capturedImage)}
              style={{ '--s-color': subjectData?.color }}
            >
              {loading ? '⏳' : '➤'}
            </button>
          </div>

          {listening && <div className="listen-bar">🎤 Listening — release to send</div>}
          <div className="input-hint">Enter to send · Shift+Enter for new line · Hold mic to speak</div>
        </footer>
      </main>
    </div>
  )
}
