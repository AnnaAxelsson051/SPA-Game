# SPA Game

---

## UI 



## Description

This is a Full stack game application built with ASP.NET Core API and React.js templates. Featuring user registration with password hash, login page with secure authentication, gameplay page, profile page with statistics over played games and victories as well as a highscore leaderboard. The game state is persisted and real-time notifications powered by SignalR have been implemented allowing users to pause and return to already started games and stay updated on their gaming progress.

### Technologies used

- ASP.Net core 
- C#
- REST API
- React 
- SignalR
- Entity Framework
- SQL database

---

## Project Architecture

### Backend

ASP.NET Core API is used to provide REST endpoints for frontend communication handeling user authentication, game logic and highscore management. SignalR allows for real-time communication with instant notifications and updates, such as highscore changes and game events. Entity Framework is used for database interactions.

### Database

The database design follows the EF Code-First approach enabling integration with the ASP.NET Core API backend. It provides an ORM framework for interacting with the database ensuring data integrity and consistency - storing user information, game data, and highscores.

Entities


- Users: Stores user credentials, including username, password hash, and email.
- Highscores: Contains historical and daily highscores for different games, linked to user IDs for tracking performance.
- Games: Records details of each game session, such as game ID, user ID, and game status.

### Frontend

React is used for the frontend to manage user interface and enables dynamic rendering of game elements and interactions fetching data via endpoints.

---

## Production Deployment

If this application was to be deployed for production a scalable and fault-tolerant approach would be good, it could be achieved using cloud infrastructure with either AWS, Azure, or Google Cloud Platform. The app components could be containerized using Docker for consistent deployment across environments and Kubernetes could be used for orchestrating containerized services and enabling automated scaling as well as load balancing. CI/CD pipelines could be implemented to automate testing, building and deploying application updates seamlessly.
