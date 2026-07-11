from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("partidos/", views.partidos, name="partidos"),
    path("login/", views.login, name="login"),
    path("profile/", views.profile, name="profile"),
    path("history/", views.history_view, name="history"),
    path("noticia/<int:news_id>/", views.news_detail, name="news_detail"),
    path("noticia/", views.news_page, name="news_page"),
    path("news/", views.news_view, name="news"),
    path("country/<str:country_code>/", views.country_detail, name="country_detail"),
    path("api/world-cup-news/", views.get_world_cup_news, name="world_cup_news"),
    path("api/world-cup-info/", views.get_world_cup_info, name="world_cup_info"),
    path("api/world-cup-standings/", views.get_world_cup_standings, name="world_cup_standings"),
    path("api/world-cup-matches/", views.get_world_cup_matches, name="world_cup_matches"),
]

