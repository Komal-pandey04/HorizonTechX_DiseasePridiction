import { useState, useRef } from 'react'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Brain, Ribbon, FlaskConical, Download, CheckCircle2, AlertTriangle, XCircle, Activity, RotateCcw, ChevronDown } from 'lucide-react'
import { predictHeart, predictDiabetes, predictBreast } from '../services/api'

/* ── Field definitions ─────────────────────────────────────────────── */
const num  = (name,label,min,max,step,ph,hint='')=>({name,label,min,max,step,ph,hint,type:'number'})
const txt  = (name,label,ph)=>({name,label,ph,type:'text'})
const sel  = (name,label,opts,hint='')=>({name,label,opts,hint,type:'select'})

const HEART_FIELDS=[
  txt('patient_name','Patient Full Name','e.g. Rahul Sharma'),
  num('age','Age','1','120','1','e.g. 55','Years'),
  sel('sex','Biological Sex',[{v:0,l:'Female'},{v:1,l:'Male'}]),
  sel('cp','Chest Pain Type',[{v:0,l:'Typical Angina'},{v:1,l:'Atypical Angina'},{v:2,l:'Non-Anginal Pain'},{v:3,l:'Asymptomatic'}],'0-3'),
  num('trestbps','Resting Blood Pressure','80','200','1','e.g. 130','mmHg'),
  num('chol','Serum Cholesterol','100','600','1','e.g. 250','mg/dl'),
  sel('fbs','Fasting Blood Sugar > 120 mg/dl',[{v:0,l:'No'},{v:1,l:'Yes'}]),
  sel('restecg','Resting ECG',[{v:0,l:'Normal'},{v:1,l:'ST-T Abnormality'},{v:2,l:'LV Hypertrophy'}]),
  num('thalach','Max Heart Rate Achieved','50','220','1','e.g. 150','bpm'),
  sel('exang','Exercise-Induced Angina',[{v:0,l:'No'},{v:1,l:'Yes'}]),
  num('oldpeak','ST Depression (Oldpeak)','0','10','0.1','e.g. 1.5','mm'),
  sel('slope','Peak Exercise ST Slope',[{v:0,l:'Upsloping'},{v:1,l:'Flat'},{v:2,l:'Downsloping'}]),
  sel('ca','Major Vessels (Fluoroscopy)',[{v:0,l:'0'},{v:1,l:'1'},{v:2,l:'2'},{v:3,l:'3'}]),
  sel('thal','Thalassemia',[{v:0,l:'Normal'},{v:1,l:'Fixed Defect'},{v:2,l:'Reversible Defect'},{v:3,l:'Normal (Type 2)'}]),
]
const DIABETES_FIELDS=[
  txt('patient_name','Patient Full Name','e.g. Priya Patel'),
  num('Pregnancies','Number of Pregnancies','0','20','1','e.g. 2','count'),
  num('Glucose','Plasma Glucose','0','300','1','e.g. 120','mg/dl'),
  num('BloodPressure','Diastolic Blood Pressure','0','150','1','e.g. 70','mmHg'),
  num('SkinThickness','Triceps Skin Fold','0','100','1','e.g. 20','mm'),
  num('Insulin','2-Hour Serum Insulin','0','900','1','e.g. 80','mu U/ml'),
  num('BMI','Body Mass Index','0','70','0.1','e.g. 32.0','kg/m²'),
  num('DiabetesPedigreeFunction','Diabetes Pedigree Function','0','3','0.001','e.g. 0.500','0-2.4'),
  num('Age','Age','1','120','1','e.g. 35','Years'),
]
const BREAST_FIELDS=[
  txt('patient_name','Patient Full Name','e.g. Neha Verma'),
  num('radius_mean','Radius Mean','0','50','0.01','e.g. 14.0','μm'),
  num('texture_mean','Texture Mean','0','50','0.01','e.g. 19.0',''),
  num('perimeter_mean','Perimeter Mean','0','300','0.1','e.g. 92.0','μm'),
  num('area_mean','Area Mean','0','3000','1','e.g. 600','μm²'),
  num('smoothness_mean','Smoothness Mean','0','1','0.001','e.g. 0.100',''),
  num('compactness_mean','Compactness Mean','0','1','0.001','e.g. 0.120',''),
  num('concavity_mean','Concavity Mean','0','1','0.001','e.g. 0.100',''),
  num('concave_points_mean','Concave Points Mean','0','1','0.001','e.g. 0.060',''),
  num('symmetry_mean','Symmetry Mean','0','1','0.001','e.g. 0.180',''),
  num('fractal_dimension_mean','Fractal Dimension Mean','0','1','0.001','e.g. 0.062',''),
]

