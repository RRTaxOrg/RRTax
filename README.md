## Documentation and References

- [Project Demo Video](https://youtu.be/inh3fe45IU8) - Exploratory meeting with the client
- [Release Video](https://youtu.be/8rPo2IGFsuo) - Final review meeting with the client
- [Detailed Project Documentation](https://docs.google.com/document/d/14BtTduTpBqOeJh-ErC-dOKVAOxjb6ydDlebsMnDQPdk/edit?usp=sharing) - Iteration 0 documentation
- [Project Iterations](https://docs.google.com/document/d/1-yC-5RIfJptZdpvjzImHeZZbosF5RxowrzwsWx9dgu4/edit?usp=sharing) - see discription of each iteration
- [Project User Stories](https://docs.google.com/document/d/1GtyKXkfuMz4ZqbVuffaSMqHt0vcx7LMGZqhZoOHn-G4/edit?tab=t.0) - Description of user stories and roles developing them
- [GitHub Repository](https://github.com/RRTaxOrg/RRTax) - Source code repository
- [Log File](LogFile.txt) - Log file 
- [Architecture Diagram](architecture_diagram.jpg) - Project Architecture Diagram
- [UML Class Diagram](UMLClassDiagram.png) - UML Diagram
- [Start Script](start_script.sh) - Project Starting Script




# RRTax - Tax Accounting and Financial Services

This is the RRTax Website Project developed for EECS2311Z. RRTax is a web application to provide tax accounting and financial services for the RRTax Company. The application allows users to sign up, log in, access various tax and accounting services, and manage their financial documents and make appointments with the company. The admin of the website also has its own accses to all the users and there data.

## Features

- **User Authentication**
  - Secure account creation and login
  - Password encryption and token-based authentication (salt + hash)
  - Admin and regular user account types

- **Document Management**
  - Upload and categorize tax documents (T4/T4A, Education, Other)
  - View and download uploaded files
  - Secure document storage

- **Client Resources**
  - Access to CRA resources
  - List of services
  - Contact services
  - Much More

- **Appointment Booking**
  - Instant appointment booking, resheduling and deletion with an account
  - appointment booking for non users with a embedded google calender  

- **GUI**
  - Minimal UI
  - Modern UI with animations

## Tech Stack

- **Frontend**: Next.js (v15), React (v19), TailwindCSS
- **Backend**: Node.js, Express.js
- **Database**: SQLite
- **Authentication**: JWT-based token system
- **Styling**: CSS, TailwindCSS

## Installation and Setup

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Running the Application

### Using the Start Script

The easiest way to run the application is using the provided start script:

```
./start_script.sh
```

This will:
1. Start the backend server
2. Launch the frontend application
3. Open http://localhost:3000 in your default browser

### Manual Startup

Alternatively, you can start the application manually:

1. Start the backend server:
   ```
   cd backend
   npm start
   ```

2. In a separate terminal, start the frontend:
   ```
   cd frontend
   npm run dev
   ```

3. Access the application at http://localhost:3000

## Project Structure

### Backend:
```
backend/
├── authentication/
│   ├── auth.js
├── databases/
│   ├── main.db
├── sql.js
├── server.js
├── package.json
└── package-lock.json
```

- **authentication/**: Contains authentication-related logic.
- **databases/**: Contains the database files.
- **sql.js**: Contains SQL-related functions.
- **server.js**: The main server file.
- **package.json**: Contains the backend dependencies and scripts.
- **package-lock.json**: Contains the exact versions of installed dependencies.

### Frontend:
```
frontend/
├── app/
│   ├── log_in/
│   │   ├── page.js
│   ├── logged_in/
│   │   ├── page.js
│   ├── page.js
│   ├── layout.js
│   ├── globals.css
│   ├── pages ....
├── public/
│   ├── Logo_Improved_bg_removed.png
│   ├── Building1.jpg
│   ├── Building2.jpg
│   ├── Building3.jpg
├── package.json
└── package-lock.json
```

- **app/**: Contains the main application files.
- **log_in/**: Contains the login page.
- **logged_in/**: Contains the logged-in page.
- **page.js**: The main page file.
- **layout.js**: The layout file.
- **globals.css**: Global CSS styles.
- **public/**: Contains public assets like images.
- **package.json**: Contains the frontend dependencies and scripts.
- **package-lock.json**: Contains the exact versions of installed dependencies.
- **pages**: contains the smaller pages like resources, services, contact etc

## Contributors

- Haider Malik 
- Sebastian Quiros 
- Diego Romero 
- Loveneek Singh 
