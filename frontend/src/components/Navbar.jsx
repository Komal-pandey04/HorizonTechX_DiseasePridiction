import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { Menu, X, Activity } from 'lucide-react'

const links = [
  {to:'/',label:'Home'},{to:'/predict',label:'Predict'},
  {to:'/dashboard',label:'Dashboard'},{to:'/history',label:'History'},{to:'/about',label:'About'},
]

export default function Navbar() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  return (
    <header style={{ background:'#fff', borderBottom:'1px solid #e2e8f0', position:'sticky', top:0, zIndex:30, boxShadow:'0 1px 4px rgba(0,0,0,0.05)' }}>
      <div style={{ maxWidth:'100%', padding:'0 1.5rem', display:'flex', alignItems:'center', height:60, gap:12 }}>
        {/* Mobile logo */}
        <Link to="/" style={{ display:'flex',alignItems:'center',gap:8,flexShrink:0 }} className="mob-logo">
          <div style={{ width:32,height:32,borderRadius:9,background:'linear-gradient(135deg,#3b82f6,#06b6d4)',display:'flex',alignItems:'center',justifyContent:'center' }}>
            <Activity size={16} color="white"/>
          </div>
          <span style={{ fontWeight:800,fontSize:'0.95rem',color:'#1e293b' }}>MediPredict <span style={{color:'#3b82f6'}}>AI</span></span>
        </Link>

        <div style={{ flex:1 }} />

        {/* Desktop links */}
        <nav style={{ display:'flex', gap:2 }} className="desk-nav">
          {links.map(l=>(
            <Link key={l.to} to={l.to} style={{
              padding:'6px 14px', borderRadius:8, fontSize:'0.85rem', fontWeight:500,
              color: pathname===l.to ? '#3b82f6' : '#64748b',
              background: pathname===l.to ? '#eff6ff' : 'transparent',
            }}>{l.label}</Link>
          ))}
        </nav>
        <Link to="/predict" style={{ padding:'8px 18px',borderRadius:9,background:'linear-gradient(135deg,#3b82f6,#06b6d4)',color:'#fff',fontWeight:700,fontSize:'0.85rem',boxShadow:'0 2px 8px rgba(59,130,246,0.3)',flexShrink:0 }} className="desk-cta">
          Run Prediction
        </Link>

        {/* Mobile toggle */}
        <button onClick={()=>setOpen(!open)} style={{ background:'none',border:'none',cursor:'pointer',color:'#64748b',padding:4 }} className="mob-toggle">
          {open ? <X size={22}/> : <Menu size={22}/>}
        </button>
      </div>

      {open && (
        <div style={{ background:'#fff',borderTop:'1px solid #e2e8f0',padding:'0.5rem 1rem 1rem',display:'flex',flexDirection:'column',gap:2 }}>
          {links.map(l=>(
            <Link key={l.to} to={l.to} onClick={()=>setOpen(false)} style={{ padding:'10px 14px',borderRadius:9,fontSize:'0.9rem',fontWeight:500,color:pathname===l.to?'#3b82f6':'#374151',background:pathname===l.to?'#eff6ff':'transparent' }}>{l.label}</Link>
          ))}
        </div>
      )}
      <style>{`
        @media(min-width:769px){.mob-logo{display:none!important}.mob-toggle{display:none!important}}
        @media(max-width:768px){.desk-nav{display:none!important}.desk-cta{display:none!important}}
      `}</style>
    </header>
  )
}
