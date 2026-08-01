from accounts.permissions import IsAdminUser
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import render
from accounts.models import User
from accounts.serializers import UserProfileSeralizers,UserCreateSerializer
from rest_framework.response import Response
from rest_framework import generics,status


# Create your views here.

class UserListApiView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserProfileSeralizers    
    permission_classes=[IsAuthenticated]
class UserCreateAPIView(generics.CreateAPIView):
    queryset=User.objects.all()
    serializer_class=UserCreateSerializer
    permission_classes=[IsAdminUser]
# accounts/views.py

from dj_rest_auth.views import LoginView

class CustomLoginView(LoginView):
    def get_response(self):
        response = super().get_response()

        user = self.user

        response.data["id"] = user.id
        response.data["username"] = user.username
        response.data["role"] = user.role
        response.data["must_change_password"] = user.must_change_password

        return response