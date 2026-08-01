from django.urls import path
from hostel.views import RoomAllotmentListCreateAPIView,RoomAllotmentRetrieveUpdateDestroyAPIView,RoomListCreateAPIView,RoomRetrieveUpdateDestroyAPIView,HostelListCreateAPIView,HostelRetrieveUpdateDestroyAPIView
urlpatterns=[
    path('roomallotment/',RoomAllotmentListCreateAPIView.as_view(),name='room_allotment'),
    path('roomallotment/<int:pk>/',RoomAllotmentRetrieveUpdateDestroyAPIView.as_view(),name='room_allotment_retrieve_update_destroy') ,  
    path('room/',RoomListCreateAPIView.as_view(),name='room_create'),
    path('room/<int:pk>/',RoomRetrieveUpdateDestroyAPIView.as_view(),name='room_retrieve_update_destroy'),  
    path('hostel/',HostelListCreateAPIView.as_view(),name='hostel_create_list'),
    path('hostel/<str:name>/',HostelRetrieveUpdateDestroyAPIView.as_view(),name='hostel_retrieve_update_destroy')   
 
]