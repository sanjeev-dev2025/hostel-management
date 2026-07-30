from django.contrib import admin
from students.models import Student
from students.models import StudentCredential
# Register your models here.

admin.site.register(Student)
admin.site.register(StudentCredential)
