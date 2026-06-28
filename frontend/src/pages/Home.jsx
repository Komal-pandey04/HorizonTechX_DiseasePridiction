import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, Brain, Ribbon, Activity, ShieldCheck, Zap, BarChart3, ArrowRight, ChevronRight } from 'lucide-react'

const card = (delay) => ({
  initial:{ opacity:0, y:24 }, animate:{ opacity:1, y:0 }, transition:{ delay, duration:0.4, ease:'easeOut' }
})

const DISEASES = [
  { icon:Heart,  title:'Heart Disease', color:'#ef4444', bg:'#fff5f5', border:'#fed7d7', acc:'95%', route:'/predict',
    desc:'Analyze 13 clinical markers including ECG patterns, cholesterol, and blood pressure for cardiac risk.' },
  { icon:Brain,  title:'Diabetes',      color:'#7c3aed', bg:'#faf5ff', border:'#e9d8fd', acc:'82%', route:'/predict',
    desc:'Screen for Type 2 diabetes using glucose, BMI, insulin resistance and metabolic indicators.' },
  { icon:Ribbon, title:'Breast Cancer', color:'#db2777', bg:'#fff5f7', border:'#fed7e2', acc:'99.6%', route:'/predict',
    desc:'Evaluate 10 cell nucleus features from fine needle aspirate for malignancy classification.' },
]
const FEATURES = [
  { icon:Zap,        title:'Instant AI Predictions', desc:'Real-time ML inference. Results in under 500ms.', color:'#f59e0b' },
  { icon:BarChart3,  title:'Feature Importance',     desc:'See which clinical factors drove the prediction.', color:'#3b82f6' },
  { icon:ShieldCheck,title:'Clinical Datasets',      desc:'Trained on real WHO-approved medical datasets.', color:'#10b981' },
  { icon:Activity,   title:'Risk Assessment',        desc:'Low / Medium / High risk with tailored advice.', color:'#db2777' },
]
const STEPS = [
  { n:'01', title:'Enter Patient Data',  desc:'Fill in the clinical measurements in our structured form.' },
  { n:'02', title:'AI Analysis',         desc:'Our ML model processes inputs using clinical training data.' },
  { n:'03', title:'Get Prediction',      desc:'Receive prediction, confidence score and risk level.' },
  { n:'04', title:'Download Report',     desc:'Export a detailed report with recommendations.' },
]
const STATS = [
  ['1,248+','Predictions Made'], ['99.6%','Best AUC Score'], ['3','Disease Models'], ['4','ML Algorithms'],
]

