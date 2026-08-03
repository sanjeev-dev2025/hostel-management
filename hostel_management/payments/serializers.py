from payments.models import RoomPrice,Payment   
from rest_framework import serializers
from hostel.models import RoomAllotment
class RoomPriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomPrice
        fields = [
            "room_type",
            "monthly_fee",
            "created_at",
            "updated_at"
        ]
        read_only_fields = [
            "created_at",
            "updated_at"
        ]

    def validate_monthly_fee(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                "Monthly fee must be greater than zero."
            )

        return value
class PaymentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Payment
        fields = [
            "id",
            "student",
            "amount",
            "billing_month",
            "billing_year",
            "payment_date",
            "status",
            "remarks",
            "created_at",
            "updated_at"
        ]

        read_only_fields = [
            "id",
            "amount",
            "payment_date",
            "created_at",
            "updated_at"
        ]


    def validate(self, data):

        student = data.get("student", getattr(self.instance, "student", None))

        # Check duplicate payment
        billing_month = data.get("billing_month", getattr(self.instance, "billing_month", None))
        billing_year = data.get("billing_year", getattr(self.instance, "billing_year", None))

        qs = Payment.objects.filter(
            student=student,
            billing_month=billing_month,
            billing_year=billing_year
        )

        if self.instance:
            qs = qs.exclude(id=self.instance.id)

        if qs.exists():
            raise serializers.ValidationError(
                "Payment already exists for this month."
            )


        # Check student has room allocation
        room_allotment = RoomAllotment.objects.filter(
            student=student,
            is_active=True
        ).first()

        if room_allotment is None:
            raise serializers.ValidationError(
                "Student has no room allocated."
    )

        room = room_allotment.room  
        


        return data


    def create(self, validated_data):

        student = validated_data["student"]

        # Get student's room
        room_allotment = RoomAllotment.objects.get(
            student=student,
            is_active=True
        )

        room = room_allotment.room

        # Get room price according to room type
        room_price = RoomPrice.objects.get(
            room_type=room.room_type
        )


        # Calculate individual payment
        individual_amount = (
            room_price.monthly_fee / room.capacity
        )


        validated_data["amount"] = individual_amount


        payment = Payment.objects.create(
            **validated_data
        )

        return payment