import { FaDownload } from 'react-icons/fa'

const RISK_CONFIG = {
  Low:    { color:'#16a34a', bg:'#f0fdf4', border:'#bbf7d0', badge:'#dcfce7', text:'Low Risk',    icon:'✓', advice:'Continue your healthy lifestyle and maintain regular annual checkups.' },
  Medium: { color:'#d97706', bg:'#fffbeb', border:'#fde68a', badge:'#fef9c3', text:'Moderate Risk', icon:'⚠', advice:'Consult a healthcare professional for further evaluation and guidance.' },
  High:   { color:'#dc2626', bg:'#fef2f2', border:'#fecaca', badge:'#fee2e2', text:'High Risk',   icon:'!', advice:'Please seek prompt medical attention and consult a specialist.' },
}

export default function ResultCard({ result, diseaseType }) {
  if (!result) return null
  const cfg = RISK_CONFIG[result.risk_level] || RISK_CONFIG.Medium
  const pct = Math.round(result.probability * 100)
  const isPositive = result.prediction === 'Positive' || result.prediction === 'Malignant'

  const handleDownload = () => {
    const txt = `MediPredict AI — Screening Report
====================================
Patient:     ${result.patient_name}
Disease:     ${diseaseType}
Date:        ${new Date(result.prediction_date).toLocaleString()}
Result:      ${result.prediction}
Confidence:  ${pct}%
Risk Level:  ${result.risk_level}
Recommended: ${cfg.advice}
====================================
This report is for informational purposes only.
Always consult a qualified medical professional.`
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([txt],{type:'text/plain'}))
    a.download = `medipredict_${diseaseType.replace(' ','_')}_${Date.now()}.txt`
    a.click()
  }

  return (
    <div style={{ background:'white', border:`1px solid ${cfg.border}`, borderRadius:18, overflow:'hidden', marginTop:'1.5rem', boxShadow:'0 4px 24px rgba(0,0,0,0.08)' }}>
      {/* Header band */}
      <div style={{ background:cfg.bg, padding:'1.25rem 1.75rem', borderBottom:`1px solid ${cfg.border}`, display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:44, height:44, borderRadius:12, background:cfg.badge, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem', fontWeight:800, color:cfg.color }}>
            {cfg.icon}
          </div>
          <div>
            <div style={{ fontSize:'0.75rem', fontWeight:600, color:'#64748b', textTransform:'uppercase', letterSpacing:'0.05em' }}>Screening Result</div>
            <div style={{ fontSize:'1.4rem', fontWeight:800, color: isPositive ? '#dc2626' : '#16a34a' }}>{result.prediction}</div>
          </div>
        </div>
        <div style={{ textAlign:'right' }}>
          <div style={{ fontSize:'0.75rem', fontWeight:600, color:'#64748b', textTransform:'uppercase', letterSpacing:'0.05em' }}>Confidence</div>
          <div style={{ fontSize:'2rem', fontWeight:800, color:cfg.color }}>{pct}%</div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding:'1.75rem' }}>
        {/* Confidence bar */}
        <div style={{ marginBottom:'1.5rem' }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
            <span style={{ fontSize:'0.8rem', color:'#64748b', fontWeight:500 }}>Confidence Score</span>
            <span style={{ fontSize:'0.8rem', fontWeight:700, color:cfg.color }}>{pct}%</span>
          </div>
          <div style={{ background:'#f1f5f9', borderRadius:100, height:8, overflow:'hidden' }}>
            <div style={{ width:`${pct}%`, height:'100%', borderRadius:100, background:`linear-gradient(90deg,${cfg.color}80,${cfg.color})`, transition:'width 1s ease' }} />
          </div>
        </div>

        {/* Info grid */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:'0.75rem', marginBottom:'1.5rem' }}>
          {[
            { label:'Patient', value:result.patient_name },
            { label:'Disease Type', value:diseaseType },
            { label:'Risk Level', value:cfg.text, color:cfg.color },
            { label:'Date', value:new Date(result.prediction_date).toLocaleDateString() },
          ].map(item => (
            <div key={item.label} style={{ background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:10, padding:'0.75rem 1rem' }}>
              <div style={{ fontSize:'0.7rem', fontWeight:600, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:4 }}>{item.label}</div>
              <div style={{ fontWeight:600, color: item.color || '#0f172a', fontSize:'0.9rem' }}>{item.value}</div>
            </div>
          ))}
        </div>

        {/* Advice box */}
        <div style={{ background:cfg.bg, border:`1px solid ${cfg.border}`, borderRadius:10, padding:'1rem 1.25rem', display:'flex', gap:10, alignItems:'flex-start', marginBottom:'1rem' }}>
          <span style={{ color:cfg.color, fontSize:'1rem', flexShrink:0, marginTop:1 }}>{cfg.icon}</span>
          <div>
            <div style={{ fontWeight:700, color:cfg.color, marginBottom:3, fontSize:'0.875rem' }}>Recommended Action</div>
            <div style={{ color:'#374151', fontSize:'0.875rem', lineHeight:1.6 }}>{cfg.advice}</div>
          </div>
        </div>

        {/* Download */}
        <button onClick={handleDownload} style={{
          width:'100%', padding:'11px', borderRadius:10, cursor:'pointer', fontWeight:600,
          fontSize:'0.875rem', display:'flex', alignItems:'center', justifyContent:'center', gap:8,
          background:'white', border:'1px solid #e2e8f0', color:'#374151',
          transition:'all 0.15s',
        }}
        onMouseEnter={e=>{e.currentTarget.style.background='#f8fafc';e.currentTarget.style.borderColor='#cbd5e1'}}
        onMouseLeave={e=>{e.currentTarget.style.background='white';e.currentTarget.style.borderColor='#e2e8f0'}}>
          <FaDownload style={{ color:'#0c8de4' }} /> Download Report
        </button>

        <p style={{ textAlign:'center', color:'#94a3b8', fontSize:'0.75rem', marginTop:'0.75rem' }}>
          This result is for informational purposes only. Always consult a licensed physician.
        </p>
      </div>
    </div>
  )
}
