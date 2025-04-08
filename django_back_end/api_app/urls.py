from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet, GreenhouseViewSet,
    InventoryItemViewSet, InventoryUsageViewSet
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'greenhouses', GreenhouseViewSet)
router.register(r'inventory', InventoryItemViewSet)
router.register(r'inventory-usage', InventoryUsageViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
