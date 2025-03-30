from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, GreenhouseViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'greenhouses', GreenhouseViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
