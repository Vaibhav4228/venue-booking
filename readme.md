# Mini Venue Booking Dashboard

## Overview

I built the Mini Venue Booking Dashboard as a full-stack application to enable venue owners to manage their venues and users to browse and book venues seamlessly. The system automatically updates venue availability upon booking, features a robust analytics dashboard with charts for admins, and includes user authentication for secure access. My goal was to create a modular, scalable, and user-friendly platform using Node.js/Express.js for the backend, MongoDB for the database, and React with Tailwind CSS for the frontend. I incorporated input validations, duplicate prevention, a health check endpoint, and deployed the application using Docker on Render, with images hosted on Docker Hub (`vaibhav990/venue-booking-backend:v1` and `vaibhav990/venue-booking-frontend:v1`). Below, I detail my approach, implementation, and deployment process.  
And for Ideation part I alredy have that type feature in my presious project so I used that to building the ideation feature and also added the .env file showing purpose how i do that.

## How I Built It
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/1b2de7a7-fd2e-4fb2-9e70-fc0a9c97586d" />
<img width="1909" height="878" alt="image" src="https://github.com/user-attachments/assets/96c6b1ce-f612-48d0-82d2-04e713f72464" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/ac8876aa-804d-4380-a84f-377b40f7ee44" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/b70f700c-a46f-4a8a-8842-059ff05dcb1f" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/24848273-5394-4508-8d27-886a079109f3" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/0cac9b4c-ea25-4680-b91a-7e00028f6b40" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/cd4cc843-f191-43d2-97e9-1bf3afb8d3ca" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/3cd2b51a-c3e1-4bf8-8ec1-fff5e0371bce" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/ed3fa5a0-79eb-4986-8664-e9b506316db0" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/1f7e2936-bce3-4d33-b821-2b5346abacb9" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/83942195-8762-4f60-98e8-e44c1ef93055" />










### Backend Development

I chose Node.js with Express.js for the backend due to its simplicity and robust ecosystem for building RESTful APIs. MongoDB was my database of choice because its schema flexibility suits the dynamic nature of venue and booking data. Here’s how I structured and built the backend:

- **Project Structure**:

  ```
  venue-booking-backend/
  ├── models/
  │   ├── Venue.js
  │   ├── Booking.js
  │   ├── User.js
  ├── routes/
  │   ├── venues.js
  │   ├── bookings.js
  │   ├── analytics.js
  │   ├── auth.js
  ├── middleware/
  │   ├── auth.js
  ├── server.js
  ├── package.json
  ├── Dockerfile
  ├── README.md
  ```

- **Models**:

  - **Venue**: Stores venue details like `name`, `description`, `location`, `capacity`, `pricePerDay`, `amenities`, `image`, `unavailableDates`, and `isActive`. I added a unique index on `name` to prevent duplicate venues, ensuring data integrity.
  - **Booking**: Captures booking details such as `venueId`, `venueName`, `customerName`, `email`, `phone`, `date`, `eventType`, `userId`, `totalAmount`, and `status`. A unique index on `venueId` and `date` prevents duplicate bookings for the same venue and date.
  - **User**: Stores user data (`email`, `password`, `role`, `name`) for authentication, with `role` distinguishing between `admin` and `user`.

- **Routes and APIs**:

  - **Venues**:
    - `GET /api/venues`: Fetch all active venues.
    - `POST /api/venues`: Add a new venue (admin-only).
    - `GET /api/venues/:id/blocked-dates`: Get blocked dates for a venue.
    - `PATCH /api/venues/:id/availability`: Update venue availability (admin-only).
    - `GET /api/venues/:id/bookings`: Get bookings for a specific venue (admin-only).
  - **Bookings**:
    - `GET /api/bookings`: Fetch all bookings (admin-only).
    - `GET /api/bookings/user/:userId`: Fetch user-specific bookings.
    - `POST /api/bookings`: Book a venue, automatically updating `unavailableDates`.
  - **Analytics** (admin-only):
    - `GET /api/analytics/dashboard`: Summary stats (total venues, bookings, revenue, growth).
    - `GET /api/analytics/revenue`: Monthly revenue data.
    - `GET /api/analytics/bookings`: Booking trends, event types, and status distribution.
    - `GET /api/analytics/venues`: Venue performance metrics.
    - `GET /api/analytics/customers`: Customer analytics (top customers, repeat rate).
  - **Auth**:
    - `POST /api/auth/register`: Register a user with email, password, and optional role.
    - `POST /api/auth/login`: Authenticate and return a JWT token.
  - **Health Check**:
    - `GET /api/health`: Checks server and MongoDB connection status, returning `{ "status": "ok", "database": "connected" }` or an error.

