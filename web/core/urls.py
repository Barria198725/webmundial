from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("partidos/", views.partidos, name="partidos"),
    path("login/", views.login, name="login"),
    path("profile/", views.profile, name="profile"),
    path("history/", views.history_view, name="history"),
    path("sedes/<str:country_code>/", views.country_detail, name="country_detail"),
]
