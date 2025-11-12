from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from django.utils import timezone
import datetime
from django.db import models

from .models import (
    Employee,
    MealPreference,
    GuestEntry,
    Attendance,
    Menu,
    DailyMenu,
)
from .serializers import (
    EmployeeSerializer,
    MealPreferenceSerializer,
    GuestEntrySerializer,
    AttendanceSerializer,
    MenuSerializer,
    DailyMenuSerializer,
)


# ---------- Employee ViewSet ---------- #
class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    permission_classes = [permissions.AllowAny]


# ---------- Login ---------- #
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_view(request):
    employee_id = request.data.get('employee_id')
    password = request.data.get('password')

    if not employee_id or not password:
        return Response({"error": "Employee ID and password are required."}, status=status.HTTP_400_BAD_REQUEST)
    user = authenticate(request, username=employee_id, password=password)

    if user is not None:
        # create or retrieve token
        token, _ = Token.objects.get_or_create(user=user)
        serializer = EmployeeSerializer(user)
        return Response({"message": "Login successful", "user": serializer.data, "token": token.key}, status=status.HTTP_200_OK)
    else:
        return Response({"error": "Invalid Employee ID or password."}, status=status.HTTP_401_UNAUTHORIZED)


# ---------- Current user ---------- #
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def me_view(request):
    """Return the authenticated user's basic info."""
    serializer = EmployeeSerializer(request.user)
    return Response(serializer.data, status=status.HTTP_200_OK)


