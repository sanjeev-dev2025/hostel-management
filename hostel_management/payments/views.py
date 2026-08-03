from accounts.permissions import IsAdminUserOrAccountant
from django.shortcuts import render
from payments.serializers import PaymentSerializer,RoomPriceSerializer
from payments.models import Payment,RoomPrice
from rest_framework import generics,viewsets
from accounts.permissions import IsAdminUserOrWarden,IsAdminUserOrAccountant,IsAdminUser
from rest_framework.permissions import IsAuthenticated,AllowAny
    # Create your views here.
class RoomPriceListCreateAPIView(generics.ListCreateAPIView):
    queryset=RoomPrice.objects.all()
    serializer_class=RoomPriceSerializer
    def get_permissions(self):
        if self.request.method=='POST':
            return [IsAdminUser()]
        else:
            return [IsAuthenticated()]
    
class RoomPriceRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset=RoomPrice.objects.all()
    serializer_class=RoomPriceSerializer    
    lookup_field='room_type'
    lookup_url_kwarg='room_type'
    def get_permissions(self):
        if self.request.method=='PATCH' or self.request.method=='DELETE' or self.request.method=='PUT':
            return [IsAdminUser()]
        else:
            return [IsAdminUserOrAccountant()]
class PaymentListCreateAPIView(generics.ListCreateAPIView):
    queryset=Payment.objects.all()
    serializer_class=PaymentSerializer
    def get_permissions(self):
        if self.request.method=='POST':
            return [IsAdminUserOrAccountant()]
        else:
            return [IsAuthenticated()]
    def get_queryset(self):
        queryset=super().get_queryset()
        if hasattr(self.request.user, 'role') and self.request.user.role == 'STUDENT':
            queryset=queryset.filter(student__user=self.request.user)
        return queryset
class PaymentRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset=Payment.objects.all()
    serializer_class=PaymentSerializer
    def get_permissions(self):
        if self.request.method=='PATCH' or self.request.method=='DELETE' or self.request.method=='PUT':
            return [IsAdminUserOrAccountant()]
        else:
            return [IsAdminUserOrAccountant()]
