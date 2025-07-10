from rest_framework.test import APITestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework import status

User = get_user_model()

class AttendanceTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass123')

    def test_mark_attendance_page_loads_for_authenticated(self):
        self.client.force_authenticate(user=self.user)

        url = reverse('mark_attendance')  # Make sure this is correct

        # Provide sample POST data as needed by your view
        data = {
            "student_id": 1,
            "status": "present",  # or whatever your API expects
        }

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

