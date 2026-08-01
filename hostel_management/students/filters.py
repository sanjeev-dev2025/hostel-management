from rest_framework import filters
import django_filters
from students.models import Student
class StudentFilter(django_filters.FilterSet):
    class Meta:
        model=Student
        fields={"student_id":["icontains"],
        "first_name":["icontains"],
        "last_name":["icontains"],
        "gender":["icontains"],
        }