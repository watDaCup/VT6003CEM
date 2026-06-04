-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jun 04, 2026 at 09:02 AM
-- Server version: 8.3.0
-- PHP Version: 8.2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `blogdb`
--

-- --------------------------------------------------------

--
-- Table structure for table `favorites`
--

DROP TABLE IF EXISTS `favorites`;
CREATE TABLE IF NOT EXISTS `favorites` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `film_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `film_id` (`film_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `favorites`
--

INSERT INTO `favorites` (`id`, `user_id`, `film_id`, `created_at`) VALUES
(1, 1, 2, '2026-06-04 07:05:28');

-- --------------------------------------------------------

--
-- Table structure for table `films`
--

DROP TABLE IF EXISTS `films`;
CREATE TABLE IF NOT EXISTS `films` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `genre` varchar(100) DEFAULT NULL,
  `year` int DEFAULT NULL,
  `rating` decimal(3,1) DEFAULT NULL,
  `description` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `films`
--

INSERT INTO `films` (`id`, `title`, `genre`, `year`, `rating`, `description`) VALUES
(1, 'Inception', 'Sci-Fi', 2010, 9.1, 'A thief who steals corporate secrets through dream-sharing something.'),
(2, 'The Godfather', 'Crime', 1972, 9.2, 'An organized crime dynasty\'s aging patriarch transfers control to his son.'),
(3, 'Spirited Away', 'Animation', 2001, 8.6, 'A young girl enters a world of spirits and must work in a bathhouse.'),
(4, 'Parasite', 'Thriller', 2019, 8.6, 'A poor family schemes to become employed by a wealthy household.');

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
CREATE TABLE IF NOT EXISTS `messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `from_user_id` int NOT NULL,
  `to_user_id` int NOT NULL,
  `film_id` int DEFAULT NULL,
  `text` text NOT NULL,
  `response` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `from_user_id` (`from_user_id`),
  KEY `to_user_id` (`to_user_id`),
  KEY `film_id` (`film_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `from_user_id`, `to_user_id`, `film_id`, `text`, `response`, `created_at`) VALUES
(1, 2, 1, 1, 'Hi admin, I think Inception is missing a director credit.', 'Thanks, we will check and update credits.', '2026-06-01 09:52:53'),
(2, 3, 1, 4, 'Is Parasite available in 4K?', NULL, '2026-06-01 09:52:53'),
(4, 4, 1, NULL, '[PUBLIC FILM REQUEST]\nFilm Title Suggestion: k\nAdditional Information: j', 'Seen', '2026-06-04 06:45:49'),
(5, 4, 1, NULL, '[PUBLIC FILM REQUEST]\nFilm Title Suggestion: asdads\nAdditional Information: adasd', 'Seen', '2026-06-04 08:34:09'),
(6, 5, 1, 3, 'something is wrong', 'no', '2026-06-04 08:35:39'),
(7, 2, 1, 3, 'The metadata for this film has a typo in the description.', NULL, '2026-06-04 08:39:02'),
(8, 4, 1, NULL, '[PUBLIC FILM REQUEST]\nFilm Title Suggestion: jssdghhsiagasdyit\nAdditional Information: sdfsdafsda', 'Seen', '2026-06-04 08:44:02'),
(9, 4, 1, NULL, '[PUBLIC FILM REQUEST]\nFilm Title Suggestion: askhsagdsakj\nAdditional Information: None provided.', 'Seen', '2026-06-04 08:44:05'),
(10, 7, 1, NULL, 'jhfhggfxg', 'ligi', '2026-06-04 08:45:40'),
(12, 2, 1, 3, 'The metadata for this film has a typo in the description.', NULL, '2026-06-04 08:48:56'),
(13, 4, 1, NULL, '[PUBLIC FILM REQUEST]\nFilm Title Suggestion: zxc\nAdditional Information: None provided.', NULL, '2026-06-04 08:54:37');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('Admin','User','Public') DEFAULT 'User',
  `email` varchar(255) DEFAULT NULL,
  `profile_photo` varchar(512) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `role`, `email`, `profile_photo`) VALUES
(1, 'admin', 'adminpass', 'Admin', 'admin@cinemavault.local', 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAPABQADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1'),
(2, 'alice', 'alice123', 'User', 'alice@example.com', 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='),
(3, 'bob', 'bob123', 'User', 'bob@example.com', NULL),
(4, 'public', 'public123', 'Public', NULL, NULL);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `favorites`
--
ALTER TABLE `favorites`
  ADD CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `favorites_ibfk_2` FOREIGN KEY (`film_id`) REFERENCES `films` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`from_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`to_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `messages_ibfk_3` FOREIGN KEY (`film_id`) REFERENCES `films` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
