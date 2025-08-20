
import React, { useState } from "react";
import { api } from "../api";

export default function AddUserForm({ onAdded }) {
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e){
    e.preventDefault();
    if(!name.trim()) return;
    setBusy(true);
    try{
      const { data } = await api.post("/users",{ name });
      onAdded?.(data);
      setName("");
    }catch(err){
      alert(err?.response?.data?.error || err.message);
    }finally{ setBusy(false); }
  }
  return (
    <form onSubmit={submit} className="flex gap-2 mt-4">
      <input 
        className="flex-1 bg-dark-panel text-text-primary border border-border p-3 rounded-xl text-sm outline-none focus:border-accent-purple focus:shadow-[0_0_0_2px_rgba(139,92,246,0.2)]" 
        placeholder="Add user name" 
        value={name} 
        onChange={e=>setName(e.target.value)}
      />
      <button 
        type="submit"
        className="bg-dark-panel border border-border text-text-primary px-4 py-3 rounded-xl cursor-pointer text-sm hover:border-accent-purple hover:bg-accent-purple hover:bg-opacity-10 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed" 
        disabled={busy || !name.trim()}
      >
        {busy ? "Adding..." : "Add User"}
      </button>
    </form>
  )
}