- **Validations**: I used `express-validator` to enforce input validation across all endpoints. For example, I validated email formats, positive numbers for `capacity` and `pricePerDay`, and date formats for bookings. This ensures robust error handling and user-friendly feedback.

- **Authentication**: I implemented JWT-based authentication using `jsonwebtoken` and `bcryptjs` for password hashing. Admin routes (`/venues`, `/analytics`, parts of `/bookings`) are protected with `authenticateToken` and `isAdmin` middleware, ensuring only authorized users access sensitive features.

- **Duplicate Prevention**: I added unique indexes in MongoDB (`Venue.name`, `Booking(venueId, date)`) to prevent duplicates. If a duplicate is attempted, the backend returns a clear error (e.g., "Venue name already exists").

- **Health Check**: I included a `/api/health` endpoint to monitor server and database connectivity, crucial for production deployments. It pings MongoDB and returns the connection status, making it easy to integrate with monitoring tools like Render.

- **Approach**: My focus was on modularity and scalability. I separated concerns (models, routes, middleware) to keep the codebase maintainable. MongoDB aggregations in the analytics routes optimize performance by reducing database load. I used environment variables (`MONGODB_URI`, `JWT_SECRET`) for configuration flexibility.

### Frontend Development

I built the frontend using React for its component-based architecture and Tailwind CSS for consistent, responsive styling. The frontend integrates with the backend via a `venueApi` service layer, ensuring secure and efficient communication.

- **Project Structure**:

  ```
  client/
  ├── src/
  │   ├── components/
  │   │   ├── AddVenueModal.js
  │   │   ├── BookingModal.js
  │   │   ├── VenueCard.js
  │   │   ├── VenueManagementModal.js
  │   │   ├── Login.js
  │   ├── pages/
  │   │   ├── AdminDashboard.js
  │   │   ├── UserDashboard.js
  │   │   ├── MyBookings.js
  │   │   ├── AnalyticsDashboard.js
  │   ├── services/
  │   │   ├── venueApi.js
  │   ├── App.js
  │   ├── App.css
  │   ├── index.js
  ├── public/
  │   ├── index.html
  ├── package.json
  ├── Dockerfile
  ```

- **Components**:

  - **Admin Interface**:
    - `AdminDashboard`: Allows admins to view, add, and manage venues.
    - `AddVenueModal`: Form for adding new venues.
    - `VenueManagementModal`: Interface for blocking/unblocking dates.
    - `AnalyticsDashboard`: Displays analytics with charts (total venues, bookings, revenue, event types, status distribution, top venues).
  - **User Interface**:
    - `UserDashboard`: Displays venues with a search bar for filtering by name or location (client-side).
    - `VenueCard`: Shows venue details and a booking button.
    - `BookingModal`: Form for booking a venue.
    - `MyBookings`: Lists user-specific bookings.
  - **Login**: A component for user authentication, storing JWT tokens in `localStorage`.

- **Routing**: I used `react-router-dom` to define routes: `/login`, `/admin`, `/admin/analytics`, `/my-bookings`, and `/` (user dashboard).

- **API Integration**: The `venueApi.js` service uses Axios with an interceptor to attach JWT tokens to requests, ensuring secure communication with the backend.

- **Styling**: I used Tailwind CSS for a modern, responsive design, aligning with the aesthetic of the provided `UserDashboard.js` (e.g., gradient backgrounds, rounded cards, and smooth transitions).

- **Approach**: My goal was to create a user-friendly interface with reusable components. I prioritized responsive design and smooth interactions (e.g., loading spinners, error messages). The analytics dashboard uses Chart.js for bar, pie, and doughnut charts, providing visual insights into key metrics.

### Approach to Search Feature

The search functionality is implemented client-side in `UserDashboard.js`, as per your provided code. Here’s how I approached it:

- **Implementation**: In `UserDashboard.js`, I used the `searchTerm` state to filter the `venues` array based on `name` and `location` using `venues.filter(venue => venue.name.toLowerCase().includes(searchTerm.toLowerCase()) || venue.location.toLowerCase().includes(searchTerm.toLowerCase()))`. This provides instant feedback as users type, leveraging React’s state management for a smooth experience.
- **Why Frontend-Only**: Client-side filtering is suitable for small datasets and provides immediate results without additional API calls, reducing server load. The provided code uses a case-insensitive search, which is user-friendly for partial matches.
- **Trade-offs**: For large datasets, client-side filtering could impact performance (e.g., slow rendering for thousands of venues). I considered moving search to the backend but adhered to your frontend-only requirement.
- **Future Enhancements**: To scale search, I’d add a backend endpoint (`GET /api/venues?search=term&location=city`) with MongoDB’s `$regex` for efficient querying. I’d also log search queries to a `SearchLog` collection to analyze user behavior and improve recommendations (e.g., suggesting popular venues based on search trends).

