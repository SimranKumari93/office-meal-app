import React from "react";

export default function MealTabs({ active, setActive }) {
  return (
    <>
      {["Breakfast", "Lunch", "Dinner"].map((m) => (
        <button
          key={m}
          className={`pill ${active === m ? "selected" : ""}`}
          onClick={() => setActive(m)}
        >
          {m}
        </button>
      ))}
    </>
  );
}
