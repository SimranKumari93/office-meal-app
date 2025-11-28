import React, { useEffect, useState } from "react";
import AddDishModal from "../components/AddDishModal";

export default function MenuManagement() {
  const [menu, setMenu] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingDish, setEditingDish] = useState(null);

  // Load menu
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cp_menu") || "[]");
    setMenu(stored);
  }, []);

  // Persist
  const saveMenu = (next) => {
    setMenu(next);
    localStorage.setItem("cp_menu", JSON.stringify(next));
  };

  // Add
  const handleAddDish = (dish) => {
    const updated = [...menu, { ...dish, id: Date.now() }];
    saveMenu(updated);
    setOpenModal(false);
  };

  // Edit
  const handleEdit = (dish) => {
    setEditingDish(dish);
    setOpenModal(true);
  };

  const handleUpdateDish = (updatedDish) => {
    const updatedMenu = menu.map((d) =>
      d.id === updatedDish.id ? updatedDish : d
    );
    saveMenu(updatedMenu);
    setEditingDish(null);
    setOpenModal(false);
  };

  // Delete
  const handleDelete = (id) => {
    if (!window.confirm("Delete this dish?")) return;
    saveMenu(menu.filter((d) => d.id !== id));
  };

  return (
    <div className="page">
      <div className="card">
        {/* header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0 }}>Menu Management</h2>

          <button
            className="add-btn"
            onClick={() => {
              setEditingDish(null);
              setOpenModal(true);
            }}
          >
            + Add New Dish
          </button>
        </div>

        {/* table */}
        <div style={{ marginTop: 18 }}>
          {menu.length === 0 ? (
            <div className="empty-card">No dishes added yet.</div>
          ) : (
            <table className="menu-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Slot</th>
                  <th>Servings</th>
                  <th>Calories</th>
                  <th>Description</th>
                  <th style={{ textAlign: "center" }}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {menu.map((dish) => (
                  <tr key={dish.id}>
                    <td>{dish.name}</td>
                    <td>
                      <span className={`slot-pill ${dish.slot}`}>
                        {dish.slot}
                      </span>
                    </td>
                    <td>{dish.servings}</td>
                    <td>{dish.calories}</td>
                    <td>{dish.description}</td>

                    <td style={{ textAlign: "center" }}>
                      {/* EDIT ICON */}
                      <span
                        style={{
                          cursor: "pointer",
                          marginRight: "14px",
                          display: "inline-flex",
                          alignItems: "center",
                        }}
                        onClick={() => handleEdit(dish)}
                      >
                        <i
                          className="fas fa-edit"
                          style={{ fontSize: "18px", color: "#4b4f58" }}
                        ></i>
                      </span>

                      {/* DELETE ICON */}
                      <span
                        style={{
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                        }}
                        onClick={() => handleDelete(dish.id)}
                      >
                        <i
                          className="fas fa-trash"
                          style={{ fontSize: "18px", color: "#4b4f58" }}
                        ></i>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* modal */}
      <AddDishModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setEditingDish(null);
        }}
        onCreate={handleAddDish}
        onUpdate={handleUpdateDish}
        editingDish={editingDish}
      />
    </div>
  );
}
