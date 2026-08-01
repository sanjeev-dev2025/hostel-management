from django.urls import path
from accounts.views import UserListApiView,UserCreateAPIView   
urlpatterns=[
    path('userlist/', UserListApiView.as_view(),name='userlist'),
    path('usercreate/', UserCreateAPIView.as_view(),name='usercreate'),
   
]