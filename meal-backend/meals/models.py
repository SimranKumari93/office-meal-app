from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

# =========================
# Employee (UNCHANGED CORE)
# =========================
class EmployeeManager(BaseUserManager):
    def create_user(self, employee_id, name, password=None, **extra_fields):
        if not employee_id:
            raise ValueError("Employee ID is required")

        if password and (not password.isdigit() or len(password) != 4):
            raise ValueError("PIN must be exactly 4 digits")

        user = self.model(employee_id=employee_id, name=name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, employee_id, name, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(employee_id, name, password, **extra_fields)


class Employee(AbstractBaseUser, PermissionsMixin):
    employee_id = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=100)
    department = models.CharField(max_length=100, blank=True, null=True)

    role = models.CharField(
        max_length=20,
        choices=[('employee', 'Employee'), ('admin', 'Admin')],
        default='employee'
    )

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    USERNAME_FIELD = 'employee_id'
    REQUIRED_FIELDS = ['name']

    objects = EmployeeManager()

    def __str__(self):
        return f"{self.name} ({self.employee_id})"


# =========================
# Dish (NEW – CORE ENTITY)
# =========================
class Dish(models.Model):
    CATEGORY_CHOICES = [
        ('Veg', 'Veg'),
        ('Non-Veg', 'Non-Veg'),
        ('Salad', 'Salad'),
    ]

    name = models.CharField(max_length=100)
    category = models.CharField(max_length=10, choices=CATEGORY_CHOICES)
    calories = models.IntegerField()

    def __str__(self):
        return self.name


# =========================
# Daily Menu (DATE + SLOT)
# =========================
class DailyMenu(models.Model):
    MEAL_SLOT_CHOICES = [
        ('Breakfast', 'Breakfast'),
        ('Lunch', 'Lunch'),
        ('Dinner', 'Dinner'),
    ]

    date = models.DateField()
    meal_slot = models.CharField(max_length=10, choices=MEAL_SLOT_CHOICES)
    dishes = models.ManyToManyField(Dish)

    class Meta:
        unique_together = ('date', 'meal_slot')

    def __str__(self):
        return f"{self.date} - {self.meal_slot}"


# =========================
# Employee Selection (NEW)
# =========================
class MealSelection(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    daily_menu = models.ForeignKey(DailyMenu, on_delete=models.CASCADE)
    selected_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('employee', 'daily_menu')

    def __str__(self):
        return f"{self.employee} → {self.daily_menu}"


# =========================
# Meal Preference (KEEP)
# =========================
class MealPreference(models.Model):
    MEAL_TYPE_CHOICES = [
        ('Veg', 'Veg'),
        ('Non-Veg', 'Non-Veg'),
        ('Salad', 'Salad'),
    ]

    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    date = models.DateField()

    breakfast = models.BooleanField(default=False)
    breakfast_type = models.CharField(max_length=10, choices=MEAL_TYPE_CHOICES, blank=True, null=True)

    lunch = models.BooleanField(default=False)
    lunch_type = models.CharField(max_length=10, choices=MEAL_TYPE_CHOICES, blank=True, null=True)

    dinner = models.BooleanField(default=False)
    dinner_type = models.CharField(max_length=10, choices=MEAL_TYPE_CHOICES, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('employee', 'date')

    def __str__(self):
        return f"{self.employee.name} - {self.date}"


# =========================
# Guest Entry (KEEP)
# =========================
class GuestEntry(models.Model):
    invited_by = models.ForeignKey(Employee, on_delete=models.CASCADE)
    guest_name = models.CharField(max_length=100)
    date = models.DateField()

    meal_slot = models.CharField(
        max_length=10,
        choices=[('Breakfast', 'Breakfast'), ('Lunch', 'Lunch'), ('Dinner', 'Dinner')]
    )

    meal_type = models.CharField(
        max_length=10,
        choices=MealPreference.MEAL_TYPE_CHOICES
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.guest_name} ({self.meal_slot})"


# =========================
# Attendance (KEEP)
# =========================
class Attendance(models.Model):
    STATUS_CHOICES = [
        ('Office', 'Office'),
        ('WFH', 'WFH'),
        ('Leave', 'Leave'),
    ]

    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    date = models.DateField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)

    lunch_requested = models.BooleanField(default=False)
    lunch_preference = models.CharField(
        max_length=20,
        choices=[
            ('Veg', 'Veg'),
            ('Non-Veg', 'Non-Veg'),
            ('Salad', 'Salad'),
            ('Veg + Salad', 'Veg + Salad'),
        ],
        blank=True,
        null=True
    )
    # =========================
# Menu (KEEP)
# =========================
class Menu(models.Model):
    day = models.CharField(max_length=20, unique=True)
    data = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)


    special_requests = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    # class Meta:
    #     unique_together = ('employee', 'date')

    def __str__(self):
        return f"{self.employee.name} - {self.date}"
