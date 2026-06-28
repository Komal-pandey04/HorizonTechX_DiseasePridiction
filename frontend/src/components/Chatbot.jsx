import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot } from 'lucide-react'

const KB = {
  cholesterol: "Cholesterol is a fatty substance in your blood. High levels (>200 mg/dl) increase heart disease risk. Reduce it by eating less saturated fat, exercising regularly, and maintaining healthy weight.",
  glucose: "Glucose is blood sugar. Normal fasting glucose is 70–100 mg/dl. Levels above 126 mg/dl may indicate diabetes. Reduce sugar intake and exercise to manage glucose.",
  bmi: "BMI (Body Mass Index) measures body fat using height and weight. Normal: 18.5–24.9. Overweight: 25–29.9. Obese: 30+. Maintain BMI through balanced diet and exercise.",
  blood: "Blood pressure is the force of blood against artery walls. Normal is below 120/80 mmHg. High BP increases stroke and heart disease risk. Reduce sodium, exercise, and avoid stress.",
  diabetes: "Diabetes is a condition where blood sugar is too high. Type 2 diabetes can often be prevented or delayed through healthy lifestyle changes: regular exercise, healthy diet, and weight management.",
  heart: "Heart disease is the leading cause of death globally. Key risk factors: high cholesterol, high blood pressure, smoking, obesity, diabetes, and family history.",
  cancer: "Breast cancer screening using AI analyzes cell nucleus features. Early detection significantly improves treatment outcomes. Regular mammograms are recommended for women over 40.",
  risk: "Risk levels in MediPredict AI: Low (<30% probability) = maintain healthy habits. Medium (30–60%) = consult a doctor. High (>60%) = seek prompt medical attention.",
  accuracy: "MediPredict AI achieves: Heart Disease 94.6% AUC, Diabetes 81.8% AUC, Breast Cancer 99.6% AUC — trained on real clinical datasets.",
  insulin: "Insulin is a hormone that regulates blood sugar. Insulin resistance is an early sign of Type 2 diabetes. Normal fasting insulin is 2–20 mIU/L.",
  tips: "Health tips: 1) Exercise 30 mins/day. 2) Eat 5 servings of vegetables. 3) Drink 2–3L water. 4) Sleep 7–8 hours. 5) Avoid smoking. 6) Limit alcohol. 7) Manage stress.",
  ecg: "ECG (Electrocardiogram) records heart electrical activity. It detects arrhythmias, heart attacks, and abnormalities. An abnormal resting ECG increases heart disease risk.",
}

function getResponse(msg) {
  const m = msg.toLowerCase()
  if (m.includes('cholesterol')) return KB.cholesterol
  if (m.includes('glucose') || m.includes('sugar')) return KB.glucose
  if (m.includes('bmi') || m.includes('weight')) return KB.bmi
  if (m.includes('blood pressure') || m.includes('bp') || m.includes('hypert')) return KB.blood
  if (m.includes('diabetes')) return KB.diabetes
  if (m.includes('heart')) return KB.heart
  if (m.includes('cancer') || m.includes('breast') || m.includes('tumor')) return KB.cancer
  if (m.includes('risk') || m.includes('level')) return KB.risk
  if (m.includes('accur') || m.includes('model') || m.includes('auc')) return KB.accuracy
  if (m.includes('insulin')) return KB.insulin
  if (m.includes('tip') || m.includes('advice') || m.includes('health')) return KB.tips
  if (m.includes('ecg') || m.includes('electrocard')) return KB.ecg
  if (m.includes('hello') || m.includes('hi') || m.includes('hey')) return "Hello! I'm MediPredict AI Assistant. Ask me about cholesterol, glucose, BMI, blood pressure, diabetes, heart disease, or breast cancer!"
  if (m.includes('thank')) return "You're welcome! Stay healthy and consult a doctor for any medical concerns. 😊"
  return "I can help with: cholesterol, glucose, BMI, blood pressure, diabetes, heart disease, breast cancer, insulin, ECG, risk levels, model accuracy, and health tips. What would you like to know?"
}

const SUGGESTIONS = ['What is cholesterol?','How to reduce diabetes risk?','What does BMI mean?','Heart disease tips','Model accuracy']

