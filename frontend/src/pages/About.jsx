import { CheckCircle2, Database, FlaskConical, BarChart3, Code2, Beaker } from 'lucide-react'

const DATASETS = [
  { title:'Heart Disease', color:'#ef4444', bg:'#fef2f2', border:'#fecaca',
    source:'UCI Heart Disease Dataset', samples:303, features:13,
    desc:'Clinical records from Cleveland, Hungary, Switzerland and VA Long Beach. Binary classification: presence or absence of coronary artery disease.' },
  { title:'Diabetes', color:'#7c3aed', bg:'#faf5ff', border:'#e9d8fd',
    source:'Pima Indians Diabetes Dataset', samples:768, features:8,
    desc:'Female patients of Pima Indian heritage, age 21+. Predicts onset of Type 2 diabetes using metabolic measurements.' },
  { title:'Breast Cancer', color:'#db2777', bg:'#fff5f7', border:'#fed7e2',
    source:'Wisconsin Breast Cancer Dataset', samples:569, features:30,
    desc:'Cell nucleus features from fine needle aspirate images. Classifies tumors as Malignant or Benign with 99.6% AUC.' },
]

const ALGOS = [
  { name:'Logistic Regression', color:'#3b82f6', desc:'Fast, interpretable linear classifier. Strong baseline — coefficients directly show feature impact.' },
  { name:'Support Vector Machine', color:'#0d9488', desc:'Finds maximum-margin separating hyperplane. Excellent for high-dimensional medical feature spaces.' },
  { name:'Random Forest', color:'#f59e0b', desc:'Ensemble of decision trees. Handles non-linear relationships, provides native feature importance.' },
  { name:'XGBoost', color:'#db2777', desc:'Gradient-boosted trees. State-of-the-art on tabular clinical data, resistant to overfitting.' },
]

const PIPELINE = [
  ['Data Cleaning', 'Remove nulls, replace zero-values in clinical fields (medically impossible) with column medians.'],
  ['Feature Scaling', 'StandardScaler: subtract mean, divide by std dev. Ensures no feature dominates by magnitude.'],
  ['Stratified Split', '80% train / 20% test, stratified by target class to preserve class ratios in both sets.'],
  ['Multi-Model Training', 'Each of 3–4 algorithms trained independently on the same scaled training data.'],
  ['Evaluation Suite', 'Accuracy, Precision, Recall, F1, and ROC-AUC computed on held-out test set.'],
  ['Auto Best-Model Selection', 'Model with highest ROC-AUC is persisted as the production model for that disease.'],
]

const STACK = [
  {name:'React 18',       cat:'Frontend',         color:'#61dafb'},
  {name:'Vite',           cat:'Build Tool',        color:'#646cff'},
  {name:'Tailwind CSS',   cat:'Styling',           color:'#06b6d4'},
  {name:'Framer Motion',  cat:'Animations',        color:'#ff4d4d'},
  {name:'Recharts',       cat:'Data Viz',          color:'#8b5cf6'},
  {name:'Lucide React',   cat:'Icons',             color:'#64748b'},
  {name:'FastAPI',        cat:'REST API',           color:'#009688'},
  {name:'SQLAlchemy',     cat:'ORM',               color:'#d9534f'},
  {name:'SQLite',         cat:'Database',          color:'#f59e0b'},
  {name:'scikit-learn',   cat:'ML',                color:'#f97316'},
  {name:'XGBoost',        cat:'ML',                color:'#db2777'},
  {name:'Pydantic v2',    cat:'Validation',        color:'#3b82f6'},
]

const ACCURACY = [
  {disease:'Heart Disease', model:'Random Forest',      auc:'94.6%', acc:'86.7%', color:'#ef4444'},
  {disease:'Diabetes',      model:'Random Forest',      auc:'81.8%', acc:'77.9%', color:'#7c3aed'},
  {disease:'Breast Cancer', model:'Logistic Regression',auc:'99.6%', acc:'96.5%', color:'#db2777'},
]

