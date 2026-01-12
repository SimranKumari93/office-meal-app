"""
URL configuration for meal_manager project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from meals.views import (
    EmployeeViewSet,
    MealPreferenceViewSet,
    GuestEntryViewSet,
    AttendanceViewSet,
    login_view,
    signup_view,
    daily_summary,
    weekly_summary,
    me_view,
    forgot_pin_view,
    change_pin_view,
)
from meals.views import MenuViewSet
from meals.views import DailyMenuViewSet
from meals.views import EmployeeMenuByDate


router = DefaultRouter()
router.register(r'employees', EmployeeViewSet)
router.register(r'meal-preferences', MealPreferenceViewSet)
router.register(r'guest-entries', GuestEntryViewSet)
router.register(r'attendances', AttendanceViewSet)
router.register(r'menu', MenuViewSet)
router.register(r'daily-menu', DailyMenuViewSet)


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/summary/daily/', daily_summary, name='daily_summary'),
    path('api/summary/weekly/', weekly_summary, name='weekly_summary'),
    path('api/me/', me_view, name='me_view'),
    path('forgot-pin/', forgot_pin_view, name='forgot_pin'),
    path('api/change-pin/', change_pin_view, name='change_pin'),
    path('login/', login_view, name='login_view'),
    path('signup/', signup_view, name='signup_view'),
    path('employee/menu/', EmployeeMenuByDate.as_view()),
]

