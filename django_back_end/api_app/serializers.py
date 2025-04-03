from rest_framework import serializers
from .models import User, Greenhouse

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
        fields = ('id', 'name', 'size', 'created_at', 'updated_at')
