from rest_framework import viewsets, permissions
from django.contrib.auth import get_user_model
from .models import Greenhouse
from .serializers import UserSerializer, GreenhouseSerializer

User = get_user_model()

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

class GreenhouseViewSet(viewsets.ModelViewSet):
    queryset = Greenhouse.objects.all()
    serializer_class = GreenhouseSerializer
    permission_classes = [permissions.IsAuthenticated]
