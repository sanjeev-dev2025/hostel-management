from django.db import models
from students.models import Student


class RoomPrice(models.Model):

    class RoomType(models.TextChoices):
        SINGLE = "SINGLE", "Single"
        DOUBLE = "DOUBLE", "Double"
        TRIPLE = "TRIPLE", "Triple"

    room_type = models.CharField(
        max_length=10,
        choices=RoomType.choices,
        unique=True
    )

    monthly_fee = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return f"{self.room_type} - Rs. {self.monthly_fee}"


class Payment(models.Model):

    class PaymentStatus(models.TextChoices):
        PAID = "PAID", "Paid"
        PENDING = "PENDING", "Pending"

    class Month(models.IntegerChoices):
        JANUARY = 1, "January"
        FEBRUARY = 2, "February"
        MARCH = 3, "March"
        APRIL = 4, "April"
        MAY = 5, "May"
        JUNE = 6, "June"
        JULY = 7, "July"
        AUGUST = 8, "August"
        SEPTEMBER = 9, "September"
        OCTOBER = 10, "October"
        NOVEMBER = 11, "November"
        DECEMBER = 12, "December"

    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
        related_name="payments"
    )

    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    billing_month = models.PositiveSmallIntegerField(
        choices=Month.choices
    )

    billing_year = models.PositiveIntegerField()

    payment_date = models.DateField(
        auto_now_add=True
    )

    status = models.CharField(
        max_length=10,
        choices=PaymentStatus.choices,
        default=PaymentStatus.PAID
    )

    remarks = models.TextField(
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        unique_together = (
            "student",
            "billing_month",
            "billing_year",
        )

    def __str__(self):
        return (
            f"{self.student.first_name} {self.student.last_name} {self.student.student_id} - "
            f"{self.get_billing_month_display()} {self.billing_year}"
        )