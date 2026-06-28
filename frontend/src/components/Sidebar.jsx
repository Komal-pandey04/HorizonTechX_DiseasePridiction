import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Activity, History, Info, Home, Stethoscope } from 'lucide-react'

const links = [
  { to:'/',          icon:Home,            label:'Home' },
  { to:'/predict',   icon:Activity,        label:'Predict' },
  { to:'/dashboard', icon:LayoutDashboard, label:'Dashboard' },
  { to:'/history',   icon:History,         label:'History' },
  { to:'/about',     icon:Info,            label:'About' },
]

export default function Sidebar() {
  return (
    <aside style={{
      width:220, flexShrink:0, background:'#1e293b',
      display:'flex', flexDirection:'column',
      minHeight:'100vh', position:'sticky', top:0, zIndex:40,
    }} className="sidebar">
      {/* Logo */}
      <div style={{ padding:'1.5rem 1.25rem', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:38,height:38,borderRadius:12,background:'linear-gradient(135deg,#3b82f6,#06b6d4)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
            <Stethoscope size={20} color="white" />
          </div>
          <div>
            <div style={{ fontWeight:800,fontSize:'0.95rem',color:'#f1f5f9',letterSpacing:'-0.02em' }}>MediPredict</div>
            <div style={{ fontSize:'0.7rem',color:'#64748b',fontWeight:600 }}>AI v2.0</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex:1, padding:'1rem 0.75rem', display:'flex', flexDirection:'column', gap:2 }}>
        <div style={{ fontSize:'0.65rem',fontWeight:700,color:'#475569',textTransform:'uppercase',letterSpacing:'0.08em',padding:'0 0.5rem',marginBottom:'0.5rem' }}>
          Navigation
        </div>
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to==='/'} style={({ isActive }) => ({
            display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:10,
            color: isActive ? '#fff' : '#94a3b8',
            background: isActive ? 'rgba(59,130,246,0.2)' : 'transparent',
            fontWeight: isActive ? 600 : 500, fontSize:'0.875rem',
            transition:'all 0.15s', boxShadow: isActive ? 'inset 0 0 0 1px rgba(59,130,246,0.3)' : 'none',
          })}>
            {({ isActive }) => (
              <>
                <Icon size={16} style={{ color: isActive ? '#60a5fa' : '#475569', flexShrink:0 }} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom badge */}
      <div style={{ padding:'1rem', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ background:'rgba(59,130,246,0.12)', border:'1px solid rgba(59,130,246,0.2)', borderRadius:10, padding:'0.75rem' }}>
          <div style={{ fontSize:'0.72rem',color:'#60a5fa',fontWeight:700,marginBottom:4 }}>3 MODELS ACTIVE</div>
          <div style={{ fontSize:'0.7rem',color:'#64748b',lineHeight:1.4 }}>Heart · Diabetes · Cancer</div>
        </div>
      </div>

      <style>{`
        @media(max-width:768px){.sidebar{display:none}}
      `}</style>
    </aside>
  )
}
