# api/urls.py
from django.urls import path
from .views import SignUpView, LoginView, ProfilesListView, ProfileView,CloudinaryDeleteView,ProfilessavedListView,LikesView

urlpatterns = [
    path("signup", SignUpView.as_view()),
    path("login", LoginView.as_view()),
    path("cloudinary/delete", CloudinaryDeleteView.as_view(), name="cloudinary-delete"),
    path("profiles", ProfilesListView.as_view()),
    path("profilessaved/<str:user_id>", ProfilessavedListView.as_view()),

    path("profile/<str:user_id>", ProfileView.as_view()),
    path("likes/<str:user_id>", LikesView.as_view()),                     
    path("likes/<str:user_id>/<str:profile_id>", LikesView.as_view()),     
]
