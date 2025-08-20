
import React from "react";

export default function UserSelect({ users, selected, onChange }) {
  return (
    <select 
      className="flex-1 bg-dark-panel text-text-primary border border-border p-3 rounded-xl text-sm outline-none focus:border-accent-purple focus:shadow-[0_0_0_2px_rgba(139,92,246,0.2)]" 
      value={selected || ""} 
      onChange={e => onChange(e.target.value)}
    >
      <option value="" disabled>Select user</option>
      {users.map(u => (
        <option key={u._id} value={u._id}>
          {u.name} 
        </option>
      ))}
    </select>
  );
}
