import React, { useEffect, useState } from "react";
// import "./styles/modal.css";

import './styles/modal.css';

/*
Props:
- open: boolean
- initialData: null | { id, name, slot, servings, calories, description }
- onClose: () => void
- onCreate: (data) => void
- onUpdate: (data) => void
*/
export default function AddDishModal({ open, initialData = null, onClose, onCreate, onUpdate }) {
  const [name, setName] = useState("");
  const [slot, setSlot] = useState("Lunch");
  const [servings, setServings] = useState(0);
  const [calories, setCalories] = useState(0);
  const [description, setDescription] = useState("");

  // when modal opens for edit, populate fields
  useEffect(() => {
    if (open && initialData) {
      setName(initialData.name || "");
      setSlot(initialData.slot ? capitalize(initialData.slot) : "Lunch");
      setServings(initialData.servings ?? 0);
      setCalories(initialData.calories ?? 0);
      setDescription(initialData.description || "");
    } else if (open && !initialData) {
      // clear for create mode
      setName("");
      setSlot("Lunch");
      setServings(0);
      setCalories(0);
      setDescription("");
    }
  }, [open, initialData]);

  if (!open) return null;

  function capitalize(s){ if(!s) return s; return s.charAt(0).toUpperCase() + s.slice(1); }

  function handleSubmit(e){
    e.preventDefault();
    // basic validation
    if (!name.trim()) { alert("Please enter dish name"); return; }
    if (!["Breakfast","Lunch","Dinner"].includes(slot)) setSlot("Lunch");
    const payload = {
      name: name.trim(),
      slot,
      servings: Number(servings) || 0,
      calories: Number(calories) || 0,
      description: description.trim(),
    };

    if (initialData && onUpdate) {
      onUpdate({ id: initialData.id, ...payload });
    } else if (!initialData && onCreate) {
      onCreate(payload);
    }
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label={initialData ? "Edit Dish" : "Add New Dish"}>
      <div className="modal-box">
        <h3 style={{marginTop:0}}>{initialData ? "Edit Dish" : "Add New Dish"}</h3>

        <form onSubmit={handleSubmit}>

          <label style={{display:"block",fontWeight:600,marginBottom:6}}>Dish Name</label>
          <input className="input" value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Chicken Curry" />

          <label style={{display:"block",fontWeight:600,marginTop:10,marginBottom:6}}>Meal Slot</label>
          <select className="input" value={slot} onChange={e=>setSlot(e.target.value)}>
            <option>Breakfast</option>
            <option>Lunch</option>
            <option>Dinner</option>
          </select>

          <label style={{display:"block",fontWeight:600,marginTop:10,marginBottom:6}}>Estimated Servings</label>
          <input className="input" type="number" min="0" value={servings} onChange={e=>setServings(e.target.value)} />

          <label style={{display:"block",fontWeight:600,marginTop:10,marginBottom:6}}>Estimated Calories (per serving)</label>
          <input className="input" type="number" min="0" value={calories} onChange={e=>setCalories(e.target.value)} />

          <label style={{display:"block",fontWeight:600,marginTop:10,marginBottom:6}}>Description</label>
          <textarea className="input" rows="3" value={description} onChange={e=>setDescription(e.target.value)} />

          <div style={{display:"flex",justifyContent:"flex-end",gap:12,marginTop:14}}>
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="create-btn">{initialData ? "Save" : "Create Dish"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
