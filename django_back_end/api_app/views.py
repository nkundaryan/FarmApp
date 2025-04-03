from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.contrib.auth import get_user_model
from .models import Greenhouse
from .serializers import UserSerializer, GreenhouseSerializer

User = get_user_model()

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    def get_permissions(self):
        if self.action == 'create':
            return []  # No permissions required for user creation
        return [permissions.IsAuthenticated()]

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            # Create user with provided data
            user = User.objects.create_user(
                username=serializer.validated_data['username'],
                email=serializer.validated_data['email'],
                password=request.data['password']  # Password will be hashed by create_user
            )
            return Response(
                UserSerializer(user).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GreenhouseViewSet(viewsets.ModelViewSet):
    queryset = Greenhouse.objects.all()
    serializer_class = GreenhouseSerializer
    permission_classes = [permissions.IsAuthenticated]