function SectionTitle({ icon: Icon, color, children, sub }) {
  return (
    <div style={{ marginBottom:'1.5rem' }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
        <div style={{ width:32, height:32, borderRadius:9, background:`${color}18`, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <Icon size={16} color={color}/>
        </div>
        <h2 style={{ fontSize:'1.25rem', fontWeight:800, color:'#0f172a', margin:0 }}>{children}</h2>
      </div>
      {sub && <p style={{ color:'#64748b', fontSize:'0.85rem', marginLeft:42 }}>{sub}</p>}
    </div>
  )
}

export default function About() {
  return (
    <div style={{ background:'#f0f4f8', minHeight:'100vh', padding:'2rem 1.5rem' }}>
      <div style={{ maxWidth:1100, margin:'0 auto' }}>

        {/* Hero banner */}
        <div style={{ background:'linear-gradient(135deg,#0f172a,#1e3a5f)', borderRadius:22, padding:'3rem 2.5rem', marginBottom:'2rem', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:'-30%', right:'-5%', width:320, height:320, borderRadius:'50%', background:'radial-gradient(circle,rgba(59,130,246,0.15) 0%,transparent 70%)', pointerEvents:'none' }}/>
          <div style={{ position:'absolute', bottom:'-40%', left:'10%', width:250, height:250, borderRadius:'50%', background:'radial-gradient(circle,rgba(6,182,212,0.10) 0%,transparent 70%)', pointerEvents:'none' }}/>
          <h1 style={{ fontSize:'2.2rem', fontWeight:900, color:'#f1f5f9', marginBottom:'0.75rem', position:'relative' }}>About MediPredict AI</h1>
          <p style={{ color:'#94a3b8', maxWidth:600, lineHeight:1.7, fontSize:'1rem', position:'relative' }}>
            A production-ready, full-stack AI healthcare platform that predicts Heart Disease, Diabetes,
            and Breast Cancer — trained on real clinical datasets with rigorous ML engineering.
          </p>
          <div style={{ display:'flex', gap:'2.5rem', marginTop:'2rem', flexWrap:'wrap', position:'relative' }}>
            {[['3','Disease Models'],['4','ML Algorithms'],['1,680','Training Samples'],['99.6%','Best AUC']].map(([v,l])=>(
              <div key={l}>
                <div style={{ fontSize:'1.6rem', fontWeight:800, color:'#60a5fa' }}>{v}</div>
                <div style={{ fontSize:'0.75rem', color:'#64748b', fontWeight:500 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Model accuracy summary */}
        <div style={{ background:'white', border:'1px solid #e2e8f0', borderRadius:18, padding:'1.75rem', marginBottom:'2rem', boxShadow:'0 1px 4px rgba(0,0,0,0.05)' }}>
          <SectionTitle icon={BarChart3} color="#3b82f6" sub="Production model performance on held-out test data">
            Model Performance Summary
          </SectionTitle>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(250px,1fr))', gap:'1rem' }}>
            {ACCURACY.map(a => (
              <div key={a.disease} style={{ background:'#f8fafc', border:`1px solid ${a.color}25`, borderRadius:14, padding:'1.25rem', borderLeft:`4px solid ${a.color}` }}>
                <div style={{ fontWeight:800, color:'#0f172a', fontSize:'1rem', marginBottom:4 }}>{a.disease}</div>
                <div style={{ fontSize:'0.78rem', color:'#64748b', marginBottom:'0.75rem' }}>Best: {a.model}</div>
                <div style={{ display:'flex', gap:'1.5rem' }}>
                  <div>
                    <div style={{ fontSize:'1.6rem', fontWeight:900, color:a.color }}>{a.auc}</div>
                    <div style={{ fontSize:'0.7rem', color:'#94a3b8', fontWeight:600 }}>ROC-AUC</div>
                  </div>
                  <div>
                    <div style={{ fontSize:'1.6rem', fontWeight:900, color:'#0f172a' }}>{a.acc}</div>
                    <div style={{ fontSize:'0.7rem', color:'#94a3b8', fontWeight:600 }}>Accuracy</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Datasets */}
        <div style={{ background:'white', border:'1px solid #e2e8f0', borderRadius:18, padding:'1.75rem', marginBottom:'2rem', boxShadow:'0 1px 4px rgba(0,0,0,0.05)' }}>
          <SectionTitle icon={Database} color="#0d9488" sub="Real peer-reviewed clinical datasets">
            Training Datasets
          </SectionTitle>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(290px,1fr))', gap:'1rem' }}>
            {DATASETS.map(d => (
              <div key={d.title} style={{ background:d.bg, border:`1px solid ${d.border}`, borderRadius:14, padding:'1.25rem', borderTop:`3px solid ${d.color}` }}>
                <div style={{ fontWeight:800, color:'#0f172a', marginBottom:3 }}>{d.title}</div>
                <div style={{ fontSize:'0.75rem', color:d.color, fontWeight:600, marginBottom:'0.6rem' }}>{d.source}</div>
                <div style={{ display:'flex', gap:8, marginBottom:'0.75rem' }}>
                  <span style={{ background:'white', color:'#374151', padding:'3px 10px', borderRadius:100, fontSize:'0.72rem', fontWeight:700, border:'1px solid #e2e8f0' }}>{d.samples} samples</span>
                  <span style={{ background:'white', color:'#374151', padding:'3px 10px', borderRadius:100, fontSize:'0.72rem', fontWeight:700, border:'1px solid #e2e8f0' }}>{d.features} features</span>
                </div>
                <p style={{ color:'#64748b', fontSize:'0.82rem', lineHeight:1.65, margin:0 }}>{d.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Algorithms */}
        <div style={{ background:'white', border:'1px solid #e2e8f0', borderRadius:18, padding:'1.75rem', marginBottom:'2rem', boxShadow:'0 1px 4px rgba(0,0,0,0.05)' }}>
          <SectionTitle icon={Beaker} color="#7c3aed" sub="Four algorithms trained per disease, best selected by AUC">
            ML Algorithms
          </SectionTitle>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(230px,1fr))', gap:'1rem' }}>
            {ALGOS.map(a => (
              <div key={a.name} style={{ background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:12, padding:'1.25rem' }}>
                <div style={{ width:'100%', height:4, borderRadius:4, background:a.color, marginBottom:'0.75rem' }}/>
                <div style={{ fontWeight:800, color:'#0f172a', fontSize:'0.92rem', marginBottom:'0.4rem' }}>{a.name}</div>
                <p style={{ color:'#64748b', fontSize:'0.8rem', lineHeight:1.65, margin:0 }}>{a.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pipeline */}
        <div style={{ background:'white', border:'1px solid #e2e8f0', borderRadius:18, padding:'1.75rem', marginBottom:'2rem', boxShadow:'0 1px 4px rgba(0,0,0,0.05)' }}>
          <SectionTitle icon={FlaskConical} color="#f59e0b" sub="Reproducible 6-step pipeline applied to all three datasets">
            ML Training Pipeline
          </SectionTitle>
          <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
            {PIPELINE.map(([title, desc], i) => (
              <div key={title} style={{ display:'flex', gap:16, padding:'1rem 0', borderBottom: i < PIPELINE.length-1 ? '1px solid #f1f5f9' : 'none' }}>
                <div style={{ width:28, height:28, borderRadius:'50%', background:'linear-gradient(135deg,#3b82f6,#06b6d4)', color:'white', fontWeight:800, fontSize:'0.75rem', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1 }}>
                  {String(i+1).padStart(2,'0')}
                </div>
                <div>
                  <div style={{ fontWeight:700, color:'#0f172a', fontSize:'0.9rem', marginBottom:3 }}>{title}</div>
                  <div style={{ color:'#64748b', fontSize:'0.82rem', lineHeight:1.6 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tech stack */}
        <div style={{ background:'white', border:'1px solid #e2e8f0', borderRadius:18, padding:'1.75rem', marginBottom:'2rem', boxShadow:'0 1px 4px rgba(0,0,0,0.05)' }}>
          <SectionTitle icon={Code2} color="#db2777" sub="Full-stack open-source technologies">
            Technology Stack
          </SectionTitle>
          <div style={{ display:'flex', flexWrap:'wrap', gap:'0.6rem' }}>
            {STACK.map(t => (
              <div key={t.name} style={{ background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:10, padding:'7px 14px', display:'flex', alignItems:'center', gap:8 }}>
                <div style={{ width:8, height:8, borderRadius:'50%', background:t.color, flexShrink:0 }}/>
                <span style={{ fontWeight:700, color:'#0f172a', fontSize:'0.83rem' }}>{t.name}</span>
                <span style={{ color:'#94a3b8', fontSize:'0.72rem' }}>— {t.cat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{ background:'#fefce8', border:'1px solid #fde68a', borderRadius:14, padding:'1.25rem 1.5rem', display:'flex', gap:12, alignItems:'flex-start' }}>
          <CheckCircle2 size={18} color="#f59e0b" style={{ flexShrink:0, marginTop:2 }}/>
          <p style={{ color:'#92400e', fontSize:'0.875rem', lineHeight:1.65, margin:0 }}>
            <strong>Medical Disclaimer:</strong> MediPredict AI is for educational and portfolio purposes only. It does not constitute medical advice, diagnosis, or treatment, and should never replace consultation with a qualified healthcare professional. Always seek guidance from a licensed physician for any health concerns.
          </p>
        </div>
      </div>
    </div>
  )
}
