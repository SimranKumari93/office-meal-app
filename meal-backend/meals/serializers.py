from rest_framework import serializers
from .models import Employee, MealPreference, GuestEntry

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ['id', 'employee_id', 'name', 'department', 'role']

class MealPreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = MealPreference
        fields = '__all__'

class GuestEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = GuestEntry
        fields = '__all__'
