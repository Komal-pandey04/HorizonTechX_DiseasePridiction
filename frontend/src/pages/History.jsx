import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { getHistory, deleteHistory } from '../services/api'
import { Search, Trash2, Filter, Clock, Heart, Brain, Ribbon, CheckCircle2, XCircle, AlertTriangle, Download } from 'lucide-react'

const D_META = {
  heart:        { label:'Heart Disease', Icon:Heart,  color:'#ef4444', bg:'#fff5f5' },
  diabetes:     { label:'Diabetes',      Icon:Brain,  color:'#7c3aed', bg:'#faf5ff' },
  breast_cancer:{ label:'Breast Cancer', Icon:Ribbon, color:'#db2777', bg:'#fff5f7' },
}
const RISK_CFG = {
  Low:    { color:'#10b981', bg:'#ecfdf5', Icon:CheckCircle2  },
  Medium: { color:'#f59e0b', bg:'#fffbeb', Icon:AlertTriangle },
  High:   { color:'#ef4444', bg:'#fef2f2', Icon:XCircle       },
}

export default function History() {
  const [records, setRecords]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [fDisease, setFD]       = useState('all')
  const [fRisk, setFR]          = useState('all')
  const [fResult, setFRe]       = useState('all')
  const [deleting, setDeleting] = useState(null)
  const [expanded, setExpanded] = useState(null)

  useEffect(()=>{
    getHistory().then(r=>setRecords(r.data)).catch(()=>toast.error('Could not load history')).finally(()=>setLoading(false))
  },[])

  const handleDelete = async id => {
    if(!window.confirm('Permanently delete this record?')) return
    setDeleting(id)
    try {
      await deleteHistory(id)
      setRecords(p=>p.filter(r=>r.id!==id))
      toast.success('Record deleted')
    } catch { toast.error('Delete failed') }
    finally { setDeleting(null) }
  }

  const downloadCSV = () => {
    const rows = [['ID','Patient','Disease','Result','Confidence%','Risk Level','Date']]
    filtered.forEach(r=>rows.push([r.id,r.patient_name,D_META[r.disease_type]?.label||r.disease_type,r.prediction,Math.round(r.probability*100),r.risk_level,new Date(r.prediction_date).toLocaleDateString()]))
    const csv = rows.map(r=>r.map(v=>`"${v}"`).join(',')).join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([csv],{type:'text/csv'}))
    a.download = 'medipredict_history.csv'
    a.click()
    toast.success('CSV exported!')
  }

  const filtered = records.filter(r=>{
    const ms = r.patient_name.toLowerCase().includes(search.toLowerCase()) || (D_META[r.disease_type]?.label||'').toLowerCase().includes(search.toLowerCase())
    const md = fDisease==='all' || r.disease_type===fDisease
    const mr = fRisk==='all' || r.risk_level===fRisk
    const mre= fResult==='all' || (fResult==='positive' ? ['Positive','Malignant'].includes(r.prediction) : ['Negative','Benign'].includes(r.prediction))
    return ms && md && mr && mre
  })

  if(loading) return (
    <div style={{ display:'flex',justifyContent:'center',alignItems:'center',minHeight:'70vh',flexDirection:'column',gap:16 }}>
      <div style={{ width:40,height:40,border:'3px solid #e2e8f0',borderTopColor:'#3b82f6',borderRadius:'50%',animation:'spin 0.8s linear infinite' }}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  return (
    <div style={{ background:'#f0f4f8',minHeight:'100vh',padding:'2rem 1.5rem' }}>
      <div style={{ maxWidth:1100,margin:'0 auto' }}>
        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'2rem',flexWrap:'wrap',gap:12 }}>
          <div>
            <h1 style={{ fontSize:'1.8rem',fontWeight:900,color:'#1e293b',marginBottom:'0.35rem',display:'flex',alignItems:'center',gap:10 }}>
              <Clock size={24} color="#3b82f6"/> Prediction History
            </h1>
            <p style={{ color:'#64748b' }}>{records.length} total records saved</p>
          </div>
          <button onClick={downloadCSV} style={{ display:'flex',alignItems:'center',gap:8,padding:'10px 18px',borderRadius:10,border:'1px solid #e2e8f0',background:'white',color:'#374151',cursor:'pointer',fontWeight:600,fontSize:'0.85rem',boxShadow:'0 1px 3px rgba(0,0,0,0.05)' }}>
            <Download size={14}/> Export CSV
          </button>
        </div>

        {/* Filters */}
        <div style={{ background:'white',border:'1px solid #e2e8f0',borderRadius:14,padding:'1rem 1.25rem',marginBottom:'1.5rem',display:'flex',gap:10,flexWrap:'wrap',alignItems:'center',boxShadow:'0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ position:'relative',flex:1,minWidth:180 }}>
            <Search size={14} style={{ position:'absolute',left:10,top:'50%',transform:'translateY(-50%)',color:'#94a3b8' }}/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search patient or disease…"
              style={{ width:'100%',padding:'9px 10px 9px 30px',borderRadius:9,border:'1px solid #e2e8f0',fontSize:'0.875rem',color:'#1e293b',outline:'none',background:'white' }}
              onFocus={e=>{e.target.style.borderColor='#3b82f6';e.target.style.boxShadow='0 0 0 3px rgba(59,130,246,0.12)'}}
              onBlur={e=>{e.target.style.borderColor='#e2e8f0';e.target.style.boxShadow='none'}}/>
          </div>
          {[
            {v:fDisease,set:setFD,opts:[['all','All Diseases'],['heart','Heart Disease'],['diabetes','Diabetes'],['breast_cancer','Breast Cancer']]},
            {v:fRisk,set:setFR,opts:[['all','All Risk Levels'],['Low','Low Risk'],['Medium','Medium Risk'],['High','High Risk']]},
            {v:fResult,set:setFRe,opts:[['all','All Results'],['positive','Positive / Malignant'],['negative','Negative / Benign']]},
          ].map((s,i)=>(
            <select key={i} value={s.v} onChange={e=>s.set(e.target.value)} style={{ padding:'9px 12px',borderRadius:9,border:'1px solid #e2e8f0',fontSize:'0.875rem',color:'#374151',outline:'none',cursor:'pointer',background:'white' }}>
              {s.opts.map(([v,l])=><option key={v} value={v}>{l}</option>)}
            </select>
          ))}
          <div style={{ marginLeft:'auto',fontSize:'0.8rem',color:'#64748b',fontWeight:600,whiteSpace:'nowrap' }}>{filtered.length} result{filtered.length!==1?'s':''}</div>
        </div>

        {filtered.length===0 ? (
          <div style={{ background:'white',border:'1px solid #e2e8f0',borderRadius:18,padding:'4rem',textAlign:'center',boxShadow:'0 1px 3px rgba(0,0,0,0.05)' }}>
            <Clock size={44} color="#cbd5e1" style={{ marginBottom:12 }}/>
            <h3 style={{ color:'#94a3b8',fontWeight:700,marginBottom:6 }}>{records.length===0?'No predictions yet':'No matching records'}</h3>
            <p style={{ color:'#cbd5e1',fontSize:'0.875rem' }}>{records.length===0?'Run a prediction to see history here.':'Try adjusting your filters.'}</p>
          </div>
        ) : (
          <div style={{ display:'flex',flexDirection:'column',gap:8 }}>
            <AnimatePresence>
              {filtered.map((r,idx)=>{
                const dm = D_META[r.disease_type]||D_META.heart
                const rc = RISK_CFG[r.risk_level]||RISK_CFG.Medium
                const isPos = ['Positive','Malignant'].includes(r.prediction)
                const isExp = expanded===r.id
                return (
                  <motion.div key={r.id} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,x:-20}} transition={{delay:idx*0.03}}
                    style={{ background:'white',border:'1px solid #e2e8f0',borderRadius:14,overflow:'hidden',boxShadow:'0 1px 3px rgba(0,0,0,0.05)',transition:'box-shadow 0.15s' }}
                    onMouseEnter={e=>e.currentTarget.style.boxShadow='0 4px 16px rgba(0,0,0,0.08)'}
                    onMouseLeave={e=>e.currentTarget.style.boxShadow='0 1px 3px rgba(0,0,0,0.05)'}>
                    {/* Main row */}
                    <div style={{ padding:'1rem 1.25rem',display:'flex',alignItems:'center',gap:14,flexWrap:'wrap',cursor:'pointer' }} onClick={()=>setExpanded(isExp?null:r.id)}>
                      <div style={{ width:38,height:38,borderRadius:10,background:dm.bg,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
                        <dm.Icon size={17} color={dm.color}/>
                      </div>
                      <div style={{ flex:1,minWidth:120 }}>
                        <div style={{ fontWeight:700,color:'#1e293b',fontSize:'0.9rem' }}>{r.patient_name}</div>
                        <div style={{ fontSize:'0.75rem',color:dm.color,fontWeight:600,marginTop:2 }}>{dm.label}</div>
                      </div>
                      <div style={{ background:isPos?'#fef2f2':'#f0fdf4',color:isPos?'#dc2626':'#16a34a',padding:'4px 12px',borderRadius:100,fontSize:'0.78rem',fontWeight:800,minWidth:70,textAlign:'center' }}>
                        {r.prediction}
                      </div>
                      <div style={{ textAlign:'center',minWidth:60 }}>
                        <div style={{ fontWeight:800,color:'#1e293b',fontSize:'0.9rem' }}>{['Positive','Malignant'].includes(r.prediction)
  ? Math.round(r.probability*100)
  : Math.round((1-r.probability)*100)}%</div>
                        <div style={{ fontSize:'0.7rem',color:'#94a3b8' }}>conf.</div>
                      </div>
                      <div style={{ background:rc.bg,color:rc.color,padding:'4px 12px',borderRadius:100,fontSize:'0.75rem',fontWeight:700,minWidth:75,textAlign:'center' }}>
                        {r.risk_level}
                      </div>
                      <div style={{ color:'#64748b',fontSize:'0.8rem',minWidth:90 }}>
                        {new Date(r.prediction_date).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}
                      </div>
                      <button onClick={e=>{e.stopPropagation();handleDelete(r.id)}} disabled={deleting===r.id} style={{
                        background:'none',border:'1px solid #fecaca',borderRadius:8,color:deleting===r.id?'#cbd5e1':'#ef4444',
                        padding:'7px 10px',cursor:deleting===r.id?'not-allowed':'pointer',flexShrink:0,transition:'all 0.15s',
                      }} onMouseEnter={e=>e.currentTarget.style.background='#fef2f2'} onMouseLeave={e=>e.currentTarget.style.background='none'}>
                        <Trash2 size={13}/>
                      </button>
                    </div>

                    {/* Expanded feature importance */}
                    <AnimatePresence>
                      {isExp && r.feature_importance && r.feature_importance.length>0 && (
                        <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} style={{ overflow:'hidden',borderTop:'1px solid #f1f5f9' }}>
                          <div style={{ padding:'1rem 1.25rem',background:'#f8fafc' }}>
                            <div style={{ fontSize:'0.75rem',fontWeight:700,color:'#64748b',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:'0.75rem' }}>Top Contributing Factors</div>
                            <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:'0.6rem' }}>
                              {r.feature_importance.map((f,i)=>{
                                const colors=['#ef4444','#f97316','#f59e0b','#10b981','#3b82f6']
                                const c = colors[i]||'#3b82f6'
                                return (
                                  <div key={f.feature}>
                                    <div style={{ display:'flex',justifyContent:'space-between',fontSize:'0.78rem',marginBottom:3 }}>
                                      <span style={{ color:'#374151',fontWeight:600 }}>{f.feature}</span>
                                      <span style={{ color:c,fontWeight:800 }}>{f.importance.toFixed(1)}%</span>
                                    </div>
                                    <div style={{ height:6,background:'#e2e8f0',borderRadius:10,overflow:'hidden' }}>
                                      <div style={{ width:`${f.importance}%`,height:'100%',borderRadius:10,background:c,transition:'width 0.6s ease' }}/>
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}
