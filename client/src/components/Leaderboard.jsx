
import React from "react";

export default function Leaderboard({ rows }){
  const max = Math.max(1, ...rows.map(r => r.totalPoints));
  return (
    <div className="leader">
      <h3 className="title" style={{marginTop:0}}>Leaderboard</h3>
      {rows.map(r => (
        <div key={r._id} className="rowItem">
          <div className="row" style={{gap:10}}>
            <div className="rank">{r.rank}</div>
            <div style={{fontWeight:700}}>{r.name}</div>
          </div>
          <div className="row" style={{gap:12, flex:1, marginLeft:12}}>
            <div className="bar">
              <div className="fill" style={{width: `${(r.totalPoints/max)*100}%`}}></div>
            </div>
            <div style={{minWidth:60,textAlign:"right"}}>{r.totalPoints} pts</div>
          </div>
        </div>
      ))}
    </div>
  )
}
