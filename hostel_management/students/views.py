from rest_framework.permissions import AllowAny
from django.shortcuts import render

# Create your views here.   
from students.serializers import StudentSerializers
from rest_framework import generics
from students.models import Student
from rest_framework.permissions import IsAuthenticated,AllowAny
from accounts.permissions import IsAdminUser,IsWardenUser,IsStudentUser,IsAdminUserOrWarden

class StudentListCreateAPIView(generics.ListCreateAPIView):
    queryset=Student.objects.all()
    serializer_class=StudentSerializers
    def get_permissions(self):

        if self.request.method=='POST':
            return [IsAdminUserOrWarden()]
        else:
            return [IsAuthenticated()]

    
    
