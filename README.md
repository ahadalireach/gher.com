# Gher.com

**Gher.com** is a full-stack web application designed for buying, selling, and finding properties. Users can create and manage property listings, with advanced filtering options.

## Technologies Used

- **Frontend:** React JS, Tailwind CSS, React Redux
- **Backend:** Node JS, Express JS
- **Database:** MongoDB
- **Authentication & Storage:** Firebase
- **Security:** JWT (JSON Web Token)
- **Email Service**: EmailJS
- **Hosting**: Vercel

## Features

- **Property Listings**: Users can add properties with details such as room type, price, and location.
- **CRUD Operations**: Complete create, read, update, and delete functionality for user profiles and property listings.
- **Advanced Filtering**: Filter properties by room type (house, flat, farmhouse), purpose (rent, sell), offers, furnishing status, parking availability, and more.
- **User Authentication**: Secure login and authorization using Firebase and JWT.
- **Admin Dashboard**: Restricted access for admins to manage user accounts and property listings.
- **Image Handling**: Seamless property image uploads and management via Firebase.
- **Restricted Routes**: Secured routes for both users and admins.
- **Contact Form**: Integrated with EmailJS for efficient communication.

## Getting Started

### Prerequisites

- Node.js and npm installed
- VS Code or any other code editor
- Git (optional, for cloning the repository)

### File Structures

```plaintext
client/
├── public/
│   └── logo.svg                       # Logo file
├── src/
│   ├── assets/                        # Images and other assets
│   ├── redux/                         # State management
│   ├── pages/                         # Page components
│   ├── components/                    # Reusable UI components
│   ├── App.jsx                        # React Router setup
│   └── main.jsx                       # Application entry point
├── .env                               # Environment variables
└── index.html                         # Root HTML file
```

```plaintext
api/
├── controllers/                       # Core logic
├── db/                                # Database connection
├── models/                            # Data schemas
├── routes/                            # API routes
├── utils/                             # Helper functions
├── .env                               # Environment variables
└── index.js                           # Main server file
```

### Setup Instructions

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/gher.com.git
   ```

   `Unzip the File`

2. **Open with VS Code**

   Open the project directory with VS Code or your preferred code editor.

3. **Install Dependencies**

````

**Frontend:**

- Navigate to the frontend directory:

  ```bash
  cd frontend
````

- Create a `.env` file in the backend directory and add the following environment variables:

  ```env
  VITE_API_KEY=your_firebase_api_key
  VITE_AUTH_DOMAIN=your_firebase_auth_domain
  VITE_PROJECT_ID=your_firebase_project_id
  VITE_STORAGE_BUCKET=your_firebase_storage_bucket
  VITE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
  VITE_APP_ID=your_firebase_app_id
  VITE_BACKEND_URL = your_backend_url (http://localhost:4000)
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
  PORT=4000
  MONGO_URI=your_mongodb_connection_string
  JWT_SECRET=your_jwt_secret_key
  NODE_ENV = development
  ```

- Install the dependencies:

  ```bash
  npm install
  ```

- Start the server:

  ```bash
  npm run dev
  ```

## 4. **Update API URLs**

Ensure that the API URLs in your frontend code are correctly pointing to your local backend server. Update the `VITE_BACKEND_URL` in the `.env` file (as mentioned in the previous step).

## 5. **Access the Application**

After everything is set up:

- Open your browser and navigate to [http://localhost:5173](http://localhost:5173) to view the application.
- Ensure the frontend loads correctly and communicates with the backend server.

## 6. **Deployment**

- Deploy the frontend to Vercel and the backend to your preferred hosting service.
- Ensure the environment variables are properly set in the respective hosting platforms.

## Live Links

- **Live Web:** [gher.vercel.app](https://gher.vercel.app)
- **GitHub Repo:** [github.com/ahadalireach/gher.com](https://github.com/ahadalireach/gher.com) (Give it a Star!)
- Live Video Demo: Coming Soon

## Contact

For any questions, feedback, or collaboration opportunities, feel free to contact me at [ahadali.reach@gmail.com](mailto:ahadali.reach@gmail.com).
