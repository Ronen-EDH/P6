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

## Setup for Windows

1. Clone the repo
2. You'll need Node Package Manager for the next step so if you don't have it here is a link how to install it: https://docs.npmjs.com/downloading-and-installing-node-js-and-npm
3. Here you can use Node.js Command Prompt or (my preferred way) follow this guide to make your npm commands globally available: https://dev.to/supritha/npm-is-not-recognized-as-internal-or-external-command-solution-o1n
4. Using Node.js Command Prompt - or a normal Command Prompt/PowerShell if you did the second option -  navigate into the backend folder and from there run `npm install`
5. Do step 4 for the frontend folder as well
6. Create a .env file in the backend directory. Inside the file you need to create 3 variables: `MONGODB_User = "guest"`, `MONGODB_PW = "dNalkvnl5NokIiVe"` and
`JWT_SECRET_KEY = "y9rSfkZzMSON4wZd1oeM2d6FT07nQacQjg28eZcsdMlWIUCmqDxPFPFyjkGtDPN"`
7. Create an assets folder in the backend directory (../backend/assets/)
8. Same way as in step 4 run `npm run dev` in the backend directory
9. Do steps 8 in the frontend directory
10. Now all you need to do is open the http://localhost:4200/ address to access the web app
