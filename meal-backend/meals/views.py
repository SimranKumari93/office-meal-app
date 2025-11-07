from rest_framework import viewsets, permissions
from .models import Employee, MealPreference, GuestEntry
from .serializers import EmployeeSerializer, MealPreferenceSerializer, GuestEntrySerializer

class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    permission_classes = [permissions.AllowAny]

class MealPreferenceViewSet(viewsets.ModelViewSet):
    queryset = MealPreference.objects.all()
    serializer_class = MealPreferenceSerializer
    permission_classes = [permissions.AllowAny]

class GuestEntryViewSet(viewsets.ModelViewSet):
    queryset = GuestEntry.objects.all()
    serializer_class = GuestEntrySerializer
    permission_classes = [permissions.AllowAny]