# ---------- Forgot PIN (simple dev flow) ---------- #
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def forgot_pin_view(request):
    """Allow resetting a 4-digit PIN by validating employee_id and name.

    NOTE: This is a simple development helper. In production, use email/OTP
    or admin flows for secure reset.
    """
    employee_id = request.data.get('employee_id')
    name = request.data.get('name')
    new_pin = request.data.get('new_pin')

    if not (employee_id and name and new_pin):
        return Response({'error': 'employee_id, name and new_pin are required.'}, status=status.HTTP_400_BAD_REQUEST)

    if not (isinstance(new_pin, str) and new_pin.isdigit() and len(new_pin) == 4):
        return Response({'error': 'new_pin must be exactly 4 numeric digits.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = Employee.objects.get(employee_id=employee_id)
    except Employee.DoesNotExist:
        return Response({'error': 'employee not found'}, status=status.HTTP_404_NOT_FOUND)

    # simple name match (case-insensitive startswith)
    if not user.name or user.name.strip().lower() != name.strip().lower():
        return Response({'error': 'name does not match employee record.'}, status=status.HTTP_400_BAD_REQUEST)

    # set new PIN and remove existing tokens
    user.set_password(new_pin)
    user.save()
    # delete existing tokens so user must login again
    try:
        from rest_framework.authtoken.models import Token
        Token.objects.filter(user=user).delete()
    except Exception:
        pass

    return Response({'message': 'PIN reset successful. Please login with your new PIN.'}, status=status.HTTP_200_OK)


# ---------- Change PIN (authenticated) ---------- #
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def change_pin_view(request):
    old_pin = request.data.get('old_pin')
    new_pin = request.data.get('new_pin')
    if not (old_pin and new_pin):
        return Response({'error': 'old_pin and new_pin are required.'}, status=status.HTTP_400_BAD_REQUEST)
    if not (isinstance(new_pin, str) and new_pin.isdigit() and len(new_pin) == 4):
        return Response({'error': 'new_pin must be exactly 4 numeric digits.'}, status=status.HTTP_400_BAD_REQUEST)

    user = request.user
    # verify old_pin
    if not user.check_password(old_pin):
        return Response({'error': 'old_pin is incorrect.'}, status=status.HTTP_400_BAD_REQUEST)

    user.set_password(new_pin)
    user.save()
    # revoke tokens to force re-login if desired
    try:
        from rest_framework.authtoken.models import Token
        Token.objects.filter(user=user).delete()
    except Exception:
        pass

    return Response({'message': 'PIN changed successfully. Please login again.'}, status=status.HTTP_200_OK)


# ---------- Signup ---------- #
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def signup_view(request):
    employee_id = request.data.get('employee_id')
    name = request.data.get('name')
    password = request.data.get('password')

    if not (employee_id and name and password):
        return Response({"error": "All fields are required."}, status=status.HTTP_400_BAD_REQUEST)

    if len(password) != 4 or not password.isdigit():
        return Response({"error": "Password must be exactly 4 digits."}, status=status.HTTP_400_BAD_REQUEST)

    if Employee.objects.filter(employee_id=employee_id).exists():
        return Response({"error": "Employee ID already exists."}, status=status.HTTP_400_BAD_REQUEST)

    user = Employee.objects.create_user(employee_id=employee_id, name=name, password=password)
    serializer = EmployeeSerializer(user)
    return Response({"message": "Signup successful", "user": serializer.data}, status=status.HTTP_201_CREATED)


# ---------- Meal Preference ---------- #
class MealPreferenceViewSet(viewsets.ModelViewSet):
    queryset = MealPreference.objects.all()
    serializer_class = MealPreferenceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        # Upsert per employee+date. Accepts only the meal flags and per-meal types.
        data = request.data
        employee = data.get('employee')
        date = data.get('date')
        if not (employee and date):
            return Response({'error': 'employee and date are required.'}, status=status.HTTP_400_BAD_REQUEST)
        # If authenticated, prefer the request user as the employee
        if request.user and request.user.is_authenticated:
            employee_obj = request.user
        else:
            # resolve employee: accept numeric PK or employee.employee_id string
            employee_obj = None
            try:
                # try PK first
                employee_obj = Employee.objects.get(pk=int(employee))
            except (ValueError, Employee.DoesNotExist):
                try:
                    employee_obj = Employee.objects.get(employee_id=employee)
                except Employee.DoesNotExist:
                    return Response({'error': 'employee not found'}, status=status.HTTP_400_BAD_REQUEST)

        obj, created = MealPreference.objects.get_or_create(employee=employee_obj, date=date)

        # update fields
        for fld in ['breakfast', 'breakfast_type', 'lunch', 'lunch_type', 'dinner', 'dinner_type']:
            if fld in data:
                setattr(obj, fld, data.get(fld))
        obj.save()
        serializer = self.get_serializer(obj)
        return Response(serializer.data, status=status.HTTP_200_OK)


# ---------- Guest Entry ---------- #
class GuestEntryViewSet(viewsets.ModelViewSet):
    queryset = GuestEntry.objects.all()
    serializer_class = GuestEntrySerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        # if authenticated, set invited_by to the request user
        if request.user and request.user.is_authenticated:
            data['invited_by'] = request.user.id
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


# ---------- Attendance ---------- #
class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        # allow submission of attendance plus optional meal fields
        data = request.data
        employee = data.get('employee')
        date = data.get('date')
        status = data.get('status')
        if not (employee and date and status):
            return Response({'error':'employee,date,status are required'}, status=status.HTTP_400_BAD_REQUEST)
        # If authenticated, use the request.user as the employee
        if request.user and request.user.is_authenticated:
            employee_obj = request.user
        else:
            # resolve employee (accept PK or employee_id)
            employee_obj = None
            try:
                employee_obj = Employee.objects.get(pk=int(employee))
            except (ValueError, Employee.DoesNotExist):
                try:
                    employee_obj = Employee.objects.get(employee_id=employee)
                except Employee.DoesNotExist:
                    return Response({'error': 'employee not found'}, status=status.HTTP_400_BAD_REQUEST)

        # validate status choice
        valid_statuses = [s[0] for s in Attendance.STATUS_CHOICES]
        if status not in valid_statuses:
            return Response({'error': f"Invalid status. Valid choices: {valid_statuses}"}, status=status.HTTP_400_BAD_REQUEST)

        obj, created = Attendance.objects.get_or_create(employee=employee_obj, date=date)
        obj.status = status
        # only set meal fields if status==Office
        if status == 'Office':
            obj.lunch_requested = data.get('lunch_requested', False)
            lp = data.get('lunch_preference')
            # validate lunch preference if provided
            valid_lunch = [p[0] for p in Attendance.LUNCH_PREF_CHOICES]
            if lp and lp not in valid_lunch:
                return Response({'error': f"Invalid lunch_preference. Valid choices: {valid_lunch}"}, status=status.HTTP_400_BAD_REQUEST)
            obj.lunch_preference = lp
            obj.special_requests = data.get('special_requests')
        else:
            obj.lunch_requested = False
            obj.lunch_preference = None
            obj.special_requests = None
        obj.save()
        return Response(AttendanceSerializer(obj).data, status=status.HTTP_200_OK)


# ---------- Menu (Cook Portal) ---------- #
class MenuViewSet(viewsets.ModelViewSet):
    queryset = Menu.objects.all()
    serializer_class = MenuSerializer
    permission_classes = [permissions.AllowAny]

    def list(self, request, *args, **kwargs):
        # allow filtering by day name via ?day=Monday
        day = request.query_params.get('day')
        if day:
            try:
                obj = Menu.objects.get(day__iexact=day)
                return Response(self.get_serializer(obj).data)
            except Menu.DoesNotExist:
                return Response(None)
        return super().list(request, *args, **kwargs)


class DailyMenuViewSet(viewsets.ModelViewSet):
    queryset = DailyMenu.objects.all()
    serializer_class = DailyMenuSerializer
    permission_classes = [permissions.AllowAny]

    def list(self, request, *args, **kwargs):
        # support ?date=YYYY-MM-DD
        date_str = request.query_params.get('date')
        if date_str:
            try:
                obj = DailyMenu.objects.get(date=date_str)
                return Response(self.get_serializer(obj).data)
            except DailyMenu.DoesNotExist:
                return Response(None)
        return super().list(request, *args, **kwargs)


# ---------- Auth (login/signup) ---------- #
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_view(request):
    employee_id = request.data.get('employee_id')
    password = request.data.get('password')

    if not employee_id or not password:
        return Response({"error": "Employee ID and password are required."}, status=status.HTTP_400_BAD_REQUEST)

    # authenticate expects username kw for custom USERNAME_FIELD
    user = authenticate(request, username=employee_id, password=password)

    if user is not None:
        # create or retrieve token
        token, _ = Token.objects.get_or_create(user=user)
        serializer = EmployeeSerializer(user)
        return Response({"message": "Login successful", "user": serializer.data, "token": token.key}, status=status.HTTP_200_OK)
    else:
        return Response({"error": "Invalid Employee ID or password."}, status=status.HTTP_401_UNAUTHORIZED)


# ---------- Daily summary for admin/kitchen ---------- #
@api_view(['GET'])
@permission_classes([permissions.IsAdminUser])
def daily_summary(request):
    """Return meal and guest counts for a specific date (YYYY-MM-DD).
    Query param: date (optional) - defaults to today
    """
    date_str = request.query_params.get('date')
    if date_str:
        try:
            date = datetime.date.fromisoformat(date_str)
        except ValueError:
            return Response({"error": "Invalid date format. Use YYYY-MM-DD."}, status=status.HTTP_400_BAD_REQUEST)
    else:
        date = timezone.localdate()

    # meal counts by time (breakfast/lunch/dinner) from MealPreference
    breakfast_count = MealPreference.objects.filter(date=date, breakfast=True).count()
    lunch_count = MealPreference.objects.filter(date=date, lunch=True).count()
    dinner_count = MealPreference.objects.filter(date=date, dinner=True).count()


    # meal preference breakdown per meal time
    breakfast_pref_counts = (
        MealPreference.objects.filter(date=date, breakfast=True)
        .values('breakfast_type')
        .order_by('breakfast_type')
        .annotate(count=models.Count('id'))
    )
    lunch_pref_counts = (
        MealPreference.objects.filter(date=date, lunch=True)
        .values('lunch_type')
        .order_by('lunch_type')
        .annotate(count=models.Count('id'))
    )
    dinner_pref_counts = (
        MealPreference.objects.filter(date=date, dinner=True)
        .values('dinner_type')
        .order_by('dinner_type')
        .annotate(count=models.Count('id'))
    )

    # Also count lunch requests from Attendance (employees coming to office)
    attendance_lunch_count = Attendance.objects.filter(date=date, status='Office', lunch_requested=True).count()

    # guest counts by meal_time and meal_type
    guest_counts = (
        GuestEntry.objects.filter(date=date)
        .values('meal_time', 'meal_type')
        .order_by('meal_time', 'meal_type')
        .annotate(count=models.Count('id'))
    )

    # derive lunch preference counts from Attendance as well (attendance-based preferences)
    attendance_lunch_prefs = (
        Attendance.objects.filter(date=date, status='Office', lunch_requested=True)
        .values('lunch_preference')
        .annotate(count=models.Count('id'))
    )

    data = {
        'date': date.isoformat(),
        'meal_counts': {
            'breakfast': breakfast_count,
            'lunch': lunch_count,
            'dinner': dinner_count,
            'attendance_lunch_count': attendance_lunch_count,
        },
        'meal_preference_breakdown': {
            'breakfast': list(breakfast_pref_counts),
            'lunch': list(lunch_pref_counts),
            'dinner': list(dinner_pref_counts),
        },
        'attendance_lunch_preferences': list(attendance_lunch_prefs),
        'guest_breakdown': list(guest_counts),
    }

    return Response(data, status=status.HTTP_200_OK)


# ---------- Weekly summary (7 days starting from start_date) ---------- #
@api_view(['GET'])
@permission_classes([permissions.IsAdminUser])
def weekly_summary(request):
    """Return aggregated meal counts for a 7-day window.
    Query param: start_date (optional) - defaults to today
    """
    start_str = request.query_params.get('start_date')
    if start_str:
        try:
            start_date = datetime.date.fromisoformat(start_str)
        except ValueError:
            return Response({"error": "Invalid date format. Use YYYY-MM-DD."}, status=status.HTTP_400_BAD_REQUEST)
    else:
        start_date = timezone.localdate()

    end_date = start_date + datetime.timedelta(days=6)

    # aggregate totals across the window

    prefs = MealPreference.objects.filter(date__range=(start_date, end_date))
    guests = GuestEntry.objects.filter(date__range=(start_date, end_date))

    totals = {
        'breakfast': prefs.filter(breakfast=True).count(),
        'lunch': prefs.filter(lunch=True).count(),
        'dinner': prefs.filter(dinner=True).count(),
    }

    # breakdown per meal time across the window
    breakfast_breakdown = (
        prefs.filter(breakfast=True).values('breakfast_type').annotate(count=models.Count('id')).order_by('breakfast_type')
    )
    lunch_breakdown = (
        prefs.filter(lunch=True).values('lunch_type').annotate(count=models.Count('id')).order_by('lunch_type')
    )
    dinner_breakdown = (
        prefs.filter(dinner=True).values('dinner_type').annotate(count=models.Count('id')).order_by('dinner_type')
    )

    guest_breakdown = (
        guests.values('meal_time', 'meal_type').annotate(count=models.Count('id')).order_by('meal_time', 'meal_type')
    )

    data = {
        'start_date': start_date.isoformat(),
        'end_date': end_date.isoformat(),
        'totals': totals,
        'preference_breakdown': {
            'breakfast': list(breakfast_breakdown),
            'lunch': list(lunch_breakdown),
            'dinner': list(dinner_breakdown),
        },
        'guest_breakdown': list(guest_breakdown),
    }

    return Response(data, status=status.HTTP_200_OK)
    