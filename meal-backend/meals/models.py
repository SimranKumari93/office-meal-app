from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.core.exceptions import ValidationError

# ---------- Custom Employee Manager ---------- #
class EmployeeManager(BaseUserManager):
    def create_user(self, employee_id, name, password=None, **extra_fields):
        if not employee_id:
            raise ValueError("Employee ID is required")

        # 🔧 validate 4-digit PIN
        if password and (not password.isdigit() or len(password) != 4):
            raise ValueError("Password (PIN) must be exactly 4 digits.")

        user = self.model(employee_id=employee_id, name=name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, employee_id, name, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(employee_id, name, password, **extra_fields)

# ---------- Employee Model ---------- #
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

    def clean(self):
        # 🔧 validate PIN even if created from admin
        if self.password and (not self.password.isdigit() or len(self.password) != 4):
            raise ValidationError("Password must be exactly 4 digits.")

    def __str__(self):
        return f"{self.name} ({self.employee_id})"

# ---------- Meal Preference Model ---------- #
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

# ---------- Guest Entry Model ---------- #
class GuestEntry(models.Model):
    invited_by = models.ForeignKey(Employee, on_delete=models.CASCADE)
    guest_name = models.CharField(max_length=100)
    date = models.DateField()
    meal_type = models.CharField(max_length=10, choices=MealPreference.MEAL_TYPE_CHOICES)
    meal_time = models.CharField(max_length=10, choices=[
        ('Breakfast', 'Breakfast'),
        ('Lunch', 'Lunch'),
        ('Dinner', 'Dinner')
    ])
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Guest: {self.guest_name} ({self.meal_time}) on {self.date}"


# ---------- Attendance Model ---------- #
class Attendance(models.Model):
    STATUS_CHOICES = [
        ('Office', 'Coming to Office'),
        ('WFH', 'Work From Home'),
        ('Leave', 'Leave'),
    ]

    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    date = models.DateField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    # meal fields when status == 'Office'
    lunch_requested = models.BooleanField(default=False)
    LUNCH_PREF_CHOICES = [
        ('Veg', 'Veg'),
        ('Non-Veg', 'Non-Veg'),
        ('Salad', 'Salad'),
        ('Veg + Salad', 'Veg + Salad'),
    ]
    lunch_preference = models.CharField(max_length=20, choices=LUNCH_PREF_CHOICES, blank=True, null=True)
    special_requests = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('employee', 'date')

    def __str__(self):
        return f"{self.employee.name} - {self.date} : {self.status}"


# ---------- Menu Model ---------- #
class Menu(models.Model):
    # day name, e.g., Monday, Tuesday
    day = models.CharField(max_length=20, unique=True)
    # store menu content as JSON: { breakfast: {veg:'', nonveg:'', salad:''}, lunch: {...}, dinner: {...} }
    data = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Menu: {self.day}"


# Daily menu for specific dates (Cook Portal can create menus for exact dates)
class DailyMenu(models.Model):
    date = models.DateField(unique=True)
    # list of menu items
    menu_items = models.JSONField(default=list)
    # available preferences for that day, e.g., ['Veg','Non-Veg','Salad']
    available_preferences = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"DailyMenu: {self.date}"
