import React from "react";

const CATS = ["All","Beverage","Bread","Burger","Curry","Dessert","Fish","Non-Veg Main","Rice","Salad"];

export default function CategoryFilter({ category, setCategory }) {
  return (
    <div className="carousel" style={{ padding: 12 }}>
      <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 6 }}>
        {CATS.map((c) => (
          <button key={c} className={`pill ${category === c ? "selected" : ""}`} onClick={() => setCategory(c)}>
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
