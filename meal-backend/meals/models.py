from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

# ---------- Custom Employee Model ---------- #
class EmployeeManager(BaseUserManager):
    def create_user(self, employee_id, name, password=None, **extra_fields):
        if not employee_id:
            raise ValueError("Employee ID is required")
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
    role = models.CharField(max_length=20, choices=[('employee', 'Employee'), ('admin', 'Admin')], default='employee')

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    USERNAME_FIELD = 'employee_id'
    REQUIRED_FIELDS = ['name']  # <— keep only name here (remove 'email')

    objects = EmployeeManager()

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
    lunch = models.BooleanField(default=False)
    dinner = models.BooleanField(default=False)
    meal_type = models.CharField(max_length=10, choices=MEAL_TYPE_CHOICES)
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