const TABS=[
  {key:'heart',    label:'Heart Disease', Icon:Heart,  color:'#ef4444',bg:'#fff5f5',border:'#fed7d7',fields:HEART_FIELDS,    fn:predictHeart,    disease:'Heart Disease'},
  {key:'diabetes', label:'Diabetes',      Icon:Brain,  color:'#7c3aed',bg:'#faf5ff',border:'#e9d8fd',fields:DIABETES_FIELDS, fn:predictDiabetes, disease:'Diabetes'},
  {key:'breast',   label:'Breast Cancer', Icon:Ribbon, color:'#db2777',bg:'#fff5f7',border:'#fed7e2',fields:BREAST_FIELDS,   fn:predictBreast,   disease:'Breast Cancer'},
]

/* ── Recommendations per disease/risk ─────────────────────────────── */
const RECS={
  heart:{
    Positive:['Consult a cardiologist immediately','Undergo ECG & stress test','Start lipid-lowering therapy','Adopt heart-healthy diet','Monitor BP daily','Avoid smoking & alcohol'],
    Negative:['Maintain current lifestyle','Annual cardiac checkup','Exercise 150 mins/week','Limit saturated fats','Keep cholesterol below 200 mg/dl'],
  },
  diabetes:{
    Positive:['See an endocrinologist soon','Monitor blood glucose daily','Adopt low-glycemic diet','Start an exercise program','Check HbA1c every 3 months','Consider medication review'],
    Negative:['Maintain healthy BMI','Exercise 30 mins daily','Limit refined sugars','Annual glucose test','Stay hydrated (2-3L/day)'],
  },
  breast_cancer:{
    Positive:['Consult an oncologist urgently','Schedule a biopsy','Discuss treatment options','Get a second medical opinion','Seek psychological support','Monthly self-examinations'],
    Negative:['Monthly self-breast exams','Annual mammogram (age 40+)','Maintain healthy BMI','Limit alcohol consumption','Regular gynecology checkups'],
  },
}
const HEALTH_TIPS=[
  '💧 Drink 2–3 litres of water daily',
  '🚶 Walk 30 minutes every day',
  '🥦 Eat 5 servings of vegetables',
  '😴 Get 7–8 hours of sleep',
  '🚭 Avoid smoking and tobacco',
  '🧘 Manage stress with meditation',
]

