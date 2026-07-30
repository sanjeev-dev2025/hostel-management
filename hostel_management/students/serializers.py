from students.models import Student,StudentCredential
from rest_framework import serializers
import secrets
import string
from accounts.models import User

class StudentSerializers(serializers.ModelSerializer):
    class Meta:
        model=Student
        fields=["id","first_name","last_name","student_id","address","phone_number","parents_name","parents_phone_number","gender","date_of_birth","date_of_admission","is_active","created_at","updated_at"]
    def password_generator(self):
        password=''.join(secrets.choice(string.ascii_letters + string.digits) for i in range(10))
        return password
    def create(self, validated_data):

        password = self.password_generator()

        user = User.objects.create_user(
            username=validated_data['first_name'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            role=User.Role.STUDENT,
            password=password
           )

        student = Student.objects.create(
            user=user,
            **validated_data
        )

        StudentCredential.objects.create(
            student=student,
            temporary_password=password
        )

        return student