### Approach to Analytics Feature

The analytics dashboard was a key focus, designed to provide actionable insights for admins, inspired by platforms like Eventbrite and Regiondo. Here’s my approach:

- **Frontend Implementation** (`AnalyticsDashboard.js`):
  - **Summary Cards**: Display total venues, bookings, current month revenue, and average booking value, styled with Tailwind CSS and Lucide icons.
  - **Charts**: Use Chart.js for:
    - Bar charts for monthly revenue and bookings (6 months or 1 year, toggleable via a dropdown).
    - Pie chart for event type distribution.
    - Doughnut chart for booking status distribution.
  - **Table**: Lists top 5 venues by revenue, showing name, location, bookings, and revenue.
  - **Responsive Design**: The grid layout adjusts for mobile and desktop views, ensuring usability across devices.
- **Backend Implementation** (`routes/analytics.js`):
  - **Endpoints**:
    - `/dashboard`: Computes total venues, bookings, revenue, growth metrics, and average booking value using MongoDB aggregations.
    - `/revenue`: Groups bookings by month for revenue trends.
    - `/bookings`: Provides monthly bookings, event types, and status distribution.
    - `/venues`: Calculates venue performance (bookings, revenue, occupancy).
    - `/customers`: Analyzes top customers, repeat rate, and unique customers.
  - **Efficiency**: I used MongoDB’s `$group`, `$sort`, and `$limit` to optimize data processing. The `date-fns` library ensures consistent date handling.
  - **Security**: All analytics routes are protected with JWT authentication and admin-only middleware.
- **Approach**: My goal was to provide clear, visual insights with minimal latency. I chose Chart.js for its lightweight integration with React and support for responsive charts. The backend aggregations reduce database load by processing data server-side. I ensured the dashboard is extensible for future metrics (e.g., predictive analytics).
- **Future Enhancements**: I’d add caching with Redis for frequently accessed analytics, predictive models for booking trends, and export options (CSV/PDF) for reporting.

### Meeting Core Requirements

- **Venue Management**: Admins can add venues (`POST /api/venues`), update availability (`PATCH /api/venues/:id/availability`), and view bookings (`GET /api/venues/:id/bookings`) via `AdminDashboard` and modals.
- **User Booking**: Users browse venues on `UserDashboard`, book via `BookingModal`, and view bookings on `MyBookings`. Bookings automatically update `unavailableDates` in the `Venue` model.
- **Validations**: I used `express-validator` for input validation (e.g., email format, positive numbers, valid dates) across all endpoints, ensuring robust error handling.
- **Authentication**: JWT-based authentication secures admin routes and user-specific bookings, with tokens stored in `localStorage` after login.
- **Duplicate Prevention**: Unique indexes on `Venue.name` and `Booking(venueId, date)` prevent duplicates, with clear error messages.
- **Health Check**: The `/api/health` endpoint monitors server and MongoDB status, critical for production deployments.

### Deployment with Docker and Render

I containerized both the backend and frontend using Docker and pushed the images to Docker Hub (`vaibhav990/venue-booking-backend:v1` and `vaibhav990/venue-booking-frontend:v1`) for easy deployment on Render, a platform that supports Docker and managed MongoDB.

#### Backend Dockerfile

```dockerfile
FROM node:16
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

#### Frontend Dockerfile

```dockerfile
FROM node:16
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npx", "serve", "-s", "build", "-l", "3000"]
```

#### Pushing to Docker Hub

I built and pushed the Docker images as follows:

```bash
# Backend
docker build -t vaibhav990/venue-booking-backend:v1 .
docker push vaibhav990/venue-booking-backend:v1

# Frontend
docker build -t vaibhav990/venue-booking-frontend:v1 .
docker push vaibhav990/venue-booking-frontend:v1
```

#### Deployment Steps on Render

1. **MongoDB Atlas Setup**:

   - Create a free cluster on MongoDB Atlas.
   - Set up a database user and allow network access (0.0.0.0/0 for simplicity, or restrict to Render’s IP range).
   - Obtain the connection string (e.g., `mongodb+srv://<user>:<pass>@cluster0.mongodb.net/venue-booking`).

2. **Backend Deployment**:

   - Create a new Web Service on Render.
   - Select "Docker" as the environment.
   - Configure the service:
     - Docker Image: `vaibhav990/venue-booking-backend:v1`.
     - Environment Variables:
       - `MONGODB_URI`: Your MongoDB Atlas connection string.
       - `JWT_SECRET`: A secure key (e.g., generate using `openssl rand -base64 32`).
     - Port: `5000`.
     - Health Check Path: `/api/health`.
   - Deploy the service. Note the deployed URL (e.g., `https://venue-backend.onrender.com`).

