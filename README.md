# FarmFlow

FarmFlow is a modern greenhouse management system that helps farmers monitor and manage their greenhouses efficiently.

## Features

- **Dashboard**: Get a quick overview of all your greenhouses and tasks
- **Greenhouse Management**: Add, view, and manage greenhouses
- **Task Management**: Create and track tasks for each greenhouse
- **Reports**: View detailed analytics and reports about your greenhouse operations
- **Settings**: Customize your experience with user preferences

## Tech Stack

### Frontend
- React
- TypeScript
- Modern CSS-in-JS styling

### Backend
- Django
- Django REST Framework
- SQLite (can be scaled to PostgreSQL)

## Getting Started

### Prerequisites
- Python 3.8 or higher
- Node.js 14 or higher
- npm or yarn

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd django_back_end
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv myvenv
   source myvenv/bin/activate  # On Windows: myvenv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run migrations:
   ```bash
   python manage.py migrate
   ```

5. Start the development server:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd farmflow
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## Project Structure

```
.
├── django_back_end/     # Django backend
│   ├── api_app/         # Main API application
│   └── django_back_end/ # Project settings
└── farmflow/           # React frontend
    ├── app/            # Application components
    ├── assets/         # Static assets
    └── public/         # Public files
```

## API Endpoints

- `/greenhouses/` - Greenhouse management
- `/tasks/` - Task management
- `/stats/` - Statistics and analytics
- `/api-token-auth/` - Authentication

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
