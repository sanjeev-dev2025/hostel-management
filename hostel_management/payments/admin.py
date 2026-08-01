from django.contrib import admin

# Register your models here.
from payments.models import RoomPrice,Payment
admin.site.register(RoomPrice)
admin.site.register(Payment)