# backend/config/settings.py

import os
from pathlib import Path

from dotenv import load_dotenv
from corsheaders.defaults import default_headers

# -------------------------------------------------
# Base
# -------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

SECRET_KEY = os.getenv("SECRET_KEY", "dev-only-change-me")
DEBUG = os.getenv("DEBUG", "0") == "1"

# Comma-separated in env:
# ALLOWED_HOSTS="acedating.onrender.com,localhost,127.0.0.1"
ALLOWED_HOSTS = [h.strip() for h in os.getenv("ALLOWED_HOSTS", "localhost,127.0.0.1").split(",") if h.strip()]

# If you're behind Render/Proxy (recommended)
USE_X_FORWARDED_HOST = True
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

# -------------------------------------------------
# Applications
# -------------------------------------------------
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    "rest_framework",
    "corsheaders",

    "api",
]

# -------------------------------------------------
# Middleware
# IMPORTANT ORDER:
# - Security
# - WhiteNoise (static)
# - CORS (must be before CommonMiddleware)
# - CommonMiddleware
# - sessions/csrf/auth/etc
# -------------------------------------------------
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",

    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",

    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

# -------------------------------------------------
# URLs / WSGI / ASGI
# -------------------------------------------------
ROOT_URLCONF = "config.urls"
WSGI_APPLICATION = "config.wsgi.application"
ASGI_APPLICATION = "config.asgi.application"

# -------------------------------------------------
# Templates (required for admin)
# -------------------------------------------------
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

# -------------------------------------------------
# Database
# You are using Mongo via pymongo in api/mongo.py and dbcommands.py,
# so Django's DATABASES isn't used for your app logic.
# Keep SQLite only for Django internals (sessions/admin if needed).
# -------------------------------------------------
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

# -------------------------------------------------
# Password validation (safe defaults)
# -------------------------------------------------
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# -------------------------------------------------
# Internationalization
# -------------------------------------------------
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

# -------------------------------------------------
# Static files (WhiteNoise)
# -------------------------------------------------
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

# Optional but recommended with WhiteNoise:
STORAGES = {
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
    }
}

# -------------------------------------------------
# Django defaults
# -------------------------------------------------
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# -------------------------------------------------
# DRF (simple)
# -------------------------------------------------
REST_FRAMEWORK = {
    "DEFAULT_RENDERER_CLASSES": (
        "rest_framework.renderers.JSONRenderer",
    )
}

# -------------------------------------------------
# CORS
# -------------------------------------------------
# Recommended env var on Render:
# CORS_ALLOWED_ORIGINS="https://acedating.vercel.app,http://localhost:3000"
env_origins = os.getenv("CORS_ALLOWED_ORIGINS", "")
CORS_ALLOWED_ORIGINS = [o.strip() for o in env_origins.split(",") if o.strip()]

# Fallback for local dev + your prod Vercel domain
if not CORS_ALLOWED_ORIGINS:
    CORS_ALLOWED_ORIGINS = [
        "https://acedating.vercel.app",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://192.168.56.1:3000",
    ]

# Allow Vercel preview URLs too (optional)
CORS_ALLOWED_ORIGIN_REGEXES = [
    r"^https://acedating-.*\.vercel\.app$",
]

# If you ever send cookies/session across domains, enable this:
# CORS_ALLOW_CREDENTIALS = True

# Make sure your custom header doesn't break preflight
CORS_ALLOW_HEADERS = list(default_headers) + [
    "x-user-id",
]

# -------------------------------------------------
# Security for production (Render)
# Only apply strict HTTPS settings when DEBUG=0
# -------------------------------------------------
if not DEBUG:
    SECURE_SSL_REDIRECT = False  # Render terminates SSL; proxy header handles scheme
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True

    # If you serve API only and don't use Django forms, you can keep CSRF as is.
    # If you later do cookie auth, configure CSRF_TRUSTED_ORIGINS below.

    # Add trusted origins if you use CSRF-protected cookie auth:
    # CSRF_TRUSTED_ORIGINS = [
    #     "https://acedating.vercel.app",
    # ]