import { useEffect, useState } from 'react'
import { BarChart,Bar,XAxis,YAxis,Tooltip,ResponsiveContainer,PieChart,Pie,Cell,AreaChart,Area,CartesianGrid,Legend,RadarChart,Radar,PolarGrid,PolarAngleAxis } from 'recharts'
import { getHistory, getMetrics, getStats } from '../services/api'
import { Activity, Heart, Brain, Ribbon, TrendingUp, Users, CheckCircle, AlertTriangle } from 'lucide-react'
import { motion } from 'framer-motion'

const DISEASE_META = { heart:{label:'Heart Disease',color:'#ef4444'}, diabetes:{label:'Diabetes',color:'#7c3aed'}, breast_cancer:{label:'Breast Cancer',color:'#db2777'} }
const RISK_COLORS  = { Low:'#10b981', Medium:'#f59e0b', High:'#ef4444' }
const MODEL_COLORS = ['#3b82f6','#10b981','#f59e0b','#db2777']

function StatCard({icon:Icon,label,value,sub,color,delay=0}){
  return (
    <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay,duration:0.35}}
      style={{ background:'white',border:'1px solid #e2e8f0',borderRadius:16,padding:'1.25rem 1.5rem',borderLeft:`4px solid ${color}`,boxShadow:'0 1px 4px rgba(0,0,0,0.05)' }}>
      <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start' }}>
        <div>
          <div style={{ fontSize:'0.72rem',fontWeight:700,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:6 }}>{label}</div>
          <div style={{ fontSize:'2.2rem',fontWeight:900,color:'#1e293b',lineHeight:1 }}>{value}</div>
          {sub&&<div style={{ fontSize:'0.75rem',color:'#64748b',marginTop:5 }}>{sub}</div>}
        </div>
        <div style={{ width:40,height:40,borderRadius:10,background:`${color}15`,display:'flex',alignItems:'center',justifyContent:'center' }}>
          <Icon size={20} color={color}/>
        </div>
      </div>
    </motion.div>
  )
}

const CTip = ({active,payload,label})=>{
  if(!active||!payload?.length) return null
  return (
    <div style={{ background:'white',border:'1px solid #e2e8f0',borderRadius:10,padding:'10px 14px',boxShadow:'0 4px 16px rgba(0,0,0,0.10)' }}>
      <p style={{ color:'#64748b',fontSize:'0.78rem',marginBottom:6,fontWeight:600 }}>{label}</p>
      {payload.map(p=><p key={p.name} style={{ color:p.color||p.fill,fontWeight:700,fontSize:'0.85rem' }}>{p.name}: {p.value}{typeof p.value==='number'&&p.value<2?'':''}</p>)}
    </div>
  )
}

