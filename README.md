# Themepark Management System - Group 5
Group 5 project for a Themepark Management System

Welcome to Coog World! This project is a full-stack Theme Park Management System built for COSC3380. It includes features for customers (ticket booking, merchandise shopping, ride logging), as well as employee dashboards and reporting tools.


## Project Structure
├── away                  
├── client/react-app      # React frontend
├── server/               # Express.js backend
├── coog_world_dump.sql   # MySQL database dump
├── README.md             # Setup and instructions

## Installation Instructions

### 1. Import Database
Use MySQL Workbench or CLI:

```bash
mysql -u youruser -p < coog_world_dump.sql
```

## 2. Backedn Setup
cd server
npm install
node server.js


### 3. Frontend Setup
cd client/react-app
npm install
npm run dev
