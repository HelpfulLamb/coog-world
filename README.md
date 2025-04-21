# Themepark Management System - Group 5
Group 5 project for a Themepark Management System

Welcome to Coog World! This project is a full-stack Theme Park Management System built for COSC3380. It includes features for customers (ticket booking, merchandise shopping, ride logging), as well as employee dashboards and reporting tools.

Brought to you by: 
1. Brennan Green (bcgreen03)
2. Bryant Truong (skppnsk3)
3. David Morillon (HelpfulLamb)
4. Elizabeth Chan (eliza365)
5. Erin Sebastian (erinsebast)

## Database Files
### Github Files and Folders:
#### README.md (File)
- The file you are currently on. This file gives an overview on the different files being used in the Github repository and OneDrive.
- This file also gives step-by-step instructions on how to install the repository in order to host locally.

#### server (Folder)
- This folder contains the backend of the web application. 
- To use the backend, you are required to create a ".env" file in the server folder and add the text from "env.txt" to the ".env" file.
- More installation instructions are located further below.

#### client/react-app (folder)
- This folder is located in the client folder and serves as the frontend of the web application. 
- When you proceed to installation instructions, make sure that you are located in the react-app folder, which is within the client folder.
- More installation instructions are located further below.

### OneDrive Files:
#### Dump20250420.sql
- The SQL dump of the populated database, made through MySQL.
- Use MySQL Workbench to import the SQL dump file.
  
#### env.txt
- Contains the environment variables necessary to run the backend and connect to the database server.
- Copy the text in this file and paste it into the .env file you will add to the server folder.
  
#### Team 5 Project Document.docx
- Contains the user logins for the various user roles.
- Contains the details of the database application, which includes:
  - types of data that can be added, modified, and edited
  - types of user roles in the web application
  - the semantic constraints which are implemented as triggers
  - types of queries/reports available in the web application

## Installation Instructions (This assumes you are using VSCode and you wish to run the program on a localhost)

### Before you begin:
- Make sure you have downloaded Node.js, git, and Visual Studio Code.
- Make a folder and open the git bash terminal in VSCode. Make sure you are in the folder you wish to clone the repository to.

1. Clone the GitHub repository, then go to the server folder:
   ```bash
   git clone https://github.com/HelpfulLamb/coog-world.git
   cd server
   ```
2. In the server folder, create a "**.env**" environment file and copy the text in the "**env.txt**" file on the OneDrive provided. Paste the text into the newly created "**.env**" file, and save the "**.env**" file.
- Once you finished the steps above, move on to the Backend Setup.

### Backend Setup (follow all instructions)
1. Open a new Command Prompt terminal in VSCode.
2. Move to the repository folder 'coog-world' by typing '**cd coog-world**' into the Command Prompt terminal, then press '**Enter**' on your keyboard.
   ```bash
   cd coog-world
   ```
3. Move to the server folder by typing '**cd server**' into the Command Prompt terminal, then press '**Enter**' on your keyboard.
   ```bash
   cd server
   ``` 
    - Your terminal should now show ```\coog-world\server>```.
4. Type in the terminal '**npm install**', then press '**Enter**' on your keyboard.
   ```bash
   npm install
   ```
    - The terminal may say ```found # vulnerabilities``` when it is done installing (that is fine).
5. Type in the terminal '**npx kill-port 3305**', then press '**Enter**' on your keyboard, so the port is free for usage for the backend.
   ```bash
   npx kill-port 3305
   ```
6. Type in the terminal '**npm run dev**', then press '**Enter**' on your keyboard.
   ```bash
   npm run dev
   ```
    - If the terminal shows ```MySQL Connected...```, then you have finished setting up the Backend.

DO NOT CLOSE THE TERMINAL ONCE YOU ARE DONE SETTING UP THE BACKEND. YOU NEED TO KEEP IT OPEN FOR THE FRONTEND.

DO NOT PROCEED TO FRONTEND SETUP UNLESS YOU HAVE FINISHED SETTING UP THE BACKEND
### Frontend Setup (Only do after Backend Setup is finished) (follow all instructions)
1. Open a new Command Prompt terminal in VSCode.
2. Move to the repository folder 'coog-world' by typing '**cd coog-world**' into the Command Prompt terminal, then press '**Enter**' on your keyboard.
   ```bash
   cd coog-world
   ```
3. Move to the react-app folder in the client folder by typing '**cd client\react-app**' into the Command Prompt terminal, then press '**Enter**' on your keyboard.
   ```bash
   cd client\react-app
   ```
    - Your terminal should now show: ```\coog-world\client\react-app>```
4. Type in the terminal '**npm install**', then press '**Enter**' on your keyboard.
   ```bash
   npm install
   ```
    - The terminal may say ```found # vulnerabilities``` when it is done installing (that is fine).
5. Type in the terminal '**npm run dev**', then press '**Enter**' on your keyboard.
   ```bash
   npm run dev
   ```
    - If the terminal gives a localhost link, then you have finished setting up the frontend.

#### To confirm you have finished setting up both the frontend and backend:      
- Click the localhost link in the terminal where it says:
  ```
  Local: http://localhost:PORT_NUMBER/
  ```
- Using the logins from the "**Team 5 Project Document.docx**", test the different user roles to confirm functionality.

## Project Structure
```
├── .github/
│   └── workflows/
│       └── ...  
├── client/
│   └── react-app/        # React frontend
|       ├── public/
|       └── src/          # React component source files
|           └── ...
├── server/              # Node JS Backend
|   ├── config/
|   |   └── ...
|   ├── controllers/
|   |   └── ...
|   ├── middleware/
|   |   └── ...
|   ├── models/
|   |   └── ...
|   ├── routes/
|   |   └── ...
|   └── ...
├── README.md             # Setup and instructions
```

## Technologies
- Frontend: React
- Backend: Node JS
- Database: MySQL
- Hosting and Deployment: Microsoft Azure