export default function Dashboard() {
  const [history,setHistory] = useState([])
  const [metrics,setMetrics] = useState(null)
  const [stats,setStats]     = useState(null)
  const [loading,setLoading] = useState(true)
  const [selD,setSelD]       = useState('heart')

  useEffect(()=>{
    Promise.all([getHistory(),getMetrics(),getStats()])
      .then(([h,m,s])=>{ setHistory(h.data); setMetrics(m.data); setStats(s.data) })
      .catch(()=>{})
      .finally(()=>setLoading(false))
  },[])

  if(loading) return (
    <div style={{ display:'flex',justifyContent:'center',alignItems:'center',minHeight:'70vh',flexDirection:'column',gap:16 }}>
      <div style={{ width:44,height:44,border:'3px solid #e2e8f0',borderTopColor:'#3b82f6',borderRadius:'50%',animation:'spin 0.8s linear infinite' }}/>
      <p style={{ color:'#64748b' }}>Loading analytics…</p>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  const total   = stats?.total||0
  const positive= history.filter(h=>['Positive','Malignant'].includes(h.prediction)).length
  const byDisease=[
    {name:'Heart',value:stats?.heart||0,color:'#ef4444'},
    {name:'Diabetes',value:stats?.diabetes||0,color:'#7c3aed'},
    {name:'Breast Cancer',value:stats?.breast_cancer||0,color:'#db2777'},
  ]
  const byRisk=['Low','Medium','High'].map(r=>({name:r,value:history.filter(h=>h.risk_level===r).length,color:RISK_COLORS[r]}))

  // 14-day trend
  const trend = Array.from({length:14},(_,i)=>{
    const d=new Date(); d.setDate(d.getDate()-13+i)
    return { day:d.toLocaleDateString('en-US',{month:'short',day:'numeric'}), count:history.filter(h=>new Date(h.prediction_date).toDateString()===d.toDateString()).length }
  })

  const curMetrics = metrics?.[selD]||[]
  const radarData = [
    {metric:'Accuracy'}, {metric:'Precision'}, {metric:'Recall'}, {metric:'F1'}, {metric:'AUC'}
  ].map((row,i)=>{
    const keys = ['accuracy','precision','recall','f1_score','roc_auc']
    const result = {metric:row.metric}
    curMetrics.forEach(m=>{ result[m.model]=Math.round(m[keys[i]]*100) })
    return result
  })

  const SectionTitle = ({children,sub})=>(
    <div style={{ marginBottom:'1.25rem' }}>
      <h3 style={{ fontWeight:800,color:'#1e293b',fontSize:'1rem',margin:0 }}>{children}</h3>
      {sub&&<p style={{ color:'#64748b',fontSize:'0.8rem',marginTop:3 }}>{sub}</p>}
    </div>
  )

  return (
    <div style={{ background:'#f0f4f8',minHeight:'100vh',padding:'2rem 1.5rem' }}>
      <div style={{ maxWidth:1200,margin:'0 auto' }}>
        <div style={{ marginBottom:'2rem' }}>
          <h1 style={{ fontSize:'1.8rem',fontWeight:900,color:'#1e293b',marginBottom:'0.35rem' }}>Analytics Dashboard</h1>
          <p style={{ color:'#64748b' }}>Real-time overview of all prediction activity and model performance</p>
        </div>

        {/* Stats */}
        <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',gap:'1rem',marginBottom:'2rem' }}>
          <StatCard icon={Users}       label="Total Predictions" value={total}    sub="All time"   color="#3b82f6" delay={0}/>
          <StatCard icon={AlertTriangle} label="Positive Cases"  value={positive} sub={`${total?Math.round(positive/total*100):0}%`} color="#ef4444" delay={0.05}/>
          <StatCard icon={Heart}       label="Heart Disease"    value={stats?.heart||0}         sub="Screenings" color="#ef4444" delay={0.1}/>
          <StatCard icon={Brain}       label="Diabetes"         value={stats?.diabetes||0}      sub="Screenings" color="#7c3aed" delay={0.15}/>
          <StatCard icon={Ribbon}      label="Breast Cancer"    value={stats?.breast_cancer||0} sub="Screenings" color="#db2777" delay={0.2}/>
        </div>

        {total===0 ? (
          <div style={{ background:'white',border:'1px solid #e2e8f0',borderRadius:20,padding:'4rem',textAlign:'center',boxShadow:'0 1px 4px rgba(0,0,0,0.05)' }}>
            <Activity size={48} color="#cbd5e1" style={{ marginBottom:16 }}/>
            <h3 style={{ color:'#94a3b8',fontWeight:700,marginBottom:8 }}>No predictions yet</h3>
            <p style={{ color:'#cbd5e1',fontSize:'0.875rem' }}>Run predictions to see charts here.</p>
          </div>
        ) : (<>
          {/* Charts row 1 */}
          <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(340px,1fr))',gap:'1.5rem',marginBottom:'1.5rem' }}>
            <div style={{ background:'white',border:'1px solid #e2e8f0',borderRadius:18,padding:'1.5rem',boxShadow:'0 1px 4px rgba(0,0,0,0.05)' }}>
              <SectionTitle sub="Predictions by disease category">Disease Distribution</SectionTitle>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={byDisease.filter(d=>d.value>0)} cx="50%" cy="50%" outerRadius={85} innerRadius={45} dataKey="value"
                    label={({name,value})=>`${name} (${value})`} labelLine={{stroke:'#cbd5e1',strokeWidth:1}}>
                    {byDisease.map((d,i)=><Cell key={i} fill={d.color}/>)}
                  </Pie>
                  <Tooltip contentStyle={{ background:'white',border:'1px solid #e2e8f0',borderRadius:8,boxShadow:'0 4px 16px rgba(0,0,0,0.08)'}} formatter={(v,n)=>[v,n]}/>
                  <Legend wrapperStyle={{ fontSize:'0.8rem',color:'#64748b' }}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ background:'white',border:'1px solid #e2e8f0',borderRadius:18,padding:'1.5rem',boxShadow:'0 1px 4px rgba(0,0,0,0.05)' }}>
              <SectionTitle sub="Distribution by risk category">Risk Level Breakdown</SectionTitle>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={byRisk} barSize={52}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false}/>
                  <XAxis dataKey="name" tick={{fill:'#64748b',fontSize:13}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fill:'#94a3b8',fontSize:12}} axisLine={false} tickLine={false} allowDecimals={false}/>
                  <Tooltip content={<CTip/>}/>
                  <Bar dataKey="value" name="Count" radius={[8,8,0,0]}>
                    {byRisk.map((r,i)=><Cell key={i} fill={r.color}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 14-day trend */}
          <div style={{ background:'white',border:'1px solid #e2e8f0',borderRadius:18,padding:'1.5rem',marginBottom:'1.5rem',boxShadow:'0 1px 4px rgba(0,0,0,0.05)' }}>
            <SectionTitle sub="Daily prediction volume over last 2 weeks">Predictions Over Time</SectionTitle>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={trend}>
                <defs>
                  <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false}/>
                <XAxis dataKey="day" tick={{fill:'#94a3b8',fontSize:11}} axisLine={false} tickLine={false} interval={1}/>
                <YAxis tick={{fill:'#94a3b8',fontSize:11}} axisLine={false} tickLine={false} allowDecimals={false}/>
                <Tooltip content={<CTip/>}/>
                <Area type="monotone" dataKey="count" name="Predictions" stroke="#3b82f6" strokeWidth={2.5} fill="url(#grad1)" dot={false} activeDot={{r:5,fill:'#3b82f6'}}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </>)}

        {/* Model performance */}
        {metrics && (
          <div style={{ background:'white',border:'1px solid #e2e8f0',borderRadius:18,padding:'1.5rem',boxShadow:'0 1px 4px rgba(0,0,0,0.05)' }}>
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.5rem',flexWrap:'wrap',gap:12 }}>
              <SectionTitle sub="Algorithm comparison on test data">Model Performance Comparison</SectionTitle>
              <div style={{ display:'flex',gap:6,background:'#f8fafc',padding:5,borderRadius:12,border:'1px solid #e2e8f0' }}>
                {[{k:'heart',l:'Heart'},{k:'diabetes',l:'Diabetes'},{k:'breast_cancer',l:'Breast'}].map(d=>(
                  <button key={d.k} onClick={()=>setSelD(d.k)} style={{
                    padding:'7px 14px',borderRadius:9,border:'none',cursor:'pointer',fontSize:'0.8rem',fontWeight:600,
                    background:selD===d.k?'white':'transparent',color:selD===d.k?'#1e293b':'#64748b',
                    boxShadow:selD===d.k?'0 1px 4px rgba(0,0,0,0.10)':'none',transition:'all 0.15s',
                  }}>{d.l}</button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div style={{ overflowX:'auto',marginBottom:'1.5rem' }}>
              <table style={{ width:'100%',borderCollapse:'separate',borderSpacing:'0 6px' }}>
                <thead><tr>
                  {['Algorithm','Accuracy','Precision','Recall','F1 Score','ROC-AUC'].map(h=>(
                    <th key={h} style={{ textAlign:'left',padding:'6px 14px',fontSize:'0.7rem',fontWeight:700,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'0.05em',whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {curMetrics.map((m,i)=>(
                    <tr key={m.model}>
                      <td style={{ padding:'12px 14px',borderRadius:'10px 0 0 10px',background:i===0?'#eff6ff':'#f8fafc',fontWeight:700,color:MODEL_COLORS[i],fontSize:'0.88rem',borderLeft:i===0?`3px solid #3b82f6`:'3px solid transparent' }}>
                        {m.model}{i===0&&<span style={{ marginLeft:8,background:'#dbeafe',color:'#2563eb',fontSize:'0.68rem',padding:'2px 8px',borderRadius:100,fontWeight:700 }}>Best</span>}
                      </td>
                      {[m.accuracy,m.precision,m.recall,m.f1_score,m.roc_auc].map((v,j)=>(
                        <td key={j} style={{ padding:'12px 14px',background:i===0?'#eff6ff':'#f8fafc',color:'#1e293b',fontWeight:600,fontSize:'0.88rem',borderRadius:j===4?'0 10px 10px 0':0 }}>
                          {(v*100).toFixed(1)}%
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Radar */}
            {radarData.length>0 && curMetrics.length>0 && (
              <div>
                <div style={{ fontSize:'0.82rem',fontWeight:700,color:'#64748b',marginBottom:'0.75rem',textTransform:'uppercase',letterSpacing:'0.05em' }}>Model Metrics Radar</div>
                <ResponsiveContainer width="100%" height={280}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#f1f5f9"/>
                    <PolarAngleAxis dataKey="metric" tick={{fill:'#64748b',fontSize:12}}/>
                    {curMetrics.map((m,i)=>(
                      <Radar key={m.model} name={m.model} dataKey={m.model} stroke={MODEL_COLORS[i]} fill={MODEL_COLORS[i]} fillOpacity={0.12}/>
                    ))}
                    <Legend wrapperStyle={{fontSize:'0.8rem',color:'#64748b'}}/>
                    <Tooltip contentStyle={{background:'white',border:'1px solid #e2e8f0',borderRadius:8}} formatter={v=>`${v}%`}/>
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
