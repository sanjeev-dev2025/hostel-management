from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):

    class Role(models.TextChoices):
        ADMIN = "ADMIN", "Admin"
        WARDEN = "WARDEN", "Warden"
        STUDENT = "STUDENT", "Student"
        ACCOUNTANT="ACCOUNTANT","accountant"

    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.STUDENT
    )

    must_change_password = models.BooleanField(default=True)

    def __str__(self):
        return self.username