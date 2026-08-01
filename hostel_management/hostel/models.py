from django.contrib import auth
from django.db import models
from students.models import Student
# Create your models here.
class Hostel(models.Model):
    class Gender(models.TextChoices):
        MALE="MALE","male"
        FEMALE="FEMALE","female"
        OTHER="OTHERS","others"
    name=models.CharField(max_length=30,null=False)
    gender=models.CharField(choices=Gender.choices)
    created_at=models.DateField(auto_now_add=True)
    updated_at=models.DateField(auto_now=True)

    def __str__(self):
        return self.name

class Room(models.Model):
    class RoomType(models.TextChoices):
        SINGLE="SINGLE","single"
        DOUBLE="DOUBLE","double"
        TRIPLE="TRIPLE","triple"
    room_number=models.CharField(max_length=10,null=False)
    room_type=models.CharField(choices=RoomType.choices)
    capacity=models.PositiveIntegerField()
    occupied=models.PositiveIntegerField(default=0) 
    hostel=models.ForeignKey(Hostel,on_delete=models.CASCADE)
    created_at=models.DateField(auto_now_add=True)
    updated_at=models.DateField(auto_now=True)
    def __str__(self):
        return f"{self.room_number}{self.hostel.name}{self.room_type}"
    
class RoomAllotment(models.Model):
    student=models.ForeignKey(Student,on_delete=models.CASCADE)
    room=models.ForeignKey(Room,on_delete=models.CASCADE)
    room_allocated_date=models.DateField(auto_now_add=True)
    created_at=models.DateField(auto_now_add=True)  
    updated_at=models.DateField(auto_now=True)
    is_active=models.BooleanField(default=True)

    def __str__(self):
        return f"{self.student.first_name}{self.student.student_id}{self.room.room_number} {self.room.room_type}"