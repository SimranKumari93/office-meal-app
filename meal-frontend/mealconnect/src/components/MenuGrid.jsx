import React from "react";
import MenuCard from "./MenuCard";

/* Default menu items + calories (editable) */
const MENU_ITEMS = [
  { id:1, name:"Chicken Curry", category:"Curry", calories:450, type:"Non-Veg" },
  { id:2, name:"Fresh Salad Bowl", category:"Salad", calories:200, type:"Veg" },
  { id:3, name:"Tomato Soup", category:"Beverage", calories:150, type:"Veg" },
  { id:4, name:"Grilled Salmon", category:"Fish", calories:600, type:"Non-Veg" },
  { id:5, name:"Cheeseburger", category:"Burger", calories:750, type:"Non-Veg" },
  { id:6, name:"Vegetable Biryani", category:"Rice", calories:400, type:"Veg" },
  { id:7, name:"Paneer Tikka", category:"Non-Veg Main", calories:350, type:"Veg" },
  { id:8, name:"Fish Curry", category:"Fish", calories:500, type:"Non-Veg" },
  { id:9, name:"Garlic Bread", category:"Bread", calories:180, type:"Veg" },
  { id:10, name:"Chocolate Cake", category:"Dessert", calories:350, type:"Veg" },
];

export default function MenuGrid({ selectedCategory, dietaryFilter, addItem, mealSlot, selections }) {
  const filtered = MENU_ITEMS.filter(item => {
    const catOk = selectedCategory === "All" || item.category === selectedCategory;
    // dietaryFilter currently unused; kept for future
    return catOk;
  });

  return (
    <div className="menu-items-grid">
      {filtered.map(item => (
        <MenuCard
          key={item.id}
          item={item}
          onAdd={() => addItem(item)}
          added={!!selections[mealSlot].find(i => i.id === item.id)}
        />
      ))}
    </div>
  );
}
