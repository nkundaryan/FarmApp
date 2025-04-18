from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action, api_view
from django.contrib.auth import get_user_model
from .models import Greenhouse, GrowingCycle, InventoryItem, InventoryUsage
from .serializers import (
    UserSerializer, GreenhouseSerializer, GrowingCycleSerializer,
    InventoryItemSerializer, InventoryUsageSerializer
)
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
    print(f"Received start_planting request for greenhouse {greenhouse_id}")
    print(f"Request data: {request.data}")
    
    try:
        greenhouse = Greenhouse.objects.get(id=greenhouse_id)
    except Greenhouse.DoesNotExist:
        return Response({"error": "Greenhouse not found"}, status=status.HTTP_404_NOT_FOUND)

    if greenhouse.status != 'inactive':
        return Response({"error": "Can only plant in inactive greenhouses"}, 
                       status=status.HTTP_400_BAD_REQUEST)

    active_cycle = greenhouse.cycles.filter(status__in=['germination', 'seedling', 'vegetative_growth', 'flowering', 'maturation']).first()
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
        'status': 'germination'
    }
    
    print(f"Creating growing cycle with data: {cycle_data}")

    serializer = GrowingCycleSerializer(data=cycle_data)
    if not serializer.is_valid():
        print(f"Validation errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    growing_cycle = serializer.save()
    print(f"Growing cycle created: {growing_cycle}")

    # Update greenhouse status
    greenhouse.status = 'active'
    greenhouse.save()

    response_data = GreenhouseSerializer(greenhouse).data
    response_data['current_cycle'] = GrowingCycleSerializer(growing_cycle).data

    return Response(response_data)

@api_view(['PATCH'])
def update_growing_stage(request, greenhouse_id):
    try:
        greenhouse = Greenhouse.objects.get(id=greenhouse_id)
    except Greenhouse.DoesNotExist:
        return Response({"error": "Greenhouse not found"}, status=status.HTTP_404_NOT_FOUND)

    if greenhouse.status != 'active':
        return Response({"error": "Can only update stage for active greenhouses"}, 
                       status=status.HTTP_400_BAD_REQUEST)

    # Look for cycles in any active growing stage
    active_cycle = greenhouse.cycles.filter(
        status__in=['germination', 'seedling', 'vegetative_growth', 'flowering', 'maturation']
    ).first()
    
    if not active_cycle:
        return Response({"error": "No active growing cycle found"}, 
                       status=status.HTTP_400_BAD_REQUEST)

    # Update the stage and stage name
    new_stage = request.data.get('stage')
    print(f"Received stage update request: {request.data}")  # Debug log
    print(f"Current active cycle: {active_cycle}")  # Debug log
    print(f"New stage value: {new_stage}")  # Debug log
    print(f"New stage type: {type(new_stage)}")  # Debug log
    
    try:
        new_stage = int(new_stage)
    except (TypeError, ValueError):
        return Response({"error": "Stage must be a number"}, 
                       status=status.HTTP_400_BAD_REQUEST)
    
    if new_stage < 1 or new_stage > 5:
        return Response({"error": "Stage must be between 1 and 5"}, 
                       status=status.HTTP_400_BAD_REQUEST)

    # Update the stage and stage name
    active_cycle.stage = new_stage
    stage_names = {
        1: 'Germination',
        2: 'Seedling',
        3: 'Vegetative Growth',
        4: 'Flowering',
        5: 'Maturation'
    }
    active_cycle.stage_name = stage_names[new_stage]
    
    # Also update the cycle status to match the stage
    status_map = {
        1: 'germination',
        2: 'seedling',
        3: 'vegetative_growth',
        4: 'flowering',
        5: 'maturation'
    }
    active_cycle.status = status_map[new_stage]
    
    active_cycle.save()

    response_data = GreenhouseSerializer(greenhouse).data
    return Response(response_data)

class InventoryItemViewSet(viewsets.ModelViewSet):
    queryset = InventoryItem.objects.all()
    serializer_class = InventoryItemSerializer
    permission_classes = [permissions.AllowAny]

    @action(detail=True, methods=['post'])
    def record_usage(self, request, pk=None):
        inventory_item = self.get_object()
        serializer = InventoryUsageSerializer(data=request.data)
        
        if serializer.is_valid():
            # Get the validated greenhouse object from the serializer
            greenhouse = serializer.validated_data['greenhouse'] 

            # Check if the greenhouse is active
            if greenhouse.status != 'active':
                return Response(
                    {'error': f'Inventory can only be used in active greenhouses. {greenhouse.name} is currently {greenhouse.status}.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Check inventory quantity
            quantity_used = serializer.validated_data['quantity_used']
            if quantity_used > inventory_item.current_quantity:
                return Response(
                    {'error': 'Not enough inventory available'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Update inventory quantity
            inventory_item.current_quantity -= quantity_used
            inventory_item.save()
            
            # Create the usage record, associating with the item and greenhouse
            # The serializer already has greenhouse via validated_data
            serializer.save(inventory_item=inventory_item)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        # Return the specific validation errors
        return Response({
            'error': 'Invalid data',
            'details': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

class InventoryUsageViewSet(viewsets.ModelViewSet):
    queryset = InventoryUsage.objects.all()
    serializer_class = InventoryUsageSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = InventoryUsage.objects.all()
        inventory_item_id = self.request.query_params.get('inventory_item', None)
        if inventory_item_id is not None:
            queryset = queryset.filter(inventory_item_id=inventory_item_id)
        return queryset
