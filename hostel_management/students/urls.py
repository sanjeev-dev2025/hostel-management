from django.urls import path
from students.views import StudentListCreateAPIView

urlpatterns=[
    path('studentlist/',StudentListCreateAPIView.as_view(),name='student_list')
]