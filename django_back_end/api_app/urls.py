from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'greenhouses', views.GreenhouseViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('greenhouses/<int:greenhouse_id>/status/', views.update_greenhouse_status, name='update-greenhouse-status'),
    path('greenhouses/<int:greenhouse_id>/plant/', views.start_planting, name='start-planting'),
]
