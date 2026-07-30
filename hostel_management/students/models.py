from django.db.models import CASCADE
from django.db import models
from django.conf import settings
# Create your models here.
class Student(models.Model):
    class Gender(models.TextChoices):
        MALE="MALE","male",
        FEMALE="FEMALE","female",
        OTHERS="OTHERS","others",
    user=models.OneToOneField(settings.AUTH_USER_MODEL,on_delete=CASCADE,related_name="student")
    first_name=models.CharField(max_length=40,null=False)
    last_name=models.CharField(max_length=40,null=False)
    student_id=models.CharField(max_length=20,null=False,unique=True)
    address=models.CharField(max_length=50)
    phone_number=models.CharField(max_length=10,null=False)
    parents_name=models.CharField(max_length=40,null=False)
    parents_phone_number=models.CharField(max_length=10,null=False)
    gender=models.CharField(choices=Gender.choices,max_length=10,null=False)
    date_of_birth=models.DateField(null=False)
    date_of_admission=models.DateField(null=False)
    is_active=models.BooleanField(default=True)
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name} {self.student_id}"
        
class StudentCredential(models.Model):

    student = models.OneToOneField(
        Student,
        on_delete=models.CASCADE,
        related_name="credential"
    )

    temporary_password = models.CharField(
        max_length=100
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return f"{self.student}"
    
    