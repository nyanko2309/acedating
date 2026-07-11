# SPADES — Asexual Dating and Connection Platform

SPADES is a free public dating and connection platform designed for people on the asexual and aromantic spectrums.

The website works like a profile message board. Users create an account and public profile, browse other users as profile cards, save profiles to favorites, filter profiles according to their preferences, and send a limited private message when they want to learn more about someone.

## Live Website

The deployed website is available at:

https://acedating.vercel.app/home

## Project Status

SPADES is currently operational and publicly deployed.

The project is still being improved, but its main account, profile, search, favorites, password reset, image, and private-message features are functional.

## Main Features

- User registration
- User login
- Password reset
- Automatic profile creation during signup
- Public profile cards
- Profile images
- Profile search
- Multiple profile filters
- Favorites
- Edit profile
- Delete account
- Limited private messaging
- MongoDB Atlas database
- Public Vercel deployment

## How the Platform Works

### Registration

A new user creates an account and profile by providing:

- Username
- Password
- Name
- Age
- Orientation
- Type of connection they are looking for
- Profile image
- City or region
- Gender
- Personal description
- Contact information

The password is stored securely as a hash rather than as plain text.

### Login

Existing users can log in using:

- Username
- Password

After a successful login, the user can access the homepage and their account features.

### Password Reset

Users who forget their password can use the password-reset form to set a new password after providing the required account verification information.

### Homepage

The homepage displays public user profiles as cards.

Each card may display:

- Profile image
- Name
- Username
- Age
- Orientation
- Gender
- City or region
- Type of connection the user is looking for
- Personal description
- Contact information

### Search and Filters

Users can search and filter profiles using information entered during registration.

Available filters include:

- Keyword search
- Age range
- Orientation
- Looking for
- Gender
- City or region

Multiple filters can be used together to narrow the results.

### Favorites

Logged-in users can save profiles to a favorites list.

This allows users to return to profiles that interest them without searching for them again.

### Profile Management

Logged-in users can manage their own account and profile.

Users can:

- Edit their profile
- Update their personal information
- Change their profile image
- Update their contact details
- Delete their account

### Private Message

The platform includes a limited private-message feature.

A user can send one private message to another person in order to:

- Introduce themselves
- Express interest
- Ask for additional personal information
- Request another method of contact

The feature is intentionally limited because SPADES is designed primarily as a profile-discovery platform rather than a full real-time chat application.

## Profile Options

### Orientation

- Ace
- Aro
- Aroace
- Demi
- Grey-asexual

### Looking For

- Friendship
- Monogamous romance
- Queerplatonic relationship
- Polyamorous romance

### Gender

- Male
- Female
- Non-binary
- Other

### City and Region Options

- Gush Dan
- Tel Aviv
- Jerusalem area
- HaSharon
- HaShfela
- Haifa and Krayot
- Galilee and Golan
- South coast
- Negev and Beer Sheva area
- Eilat and Arava
- Other area in Israel

## Technologies

### Frontend

- React
- React Router
- Axios
- JavaScript
- HTML
- CSS

### Backend

- Python
- Django
- Django REST Framework
- PyMongo

### Database

- MongoDB Atlas

### Deployment

- Vercel

## Project Structure

```text
acedating/
│
├── backend/
│   ├── api/
│   │   ├── mongo.py
│   │   ├── urls.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   └── ...
│   │
│   ├── config/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── wsgi.py
│   │   └── ...
│   │
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   │   └── ...
│   │
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LoginPage.js
│   │   │   ├── Homepage.js
│   │   │   ├── LoginPage.css
│   │   │   └── Homepage.css
│   │   │
│   │   ├── App.js
│   │   ├── index.js
│   │   └── ...
│   │
│   ├── package.json
│   └── package-lock.json
│
├── .gitignore
└── README.md
```

## Frontend Routes

```text
/        Login, signup, and password reset page
/home    Main homepage with profile cards, search, and filters
```

## API Overview

The backend provides API endpoints for account and profile operations.

Example endpoint structure:

```text
POST    /api/auth/signup
POST    /api/auth/login
POST    /api/auth/reset-password

GET     /api/homepage

GET     /api/me/profile
PATCH   /api/me/profile
DELETE  /api/me

GET     /api/favorites
POST    /api/favorites
DELETE  /api/favorites

POST    /api/messages
```

