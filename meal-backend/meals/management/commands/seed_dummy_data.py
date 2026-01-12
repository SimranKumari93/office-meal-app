from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
import random

from meals.models import (
    Employee,
    MealPreference,
    DailyMenu,
    Dish
)

class Command(BaseCommand):
    help = "Seed dummy data for employees, dishes, menus, and meal preferences"

    def handle(self, *args, **kwargs):
        self.stdout.write("Seeding dummy data...")

        # ---------- 1. Create Dishes ----------
        dish_names = [
            ("Idli", "Veg", 200),
            ("Dosa", "Veg", 250),
            ("Paneer Curry", "Veg", 350),
            ("Chicken Curry", "Non-Veg", 450),
            ("Salad Bowl", "Salad", 150),
            ("Rice", "Veg", 300),
            ("Dal", "Veg", 280),
            ("Egg Curry", "Non-Veg", 400),
        ]

        dishes = []
        for name, category, calories in dish_names:
            dish, _ = Dish.objects.get_or_create(
                name=name,
                defaults={
                    "category": category,
                    "calories": calories
                }
            )
            dishes.append(dish)

        self.stdout.write("✔ Dishes ready")

        # ---------- 2. Create Employees ----------
        employees = []
        for i in range(1, 101):
            emp, _ = Employee.objects.get_or_create(
                employee_id=f"EMP{i:03}",
                defaults={
                    "name": f"Employee {i}",
                    "department": random.choice(["Tech", "HR", "Finance"]),
                }
            )
            if not emp.password:
                emp.set_password("1234")
                emp.save()
            employees.append(emp)

        self.stdout.write("✔ 100 employees ready")

        # ---------- 3. Create Daily Menus (Next 14 days) ----------
        today = timezone.now().date()

        for day in range(14):
            date = today + timedelta(days=day)

            for slot in ["Breakfast", "Lunch", "Dinner"]:
                menu, _ = DailyMenu.objects.get_or_create(
                    date=date,
                    meal_slot=slot
                )
                menu.dishes.set(random.sample(dishes, k=3))

        self.stdout.write("✔ 2 weeks daily menus created")

        # ---------- 4. Create Meal Preferences ----------
        for emp in employees:
            for day in range(14):
                date = today + timedelta(days=day)

                MealPreference.objects.get_or_create(
                    employee=emp,
                    date=date,
                    defaults={
                        "breakfast": random.choice([True, False]),
                        "breakfast_type": random.choice(["Veg", "Non-Veg", "Salad"]),
                        "lunch": random.choice([True, False]),
                        "lunch_type": random.choice(["Veg", "Non-Veg", "Salad"]),
                        "dinner": random.choice([True, False]),
                        "dinner_type": random.choice(["Veg", "Non-Veg", "Salad"]),
                    }
                )

        self.stdout.write(self.style.SUCCESS("✔ Dummy data seeding completed"))
