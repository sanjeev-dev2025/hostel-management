from django.contrib import admin
from hostel.models import Hostel,Room,RoomAllotment

# Register your models here.
admin.site.register(Hostel)
admin.site.register(Room)
admin.site.register(RoomAllotment)
