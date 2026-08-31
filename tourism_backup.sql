-- MySQL dump 10.13  Distrib 26.7.0, for macos15 (arm64)
--
-- Host: localhost    Database: tourism
-- ------------------------------------------------------
-- Server version	26.7.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '497a16ea-9a2b-11f1-96e6-7b76dcec0c76:1-34';

--
-- Table structure for table `ai_analysis`
--

DROP TABLE IF EXISTS `ai_analysis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ai_analysis` (
  `id` int NOT NULL AUTO_INCREMENT,
  `famous_destination_id` int DEFAULT NULL,
  `hidden_destination_id` int DEFAULT NULL,
  `visitor_shift_percentage` float DEFAULT NULL,
  `overcrowding_impact` float DEFAULT NULL,
  `employment_impact` float DEFAULT NULL,
  `local_purchase_impact` float DEFAULT NULL,
  `government_profit_impact` float DEFAULT NULL,
  `water_saving` float DEFAULT NULL,
  `waste_impact` float DEFAULT NULL,
  `pollution_impact` float DEFAULT NULL,
  `accessibility_score` float DEFAULT NULL,
  `ai_recommendation` text,
  PRIMARY KEY (`id`),
  KEY `famous_destination_id` (`famous_destination_id`),
  KEY `hidden_destination_id` (`hidden_destination_id`),
  KEY `ix_ai_analysis_id` (`id`),
  CONSTRAINT `ai_analysis_ibfk_1` FOREIGN KEY (`famous_destination_id`) REFERENCES `destinations` (`id`),
  CONSTRAINT `ai_analysis_ibfk_2` FOREIGN KEY (`hidden_destination_id`) REFERENCES `destinations` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ai_analysis`
--

LOCK TABLES `ai_analysis` WRITE;
/*!40000 ALTER TABLE `ai_analysis` DISABLE KEYS */;
INSERT INTO `ai_analysis` VALUES (1,1,2,20,18,12,15,10,8,11,9,75,'Redistribute a portion of tourist traffic from the overcrowded destination to the hidden destination to reduce pressure and improve local economic opportunities.');
/*!40000 ALTER TABLE `ai_analysis` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `destinations`
--

DROP TABLE IF EXISTS `destinations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `destinations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `state` varchar(100) NOT NULL,
  `district` varchar(100) DEFAULT NULL,
  `description` text,
  `latitude` float DEFAULT NULL,
  `longitude` float DEFAULT NULL,
  `destination_type` varchar(30) NOT NULL,
  `approved` tinyint(1) DEFAULT NULL,
  `current_footfall` int DEFAULT NULL,
  `water_usage` float DEFAULT NULL,
  `waste_generation` float DEFAULT NULL,
  `pollution_level` float DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_destinations_id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `destinations`
--

LOCK TABLES `destinations` WRITE;
/*!40000 ALTER TABLE `destinations` DISABLE KEYS */;
INSERT INTO `destinations` VALUES (1,'Deomali Hidden Trail','Odisha','Koraput','A scenic hidden destination surrounded by hills and forests.',18.6736,82.9511,'hidden',1,1200,4500,350,18),(2,'Mahendragiri Hidden Zone','Odisha','Gajapati','A lesser-known mountain tourism destination with natural landscapes.',18.9364,84.3437,'hidden',1,850,3200,220,12),(3,'Kandhamal Nature Valley','Odisha','Kandhamal','A nature destination suitable for eco-tourism and local employment.',20.47,84.23,'hidden',1,600,2500,180,10),(4,'Puri Beach','Odisha','Puri','One of Odisha\'s most popular tourist destinations.',19.8135,85.8312,'famous',1,150000,500000,45000,72),(5,'Konark Sun Temple','Odisha','Puri','A major historical and cultural tourist destination.',19.8876,86.0945,'famous',1,100000,300000,30000,60),(6,'Hidden waterfall Demo','Odisha','Keonjhar','A hidden waterfall suitable for eco tourism',21.6,85.58,'hidden',1,0,0,0,0);
/*!40000 ALTER TABLE `destinations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `footfall`
--

DROP TABLE IF EXISTS `footfall`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `footfall` (
  `id` int NOT NULL AUTO_INCREMENT,
  `destination_id` int DEFAULT NULL,
  `month` varchar(20) DEFAULT NULL,
  `visitor_count` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `destination_id` (`destination_id`),
  KEY `ix_footfall_id` (`id`),
  CONSTRAINT `footfall_ibfk_1` FOREIGN KEY (`destination_id`) REFERENCES `destinations` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `footfall`
--

LOCK TABLES `footfall` WRITE;
/*!40000 ALTER TABLE `footfall` DISABLE KEYS */;
INSERT INTO `footfall` VALUES (1,1,'May 2026',900),(2,1,'June 2026',1050),(3,1,'July 2026',1200),(4,2,'May 2026',600),(5,2,'June 2026',720),(6,2,'July 2026',850),(7,3,'May 2026',400),(8,3,'June 2026',500),(9,3,'July 2026',600);
/*!40000 ALTER TABLE `footfall` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `guide_bookings`
--

DROP TABLE IF EXISTS `guide_bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `guide_bookings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `guide_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `destination_id` int DEFAULT NULL,
  `booking_date` varchar(30) DEFAULT NULL,
  `status` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `guide_id` (`guide_id`),
  KEY `user_id` (`user_id`),
  KEY `destination_id` (`destination_id`),
  KEY `ix_guide_bookings_id` (`id`),
  CONSTRAINT `guide_bookings_ibfk_1` FOREIGN KEY (`guide_id`) REFERENCES `guides` (`id`),
  CONSTRAINT `guide_bookings_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `guide_bookings_ibfk_3` FOREIGN KEY (`destination_id`) REFERENCES `destinations` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `guide_bookings`
--

LOCK TABLES `guide_bookings` WRITE;
/*!40000 ALTER TABLE `guide_bookings` DISABLE KEYS */;
/*!40000 ALTER TABLE `guide_bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `guides`
--

DROP TABLE IF EXISTS `guides`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `guides` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `experience` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `verification_status` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `ix_guides_id` (`id`),
  CONSTRAINT `guides_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `guides`
--

LOCK TABLES `guides` WRITE;
/*!40000 ALTER TABLE `guides` DISABLE KEYS */;
INSERT INTO `guides` VALUES (1,3,'5 years','9000000001','APPROVED'),(52,1,'1','9040244868','APPROVED');
/*!40000 ALTER TABLE `guides` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `place_submissions`
--

DROP TABLE IF EXISTS `place_submissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `place_submissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `name` varchar(150) NOT NULL,
  `state` varchar(100) NOT NULL,
  `district` varchar(100) DEFAULT NULL,
  `description` text,
  `latitude` float DEFAULT NULL,
  `longitude` float DEFAULT NULL,
  `verification_status` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `ix_place_submissions_id` (`id`),
  CONSTRAINT `place_submissions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `place_submissions`
--

LOCK TABLES `place_submissions` WRITE;
/*!40000 ALTER TABLE `place_submissions` DISABLE KEYS */;
INSERT INTO `place_submissions` VALUES (1,1,'Hidden waterfall Demo','Odisha','Keonjhar','A hidden waterfall suitable for eco tourism',21.6,85.58,'APPROVED');
/*!40000 ALTER TABLE `place_submissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `destination_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `rating` int DEFAULT NULL,
  `feedback` text,
  PRIMARY KEY (`id`),
  KEY `destination_id` (`destination_id`),
  KEY `user_id` (`user_id`),
  KEY `ix_reviews_id` (`id`),
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`destination_id`) REFERENCES `destinations` (`id`),
  CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES (1,1,1,5,'Beautiful place and peaceful environment.'),(2,1,1,4,'Very scenic but transport can be improved.'),(3,2,1,5,'Amazing natural landscape.'),(4,3,1,4,'Good place for nature tourism.'),(52,1,1,5,'Amazing Scenery');
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stays`
--

DROP TABLE IF EXISTS `stays`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stays` (
  `id` int NOT NULL AUTO_INCREMENT,
  `destination_id` int DEFAULT NULL,
  `name` varchar(150) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `price_per_night` float DEFAULT NULL,
  `contact` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `destination_id` (`destination_id`),
  KEY `ix_stays_id` (`id`),
  CONSTRAINT `stays_ibfk_1` FOREIGN KEY (`destination_id`) REFERENCES `destinations` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stays`
--

LOCK TABLES `stays` WRITE;
/*!40000 ALTER TABLE `stays` DISABLE KEYS */;
INSERT INTO `stays` VALUES (1,1,'Deomali Eco Stay','Koraput, Odisha',1200,'9000000011'),(2,1,'Hill View Homestay','Deomali Road, Koraput',900,'9000000012'),(3,2,'Mahendragiri Nature Stay','Gajapati, Odisha',1000,'9000000013'),(4,3,'Kandhamal Eco Homestay','Kandhamal, Odisha',800,'9000000014');
/*!40000 ALTER TABLE `stays` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(30) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `ix_users_id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Public User','public@s21.com','1234','PUBLIC'),(2,'Government Officer','govt@s21.com','1234','GOVERNMENT'),(3,'Rahul Guide','rahul@s21.com','1234','GUIDE');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-19 18:12:25
