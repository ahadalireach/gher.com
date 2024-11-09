# Gher.com

**Gher.com** is a full-stack web application designed for buying, selling, and finding properties. Users can create and manage property listings, with advanced filtering options.

## Technologies Used

- **Frontend:** React JS, Tailwind CSS, React Redux
- **Backend:** Node JS, Express JS
- **Database:** MongoDB
- **Authentication & Storage:** Firebase
- **Security:** JWT (JSON Web Token)

## Features

- **Property Listings**: Users can post new properties, including details like room type, price, and location.
- **CRUD Operations**: Full create, read, update, and delete functionality for user profiles and property listings.
- **Advanced Filtering**: Filter properties by room types, such as studios, apartments, and villas.
- **User Authentication**: Secure authentication and authorization using Firebase and JWT.
- **Admin Dashboard**: Restricted admin access for managing user accounts and property listings.
- **Image Handling**: Efficient property image upload and management through Firebase.

## Getting Started

### Prerequisites

- Node.js and npm installed
- VS Code or any other code editor
- Git (optional, for cloning the repository)

### Setup Instructions

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/gher.com.git
   ```

   `Unzip the File`

2. **Open with VS Code**

   Open the project directory with VS Code or your preferred code editor.

3. **Install Dependencies**

   **Frontend:**

   - Navigate to the frontend directory:

     ```bash
     cd frontend
     ```

   - Create a `.env` file in the backend directory and add the following environment variables:

     ```env
     VITE_API_KEY=your_firebase_api_key
     VITE_AUTH_DOMAIN=your_firebase_auth_domain
     VITE_PROJECT_ID=your_firebase_project_id
     VITE_STORAGE_BUCKET=your_firebase_storage_bucket
     VITE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
     VITE_APP_ID=your_firebase_app_id
     ```

   - Install the dependencies:

     ```bash
     npm install
     ```

   - Run the development server:

     ```bash
     npm run dev
     ```

   **Backend:**

   - Navigate to the backend directory:

     ```bash
     cd backend
     ```

   - Create a `.env` file in the backend directory and add the following environment variables:

     ```env
     PORT=5000
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret_key
     ```

   - Install the dependencies:

     ```bash
     npm install
     ```

   - Start the server:

     ```bash
     npm run dev
     ```

4. **Update API URLs**

   Ensure that the API URLs in the frontend code are correctly set to point to your local backend server.

5. **Access the Application**

   Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to view the application.

**Live Demo**

- Live Web: [ghercom.vercel.app](https://gher-com.vercel.app)
- GitHub Repo: Give it a Star!
- Live Video Demo: Coming Soon

**Contact**

For any questions or feedback, please reach out to me at [ahadali.reach@gmail.com](ahadali.reach@gmail.com).