The exact endpoint names may vary according to the current implementation.

## Example Signup Data

```json
{
  "username": "example_user",
  "password": "example_password",
  "name": "Example",
  "age": 25,
  "orientation": "ace",
  "looking_for": "friendship",
  "image_url": "https://example.com/profile-image.jpg",
  "city": "gush-dan",
  "gender": "non-binary",
  "info": "A short introduction about the user.",
  "contact": "Preferred contact information"
}
```

## Example Login Data

```json
{
  "username": "example_user",
  "password": "example_password"
}
```

## Database Structure

The project uses MongoDB Atlas.

The database may contain collections such as:

- `users`
- `profiles`
- `favorites`
- `messages`

### Users Collection

Stores private account and authentication information.

```json
{
  "_id": "MongoDB ObjectId",
  "username": "example_user",
  "password_hash": "hashed_password",
  "session_token": "generated_session_token",
  "created_at": "date"
}
```

### Profiles Collection

Stores information displayed publicly on the homepage.

```json
{
  "_id": "MongoDB ObjectId",
  "user_id": "MongoDB ObjectId",
  "username": "example_user",
  "name": "Example",
  "age": 25,
  "orientation": "ace",
  "looking_for": "friendship",
  "image_url": "https://example.com/profile-image.jpg",
  "city": "gush-dan",
  "gender": "non-binary",
  "info": "A short profile description",
  "contact": "Contact information",
  "created_at": "date",
  "updated_at": "date"
}
```

### Favorites Collection

Stores connections between a user and profiles they saved.

```json
{
  "_id": "MongoDB ObjectId",
  "user_id": "MongoDB ObjectId",
  "favorite_profile_id": "MongoDB ObjectId",
  "created_at": "date"
}
```

### Messages Collection

Stores limited private messages sent between users.

```json
{
  "_id": "MongoDB ObjectId",
  "sender_id": "MongoDB ObjectId",
  "receiver_id": "MongoDB ObjectId",
  "message": "A private introduction or contact request",
  "created_at": "date"
}
```

## Security

The project follows several basic security practices:

- Passwords are hashed before being stored.
- Plain-text passwords are not saved in the database.
- Database credentials are stored as environment variables.
- Secret keys are not committed to Git.
- Authentication tokens are required for protected operations.
- Users can edit or delete only their own profile.
- Private account data is separated from public profile data where applicable.

## Environment Variables

The deployed project requires environment variables similar to:

```text
MONGODB_URI
MONGODB_DB
DJANGO_SECRET_KEY
DJANGO_DEBUG
FRONTEND_URL
```

The frontend may also use:

```text
REACT_APP_API_BASE
```

Environment-variable files must not be committed to Git.

## `.gitignore`

```gitignore
# Environment variables
.env
backend/.env
frontend/.env

# Python
__pycache__/
*.pyc
*.pyo
*.pyd
.venv/
venv/

# Django
db.sqlite3
media/
staticfiles/

# React
node_modules/
frontend/build/

# Editors
.vscode/
.idea/

# Operating system files
.DS_Store
Thumbs.db
```

## Privacy and Safety

Because SPADES is a dating and social connection platform, users should avoid publishing sensitive personal information directly on their public profiles.

Users should not publicly share:

- Home addresses
- Identification numbers
- Financial information
- Passwords
- Highly sensitive personal information

The private-message feature is intended to allow users to establish contact more carefully before exchanging additional information.

## Possible Future Improvements

- User reporting
- User blocking
- Admin moderation dashboard
- Email verification
- Improved password recovery
- Message notifications
- Profile visibility controls
- Contact-information privacy settings
- Image moderation
- Pagination or infinite scrolling
- Improved mobile responsiveness
- Accessibility improvements
- Profile approval system
- Better spam prevention
- Terms of service
- Privacy policy
- Community guidelines

## Purpose

SPADES was created to provide a simple and accessible place where people on the asexual and aromantic spectrums can find:

- Friendship
- Romance
- Queerplatonic relationships
- Polyamorous relationships
- Other meaningful personal connections

The project focuses on making profile discovery straightforward while allowing users to search for people whose identity, preferences, location, and relationship goals may be compatible with their own.

## Author

Yana Zlatin
