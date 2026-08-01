from accounts.models import User

from rest_framework import serializers

class UserProfileSeralizers(serializers.ModelSerializer):
    class Meta:
        model=User
        fields=['id','username','email','role','must_change_password']    

            
class UserCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields=['username','password','email','role']  
        extra_kwargs={
            'password':{'write_only':True}
        } 
        
    def create(self, validated_data):

        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data.get("email"),
            password=validated_data["password"],
            role=validated_data["role"]
        )
        if user.role==User.Role.STUDENT:
            user.must_change_password=True
        else:
            user.must_change_password=False
        user.save()

        return user