from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action, api_view
from django.contrib.auth import get_user_model
from .models import Greenhouse, GrowingCycle
from .serializers import UserSerializer, GreenhouseSerializer, GrowingCycleSerializer
from django.utils import timezone

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
    # Temporarily remove authentication for testing
    permission_classes = []  # Remove [permissions.IsAuthenticated]

@api_view(['PATCH'])
def update_greenhouse_status(request, greenhouse_id):
    try:
        greenhouse = Greenhouse.objects.get(id=greenhouse_id)
    except Greenhouse.DoesNotExist:
        return Response({"error": "Greenhouse not found"}, status=status.HTTP_404_NOT_FOUND)

    new_status = request.data.get('status')
    if not new_status:
        return Response({"error": "Status is required"}, status=status.HTTP_400_BAD_REQUEST)

    if new_status not in dict(Greenhouse.STATUS_CHOICES):
        return Response({"error": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)

    # Validate status transition
    if new_status == 'active' and greenhouse.status == 'inactive':
        active_cycle = greenhouse.cycles.filter(status__in=['preparing', 'growing']).first()
        if not active_cycle:
            return Response({"error": "Cannot activate greenhouse without an active growing cycle"}, 
                          status=status.HTTP_400_BAD_REQUEST)

    greenhouse.status = new_status
    greenhouse.save()

    return Response(GreenhouseSerializer(greenhouse).data)

@api_view(['POST'])
def start_planting(request, greenhouse_id):
    try:
        greenhouse = Greenhouse.objects.get(id=greenhouse_id)
    except Greenhouse.DoesNotExist:
        return Response({"error": "Greenhouse not found"}, status=status.HTTP_404_NOT_FOUND)

    if greenhouse.status != 'inactive':
        return Response({"error": "Can only plant in inactive greenhouses"}, 
                       status=status.HTTP_400_BAD_REQUEST)

    active_cycle = greenhouse.cycles.filter(status__in=['preparing', 'growing']).first()
    if active_cycle:
        return Response({"error": "Greenhouse already has an active growing cycle"}, 
                       status=status.HTTP_400_BAD_REQUEST)

    # Create new growing cycle
    cycle_data = {
        'greenhouse': greenhouse.id,
        'crop_name': request.data.get('crop_name'),
        'seed_type': request.data.get('seed_type'),
        'planting_date': request.data.get('planting_date'),
        'expected_harvest_date': request.data.get('expected_harvest_date'),
        'status': 'growing'
    }

    serializer = GrowingCycleSerializer(data=cycle_data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    growing_cycle = serializer.save()

    # Update greenhouse status
    greenhouse.status = 'active'
    greenhouse.save()

    response_data = GreenhouseSerializer(greenhouse).data
    response_data['current_cycle'] = GrowingCycleSerializer(growing_cycle).data

    return Response(response_data)