export default function Home() {
  return (
    <div style={{ background:'#f0f4f8' }}>

      {/* Hero */}
      <section style={{ background:'linear-gradient(135deg,#1e293b 0%,#0f172a 50%,#1e3a5f 100%)', padding:'5rem 2rem 4rem', position:'relative', overflow:'hidden' }}>
        {/* Decorative blobs */}
        <div style={{ position:'absolute',top:'-20%',right:'-5%',width:500,height:500,borderRadius:'50%',background:'radial-gradient(circle,rgba(59,130,246,0.12) 0%,transparent 70%)',pointerEvents:'none' }}/>
        <div style={{ position:'absolute',bottom:'-30%',left:'0%',width:400,height:400,borderRadius:'50%',background:'radial-gradient(circle,rgba(6,182,212,0.08) 0%,transparent 70%)',pointerEvents:'none' }}/>

        <div style={{ maxWidth:1100,margin:'0 auto',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'4rem',alignItems:'center' }}>
          <motion.div {...card(0)}>
            <div style={{ display:'inline-flex',alignItems:'center',gap:8,background:'rgba(59,130,246,0.15)',border:'1px solid rgba(59,130,246,0.3)',borderRadius:100,padding:'5px 14px',marginBottom:'1.5rem' }}>
              <span style={{ width:7,height:7,borderRadius:'50%',background:'#60a5fa',animation:'pulse 2s infinite',display:'inline-block' }}/>
              <span style={{ color:'#93c5fd',fontSize:'0.78rem',fontWeight:600 }}>AI-Powered Disease Screening</span>
            </div>
            <h1 style={{ fontSize:'clamp(2rem,3.5vw,3rem)',fontWeight:900,color:'#f1f5f9',lineHeight:1.15,letterSpacing:'-0.03em',marginBottom:'1.25rem' }}>
              AI-Powered<br/>
              <span style={{ background:'linear-gradient(135deg,#60a5fa,#34d399)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent' }}>
                Disease Prediction
              </span><br/>
              <span style={{ color:'#94a3b8',fontSize:'0.75em',fontWeight:600 }}>for a Healthier Tomorrow</span>
            </h1>
            <p style={{ color:'#94a3b8',fontSize:'1.05rem',lineHeight:1.7,marginBottom:'2rem',maxWidth:460 }}>
              Advanced machine learning models to predict Heart Disease, Diabetes, and Breast Cancer with clinical-grade accuracy.
            </p>
            <div style={{ display:'flex',gap:12,flexWrap:'wrap' }}>
              <Link to="/predict" style={{ display:'flex',alignItems:'center',gap:8,padding:'13px 28px',borderRadius:12,background:'linear-gradient(135deg,#3b82f6,#06b6d4)',color:'#fff',fontWeight:700,fontSize:'0.95rem',boxShadow:'0 4px 20px rgba(59,130,246,0.4)' }}>
                Start Prediction <ArrowRight size={16}/>
              </Link>
              <Link to="/dashboard" style={{ padding:'13px 28px',borderRadius:12,background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.15)',color:'#e2e8f0',fontWeight:600,fontSize:'0.95rem' }}>
                View Dashboard
              </Link>
            </div>
            {/* Stats row */}
            <div style={{ display:'flex',gap:'2rem',marginTop:'2.5rem',flexWrap:'wrap' }}>
              {STATS.map(([v,l])=>(
                <div key={l}>
                  <div style={{ fontSize:'1.5rem',fontWeight:800,color:'#60a5fa' }}>{v}</div>
                  <div style={{ fontSize:'0.75rem',color:'#64748b',fontWeight:500 }}>{l}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Preview card */}
          <motion.div {...card(0.15)} style={{ display:'flex',justifyContent:'center' }}>
            <div style={{ background:'rgba(255,255,255,0.04)',backdropFilter:'blur(20px)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:24,padding:'1.75rem',maxWidth:340,width:'100%' }}>
              <div style={{ display:'flex',alignItems:'center',gap:10,marginBottom:'1.25rem' }}>
                <div style={{ width:38,height:38,borderRadius:10,background:'linear-gradient(135deg,#ef4444,#f97316)',display:'flex',alignItems:'center',justifyContent:'center' }}>
                  <Heart size={18} color="white"/>
                </div>
                <div>
                  <div style={{ fontWeight:700,color:'#f1f5f9',fontSize:'0.9rem' }}>Heart Disease Result</div>
                  <div style={{ fontSize:'0.72rem',color:'#64748b' }}>Patient: Rahul Sharma</div>
                </div>
                <div style={{ marginLeft:'auto',background:'#fef2f2',color:'#dc2626',padding:'4px 10px',borderRadius:100,fontSize:'0.72rem',fontWeight:800 }}>HIGH RISK</div>
              </div>
              {/* Gauge visual */}
              <div style={{ textAlign:'center',padding:'1rem 0',borderBottom:'1px solid rgba(255,255,255,0.08)',marginBottom:'1rem' }}>
                <div style={{ fontSize:'3rem',fontWeight:900,color:'#ef4444',lineHeight:1 }}>94.2%</div>
                <div style={{ color:'#64748b',fontSize:'0.8rem',marginTop:4 }}>Confidence Score</div>
              </div>
              {[['Chest Pain Type','98%','#ef4444'],['Max Heart Rate','85%','#f97316'],['Cholesterol','76%','#f59e0b'],['ST Depression','65%','#10b981']].map(([k,v,c])=>(
                <div key={k} style={{ marginBottom:8 }}>
                  <div style={{ display:'flex',justifyContent:'space-between',fontSize:'0.75rem',color:'#94a3b8',marginBottom:3 }}>
                    <span>{k}</span><span style={{ color:c,fontWeight:700 }}>{v}</span>
                  </div>
                  <div style={{ height:5,background:'rgba(255,255,255,0.08)',borderRadius:10 }}>
                    <div style={{ width:v,height:'100%',borderRadius:10,background:c }}/>
                  </div>
                </div>
              ))}
              <div style={{ marginTop:'1rem',background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.2)',borderRadius:10,padding:'10px 12px',fontSize:'0.78rem',color:'#fca5a5' }}>
                ⚠️ Consult a cardiologist immediately
              </div>
            </div>
          </motion.div>
        </div>
        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
      </section>

      {/* Disease cards */}
      <section style={{ padding:'4rem 2rem', maxWidth:1100, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:'3rem' }}>
          <h2 style={{ fontSize:'2rem',fontWeight:800,color:'#1e293b',marginBottom:'0.5rem' }}>Our Prediction Services</h2>
          <p style={{ color:'#64748b' }}>Trained on real peer-reviewed clinical datasets from UCI and WHO</p>
        </div>
        <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(290px,1fr))',gap:'1.5rem' }}>
          {DISEASES.map((d,i)=>{
            const Icon = d.icon
            return (
              <motion.div key={d.title} {...card(i*0.1)} style={{
                background:'white',border:`1px solid ${d.border}`,borderRadius:20,padding:'2rem',
                boxShadow:'0 2px 12px rgba(0,0,0,0.05)',transition:'transform 0.2s,box-shadow 0.2s',
              }}
              onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.boxShadow='0 12px 40px rgba(0,0,0,0.10)'}}
              onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='0 2px 12px rgba(0,0,0,0.05)'}}>
                <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'1.25rem' }}>
                  <div style={{ width:52,height:52,borderRadius:14,background:d.bg,display:'flex',alignItems:'center',justifyContent:'center' }}>
                    <Icon size={24} color={d.color}/>
                  </div>
                  <span style={{ background:d.bg,color:d.color,padding:'4px 12px',borderRadius:100,fontSize:'0.78rem',fontWeight:800 }}>AUC {d.acc}</span>
                </div>
                <h3 style={{ fontWeight:800,fontSize:'1.1rem',color:'#1e293b',marginBottom:'0.5rem' }}>{d.title}</h3>
                <p style={{ color:'#64748b',fontSize:'0.875rem',lineHeight:1.65,marginBottom:'1.25rem' }}>{d.desc}</p>
                <Link to={d.route} style={{ display:'inline-flex',alignItems:'center',gap:6,color:d.color,fontWeight:700,fontSize:'0.875rem' }}>
                  Predict Now <ChevronRight size={14}/>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Features */}
      <section style={{ background:'white',borderTop:'1px solid #e2e8f0',borderBottom:'1px solid #e2e8f0',padding:'4rem 2rem' }}>
        <div style={{ maxWidth:1100,margin:'0 auto' }}>
          <div style={{ textAlign:'center',marginBottom:'3rem' }}>
            <h2 style={{ fontSize:'2rem',fontWeight:800,color:'#1e293b',marginBottom:'0.5rem' }}>Why MediPredict AI?</h2>
            <p style={{ color:'#64748b' }}>Built with production-grade ML engineering practices</p>
          </div>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:'1.25rem' }}>
            {FEATURES.map(f=>{
              const Icon = f.icon
              return (
                <div key={f.title} style={{ background:'#f8fafc',border:'1px solid #e2e8f0',borderRadius:16,padding:'1.5rem' }}>
                  <div style={{ width:44,height:44,borderRadius:12,background:`${f.color}15`,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'1rem' }}>
                    <Icon size={20} color={f.color}/>
                  </div>
                  <h4 style={{ fontWeight:700,color:'#1e293b',marginBottom:'0.4rem',fontSize:'0.95rem' }}>{f.title}</h4>
                  <p style={{ color:'#64748b',fontSize:'0.83rem',lineHeight:1.6 }}>{f.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding:'4rem 2rem', maxWidth:1100, margin:'0 auto' }}>
        <div style={{ textAlign:'center',marginBottom:'3rem' }}>
          <h2 style={{ fontSize:'2rem',fontWeight:800,color:'#1e293b',marginBottom:'0.5rem' }}>How It Works</h2>
          <p style={{ color:'#64748b' }}>Four simple steps to your AI health report</p>
        </div>
        <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'1.5rem' }}>
          {STEPS.map((s,i)=>(
            <div key={s.n} style={{ textAlign:'center' }}>
              <div style={{ width:52,height:52,borderRadius:14,background:'linear-gradient(135deg,#3b82f6,#06b6d4)',color:'white',fontWeight:800,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 1rem',fontSize:'0.85rem' }}>{s.n}</div>
              <h4 style={{ fontWeight:700,color:'#1e293b',marginBottom:'0.4rem' }}>{s.title}</h4>
              <p style={{ color:'#64748b',fontSize:'0.83rem',lineHeight:1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:'0 2rem 4rem',maxWidth:1100,margin:'0 auto' }}>
        <div style={{ background:'linear-gradient(135deg,#1e293b,#1e3a5f)',borderRadius:24,padding:'3.5rem 2.5rem',textAlign:'center',position:'relative',overflow:'hidden' }}>
          <div style={{ position:'absolute',top:'-30%',right:'-5%',width:300,height:300,borderRadius:'50%',background:'radial-gradient(circle,rgba(59,130,246,0.2) 0%,transparent 70%)',pointerEvents:'none' }}/>
          <h2 style={{ fontSize:'2rem',fontWeight:800,color:'#f1f5f9',marginBottom:'0.75rem' }}>Ready to Get Screened?</h2>
          <p style={{ color:'#94a3b8',marginBottom:'2rem',fontSize:'1rem',maxWidth:480,margin:'0 auto 2rem' }}>
            Enter patient data and receive an instant AI-powered disease screening report.
          </p>
          <Link to="/predict" style={{ display:'inline-flex',alignItems:'center',gap:8,padding:'14px 32px',borderRadius:12,background:'linear-gradient(135deg,#3b82f6,#06b6d4)',color:'white',fontWeight:700,boxShadow:'0 4px 20px rgba(59,130,246,0.4)' }}>
            Start Free Prediction <ArrowRight size={16}/>
          </Link>
        </div>
      </section>
    </div>
  )
}
