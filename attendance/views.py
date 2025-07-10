from django.shortcuts import render
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Attendance
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from .serializers import AttendanceSerializer
from django.utils import timezone
from rest_framework import status
from datetime import date
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.views import LogoutView as DjangoLogoutView
from django.urls import reverse_lazy
from rest_framework.authentication import SessionAuthentication
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

class RegisterView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({'message': 'Username and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({'message': 'Username already exists.'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=username, password=password)
        return Response({'message': 'User created successfully.'}, status=status.HTTP_201_CREATED)

class LoginView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = []
    
    @method_decorator(csrf_exempt)
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)  # sets session
            return Response({
                'message': 'Login successful.',
                'username': user.username,
                'user_id': user.id
            }, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'Invalid credentials.'}, status=status.HTTP_401_UNAUTHORIZED)
        
class MarkAttendanceView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request):
        status_text = request.data.get('status')

        if not status_text:
            return Response({'message': 'Status is required.'}, status=status.HTTP_400_BAD_REQUEST)

        today = date.today()
        if Attendance.objects.filter(user=request.user, date=today).exists():
            return Response({'message': 'Attendance already marked today.'}, status=status.HTTP_400_BAD_REQUEST)

        Attendance.objects.create(user=request.user, status=status_text, date=today)
        return Response({'message': 'Attendance marked successfully.'}, status=status.HTTP_201_CREATED)
    def post(self, request):
        user = request.user
        data = request.data
        # Allow staff to mark attendance for others and custom dates
        if user.role == 'staff':
            user_id = data.get('user_id')
            date = data.get('date')
            if user_id:
                from users.models import CustomUser
                try:
                    user = CustomUser.objects.get(id=user_id)
                except CustomUser.DoesNotExist:
                    return Response({"message": "User not found."}, status=404)
            if date:
                from datetime import datetime
                try:
                    date = datetime.strptime(date, "%Y-%m-%d").date()
                except ValueError:
                    return Response({"message": "Invalid date format. Use YYYY-MM-DD."}, status=400)
            else:
                date = timezone.now().date()
        else:
            date = timezone.now().date()

        attendance, created = Attendance.objects.get_or_create(user=user, date=date)

        if not attendance.check_in_time:
            attendance.check_in_time = timezone.now().time()
            attendance.save()
            serializer = AttendanceSerializer(attendance)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        elif not attendance.check_out_time:
            attendance.check_out_time = timezone.now().time()
            attendance.save()
            serializer = AttendanceSerializer(attendance)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response({"message": "You already checked in and out for this date."}, status=status.HTTP_400_BAD_REQUEST)

class AttendanceListView(generics.ListAPIView):
    serializer_class = AttendanceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Use hasattr to check for 'role' if using default User model
        if hasattr(user, 'role') and user.role == 'staff':
            return Attendance.objects.all()
        return Attendance.objects.filter(user=user)
class AttendanceSummaryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        attendances = Attendance.objects.filter(user=user)

        present = attendances.filter(status="Present").count()
        absent = attendances.filter(status="Absent").count()
        # Add serialized attendance records
        serializer = AttendanceSerializer(attendances, many=True)
        return Response({
            'present': present,
            'absent': absent,
            'records': serializer.data
        })
class LogoutView(DjangoLogoutView):
    next_page = reverse_lazy('login')