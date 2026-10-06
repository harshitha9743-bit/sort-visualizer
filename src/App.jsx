import { useState, useRef } from "react";

function quickSortSteps(arr) {
  const steps = [];
  function qs(a) {
    if (a.length <= 1) return a;
    const pivot = a[Math.floor(a.length / 2)];
    const left   = a.filter(x => x < pivot);
    const middle = a.filter(x => x === pivot);
    const right  = a.filter(x => x > pivot);
    steps.push({ pivot, left, middle, right });
    return [...qs(left), ...middle, ...qs(right)];
  }
  const sorted = qs(arr);
  return { sorted, steps };
}

function mergeSortSteps(arr) {
  const steps = [];
  function ms(a) {
    if (a.length <= 1) return a;
    const mid   = Math.floor(a.length / 2);
    const left  = ms(a.slice(0, mid));
    const right = ms(a.slice(mid));
    const merged = merge(left, right);
    steps.push({ left, right, merged });
    return merged;
  }
  function merge(l, r) {
    const res = []; let i = 0, j = 0;
    while (i < l.length && j < r.length)
      res.push(l[i] < r[j] ? l[i++] : r[j++]);
    return [...res, ...l.slice(i), ...r.slice(j)];
  }
  const sorted = ms(arr);
  return { sorted, steps };
}

const Chip = ({ val, color }) => (
  <span style={{
    display:"inline-block", background: color,
    color:"#fff", borderRadius:6, padding:"2px 10px",
    fontFamily:"'JetBrains Mono',monospace", fontSize:13,
    margin:"2px 3px", fontWeight:700, letterSpacing:1
  }}>{val}</span>
);

const ArrayChips = ({ arr, color }) => (
  <span>{arr.map((v,i) => <Chip key={i} val={v} color={color} />)}</span>
);

const COLORS = {
  pivot  : "#e85d04",
  left   : "#3a86ff",
  middle : "#8338ec",
  right  : "#06d6a0",
  merged : "#118ab2",
  sorted : "#2dc653",
};

const complexityRows = [
  ["Best Case",    "O(n log n)", "O(n log n)"],
  ["Average Case", "O(n log n)", "O(n log n)"],
  ["Worst Case",   "O(n²)",      "O(n log n)"],
  ["Space",        "O(log n)",   "O(n)"],
  ["Stable?",      "✗",          "✓"],
  ["In-place?",    "✓",          "✗"],
];

