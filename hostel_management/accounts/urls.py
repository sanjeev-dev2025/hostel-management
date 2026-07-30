from django.urls import path
from accounts.views import UserListApiView
urlpatterns=[
    path('userlist/', UserListApiView.as_view(),name='userlist'),
]