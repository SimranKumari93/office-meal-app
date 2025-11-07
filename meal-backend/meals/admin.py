from django.contrib import admin
from .models import Employee, MealPreference, GuestEntry
from django.contrib.auth.admin import UserAdmin

@admin.register(Employee)
class EmployeeAdmin(UserAdmin):
    list_display = ('employee_id', 'name', 'department', 'role', 'is_staff')
    search_fields = ('employee_id', 'name', 'department')
    ordering = ('employee_id',)

    fieldsets = (
        (None, {'fields': ('employee_id', 'password')}),
        ('Personal info', {'fields': ('name', 'department', 'role')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('employee_id', 'name', 'password1', 'password2', 'role'),
        }),
    )

admin.site.register(MealPreference)
admin.site.register(GuestEntry)
