Features
• User Authentication: Register, login, logout functionality with JWT
• Patient Management: CRUD operations for patient records
• File Uploads: Support for patient profile images
• Search Functionality: Find patients by various criteria
• Error Handling: Comprehensive error management
• Security: CORS configuration, protected routes

Prerequisites
• Node.js
• MongoDB instance (local or Atlas)
• npm or yarn package manager

Installation1. Clone the repository:
bash
git clone <repository-url>
cd patient-data-management-system-backend
2. Install dependencies:
bash
npm install

Configuration
1. Create a .env file in the root directory with the following variables:
PORT=5000
MONGO_URI=mongodb://localhost:27017/patient-management
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
Replace the values with your specific configuration.
Running the Server
Start the development server with:
bash
npm start
The server will run on http://localhost:5000 by default (or the PORT specified in your .env file).

API Documentation
Authentication
Register User• URL: /api/auth/register
• Method: POST
• Request Body:
json
{
"name": "John Doe",
"email": "john.doe@example.com",
"password": "password123"
}
• Response: Returns user data and authentication token
Login User
• URL: /api/auth/login
• Method: POST
• Request Body:
json
{
"email": "john.doe@example.com",
"password": "password123"
}
• Response: Returns user data and authentication token in cookie
Logout User
• URL: /api/auth/logout
• Method: POST
• Response: Success message and clears authentication cookie
Get Current User
• URL: /api/auth/me
• Method: GET
• Headers: Requires authentication token
• Response: Returns current user data
Patients
Get All Patients• URL: /api/patients
• Method: GET
• Headers: Requires authentication token
• Response: Returns list of all patients
Get Patient by ID
• URL: /api/patients/:id
• Method: GET
• Headers: Requires authentication token
• Response: Returns single patient data
Create Patient
• URL: /api/patients
• Method: POST
• Headers: Requires authentication token
• Content-Type: multipart/form-data
• Request Body:
firstName: "John"
lastName: "Doe"
dateOfBirth: "1990-01-01"
gender: "Male"
contactNumber: "1234567890"
email: "patient@example.com"
address: "123 Main St, City"
medicalHistory: "No prior conditions"
currentMedications: "None"
allergies: "None"
emergencyContact: "Jane Doe, 0987654321"
insuranceDetails: "Insurance #12345"
profileImage: [file upload]
• Response: Returns created patient data
Update Patient• URL: /api/patients/:id
• Method: PUT
• Headers: Requires authentication token
• Content-Type: multipart/form-data
• Request Body: Same fields as Create Patient (all fields optional)
• Response: Returns updated patient data
Delete Patient
• URL: /api/patients/:id
• Method: DELETE
• Headers: Requires authentication token
• Response: Success message
Search Patients
• URL: /api/patients/search
• Method: GET
• Headers: Requires authentication token
• Query Parameters:
• name : Search by first or last name
• email : Search by email
• contactNumber : Search by contact number
• Response: Returns matching patients#   P a t i e n t - D a t a - M a n a g e m e n t - S y s t e m - B a c k e n d  
 