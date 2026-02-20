from django.urls import path
from .views import SignUpView, LoginView,ProfilesListView

urlpatterns = [
    path("signup", SignUpView.as_view(), name="signup"),
    path("login", LoginView.as_view(), name="login"),
    path("profiles", ProfilesListView.as_view(), name="profiles"),
]
