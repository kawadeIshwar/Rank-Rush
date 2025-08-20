
import React from "react";

export default function History({ items }){
  return (
    <div className="history">
      {items.map(i => (
        <div key={i._id} className="rowItem">
          <div className="row" style={{gap:10}}>
            <div style={{width:28,height:28,background:"#1f3123",borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center"}}>+</div>
            <div style={{fontWeight:700}}>{i.userName}</div>
          </div>
          <div className="muted">{new Date(i.createdAt).toLocaleString()}</div>
          <div style={{minWidth:60,textAlign:"right",fontWeight:800}}>+{i.points} pts</div>
        </div>
      ))}
    </div>
  )
}
