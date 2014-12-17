-- phpMyAdmin SQL Dump
-- version 4.0.10.6
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Erstellungszeit: 17. Dez 2014 um 05:10
-- Server Version: 5.5.40-cll
-- PHP-Version: 5.4.23

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Datenbank: `duendarc_pigl`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `list`
--

CREATE TABLE IF NOT EXISTS `list` (
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `lname` varchar(50) COLLATE latin1_general_ci NOT NULL,
  `pw` varchar(50) COLLATE latin1_general_ci NOT NULL,
  PRIMARY KEY (`lname`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

--
-- Daten für Tabelle `list`
--

INSERT INTO `list` (`date`, `lname`, `pw`) VALUES
('0000-00-00 00:00:00', 'poste', '46f94c8de14fb36680850768ff1b7f2a'),
('0000-00-00 00:00:00', 'test', '202cb962ac59075b964b07152d234b70'),
('0000-00-00 00:00:00', 'lukas', '098f6bcd4621d373cade4e832627b4f6'),
('0000-00-00 00:00:00', 'compras', 'fb9625b0a66ab4eb0b1a238fd9a93d3a'),
('0000-00-00 00:00:00', 'infopunkt', '2a4dbca69e1640b89d143806022bffaa'),
('0000-00-00 00:00:00', 'wgmuri', '2e4f0e322ac35f17f7a42d299deea7e8'),
('0000-00-00 00:00:00', 'salvis', '522f6541afa770915ca91ed0c1b4c2ad');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `object`
--

CREATE TABLE IF NOT EXISTS `object` (
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `lname` varchar(50) COLLATE latin1_general_ci NOT NULL,
  `mass` varchar(50) COLLATE latin1_general_ci NOT NULL,
  `oname` varchar(50) COLLATE latin1_general_ci NOT NULL,
  `checked` tinyint(1) NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `lname` (`lname`),
  KEY `ID` (`ID`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci AUTO_INCREMENT=9 ;

--
-- Daten für Tabelle `object`
--

INSERT INTO `object` (`date`, `ID`, `lname`, `mass`, `oname`, `checked`) VALUES
('0000-00-00 00:00:00', 1, 'infopunkt', '24', 'Espressokapseln', 0),
('0000-00-00 00:00:00', 2, 'test', '', 'test', 0),
('0000-00-00 00:00:00', 3, 'wgmuri', '', 'milch', 0),
('0000-00-00 00:00:00', 4, 'wgmuri', '', 'brot', 0);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
