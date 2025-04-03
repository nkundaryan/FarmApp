from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Greenhouse

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('id', 'username', 'email')
    search_fields = ('username', 'email')
    ordering = ('id',)

@admin.register(Greenhouse)
class GreenhouseAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'size', 'created_at')
    search_fields = ('name',)


