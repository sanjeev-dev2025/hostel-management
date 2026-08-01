from rest_framework.permissions import AllowAny
from django.shortcuts import render

# Create your views here.   
from students.serializers import StudentSerializers
from rest_framework import generics
from students.models import Student
from rest_framework.permissions import IsAuthenticated,AllowAny
from accounts.permissions import IsAdminUser,IsWardenUser,IsStudentUser,IsAdminUserOrWarden
from rest_framework.pagination import PageNumberPagination
from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend 
from students.filters import StudentFilter   
class StudentListCreateAPIView(generics.ListCreateAPIView):
    queryset=Student.objects.all()
    serializer_class=StudentSerializers
    pagination_class=PageNumberPagination       
    filter_backends=[DjangoFilterBackend,filters.SearchFilter,filters.OrderingFilter]
    filterset_class=StudentFilter
    search_fields=['first_name','last_name','student_id']
    ordering_fields=['student_id'] 
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
        if self.request.method=='PATCH' or self.request.method=='DELETE' or self.request.method=='PUT':
            return [IsAdminUserOrWarden()]
        else:
            return [IsAdminUserOrWarden()] 
    def perform_destroy(self, instance):
        instance.delete()
