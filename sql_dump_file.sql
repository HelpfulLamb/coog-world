CREATE DATABASE  IF NOT EXISTS `coog_world` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `coog_world`;
-- MySQL dump 10.13  Distrib 8.0.41, for macos15 (arm64)
--
-- Host: localhost    Database: coog_world
-- ------------------------------------------------------
-- Server version	9.2.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `BOOTHS`
--

DROP TABLE IF EXISTS `BOOTHS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `BOOTHS` (
  `Booth_ID` varchar(15) NOT NULL,
  `Booth_name` varchar(30) NOT NULL,
  `Booth_loc` smallint NOT NULL,
  `Booth_start` time NOT NULL,
  `Booth_end` time NOT NULL,
  `Booth_cost` decimal(6,2) DEFAULT NULL,
  `Booth_rev` int DEFAULT NULL,
  `Staff_num` int unsigned DEFAULT NULL,
  `Is_operate` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`Booth_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `BOOTHS`
--

LOCK TABLES `BOOTHS` WRITE;
/*!40000 ALTER TABLE `BOOTHS` DISABLE KEYS */;
/*!40000 ALTER TABLE `BOOTHS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `EMPLOYEES`
--

DROP TABLE IF EXISTS `EMPLOYEES`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `EMPLOYEES` (
  `Emp_ID` varchar(15) NOT NULL,
  `First_name` varchar(50) NOT NULL,
  `Last_name` varchar(50) NOT NULL,
  `Emp_sec` smallint NOT NULL,
  `Emp_pos` varchar(40) NOT NULL,
  `Emp_loc` smallint NOT NULL,
  `Emp_salary` decimal(6,2) DEFAULT NULL,
  `Start_date` date NOT NULL,
  `End_date` date DEFAULT NULL,
  `Emp_in` time NOT NULL,
  `Emp_out` time NOT NULL,
  `Emp_hours` int unsigned DEFAULT NULL,
  `Emp_phone` char(10) DEFAULT NULL,
  `Emp_email` varchar(255) NOT NULL,
  `Emp_emer` char(10) DEFAULT NULL,
  PRIMARY KEY (`Emp_ID`),
  UNIQUE KEY `Emp_email` (`Emp_email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `EMPLOYEES`
--

LOCK TABLES `EMPLOYEES` WRITE;
/*!40000 ALTER TABLE `EMPLOYEES` DISABLE KEYS */;
/*!40000 ALTER TABLE `EMPLOYEES` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Inventory`
--

DROP TABLE IF EXISTS `Inventory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Inventory` (
  `InventoryID` int unsigned NOT NULL AUTO_INCREMENT,
  `ItemID` int unsigned NOT NULL,
  `Item_type` varchar(50) NOT NULL,
  `Item_name` varchar(50) NOT NULL,
  `Item_quantity` int unsigned NOT NULL,
  `Shop_ID` int unsigned DEFAULT NULL,
  `Booth_ID` varchar(15) DEFAULT NULL,
  `Unit_price` decimal(10,2) unsigned NOT NULL,
  `Last_restocked_date` date NOT NULL,
  `Reorder_level` int unsigned DEFAULT '10',
  PRIMARY KEY (`InventoryID`),
  UNIQUE KEY `ItemID` (`ItemID`),
  KEY `Shop_ID` (`Shop_ID`),
  KEY `Booth_ID` (`Booth_ID`),
  CONSTRAINT `inventory_ibfk_1` FOREIGN KEY (`Shop_ID`) REFERENCES `SHOPS` (`Shop_ID`),
  CONSTRAINT `inventory_ibfk_2` FOREIGN KEY (`Booth_ID`) REFERENCES `BOOTHS` (`Booth_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Inventory`
--

LOCK TABLES `Inventory` WRITE;
/*!40000 ALTER TABLE `Inventory` DISABLE KEYS */;
/*!40000 ALTER TABLE `Inventory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `MAINTENANCE`
--

DROP TABLE IF EXISTS `MAINTENANCE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `MAINTENANCE` (
  `MaintID` varchar(15) NOT NULL,
  `Maintenance_Date` datetime NOT NULL,
  `Repair_Cost` decimal(6,2) DEFAULT NULL,
  `Repair_Date` datetime NOT NULL,
  `Maint_cost` decimal(6,2) DEFAULT NULL,
  `Maint_Type` enum('Routine','Emergency') NOT NULL,
  `Maint_obj` varchar(30) NOT NULL,
  `Maint_num` int unsigned DEFAULT NULL,
  PRIMARY KEY (`MaintID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `MAINTENANCE`
--

LOCK TABLES `MAINTENANCE` WRITE;
/*!40000 ALTER TABLE `MAINTENANCE` DISABLE KEYS */;
/*!40000 ALTER TABLE `MAINTENANCE` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `RIDES`
--

DROP TABLE IF EXISTS `RIDES`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `RIDES` (
  `Ride_ID` varchar(15) NOT NULL,
  `Ride_name` varchar(30) NOT NULL,
  `Ride_type` enum('Normal','Water','Thrill','Family','Spinning','Water Coaster','Extreme') NOT NULL,
  `Ride_maint` datetime NOT NULL,
  `Ride_cost` decimal(6,2) DEFAULT NULL,
  `Ride_op` int unsigned DEFAULT NULL,
  `Is_operate` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`Ride_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RIDES`
--

LOCK TABLES `RIDES` WRITE;
/*!40000 ALTER TABLE `RIDES` DISABLE KEYS */;
/*!40000 ALTER TABLE `RIDES` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SERVICES`
--

DROP TABLE IF EXISTS `SERVICES`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SERVICES` (
  `Rent_type` varchar(10) NOT NULL,
  `Rent_cost` int unsigned NOT NULL,
  `Staff_num` int unsigned DEFAULT NULL,
  `Staff_assign` varchar(10) NOT NULL,
  `Internet_use` decimal(6,2) unsigned NOT NULL,
  PRIMARY KEY (`Rent_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SERVICES`
--

LOCK TABLES `SERVICES` WRITE;
/*!40000 ALTER TABLE `SERVICES` DISABLE KEYS */;
/*!40000 ALTER TABLE `SERVICES` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SHOPS`
--

DROP TABLE IF EXISTS `SHOPS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SHOPS` (
  `Shop_ID` int unsigned NOT NULL AUTO_INCREMENT,
  `Shop_name` varchar(30) NOT NULL,
  `Shop_location` varchar(30) NOT NULL,
  `Shop_open` time NOT NULL,
  `Shop_close` time NOT NULL,
  `Shop_type` enum('Food','Merch') NOT NULL,
  `Shop_cost` decimal(6,2) unsigned NOT NULL,
  `Shop_rev` decimal(6,2) unsigned NOT NULL,
  `Staff_num` int unsigned DEFAULT NULL,
  `Merch_type` varchar(20) NOT NULL,
  `Merch_cost` decimal(6,2) unsigned NOT NULL,
  `Merch_inv` int unsigned NOT NULL,
  `Merch_sold` int unsigned NOT NULL,
  PRIMARY KEY (`Shop_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SHOPS`
--

LOCK TABLES `SHOPS` WRITE;
/*!40000 ALTER TABLE `SHOPS` DISABLE KEYS */;
/*!40000 ALTER TABLE `SHOPS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SHOWS`
--

DROP TABLE IF EXISTS `SHOWS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SHOWS` (
  `Show_ID` varchar(15) NOT NULL,
  `Show_name` varchar(30) NOT NULL,
  `Show_cost` decimal(6,2) DEFAULT NULL,
  `Show_start` time NOT NULL,
  `Show_end` time NOT NULL,
  `Stage_location` smallint NOT NULL,
  `Seat_num` int unsigned NOT NULL,
  `Perf_num` int unsigned DEFAULT NULL,
  `Staff_num` int unsigned DEFAULT NULL,
  `Stage_maint` datetime NOT NULL,
  `Is_operate` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`Show_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SHOWS`
--

LOCK TABLES `SHOWS` WRITE;
/*!40000 ALTER TABLE `SHOWS` DISABLE KEYS */;
/*!40000 ALTER TABLE `SHOWS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `TICKETS`
--

DROP TABLE IF EXISTS `TICKETS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `TICKETS` (
  `Tick_ID` int unsigned NOT NULL AUTO_INCREMENT,
  `Tick_cost` decimal(6,2) unsigned NOT NULL,
  `Tick_type` enum('Day Pass','Season Pass','Child','Adult','VIP','Senior') NOT NULL,
  `Tick_sold` int unsigned NOT NULL,
  `Parking_cost` decimal(6,2) unsigned DEFAULT NULL,
  `Parking_sales` int unsigned DEFAULT NULL,
  `Tick_Date` datetime NOT NULL,
  `Visitor_ID` int unsigned DEFAULT NULL,
  PRIMARY KEY (`Tick_ID`),
  KEY `Visitor_ID` (`Visitor_ID`),
  CONSTRAINT `tickets_ibfk_1` FOREIGN KEY (`Visitor_ID`) REFERENCES `VISITORS` (`Visitor_ID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `TICKETS`
--

LOCK TABLES `TICKETS` WRITE;
/*!40000 ALTER TABLE `TICKETS` DISABLE KEYS */;
/*!40000 ALTER TABLE `TICKETS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `VISITORS`
--

DROP TABLE IF EXISTS `VISITORS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `VISITORS` (
  `Visitor_ID` int unsigned NOT NULL AUTO_INCREMENT,
  `First_name` varchar(50) NOT NULL,
  `Last_name` varchar(50) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `Phone` varchar(15) NOT NULL,
  `Tickets_purchased` int unsigned NOT NULL,
  `Ticket_type` varchar(20) NOT NULL,
  PRIMARY KEY (`Visitor_ID`),
  UNIQUE KEY `Email` (`Email`),
  UNIQUE KEY `Phone` (`Phone`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `VISITORS`
--

LOCK TABLES `VISITORS` WRITE;
/*!40000 ALTER TABLE `VISITORS` DISABLE KEYS */;
/*!40000 ALTER TABLE `VISITORS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `WEATHER`
--

DROP TABLE IF EXISTS `WEATHER`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `WEATHER` (
  `WtrID` int NOT NULL AUTO_INCREMENT,
  `Date_recorded` date NOT NULL,
  `Wtr_cond` varchar(50) NOT NULL,
  `Num_rnout` int unsigned NOT NULL,
  `Rnout_date` date NOT NULL,
  `Precp_level` decimal(6,2) unsigned NOT NULL,
  `Wtr_temp` float NOT NULL,
  `Air_qual` varchar(50) NOT NULL,
  `UV_ind` int DEFAULT NULL,
  `Special_alerts` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`WtrID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `WEATHER`
--

LOCK TABLES `WEATHER` WRITE;
/*!40000 ALTER TABLE `WEATHER` DISABLE KEYS */;
/*!40000 ALTER TABLE `WEATHER` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-03 21:50:26
