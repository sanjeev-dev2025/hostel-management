from hostel.models import RoomAllotment,Room,Hostel
from rest_framework import serializers

class RoomAllotmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomAllotment
        fields = [
            "id",
            "student",
            "room",
            "room_allocated_date",
            "created_at",
            "updated_at"
        ]

        read_only_fields = [
            "room_allocated_date",
            "created_at",
            "updated_at"
        ]


    def validate(self, data):

        student = data["student"]
        room = data["room"]


        # Check student already has room
        if RoomAllotment.objects.filter(
            student=student,
            is_active=True
        ).exists():

            raise serializers.ValidationError(
                "Student already has a room."
            )


        # Check gender matching
        if student.gender != room.hostel.gender:

            raise serializers.ValidationError(
                "Cannot assign student to this hostel."
            )


        # Check room capacity
        if room.occupied >= room.capacity:

            raise serializers.ValidationError(
                "Room is full."
            )


        return data



    def create(self, validated_data):

        room = validated_data["room"]

        # Create allocation
        allocation = RoomAllotment.objects.create(
            **validated_data
        )


        # Increase occupied count
        room.occupied += 1
        room.save()


        return allocation

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model=Room
        fields=["id","room_number","room_type","capacity","occupied","hostel","created_at","updated_at"]

class HostelSerializer(serializers.ModelSerializer):
    class Meta:
        model=Hostel
        fields=["id","name","gender","created_at","updated_at"] 