3. **Frontend Deployment**:

   - Create another Web Service on Render.
   - Select "Docker" as the environment.
   - Configure the service:
     - Docker Image: `vaibhav990/venue-booking-frontend:v1`.
     - Environment Variables:
       - `REACT_APP_API_URL`: The backend URL (e.g., `https://venue-backend.onrender.com/api`).
     - Port: `3000`.
   - Deploy the service. Note the frontend URL (e.g., `https://venue-frontend.onrender.com`).

4. **Testing**:

   - Verify the backend health check: `GET https://venue-backend.onrender.com/api/health` (should return `{ "status": "ok", "database": "connected" }`).
   - Access the frontend at `https://venue-frontend.onrender.com`.
   - Register an admin user (`POST /api/auth/register` with `{ "email": "admin@example.com", "password": "admin123", "role": "admin", "name": "Admin" }`).
   - Log in at `/login`, then test admin features (`/admin`, `/admin/analytics`) and user features (`/`, `/my-bookings`).

### Setup Instructions (Local)

1. **Backend**:

   - Install MongoDB locally or use MongoDB Atlas.
   - Clone the backend repository or use the Docker image:

     ```bash
     docker run -p 5000:5000 -e MONGODB_URI=mongodb://localhost/venue-booking -e JWT_SECRET=your-secret-key vaibhav990/venue-booking-backend:v1
     ```
   - Alternatively, navigate to `venue-booking-backend/`, run `npm install`, then `npm start`.
   - Register an admin: `POST http://localhost:5000/api/auth/register` with `{ "email": "admin@example.com", "password": "admin123", "role": "admin", "name": "Admin" }`.

2. **Frontend**:

   - Clone the frontend repository or use the Docker image:

     ```bash
     docker run -p 3000:3000 -e REACT_APP_API_URL=http://localhost:5000/api vaibhav990/venue-booking-frontend:v1
     ```
   - Alternatively, navigate to `client/`, run `npm install`, then `npm start`.
   - Access at `http://localhost:3000`.

3. **Testing**:

   - Log in at `/login`.
   - Test admin features: Add venues, manage availability, view analytics (`/admin/analytics`).
   - Test user features: Search venues (client-side), book venues, view bookings (`/my-bookings`).
   - Verify no duplicate venues/bookings are created (handled by MongoDB indexes).

### Advanced Features (Ideation)

- **Capturing User Search Activity**:
  - Store search queries in a `SearchLog` collection with fields like `userId`, `searchTerm`, `timestamp`, and `filters`.
  - Analyze popular search terms and locations to suggest trending venues.
  - Implement personalized recommendations based on user search history.
- **Admin Analytics Dashboard**:
  - Add predictive analytics for booking trends using time-series models (e.g., ARIMA).
  - Include geographic heatmaps to visualize venue popularity by location.
  - Enable data export to CSV/PDF for reporting.
- **Calendar View for Venue Availability**:
  - Build a full-month calendar in `VenueManagementModal` with color-coded dates (available, booked, blocked).
  - Support bulk date management (block/unblock multiple days).
  - Use WebSockets for real-time availability updates.
- **Authentication Enhancements**:
  1. Add OAuth2 for social logins (Google, Facebook).
  2. Implement password reset via email and two-factor authentication for security.

### Possible Improvements for Eazyvenue (www.eazyvenue.com)
Better Search: Eazyvenue’s search seems basic. I’d add advanced filters (e.g., capacity, price range) and client-side filtering like mine, with a backend option for large datasets using MongoDB $regex for speed.
User Experience: Eazyvenue’s UI looks dated. I’d modernize it with Tailwind CSS, responsive design, and smooth loading spinners like my solution.
Availability Updates: Ensure bookings instantly block dates, as my system does with unavailableDates.
Mobile Support: Enhance mobile usability with a mobile menu (like my UserDashboard’s toggle) and touch-friendly buttons.
Better Error Handling in Login and Signup:
Login: Currently, Eazyvenue might not handle errors well (e.g., wrong password, invalid email). I’d improve this by showing specific error messages like “Invalid email or password” or “Account not found” with a try-catch block and user feedback, as in my Login.js:
Deployment Scalability: Use Docker and Render (like I did) for easy scaling and health monitoring with a /api/health endpoint.


- **Search Performance**: Client-side search works well for small datasets but may slow down with thousands of venues. I’d add a backend search endpoint with MongoDB indexes (`$regex` on `name` and `location`) for scalability.
- **Analytics Efficiency**: MongoDB aggregations minimize database load, but for high-traffic scenarios, I’d cache results with Redis.
- **Authentication Security**: JWT is stateless and secure, but I’d add refresh tokens for longer sessions in production.
- **Deployment**: Render’s Docker support simplified deployment, and the health check endpoint ensures reliability. I’d add monitoring tools (e.g., New Relic) for production.
