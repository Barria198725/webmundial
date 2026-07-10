from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("partidos/", views.partidos, name="partidos"),
    path("login/", views.login, name="login"),
    path("profile/", views.profile, name="profile"),
    path("history/", views.history_view, name="history"),
    path("noticias/", views.news_view, name="news"),
    path("sedes/<str:country_code>", views.country_detail, name="country_detail"),
    path("legends/", views.legends_view, name="legends"),
    path("api/world-cup-news/", views.get_world_cup_news, name="api_world_cup_news"),
    path("api/world-cup-info/", views.get_world_cup_info, name="api_world_cup_info"),
    path("api/world-cup-standings/", views.get_world_cup_standings, name="api_world_cup_standings"),
]


