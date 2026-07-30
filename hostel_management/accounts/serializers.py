from accounts.models import User

from rest_framework import serializers


class UserProfileSeralizers(serializers.ModelSerializer):
    class Meta:
        model=User
        fields=['id','username','email','role']    

        def validate(self, attrs):
            email=attrs.get('email')
            if email and User.objects.filter(email=email).exists():
                raise serializers.ValidationError("Email already exists")