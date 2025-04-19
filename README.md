# Themepark Management System - Group 5
Group 5 project for a Themepark Management System

Welcome to Coog World! This project is a full-stack Theme Park Management System built for COSC3380. It includes features for customers (ticket booking, merchandise shopping, ride logging), as well as employee dashboards and reporting tools.


## Project Structure
├── away                  
├── client/react-app      # React frontend
├── server/               # Express.js backend
├── coog_world_dump.sql   # MySQL database dump
├── README.md             # Setup and instructions



## Features

### Visitor (Customer) Features
- Create and manage profile
- Purchase tickets (with visit date)
- Add merchandise to cart and checkout
- View ticket history (upcoming and past)
- View merchandise purchase history
- Track ride activity ("I Rode This" feature)

### Employee Features
- Admin Dashboard with CRUD for:
  - Tickets
  - Employees
  - Rides
  - Shows
  - Kiosks
  - Inventory
  - Weather and Maintenance
- Generate reports for:
  - Ticket sales (daily/weekly/monthly/yearly)
  - Ride usage by month
  - Customer visit trends
  - Rainouts and Maintenance logs


## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Auth**: Custom login system (no JWT)
- **Deployment**: (e.g. Render / Localhost)


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


## Sample User Accounts

## 1. Visitor
Email - visitor1@gmail.com
Password - password123

### 2. Employee
Email - admin@coogworld.com
Pssword - adminpassword123