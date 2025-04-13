from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet, GreenhouseViewSet,
    InventoryItemViewSet, InventoryUsageViewSet,
    start_planting, update_greenhouse_status,
    update_growing_stage
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'greenhouses', GreenhouseViewSet)
router.register(r'inventory', InventoryItemViewSet)
router.register(r'inventory-usage', InventoryUsageViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('greenhouses/<int:greenhouse_id>/start_planting/', start_planting, name='start_planting'),
    path('greenhouses/<int:greenhouse_id>/update_status/', update_greenhouse_status, name='update_greenhouse_status'),
    path('greenhouses/<int:greenhouse_id>/update_stage/', update_growing_stage, name='update_growing_stage'),
]
