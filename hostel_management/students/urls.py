from django.urls import path
from students.views import StudentListCreateAPIView,StudentRetrieveUpdateDestroyAPIView

urlpatterns=[
    path('studentlist/',StudentListCreateAPIView.as_view(),name='student_list'),
    path('studentlist/<str:student_id>/',StudentRetrieveUpdateDestroyAPIView.as_view(),name='student_retrieve_update_destroy')
]