from rest_framework.permissions import IsAuthenticated
from django.shortcuts import render
from accounts.models import User
from accounts.serializers import UserProfileSeralizers
from rest_framework.response import Response
from rest_framework import generics,status
from rest_framework.permissions import IsAuthenticated

# Create your views here.

class UserListApiView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserProfileSeralizers    
    permission_classes=[IsAuthenticated]
