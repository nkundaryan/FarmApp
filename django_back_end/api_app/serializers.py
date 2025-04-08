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
    class Meta:
        model = GrowingCycle
        fields = ('id', 'greenhouse', 'crop_name', 'seed_type', 'planting_date', 
                 'expected_harvest_date', 'actual_harvest_date', 'status', 
                 'termination_reason', 'termination_notes', 'notes')

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
        active_cycle = obj.cycles.filter(status__in=['preparing', 'growing']).first()
        if active_cycle:
            return GrowingCycleSerializer(active_cycle).data
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
