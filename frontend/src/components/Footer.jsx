import { Link } from 'react-router-dom'
import { Heart, ExternalLink, Code2, FileText } from 'lucide-react'

export default function Footer() {
  return (
    <footer style={{ background:'#0f172a', color:'#94a3b8', padding:'2rem 2rem', borderTop:'1px solid #1e293b' }}>
      <div style={{ maxWidth:1100, margin:'0 auto', display:'flex', flexWrap:'wrap', justifyContent:'space-between', gap:'1.5rem', alignItems:'center' }}>
        <div>
          <div style={{ fontWeight:800, color:'#f1f5f9', fontSize:'0.95rem', marginBottom:4 }}>MediPredict AI</div>
          <div style={{ fontSize:'0.78rem', color:'#475569' }}>AI-powered clinical decision support · v2.0</div>
        </div>
        <div style={{ display:'flex', gap:'1.5rem', flexWrap:'wrap' }}>
          {[['Home','/'],['Predict','/predict'],['Dashboard','/dashboard'],['History','/history'],['About','/about']].map(([l,to])=>(
            <Link key={to} to={to} style={{ color:'#475569', fontSize:'0.82rem', fontWeight:500 }}>{l}</Link>
          ))}
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <a href="http://localhost:8000/docs" target="_blank" rel="noreferrer" title="API Docs"
            style={{ width:32,height:32,borderRadius:8,background:'rgba(255,255,255,0.05)',display:'flex',alignItems:'center',justifyContent:'center',color:'#475569',border:'1px solid #1e293b' }}>
            <FileText size={14}/>
          </a>
          <a href="https://github.com" target="_blank" rel="noreferrer" title="GitHub"
            style={{ width:32,height:32,borderRadius:8,background:'rgba(255,255,255,0.05)',display:'flex',alignItems:'center',justifyContent:'center',color:'#475569',border:'1px solid #1e293b' }}>
            <Code2 size={14}/>
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" title="LinkedIn"
            style={{ width:32,height:32,borderRadius:8,background:'rgba(255,255,255,0.05)',display:'flex',alignItems:'center',justifyContent:'center',color:'#475569',border:'1px solid #1e293b' }}>
            <ExternalLink size={14}/>
          </a>
        </div>
      </div>
      <div style={{ textAlign:'center', marginTop:'1.5rem', paddingTop:'1rem', borderTop:'1px solid #1e293b', fontSize:'0.73rem', color:'#334155', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
        For educational purposes only · Not a medical device · Built with <Heart size={10} style={{color:'#ef4444'}}/> using React + FastAPI + scikit-learn
      </div>
    </footer>
  )
}
