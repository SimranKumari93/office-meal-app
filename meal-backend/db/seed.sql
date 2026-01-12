INSERT INTO meal_slots (meal_slot_name)
VALUES ('Breakfast'), ('Lunch'), ('Dinner');

INSERT INTO employees (name, department)
SELECT 'Employee ' || generate_series, 'Engineering'
FROM generate_series(1,250);

INSERT INTO dishes (dish_name, category, calories_per_serve, is_veg, rating)
VALUES
('Chicken Curry','Curry',450,false,5),
('Veg Biryani','Rice',400,true,4),
('Paneer Tikka','Main',350,true,5),
('Fish Curry','Main',500,false,4),
('Salad Bowl','Salad',200,true,3);

INSERT INTO daily_menu (menu_date, meal_slot_id, dish_id)
SELECT CURRENT_DATE + 1, ms.meal_slot_id, d.dish_id
FROM meal_slots ms, dishes d;