function ComplexityTab() {
  return (
    <div style={{padding:"24px 16px"}}>
      <table style={{width:"100%", borderCollapse:"collapse", fontFamily:"'JetBrains Mono',monospace"}}>
        <thead>
          <tr style={{background:"#1a1a2e"}}>
            <th style={th("#7f5af0")}>Property</th>
            <th style={th("#3a86ff")}>Quick Sort</th>
            <th style={th("#06d6a0")}>Merge Sort</th>
          </tr>
        </thead>
        <tbody>
          {complexityRows.map(([prop, q, m], i) => (
            <tr key={i} style={{background: i%2===0?"#16213e":"#0f3460"}}>
              <td style={td("#ccd6f6", true)}>{prop}</td>
              <td style={td("#a8d8ea")}>{q}</td>
              <td style={td("#a8d8ea")}>{m}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{display:"flex", gap:24, marginTop:28, flexWrap:"wrap"}}>
        {[
          { label:"Quick Sort", pros:["Faster on small data","In-place (O(log n) stack)","Cache friendly"], cons:["O(n²) worst case","Not stable"] },
          { label:"Merge Sort", pros:["Guaranteed O(n log n)","Stable sort","Great for linked lists"], cons:["O(n) extra memory","Slightly slower on tiny arrays"] },
        ].map(({label,pros,cons}) => (
          <div key={label} style={{flex:1, minWidth:220, background:"#16213e", borderRadius:12, padding:"16px 20px"}}>
            <div style={{fontSize:15, fontWeight:800, color:"#7f5af0", marginBottom:10, fontFamily:"'Syne',sans-serif", letterSpacing:1}}>{label}</div>
            <div style={{color:"#2dc653", fontSize:13, marginBottom:6, fontWeight:700}}>✓ Pros</div>
            {pros.map((p,i) => <div key={i} style={{color:"#ccd6f6", fontSize:12, marginBottom:3}}>• {p}</div>)}
            <div style={{color:"#e85d04", fontSize:13, margin:"10px 0 6px", fontWeight:700}}>✗ Cons</div>
            {cons.map((c,i) => <div key={i} style={{color:"#ccd6f6", fontSize:12, marginBottom:3}}>• {c}</div>)}
          </div>
        ))}
      </div>
    </div>
  );
}

const th = (bg) => ({
  padding:"12px 16px", background:bg, color:"#fff",
  fontSize:13, fontWeight:800, textAlign:"left", letterSpacing:.5
});
const td = (color, bold=false) => ({
  padding:"10px 16px", color, fontSize:13,
  fontWeight: bold ? 700 : 400, borderBottom:"1px solid #1a1a2e"
});

function QuickStep({ step, idx }) {
  return (
    <div style={stepCard}>
      <span style={stepBadge}>Step {idx}</span>
      <div style={stepRow}><span style={stepLabel("pivot")}>Pivot</span><ArrayChips arr={[step.pivot]} color={COLORS.pivot}/></div>
      <div style={stepRow}><span style={stepLabel("left")}>Left</span><ArrayChips arr={step.left} color={COLORS.left}/></div>
      <div style={stepRow}><span style={stepLabel("middle")}>Middle</span><ArrayChips arr={step.middle} color={COLORS.middle}/></div>
      <div style={stepRow}><span style={stepLabel("right")}>Right</span><ArrayChips arr={step.right} color={COLORS.right}/></div>
    </div>
  );
}

function MergeStep({ step, idx }) {
  return (
    <div style={stepCard}>
      <span style={stepBadge}>Step {idx}</span>
      <div style={stepRow}><span style={stepLabel("left")}>Left</span><ArrayChips arr={step.left} color={COLORS.left}/></div>
      <div style={stepRow}><span style={stepLabel("right")}>Right</span><ArrayChips arr={step.right} color={COLORS.right}/></div>
      <div style={stepRow}><span style={stepLabel("merged")}>Merged</span><ArrayChips arr={step.merged} color={COLORS.merged}/></div>
    </div>
  );
}

const stepCard = {
  background:"#16213e", borderRadius:10, padding:"14px 18px",
  marginBottom:12, borderLeft:"4px solid #7f5af0"
};
const stepBadge = {
  display:"inline-block", background:"#7f5af0", color:"#fff",
  borderRadius:20, padding:"2px 12px", fontSize:11,
  fontWeight:800, marginBottom:10, letterSpacing:1,
  fontFamily:"'Syne',sans-serif"
};
const stepRow = { display:"flex", alignItems:"center", marginBottom:5, flexWrap:"wrap", gap:6 };
const stepLabel = (key) => ({
  background: COLORS[key]+"33", color: COLORS[key],
  borderRadius:4, padding:"1px 8px", fontSize:11,
  fontWeight:800, minWidth:60, textAlign:"center",
  fontFamily:"'Syne',sans-serif", letterSpacing:.5, flexShrink:0
});

export default function App() {
  const [size, setSize] = useState(5);
  const [input, setInput] = useState("");
  const [algo, setAlgo] = useState("Quick Sort");
  const [result, setResult] = useState(null);
  const [tab, setTab] = useState("steps");
  const [error, setError] = useState("");
  const stepsRef = useRef();

  function handleSort() {
    setError(""); setResult(null);
    const raw = input.replace(/,/g," ").trim().split(/\s+/).filter(Boolean);
    if (raw.length !== size) { setError(`Expected ${size} numbers, got ${raw.length}.`); return; }
    const arr = raw.map(Number);
    if (arr.some(isNaN)) { setError("Please enter valid integers only."); return; }
    const t0 = performance.now();
    const { sorted, steps } = algo === "Quick Sort" ? quickSortSteps(arr) : mergeSortSteps(arr);
    const elapsed = ((performance.now()-t0)/1000).toFixed(6);
    setResult({ original:arr, sorted, steps, algo, elapsed });
    setTab("steps");
    setTimeout(() => stepsRef.current?.scrollIntoView({behavior:"smooth"}),100);
  }

  const tabs = ["steps","result","complexity"];

  return (
    <div style={{ minHeight:"100vh", background:"#0a0a1a", fontFamily:"'DM Sans',sans-serif", color:"#ccd6f6" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;700&family=JetBrains+Mono:wght@400;700&display=swap');
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { width:6px; }
        ::-webkit-scrollbar-track { background:#0f3460; }
        ::-webkit-scrollbar-thumb { background:#7f5af0; border-radius:3px; }
        input, select { outline:none; }
        .tab-btn:hover { opacity:.85; }
      `}</style>

      <div style={{ background:"linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%)", borderBottom:"2px solid #7f5af0", padding:"32px 24px 24px", textAlign:"center" }}>
        <div style={{fontSize:11, letterSpacing:4, color:"#7f5af0", fontWeight:800, fontFamily:"'Syne',sans-serif", marginBottom:8}}>ALGORITHM ANALYSIS</div>
        <h1 style={{ margin:0, fontSize:"clamp(24px,5vw,42px)", fontFamily:"'Syne',sans-serif", fontWeight:800, background:"linear-gradient(90deg,#7f5af0,#3a86ff,#06d6a0)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", letterSpacing:-1 }}>Quick Sort vs Merge Sort</h1>
        <p style={{color:"#8892b0", margin:"8px 0 0", fontSize:14}}>Step-by-step visualizer with complexity analysis</p>
      </div>

      <div style={{maxWidth:760, margin:"32px auto", padding:"0 20px"}}>
        <div style={{ background:"#16213e", borderRadius:16, padding:"28px 28px", border:"1px solid #1a1a2e", boxShadow:"0 8px 40px #00000060" }}>
          <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:20, marginBottom:20}}>
            <div>
              <label style={labelStyle}>Array Size</label>
              <select value={size} onChange={e=>setSize(+e.target.value)} style={selectStyle}>
                {[5,6,7,8,9,10].map(n=><option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Algorithm</label>
              <select value={algo} onChange={e=>setAlgo(e.target.value)} style={selectStyle}>
                <option>Quick Sort</option>
                <option>Merge Sort</option>
              </select>
            </div>
          </div>

          <div style={{marginBottom:20}}>
            <label style={labelStyle}>Enter {size} Numbers (comma or space separated)</label>
            <input
              value={input}
              onChange={e=>setInput(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&handleSort()}
              placeholder={`e.g. ${Array.from({length:size},()=>Math.floor(Math.random()*90+10)).join(" ")}`}
              style={{...selectStyle, width:"100%"}}
            />
          </div>

          {error && (
            <div style={{ background:"#e85d0422", border:"1px solid #e85d04", borderRadius:8, padding:"10px 14px", color:"#e85d04", fontSize:13, marginBottom:16, fontWeight:600 }}>⚠ {error}</div>
          )}

          <button onClick={handleSort} style={{ width:"100%", padding:"14px", background:"linear-gradient(90deg,#7f5af0,#3a86ff)", border:"none", borderRadius:10, color:"#fff", fontSize:15, fontWeight:800, cursor:"pointer", fontFamily:"'Syne',sans-serif", letterSpacing:1.5, boxShadow:"0 4px 20px #7f5af055" }}>⚡ START SORTING</button>
        </div>

        {result && (
          <div ref={stepsRef} style={{marginTop:28}}>
            <div style={{ display:"flex", flexWrap:"wrap", gap:12, background:"#16213e", borderRadius:12, padding:"16px 20px", marginBottom:20, border:"1px solid #0f3460", alignItems:"center", justifyContent:"space-between" }}>
              <div>
                <span style={{...stepLabel("left"), fontSize:10}}>ORIGINAL</span>{" "}
                <span style={{fontFamily:"'JetBrains Mono',monospace", fontSize:13, color:"#ccd6f6"}}>[{result.original.join(", ")}]</span>
              </div>
              <div style={{ background:"#7f5af022", border:"1px solid #7f5af0", borderRadius:8, padding:"4px 14px", color:"#7f5af0", fontSize:12, fontWeight:700, fontFamily:"'JetBrains Mono',monospace" }}>⏱ {result.elapsed}s</div>
            </div>

            <div style={{display:"flex", gap:4, marginBottom:16}}>
              {tabs.map(t => (
                <button key={t} className="tab-btn" onClick={()=>setTab(t)} style={{ flex:1, padding:"10px", border:"none", borderRadius:8, cursor:"pointer", background: tab===t ? "#7f5af0" : "#16213e", color: tab===t ? "#fff" : "#8892b0", fontFamily:"'Syne',sans-serif", fontSize:12, fontWeight:800, letterSpacing:.8, textTransform:"uppercase" }}>
                  {t==="steps"?"📋 Steps":t==="result"?"✅ Result":"📊 Complexity"}
                </button>
              ))}
            </div>

            <div style={{ background:"#0f3460", borderRadius:14, padding:"4px", border:"1px solid #16213e", maxHeight:480, overflowY:"auto" }}>
              <div style={{padding:"16px 12px"}}>
                {tab==="steps" && (
                  result.steps.length === 0
                    ? <div style={{color:"#8892b0", textAlign:"center", padding:20}}>Array already sorted — no steps needed.</div>
                    : result.algo === "Quick Sort"
                      ? result.steps.map((s,i)=><QuickStep key={i} step={s} idx={i+1}/>)
                      : result.steps.map((s,i)=><MergeStep key={i} step={s} idx={i+1}/>)
                )}
                {tab==="result" && (
                  <div style={{textAlign:"center", padding:"24px 0"}}>
                    <div style={{fontSize:12, color:"#8892b0", letterSpacing:3, fontFamily:"'Syne',sans-serif", fontWeight:800, marginBottom:12}}>SORTED ARRAY ({result.algo.toUpperCase()})</div>
                    <div style={{display:"flex", flexWrap:"wrap", justifyContent:"center", gap:8, marginBottom:28}}>
                      {result.sorted.map((v,i)=>(
                        <div key={i} style={{ background:"linear-gradient(135deg,#2dc65333,#06d6a033)", border:"1px solid #2dc653", borderRadius:10, width:54, height:54, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'JetBrains Mono',monospace", fontWeight:800, fontSize:18, color:"#2dc653" }}>{v}</div>
                      ))}
                    </div>
                    <div style={{ display:"inline-block", background:"#7f5af022", border:"1px solid #7f5af0", borderRadius:10, padding:"12px 28px", color:"#7f5af0", fontFamily:"'JetBrains Mono',monospace" }}>
                      <div style={{fontSize:11, opacity:.7, marginBottom:4}}>Execution Time</div>
                      <div style={{fontSize:20, fontWeight:800}}>{result.elapsed}s</div>
                    </div>
                  </div>
                )}
                {tab==="complexity" && <ComplexityTab />}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const labelStyle = {
  display:"block", fontSize:11, fontWeight:800, color:"#8892b0",
  letterSpacing:1.5, marginBottom:8, fontFamily:"'Syne',sans-serif",
  textTransform:"uppercase"
};
const selectStyle = {
  width:"100%", padding:"11px 14px",
  background:"#0f3460", border:"1px solid #1a1a2e",
  borderRadius:8, color:"#ccd6f6", fontSize:14,
  fontFamily:"'JetBrains Mono',monospace", cursor:"pointer"
};