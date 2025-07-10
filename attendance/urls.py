from django.urls import path
from .views import MarkAttendanceView, AttendanceListView, RegisterView, LoginView,  AttendanceSummaryView,LogoutView

urlpatterns = [
    path('mark/', MarkAttendanceView.as_view(), name='mark_attendance'),
    path('', AttendanceListView.as_view(), name='attendance_list'),
     path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('attendance/mark/', MarkAttendanceView.as_view(), name='mark_attendance'),
    path('attendance/summary/', AttendanceSummaryView.as_view(), name='view_attendance'),
      path('logout/', LogoutView.as_view(), name='logout'),
]
