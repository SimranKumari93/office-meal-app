import React, { useEffect, useState } from "react";

/*
  Menu items persisted to localStorage under key: cp_menu
  Each item: { id, name, slot, servings, calories, description, prepared }
*/
export default function MenuManagement() {
  const [menu, setMenu] = useState([]);
  useEffect(() => {
    setMenu(JSON.parse(localStorage.getItem("cp_menu") || "[]"));
  }, []);

  const persist = (next) => {
    setMenu(next);
    localStorage.setItem("cp_menu", JSON.stringify(next));
  };

  const addDish = () => {
    const name = prompt("Dish name");
    if (!name) return;
    const slot = prompt("Slot (breakfast/lunch/dinner)").toLowerCase();
    const servings = parseInt(prompt("Servings available (number)"), 10) || 0;
    const calories = prompt("Calories (e.g. 450 Cal)") || "0";
    const description = prompt("Description") || "";

    const newDish = {
      id: Date.now(),
      name, slot, servings, calories, description,
      prepared: servings
    };
    persist([...menu, newDish]);
  };

  const edit = (id) => {
    const item = menu.find(m=>m.id===id);
    if(!item) return;
    const name = prompt("Dish name", item.name) || item.name;
    const slot = prompt("Slot", item.slot) || item.slot;
    const servings = parseInt(prompt("Servings", item.servings),10) || item.servings;
    const calories = prompt("Calories", item.calories) || item.calories;
    const description = prompt("Description", item.description) || item.description;
    const updated = menu.map(m => m.id===id ? {...m, name, slot, servings, calories, description, prepared:servings} : m);
    persist(updated);
  };

  const remove = (id) => {
    if(!window.confirm("Delete dish?")) return;
    persist(menu.filter(m=>m.id!==id));
  };

  return (
    <div className="page">
      <div className="card">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <h2 style={{margin:0}}>Menu Management</h2>
          <button className="btn" onClick={addDish}>+ Add New Dish</button>
        </div>

        <div style={{marginTop:14}}>
          {menu.length === 0 ? (
            <div className="card">No dishes yet. Add a dish to populate employee menu.</div>
          ) : (
            <table className="menu-table">
              <thead>
                <tr>
                  <th>Name</th><th>Slot</th><th>Servings</th><th>Calories</th><th>Description</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {menu.map(row=>(
                  <tr key={row.id}>
                    <td>{row.name}</td>
                    <td><span className={`slot-pill ${row.slot}`}>{row.slot}</span></td>
                    <td>{row.servings}</td>
                    <td>{row.calories}</td>
                    <td>{row.description}</td>
                    <td>
                      <button className="small-btn" onClick={()=>edit(row.id)}>Edit</button>
                      <button className="small-btn" onClick={()=>remove(row.id)} style={{marginLeft:8}}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