/* ── Premium Result Card ───────────────────────────────────────────── */
function ResultCard({ result, diseaseKey, diseaseName }) {
  const reportRef = useRef()
  const diseasePct = Math.round(result.probability * 100)
const confidencePct = isPos ? diseasePct : 100 - diseasePct
  const isPos = ['Positive','Malignant'].includes(result.prediction)
  const risk = result.risk_level
  const riskCfg = {
    Low:    {color:'#10b981',bg:'#ecfdf5',border:'#a7f3d0',Icon:CheckCircle2,  label:'Low Risk'},
    Medium: {color:'#f59e0b',bg:'#fffbeb',border:'#fde68a',Icon:AlertTriangle, label:'Moderate Risk'},
    High:   {color:'#ef4444',bg:'#fef2f2',border:'#fecaca',Icon:XCircle,       label:'High Risk'},
  }[risk] || {color:'#f59e0b',bg:'#fffbeb',border:'#fde68a',Icon:AlertTriangle,label:'Moderate Risk'}
  const RiskIcon = riskCfg.Icon
  const recs = RECS[diseaseKey]?.[isPos?'Positive':'Negative'] || []

  const downloadReport = () => {
    const reportId = `MP${Math.random().toString(36).substr(2,8).toUpperCase()}`
    const content = `
╔══════════════════════════════════════════════════════════════╗
║                    MEDIPREDICT AI                            ║
║              AI-Powered Medical Prediction Report            ║
╚══════════════════════════════════════════════════════════════╝

Report ID   : ${reportId}
Date & Time : ${new Date(result.prediction_date).toLocaleString()}
Patient     : ${result.patient_name}
Disease     : ${diseaseName}

──────────────────────────────────────────────────────────────
PREDICTION RESULT
──────────────────────────────────────────────────────────────
Result          : ${result.prediction}
Confidence      : ${pct}%
Risk Level      : ${riskCfg.label}

──────────────────────────────────────────────────────────────
TOP CONTRIBUTING FACTORS
──────────────────────────────────────────────────────────────
${(result.feature_importance||[]).map((f,i)=>`  ${i+1}. ${f.feature.padEnd(22)} ${f.importance.toFixed(1)}%`).join('\n')}

──────────────────────────────────────────────────────────────
AI RECOMMENDATIONS
──────────────────────────────────────────────────────────────
${recs.map((r,i)=>`  ${i+1}. ${r}`).join('\n')}

──────────────────────────────────────────────────────────────
HEALTH TIPS
──────────────────────────────────────────────────────────────
${HEALTH_TIPS.map(t=>`  ${t}`).join('\n')}

──────────────────────────────────────────────────────────────
DISCLAIMER: This report is generated by AI and should NOT replace
professional medical advice. Please consult a qualified physician.
──────────────────────────────────────────────────────────────
MediPredict AI v2.0  |  For Educational Purposes Only
`.trim()
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([content],{type:'text/plain'}))
    a.download = `MediPredict_${diseaseName.replace(' ','_')}_${reportId}.txt`
    a.click()
    toast.success('Report downloaded!')
  }

  return (
    <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.4}} ref={reportRef}
      style={{ background:'white',borderRadius:20,overflow:'hidden',boxShadow:'0 4px 30px rgba(0,0,0,0.10)',border:'1px solid #e2e8f0',marginTop:'2rem' }}>

      {/* Top banner */}
      <div style={{ background:isPos?'linear-gradient(135deg,#ef4444,#f97316)':'linear-gradient(135deg,#10b981,#059669)', padding:'1.5rem 2rem', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <div>
          <div style={{ fontSize:'0.75rem',color:'rgba(255,255,255,0.8)',fontWeight:600,marginBottom:4,textTransform:'uppercase',letterSpacing:'0.05em' }}>Prediction Result</div>
          <div style={{ fontSize:'1.8rem',fontWeight:900,color:'white' }}>
            {isPos ? '⚠ '+diseaseName+' Detected' : '✓ '+diseaseName+' Not Detected'}
          </div>
          <div style={{ fontSize:'0.85rem',color:'rgba(255,255,255,0.8)',marginTop:4 }}>Patient: {result.patient_name}</div>
        </div>
        <div style={{ textAlign:'center' }}>
          <div style={{ fontSize:'3rem',fontWeight:900,color:'white',lineHeight:1 }}>{confidencePct}%</div>
          <div style={{ fontSize:'0.8rem',color:'rgba(255,255,255,0.8)',fontWeight:600 }}>Confidence Score</div>
        </div>
      </div>

      <div style={{ padding:'2rem', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:'2rem' }}>

        {/* Left column */}
        <div>
          {/* Risk gauge */}
          <div style={{ background:riskCfg.bg,border:`1px solid ${riskCfg.border}`,borderRadius:16,padding:'1.25rem',marginBottom:'1.5rem' }}>
            <div style={{ display:'flex',alignItems:'center',gap:12,marginBottom:'1rem' }}>
              <RiskIcon size={24} color={riskCfg.color}/>
              <div>
                <div style={{ fontWeight:800,color:riskCfg.color,fontSize:'1.1rem' }}>{riskCfg.label}</div>
                <div style={{ fontSize:'0.78rem',color:'#64748b' }}>Risk Assessment</div>
              </div>
            </div>
            {/* Bar */}
            <div style={{ background:'rgba(0,0,0,0.08)',borderRadius:10,height:12,overflow:'hidden',marginBottom:6 }}>
              <motion.div initial={{width:0}} animate={{width:`${pct}%`}} transition={{duration:1,delay:0.3}}
                style={{ height:'100%',borderRadius:10,background:riskCfg.color }}/>
            </div>
            <div style={{ display:'flex',justifyContent:'space-between',fontSize:'0.72rem',color:'#94a3b8',fontWeight:600 }}>
              <span>0% — No Risk</span><span style={{color:riskCfg.color,fontWeight:700}}>{diseasePct}%</span><span>100% — Certain</span>
            </div>
          </div>

          {/* Info grid */}
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.75rem',marginBottom:'1.5rem' }}>
            {[
              {l:'Patient',v:result.patient_name},
              {l:'Disease Type',v:diseaseName},
              {l:'Screening Date',v:new Date(result.prediction_date).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})},
              {l:'Report ID',v:`#MP${result.id?.toString().padStart(5,'0')}`},
            ].map(({l,v})=>(
              <div key={l} style={{ background:'#f8fafc',border:'1px solid #e2e8f0',borderRadius:10,padding:'0.75rem' }}>
                <div style={{ fontSize:'0.68rem',fontWeight:700,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:3 }}>{l}</div>
                <div style={{ fontWeight:700,color:'#1e293b',fontSize:'0.87rem' }}>{v}</div>
              </div>
            ))}
          </div>

          {/* Recommendations */}
          <div style={{ background:'#f8fafc',border:'1px solid #e2e8f0',borderRadius:14,padding:'1.25rem' }}>
            <div style={{ fontWeight:700,color:'#1e293b',marginBottom:'0.75rem',display:'flex',alignItems:'center',gap:8,fontSize:'0.95rem' }}>
              <Activity size={16} color="#3b82f6"/> AI Recommendation
            </div>
            <div style={{ display:'flex',flexDirection:'column',gap:6 }}>
              {recs.map((r,i)=>(
                <div key={i} style={{ display:'flex',alignItems:'flex-start',gap:8 }}>
                  <CheckCircle2 size={14} color="#10b981" style={{ flexShrink:0,marginTop:2 }}/>
                  <span style={{ fontSize:'0.83rem',color:'#374151',lineHeight:1.5 }}>{r}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div>
          {/* Feature importance */}
          {result.feature_importance && result.feature_importance.length > 0 && (
            <div style={{ background:'white',border:'1px solid #e2e8f0',borderRadius:14,padding:'1.25rem',marginBottom:'1.5rem' }}>
              <div style={{ fontWeight:700,color:'#1e293b',marginBottom:'1rem',fontSize:'0.95rem' }}>
                Top Contributing Factors
              </div>
              <div style={{ display:'flex',flexDirection:'column',gap:10 }}>
                {result.feature_importance.map((f,i)=>{
                  const colors=['#ef4444','#f97316','#f59e0b','#10b981','#3b82f6']
                  const c = colors[i]||'#3b82f6'
                  return (
                    <div key={f.feature}>
                      <div style={{ display:'flex',justifyContent:'space-between',marginBottom:4 }}>
                        <span style={{ fontSize:'0.82rem',fontWeight:600,color:'#374151' }}>{f.feature}</span>
                        <span style={{ fontSize:'0.82rem',fontWeight:800,color:c }}>{f.importance.toFixed(1)}%</span>
                      </div>
                      <div style={{ height:8,background:'#f1f5f9',borderRadius:10,overflow:'hidden' }}>
                        <motion.div initial={{width:0}} animate={{width:`${f.importance}%`}} transition={{duration:0.8,delay:0.2+i*0.1}}
                          style={{ height:'100%',borderRadius:10,background:c }}/>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Health tips */}
          <div style={{ background:'linear-gradient(135deg,#eff6ff,#ecfdf5)',border:'1px solid #bfdbfe',borderRadius:14,padding:'1.25rem',marginBottom:'1.5rem' }}>
            <div style={{ fontWeight:700,color:'#1e293b',marginBottom:'0.75rem',fontSize:'0.95rem' }}>Today's Health Tips</div>
            <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:6 }}>
              {HEALTH_TIPS.map((t,i)=>(
                <div key={i} style={{ fontSize:'0.78rem',color:'#374151',background:'white',borderRadius:8,padding:'6px 10px',border:'1px solid #e2e8f0' }}>{t}</div>
              ))}
            </div>
          </div>

          {/* Download */}
          <button onClick={downloadReport} style={{
            width:'100%',padding:'13px',borderRadius:12,border:'none',cursor:'pointer',
            background:'linear-gradient(135deg,#1e293b,#334155)',color:'white',
            fontWeight:700,fontSize:'0.9rem',display:'flex',alignItems:'center',justifyContent:'center',gap:8,
            boxShadow:'0 4px 16px rgba(30,41,59,0.3)',
          }}>
            <Download size={16}/> Download Full Report
          </button>
          <p style={{ textAlign:'center',color:'#94a3b8',fontSize:'0.72rem',marginTop:'0.75rem' }}>
            ⚕️ AI-generated. Always consult a licensed physician.
          </p>
        </div>
      </div>
    </motion.div>
  )
}

/* ── Input Field ───────────────────────────────────────────────────── */
function Field({ f, value, onChange, accentColor }) {
  const base = { width:'100%',padding:'10px 12px',borderRadius:10,border:'1px solid #e2e8f0',background:'white',color:'#1e293b',fontSize:'0.875rem',outline:'none',transition:'all 0.15s' }
  const focus = (e)=>{ e.target.style.borderColor=accentColor; e.target.style.boxShadow=`0 0 0 3px ${accentColor}20` }
  const blur  = (e)=>{ e.target.style.borderColor='#e2e8f0';  e.target.style.boxShadow='none' }
  return (
    <div>
      <label style={{ display:'block',fontSize:'0.75rem',fontWeight:700,color:'#374151',marginBottom:5,textTransform:'uppercase',letterSpacing:'0.04em' }}>
        {f.label}{f.hint&&<span style={{color:'#94a3b8',fontWeight:400,marginLeft:4,textTransform:'none'}}>({f.hint})</span>}
      </label>
      {f.type==='select'
        ? <select name={f.name} value={value??''} onChange={onChange} onFocus={focus} onBlur={blur} style={{...base,cursor:'pointer',appearance:'none',backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,backgroundRepeat:'no-repeat',backgroundPosition:'right 10px center',paddingRight:28}}>
            <option value=''>Select…</option>
            {f.opts.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}
          </select>
        : <input type={f.type} name={f.name} value={value??''} onChange={onChange} onFocus={focus} onBlur={blur}
            min={f.min} max={f.max} step={f.step} placeholder={f.ph} style={base}/>
      }
    </div>
  )
}

/* ── Disease Form ──────────────────────────────────────────────────── */
function DiseaseForm({ tab, onResult }) {
  const [vals, setVals] = useState({})
  const [loading, setLoading] = useState(false)
  const change = e => setVals(p=>({...p,[e.target.name]:e.target.value}))

  const submit = async () => {
    for (const f of tab.fields) {
      if (!vals[f.name] && vals[f.name]!=='0') { toast.error(`Please fill: ${f.label}`); return }
    }
    setLoading(true)
    try {
      const payload={}
      for (const f of tab.fields) payload[f.name] = f.type==='text' ? vals[f.name] : parseFloat(vals[f.name])
      const { data } = await tab.fn(payload)
      onResult(data)
      toast.success('Prediction complete!')
      setTimeout(()=>document.getElementById('result-section')?.scrollIntoView({behavior:'smooth'}),100)
    } catch(e) {
      toast.error(e.response?.data?.detail || 'Prediction failed. Is the backend running on port 8000?')
    } finally { setLoading(false) }
  }

  return (
    <div>
      <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))',gap:'1rem',marginBottom:'1.75rem' }}>
        {tab.fields.map(f=><Field key={f.name} f={f} value={vals[f.name]} onChange={change} accentColor={tab.color}/>)}
      </div>
      <div style={{ display:'flex',gap:12 }}>
        <button onClick={submit} disabled={loading} style={{
          flex:1,padding:'14px',borderRadius:12,border:'none',fontWeight:700,fontSize:'0.95rem',
          cursor:loading?'not-allowed':'pointer',
          background:loading?'#e2e8f0':`linear-gradient(135deg,${tab.color},${tab.color}dd)`,
          color:loading?'#94a3b8':'white',
          boxShadow:loading?'none':`0 4px 16px ${tab.color}40`,
          display:'flex',alignItems:'center',justifyContent:'center',gap:8,transition:'all 0.2s',
        }}>
          {loading
            ? <><span style={{width:16,height:16,border:'2px solid #94a3b8',borderTopColor:'transparent',borderRadius:'50%',display:'inline-block',animation:'spin 0.7s linear infinite'}}/>Analyzing...</>
            : <><FlaskConical size={16}/>Run {tab.label} Prediction</>}
        </button>
        <button onClick={()=>setVals({})} style={{ padding:'14px 20px',borderRadius:12,border:'1px solid #e2e8f0',background:'white',color:'#64748b',cursor:'pointer',fontWeight:600,fontSize:'0.85rem',display:'flex',alignItems:'center',gap:6 }}>
          <RotateCcw size={14}/>Clear
        </button>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

/* ── Page ──────────────────────────────────────────────────────────── */
export default function Predict() {
  const [active, setActive] = useState('heart')
  const [result, setResult] = useState(null)
  const tab = TABS.find(t=>t.key===active)

  return (
    <div style={{ background:'#f0f4f8',minHeight:'100vh',padding:'2rem 1.5rem' }}>
      <div style={{ maxWidth:1000,margin:'0 auto' }}>
        <div style={{ marginBottom:'2rem' }}>
          <h1 style={{ fontSize:'1.8rem',fontWeight:900,color:'#1e293b',marginBottom:'0.35rem' }}>Disease Prediction</h1>
          <p style={{ color:'#64748b' }}>Select a disease type, fill in clinical measurements, and receive an instant AI prediction report.</p>
        </div>

        {/* Tab selector */}
        <div style={{ background:'white',border:'1px solid #e2e8f0',borderRadius:16,padding:6,display:'flex',gap:6,marginBottom:'1.75rem',width:'fit-content',flexWrap:'wrap',boxShadow:'0 1px 4px rgba(0,0,0,0.05)' }}>
          {TABS.map(t=>{
            const isA=active===t.key
            return (
              <button key={t.key} onClick={()=>{setActive(t.key);setResult(null)}} style={{
                display:'flex',alignItems:'center',gap:8,padding:'10px 20px',borderRadius:12,border:'none',cursor:'pointer',
                fontWeight:isA?700:500,fontSize:'0.875rem',transition:'all 0.2s',
                background:isA?t.bg:'transparent',color:isA?t.color:'#64748b',
                boxShadow:isA?`0 0 0 1.5px ${t.color}40`:'none',
              }}>
                <t.Icon size={15}/>{t.label}
              </button>
            )
          })}
        </div>

        {/* Form card */}
        <div style={{ background:'white',border:'1px solid #e2e8f0',borderRadius:20,padding:'2rem',boxShadow:'0 2px 12px rgba(0,0,0,0.05)' }}>
          <div style={{ display:'flex',alignItems:'center',gap:12,marginBottom:'2rem',paddingBottom:'1.25rem',borderBottom:'1px solid #f1f5f9' }}>
            <div style={{ width:46,height:46,borderRadius:12,background:tab.bg,display:'flex',alignItems:'center',justifyContent:'center',border:`1px solid ${tab.border}` }}>
              <tab.Icon size={22} color={tab.color}/>
            </div>
            <div>
              <h2 style={{ fontWeight:800,color:'#1e293b',fontSize:'1.05rem',margin:0 }}>{tab.label} Assessment</h2>
              <p style={{ color:'#64748b',fontSize:'0.8rem',margin:0 }}>All fields required for accurate prediction</p>
            </div>
          </div>
          <DiseaseForm key={active} tab={tab} onResult={setResult}/>
        </div>

        {/* Result */}
        <div id="result-section">
          <AnimatePresence>
            {result && <ResultCard key={result.id} result={result} diseaseKey={active} diseaseName={tab.disease}/>}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
