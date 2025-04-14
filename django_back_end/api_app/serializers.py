from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import User, Greenhouse, GrowingCycle, WeeklyHarvest, MaintenanceActivity, InventoryItem, InventoryUsage

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
        extra_kwargs = {
            'password': {'write_only': True}
        }

class GrowingCycleSerializer(serializers.ModelSerializer):
    def validate(self, data):
        print(f"Validating growing cycle data: {data}")
        return data

    class Meta:
        model = GrowingCycle
        fields = ('id', 'greenhouse', 'crop_name', 'seed_type', 'planting_date', 
                 'expected_harvest_date', 'actual_harvest_date', 'status', 
                 'termination_reason', 'termination_notes', 'notes',
                 'stage', 'total_stages', 'stage_name')
        read_only_fields = ('id', 'actual_harvest_date', 'termination_reason', 
                          'termination_notes', 'notes', 'stage', 'total_stages', 
                          'stage_name')

# Forward declaration for InventoryUsageSerializer if needed, or ensure definition order
# class InventoryUsageSerializer(serializers.Serializer):
#     pass 

class GreenhouseSerializer(serializers.ModelSerializer):
    current_cycle = serializers.SerializerMethodField()
    # Remove inventory_usages field
    # inventory_usages = InventoryUsageSerializer(many=True, read_only=True)

    class Meta:
        model = Greenhouse
        # Remove inventory_usages from fields
        fields = (
            'id', 'name', 'size', 'status', 
            'created_at', 'updated_at', 
            'current_cycle' 
        )
        read_only_fields = ('created_at', 'updated_at')

    def get_current_cycle(self, obj):
        # Look for cycles in any active growing stage
        active_cycle = obj.cycles.filter(
            status__in=['germination', 'seedling', 'vegetative_growth', 'flowering', 'maturation']
        ).first()
        if active_cycle:
            cycle_data = GrowingCycleSerializer(active_cycle).data
            return {
                'type': cycle_data['crop_name'],
                'variety': cycle_data['seed_type'],
                'plantingDate': cycle_data['planting_date'],
                'expectedHarvestDate': cycle_data['expected_harvest_date'],
                'stage': cycle_data['stage'],
                'totalStages': cycle_data.get('total_stages', 5),
                'stageName': cycle_data.get('stage_name', 'Unknown Stage')
            }
        return None

class InventoryItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = InventoryItem
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')

class InventoryUsageSerializer(serializers.ModelSerializer):
    greenhouse_id = serializers.PrimaryKeyRelatedField(
        queryset=Greenhouse.objects.all(), 
        source='greenhouse', 
        write_only=True, 
        required=True, 
        allow_null=False
    )
    greenhouse = GreenhouseSerializer(read_only=True)
    # Add back the nested InventoryItemSerializer for read operations
    inventory_item = InventoryItemSerializer(read_only=True) 

    class Meta:
        model = InventoryUsage
        fields = (
            'id', 
            'inventory_item', # Include for reading nested data
            'greenhouse_id', 
            'greenhouse', 
            'quantity_used', 
            'purpose_note', 
            'usage_date', 
            'created_at'
        )
        # inventory_item is handled by its definition above
        read_only_fields = ('id', 'greenhouse', 'inventory_item', 'created_at', 'usage_date')
