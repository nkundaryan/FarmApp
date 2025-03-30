from django.contrib import admin
from .models import User, Greenhouse

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'email')
    search_fields = ('username', 'email')

@admin.register(Greenhouse)
class GreenhouseAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'size', 'created_at')
    search_fields = ('name',)


