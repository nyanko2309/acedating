# api/urls.py
from django.urls import path
from .views import SignUpView, LoginView, ProfilesListView, ProfileView,CloudinaryDeleteView,ProfilessavedListView,LikesView,WriteLatterView,InboxView
from .views import DeleteLetterView,MarkLetterReadView
urlpatterns = [
    path("signup", SignUpView.as_view()),
    path("login", LoginView.as_view()),
    path("cloudinary/delete", CloudinaryDeleteView.as_view(), name="cloudinary-delete"),
    path("allprofiles", ProfilesListView.as_view()),
    path("profilessaved/<str:user_id>", ProfilessavedListView.as_view()),
    path("writelatter/<str:user_id>/<str:profile_id>",WriteLatterView.as_view()),
    path("inbox/<str:user_id>",InboxView.as_view()),
    path("profile/<str:user_id>", ProfileView.as_view()),
    path("likes/<str:user_id>", LikesView.as_view()),                     
    path("likes/<str:user_id>/<str:profile_id>", LikesView.as_view()),
    path("letters/<str:letter_id>", DeleteLetterView.as_view()),
    path("letters/<str:letter_id>/read", MarkLetterReadView.as_view()),     
]
