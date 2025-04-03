from rest_framework import serializers
from .models import User, Greenhouse, GrowingCycle, WeeklyHarvest, MaintenanceActivity

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
        extra_kwargs = {
            'password': {'write_only': True}
        }

class GreenhouseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Greenhouse
        fields = ('id', 'name', 'size', 'status', 'created_at', 'updated_at')
        read_only_fields = ('created_at', 'updated_at')
