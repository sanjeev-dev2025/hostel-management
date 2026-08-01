from accounts import permissions
from django.shortcuts import render
from rest_framework import generics
from hostel.serializers import RoomAllotmentSerializer,RoomSerializer,HostelSerializer  
from hostel.models import Room,RoomAllotment,Hostel
from accounts.permissions import IsAdminUserOrWarden,IsAdminUser,IsStudentUser
from rest_framework.permissions import IsAuthenticated


# Create your views here.
class RoomAllotmentListCreateAPIView(generics.ListCreateAPIView):
    queryset=RoomAllotment.objects.all()
    serializer_class=RoomAllotmentSerializer
    def get_permissions(self):
        if self.request.method=="POST":
            return [IsAdminUser()]
        return [IsAdminUser()]    

class RoomAllotmentRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset=RoomAllotment.objects.all()
    serializer_class=RoomAllotmentSerializer   
    def get_permissions(self):
        if self.request.method=='PATCH' or self.request.method=='DELETE':
            return [IsAdminUserOrWarden()]
        elif self.request.method=='PUT':
            return [ IsAdminUserOrWarden()]
        else:
            return [IsAuthenticated()]   
            
    def perform_destroy(self, instance):
        room = instance.room
        if room.occupied > 0:
            room.occupied -= 1
            room.save()
        instance.delete()
class RoomListCreateAPIView(generics.ListCreateAPIView):
    queryset=Room.objects.all()
    serializer_class=RoomSerializer 
    def get_permissions(self):
        if self.request.method=='POST':
            return [IsAdminUser()]
        else:
            return [IsAdminUserOrWarden()] 
    def perform_destroy(self, instance):
       instance.delete()

class RoomRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset=Room.objects.all()
    serializer_class=RoomSerializer   
    def get_permissions(self):
        if self.request.method=='PATCH' or self.request.method=='DELETE':
            return [IsAdminUserOrWarden()]
        elif self.request.method=='PUT':
            return [ IsAdminUserOrWarden()]
        else:
            return [IsAuthenticated()]  
            
    def perform_destroy(self, instance):
        instance.delete() 
class HostelListCreateAPIView(generics.ListCreateAPIView):
    queryset=Hostel.objects.all()
    serializer_class=HostelSerializer
    def get_permissions(self):
        if self.request.method=='POST':
            return [IsAdminUser()]
        else:
            return [IsAdminUserOrWarden()]
    def perform_destroy(self, instance):
        instance.delete()
class HostelRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset=Hostel.objects.all()
    serializer_class=HostelSerializer   
    lookup_field='name'
    loop_url_kwarg='name'
    def get_permissions(self):
        if self.request.method=='PATCH' or self.request.method=='DELETE':
            return [IsAdminUserOrWarden()]
        elif self.request.method=='PUT':
            return [ IsAdminUserOrWarden()]
        else:
            return [IsAuthenticated()] 