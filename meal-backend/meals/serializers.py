from rest_framework import serializers
from .models import Employee, MealPreference, GuestEntry, Attendance, Menu, DailyMenu

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ['id', 'name', 'employee_id', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }


class MealPreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = MealPreference
        fields = [
            'id', 'employee', 'date',
            'breakfast', 'breakfast_type',
            'lunch', 'lunch_type',
            'dinner', 'dinner_type',
            'created_at'
        ]


class MenuSerializer(serializers.ModelSerializer):
    class Meta:
        model = Menu
        fields = '__all__'

class GuestEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = GuestEntry
        fields = '__all__'


class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        fields = '__all__'


# Menu serializer defined earlier; ensure import order

class DailyMenuSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyMenu
        fields = ['id','date','menu_items','available_preferences','created_at','updated_at']
