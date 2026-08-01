from django.urls import path
from payments.views import PaymentListCreateAPIView,PaymentRetrieveUpdateDestroyAPIView,RoomPriceListCreateAPIView,RoomPriceRetrieveUpdateDestroyAPIView
urlpatterns=[
    path('roomprice/',RoomPriceListCreateAPIView.as_view(),name='room_price_create_list'),
    path('roomprice/<str:room_type>/',RoomPriceRetrieveUpdateDestroyAPIView.as_view(),name='room_price_retrieve_update_destroy')  ,
    path('payment/',PaymentListCreateAPIView.as_view(),name='payment_create_list'),
    path('payment/<str:student_id>/',PaymentRetrieveUpdateDestroyAPIView.as_view(),name='payment_retrieve_update_destroy')  
] 