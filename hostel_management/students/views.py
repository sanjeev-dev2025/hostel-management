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
    def get_queryset(self):
        queryset=super().get_queryset()
        if not self.request.user.is_staff:
            queryset=queryset.filter(user=self.request.user)
        return queryset
    
class StudentRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset=Student.objects.all()
    serializer_class=StudentSerializers
    lookup_field='student_id'
    lookup_url_kwarg='student_id'
    def get_permissions(self):
        if self.request.method=='PATCH' or self.request.method=='DELETE':
            return [IsAdminUserOrWarden()]
        elif self.request.method=='PUT':
            return [IsStudentUser() or IsAdminUserOrWarden()]
        else:
            return [IsAuthenticated()]    
