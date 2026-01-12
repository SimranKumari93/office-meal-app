CREATE TABLE employees (
  employee_id SERIAL PRIMARY KEY,
  name TEXT,
  department TEXT,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE meal_slots (
  meal_slot_id SERIAL PRIMARY KEY,
  meal_slot_name TEXT UNIQUE
);

CREATE TABLE dishes (
  dish_id SERIAL PRIMARY KEY,
  dish_name TEXT,
  category TEXT,
  calories_per_serve INT,
  is_veg BOOLEAN,
  rating INT
);

CREATE TABLE daily_menu (
  menu_id SERIAL PRIMARY KEY,
  menu_date DATE,
  meal_slot_id INT REFERENCES meal_slots(meal_slot_id),
  dish_id INT REFERENCES dishes(dish_id)
);

CREATE TABLE employee_meal_selection (
  selection_id SERIAL PRIMARY KEY,
  employee_id INT REFERENCES employees(employee_id),
  menu_date DATE,
  meal_slot_id INT REFERENCES meal_slots(meal_slot_id),
  dish_id INT REFERENCES dishes(dish_id),
  created_at TIMESTAMP DEFAULT NOW()
);