export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState([
    { role:'bot', text:"Hi! I'm your MediPredict AI Assistant 🩺\nAsk me about any health topic or disease prediction!" }
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const endRef = useRef()

  useEffect(() => { endRef.current?.scrollIntoView({ behavior:'smooth' }) }, [msgs, typing])

  const send = async (text) => {
    const q = text || input.trim()
    if (!q) return
    setInput('')
    setMsgs(p => [...p, { role:'user', text:q }])
    setTyping(true)
    await new Promise(r => setTimeout(r, 700))
    setTyping(false)
    setMsgs(p => [...p, { role:'bot', text: getResponse(q) }])
  }

  return (
    <>
      {/* Floating button */}
      <button onClick={()=>setOpen(!open)} style={{
        position:'fixed', bottom:24, right:24, zIndex:1000,
        width:54, height:54, borderRadius:'50%', border:'none',
        background:'linear-gradient(135deg,#3b82f6,#06b6d4)',
        color:'white', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
        boxShadow:'0 4px 20px rgba(59,130,246,0.5)',
        transition:'transform 0.2s',
      }} onMouseEnter={e=>e.currentTarget.style.transform='scale(1.08)'} onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'}>
        {open ? <X size={22}/> : <MessageCircle size={22}/>}
      </button>

      {/* Chat window */}
      {open && (
        <div style={{
          position:'fixed', bottom:88, right:24, zIndex:999,
          width:340, height:480, borderRadius:18, overflow:'hidden',
          background:'#fff', border:'1px solid #e2e8f0',
          boxShadow:'0 20px 60px rgba(0,0,0,0.18)',
          display:'flex', flexDirection:'column', animation:'slideUp 0.25s ease',
        }}>
          {/* Header */}
          <div style={{ background:'linear-gradient(135deg,#3b82f6,#06b6d4)', padding:'1rem 1.25rem', display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:34,height:34,borderRadius:'50%',background:'rgba(255,255,255,0.2)',display:'flex',alignItems:'center',justifyContent:'center' }}>
              <Bot size={18} color="white"/>
            </div>
            <div>
              <div style={{ fontWeight:700,color:'white',fontSize:'0.9rem' }}>AI Health Assistant</div>
              <div style={{ fontSize:'0.72rem',color:'rgba(255,255,255,0.8)',display:'flex',alignItems:'center',gap:4 }}>
                <span style={{ width:6,height:6,borderRadius:'50%',background:'#4ade80',display:'inline-block' }}/>Online
              </div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex:1, overflowY:'auto', padding:'1rem', display:'flex', flexDirection:'column', gap:10 }}>
            {msgs.map((m,i) => (
              <div key={i} style={{ display:'flex', justifyContent: m.role==='user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth:'80%', padding:'9px 13px', borderRadius: m.role==='user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                  background: m.role==='user' ? 'linear-gradient(135deg,#3b82f6,#06b6d4)' : '#f8fafc',
                  color: m.role==='user' ? 'white' : '#1e293b',
                  fontSize:'0.83rem', lineHeight:1.5,
                  border: m.role==='bot' ? '1px solid #e2e8f0' : 'none',
                  whiteSpace:'pre-wrap',
                }}>
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div style={{ display:'flex', gap:4, padding:'10px 13px', background:'#f8fafc', borderRadius:'14px 14px 14px 4px', border:'1px solid #e2e8f0', width:'fit-content' }}>
                {[0,1,2].map(i=>(
                  <div key={i} style={{ width:7,height:7,borderRadius:'50%',background:'#94a3b8',animation:`bounce 1.2s ${i*0.2}s infinite` }}/>
                ))}
              </div>
            )}
            <div ref={endRef}/>
          </div>

          {/* Suggestions */}
          {msgs.length <= 2 && (
            <div style={{ padding:'0 1rem', display:'flex', gap:6, flexWrap:'wrap', marginBottom:8 }}>
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={()=>send(s)} style={{ fontSize:'0.72rem',padding:'4px 10px',borderRadius:100,border:'1px solid #e2e8f0',background:'#f8fafc',color:'#64748b',cursor:'pointer',fontWeight:500 }}>{s}</button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ padding:'0.75rem', borderTop:'1px solid #e2e8f0', display:'flex', gap:8 }}>
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Ask about health topics…" style={{
              flex:1, padding:'9px 12px', borderRadius:10, border:'1px solid #e2e8f0',
              fontSize:'0.83rem', color:'#1e293b', outline:'none', background:'#f8fafc',
            }}/>
            <button onClick={()=>send()} style={{ width:36,height:36,borderRadius:9,background:'linear-gradient(135deg,#3b82f6,#06b6d4)',border:'none',color:'white',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
              <Send size={14}/>
            </button>
          </div>
        </div>
      )}
      <style>{`
        @keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}}
        @keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
      `}</style>
    </>
  )
}
