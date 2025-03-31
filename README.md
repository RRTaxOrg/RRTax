# RRTax
This is the RRtax Website Project for EECS2311Z

**ITR0**
Link to Youtube video of exploratory meeting with the client: https://youtu.be/inh3fe45IU8
Link to Google Docs document for Iteration 0: https://docs.google.com/document/d/14BtTduTpBqOeJh-ErC-dOKVAOxjb6ydDlebsMnDQPdk/edit?usp=sharing

**Tech Stack**
- Next.js - Frontend
- Node.js - Backend
- SQLite - Database
  
## How to Run the Project

- In the root directory do ./start_script.sh to run then the website should open on
- http://localhost:3000 if it doent click on this

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)


RRTax is a web application designed to provide tax accounting and financial services. The application allows users to sign up, log in, and access various services related to tax and accounting. The backend is built with Node.js and Express, while the frontend is built with Next.js and React.

## File Overview 
Backend:
backend/
├── authentication/
│   ├── auth.js
├── databases/
│   ├── main.db
├── sql.js
├── server.js
├── package.json
└── package-lock.json

authentication/: Contains authentication-related logic.
databases/: Contains the database files.
sql.js: Contains SQL-related functions.
server.js: The main server file.
package.json: Contains the backend dependencies and scripts.
package-lock.json: Contains the exact versions of installed dependencies.

Frontend:
frontend/
├── app/
│   ├── log_in/
│   │   ├── page.js
│   ├── logged_in/
│   │   ├── page.js
│   ├── page.js
│   ├── layout.js
│   ├── globals.css
├── public/
│   ├── Logo_Improved_bg_removed.png
│   ├── Building1.jpg
│   ├── Building2.jpg
│   ├── Building3.jpg
├── package.json
└── package-lock.json

app/: Contains the main application files.
log_in/: Contains the login page.
logged_in/: Contains the logged-in page.
page.js: The main page file.
layout.js: The layout file.
globals.css: Global CSS styles.
public/: Contains public assets like images.
package.json: Contains the frontend dependencies and scripts.
package-lock.json: Contains the exact versions of installed dependencies.
