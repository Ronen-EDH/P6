# Hot Sauce Review Web Application

This is an OpenClassrooms student repo for project 6 by EDH.

## Project Description

### Scenario:  

Piiquante a specialty maker of spicy, pepper-based condiments company wants to develop a hot sauce review web application called "Hot Takes".
My task for this project was to build a RESTful API complementing the already developed front-end for the web app.

### The main server-side requirements:
- Store data like login credentials securely using NoSQL
- Email addresses for users in the database must be unique
- Token-based user authentication
- Implement a schema-less data model
- Enable users to interact with a database using CRUD operations:
  - Users be able to interact with other user's sauces
  - Users be able to upload sauces with Image Files
  - Users be able to like or dislike another user's sauces
  - Users be able to modify or delete their own sauces
- Any errors must be returned as they are thrown
- All Sauce routes must have authorization
- Security of the NoSQL database must not impede the application from launching on a user’s machine
- The most recent software versions are used with updated security patches
- The content of the images folder must not be uploaded to GitHub


## Technologies Used 

NodeJS for runtime with ExpressJS. MongoDB with Mongoose for database while storing data securely using Bcrypt. 
JSON Web Token for user authentication and securing the sauce routes. Multer for file upload. Environment variables to practice uploading code securely.

## Setup

1. Clone the repo
2. Open 2 terminals (Linux/Mac) or command prompts/PowerShell's (Windows) 
3. Run npm install from both the backend and frontend folders
5. Create a .env file in the backend directory. Inside the file you need to create 3 variables: MONGODB_User = "guest", MONGODB_PW = "dNalkvnl5NokIiVe" and
JWT_SECRET_KEY = "y9rSfkZzMSON4wZd1oeM2d6FT07nQacQjg28eZcsdMlWIUCmqDxPFPFyjkGtDPN"
6. Create an assets folder in the backend directory (../backend/assets/)
7. Run "npm run watch" in the backend directory.
8. Run "npm run start" in the frontend directory.
9. Now all you need to do is CTRL + Left click on the live server that's just popped up (http://localhost:4200/) to access the web app
