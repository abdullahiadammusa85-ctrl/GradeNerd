export default function Landing({ onGetStarted }) {
  return (
    <div>
      <div style={{ textAlign:'center', padding:'4rem 1rem 3rem' }}>
        <div style={{ display:'inline-block', background:'rgba(99,102,241,0.1)', border:'1px solid rgba(99,102,241,0.25)', color:'var(--accent2)', padding:'0.3rem 0.9rem', borderRadius:100, fontSize:'0.75rem', fontWeight:600, marginBottom:'1.25rem', letterSpacing:'0.05em' }}>
          🇳🇬 Built for Nigerian University Students
        </div>
        <h1 style={{ fontFamily:'Syne,sans-serif', fontSize:'clamp(2rem,5vw,3.5rem)', fontWeight:800, letterSpacing:'-0.04em', lineHeight:1.1, marginBottom:'1rem' }}>
          Track Your <span style={{ background:'linear-gradient(135deg,#6366f1,#818cf8,#a5b4fc)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Academic Journey</span><br />with Precision
        </h1>
        <p style={{ fontSize:'1.05rem', color:'var(--muted)', maxWidth:520, margin:'0 auto 2rem', lineHeight:1.65 }}>
          Calculate GPA & CGPA, predict future results, plan your path to First Class — all in one elegant tool.
        </p>
        <div style={{ display:'flex', gap:'0.75rem', justifyContent:'center', flexWrap:'wrap' }}>
          <button onClick={onGetStarted} style={{ background:'var(--accent)', color:'#fff', border:'none', borderRadius:9, padding:'0.65rem 1.75rem', fontSize:'0.9rem', fontWeight:600, cursor:'pointer' }}>
            Start Calculating →
          </button>
          <button onClick={onGetStarted} style={{ background:'transparent', color:'var(--muted)', border:'1px solid var(--border)', borderRadius:9, padding:'0.65rem 1.75rem', fontSize:'0.9rem', fontWeight:600, cursor:'pointer' }}>
            See Dashboard
          </button>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'0.75rem', marginBottom:'2rem' }}>
        {[{g:'A=5',d:'Excellent',c:'#22c55e'},{g:'B=4',d:'Good',c:'#3b82f6'},{g:'C=3',d:'Fair',c:'#f59e0b'},{g:'D=2',d:'Pass',c:'#f97316'},{g:'E=1',d:'Weak Pass',c:'#ef4444'},{g:'F=0',d:'Fail',c:'#6b7280'}].map(x=>(
          <div key={x.g} style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:12, padding:'0.75rem', textAlign:'center' }}>
            <div style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:'1rem', color:x.c }}>{x.g}</div>
            <div style={{ fontSize:'0.7rem', color:'var(--muted)', marginTop:'0.2rem' }}>{x.d}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:'1rem', marginBottom:'2rem' }}>
        {[
          { icon:'🧮', title:'GPA Calculator',  desc:'Add courses, credit units, and grades to instantly compute your semester GPA.' },
          { icon:'📊', title:'CGPA Tracker',    desc:'Track cumulative GPA across all semesters with real-time updates.' },
          { icon:'🔮', title:'CGPA Prediction', desc:"Simulate future scenarios: 'What if I score mostly A's next semester?'" },
          { icon:'🎯', title:'Goal Planning',   desc:'Set your target degree class and get the exact GPA needed.' },
          { icon:'📈', title:'Trend Analysis',  desc:'Visualize your academic trajectory with beautiful charts.' },
          { icon:'💡', title:'Smart Insights',  desc:'Get personalized recommendations based on your performance data.' },
        ].map(f=>(
          <div key={f.title} style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:16, padding:'1.5rem' }}>
            <div style={{ fontSize:'1.5rem', marginBottom:'0.75rem' }}>{f.icon}</div>
            <div style={{ fontFamily:'Syne,sans-serif', fontSize:'0.9rem', fontWeight:700, marginBottom:'0.4rem' }}>{f.title}</div>
            <div style={{ fontSize:'0.8rem', color:'var(--muted)', lineHeight:1.5 }}>{f.desc}</div>
          </div>
        ))}
      </div>

      <div style={{ textAlign:'center', padding:'2rem', background:'var(--surface)', borderRadius:20, border:'1px solid var(--border)' }}>
        <div style={{ fontFamily:'Syne,sans-serif', fontSize:'1.3rem', fontWeight:800, marginBottom:'0.75rem' }}>Degree Classification</div>
        <div style={{ display:'flex', gap:'0.5rem', justifyContent:'center', flexWrap:'wrap' }}>
          {[{label:'First Class',min:'4.50–5.00',color:'#22c55e'},{label:'2nd Upper',min:'3.50–4.49',color:'#3b82f6'},{label:'2nd Lower',min:'2.40–3.49',color:'#f59e0b'},{label:'Third Class',min:'1.50–2.39',color:'#ef4444'}].map(d=>(
            <div key={d.label} style={{ padding:'0.6rem 1rem', borderRadius:10, background:`${d.color}18`, border:`1px solid ${d.color}40`, textAlign:'center' }}>
              <div style={{ fontWeight:700, fontSize:'0.8rem', color:d.color }}>{d.label}</div>
              <div style={{ fontSize:'0.7rem', color:'var(--muted)' }}>{d.min}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}