from django.urls import path
from hostel.views import RoomAllotmentListCreateAPIView,RoomAllotmentRetrieveUpdateDestroyAPIView
urlpatterns=[
    path('roomallotment/',RoomAllotmentListCreateAPIView.as_view(),name='room_allotment'),
    path('roomallotment/<int:pk>/',RoomAllotmentRetrieveUpdateDestroyAPIView.as_view(),name='room_allotment_retrieve_update_destroy')   
 
]