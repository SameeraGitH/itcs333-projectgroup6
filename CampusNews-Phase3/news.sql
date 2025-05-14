-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: May 13, 2025 at 11:42 PM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.0.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `camp-news`
--

-- --------------------------------------------------------

--
-- Table structure for table `news`
--

CREATE TABLE `news` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `college` varchar(100) NOT NULL,
  `date` date NOT NULL,
  `summary` text NOT NULL,
  `content` text NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `news`
--

INSERT INTO `news` (`id`, `title`, `college`, `date`, `summary`, `content`, `image`, `created_at`) VALUES
(1, 'New Science Building Opens Next Week', 'academic', '2025-03-25', 'State-of-the-art science facility to open Monday.', 'The University is proud to announce the grand opening of our new state-of-the-art Science Building. The facility will officially open on April 7.', '', '2025-05-13 21:28:03'),
(2, 'Basketball Team Advances to Finals', 'sports', '2025-03-23', 'The team secures spot in national championship.', 'Our university basketball team has secured a spot in the national championship finals. The entire campus is celebrating their hard work.', '', '2025-05-13 21:28:03'),
(3, 'Annual Spring Festival Schedule Announced', 'events', '2025-03-20', 'Live music, food vendors, and games coming soon.', 'The schedule for this year\'s Spring Festival has been released, featuring live entertainment, vendors, and fun activities for all.', '', '2025-05-13 21:28:03'),
(4, 'Extended Library Hours During Finals Week', 'announcements', '2025-03-18', 'Library open 24/7 during finals.', 'To help students during finals week, the main library will be open 24 hours a day. Study rooms can also be booked online.', '', '2025-05-13 21:28:03'),
(5, 'Main Quad Renovation Project Update', 'campus-life', '2025-03-12', 'Quad renovations ahead of schedule.', 'The renovation of the main quad is ahead of schedule. Students can expect improved walkways and green spaces when completed.', '', '2025-05-13 21:28:03'),
(6, 'hello', 'sports', '2025-05-21', '2323232', '323232', '', '2025-05-13 21:39:08');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `news`
--
ALTER TABLE `news`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `news`
--
ALTER TABLE `news`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
