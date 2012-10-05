
-- phpMyAdmin SQL Dump
-- version 2.11.4
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Oct 05, 2012 at 09:44 AM
-- Server version: 5.1.57
-- PHP Version: 5.2.17

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";

--
-- Database: `a3048444_list`
--

-- --------------------------------------------------------

--
-- Table structure for table `list`
--

CREATE TABLE `list` (
  `lname` varchar(50) COLLATE latin1_general_ci NOT NULL,
  `pw` varchar(50) COLLATE latin1_general_ci NOT NULL,
  PRIMARY KEY (`lname`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

--
-- Dumping data for table `list`
--

INSERT INTO `list` VALUES('Poste', '46f94c8de14fb36680850768ff1b7f2a');
INSERT INTO `list` VALUES('Oerlikon', '9e396ac73b53ac37b6f2f7619413eee5');
INSERT INTO `list` VALUES('test', '202cb962ac59075b964b07152d234b70');
INSERT INTO `list` VALUES('poste2', '202cb962ac59075b964b07152d234b70');

-- --------------------------------------------------------

--
-- Table structure for table `object`
--

CREATE TABLE `object` (
  `lname` varchar(50) COLLATE latin1_general_ci NOT NULL,
  `mass` varchar(50) COLLATE latin1_general_ci NOT NULL,
  `oname` varchar(50) COLLATE latin1_general_ci NOT NULL,
  `checked` tinyint(1) NOT NULL,
  KEY `lname` (`lname`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

--
-- Dumping data for table `object`
--

INSERT INTO `object` VALUES('Poste', '', 'Zucker', 1);
INSERT INTO `object` VALUES('Poste', '', 'Brot', 1);
INSERT INTO `object` VALUES('Poste', '', 'Energy', 1);
INSERT INTO `object` VALUES('Poste', '', 'Milch', 1);
INSERT INTO `object` VALUES('Poste', '', 'Butter', 1);
INSERT INTO `object` VALUES('Poste', '', 'WC-Papier', 1);
INSERT INTO `object` VALUES('Poste', '', 'Teigwaren', 1);
INSERT INTO `object` VALUES('Poste', '', 'Nastüechli', 0);
INSERT INTO `object` VALUES('Poste', '', 'Öl', 1);
INSERT INTO `object` VALUES('Poste', '', 'Konfitüre', 1);
INSERT INTO `object` VALUES('Poste', '', 'Wöschpulver', 1);
INSERT INTO `object` VALUES('Poste', '', 'Handseife', 1);
INSERT INTO `object` VALUES('Poste', '', 'Batterien AA', 1);
INSERT INTO `object` VALUES('Poste', '', 'Batterien AAA', 1);
INSERT INTO `object` VALUES('test', '', 'buu', 1);
INSERT INTO `object` VALUES('test', '', 'haha', 0);
INSERT INTO `object` VALUES('test', '', 'test', 0);
INSERT INTO `object` VALUES('test', '', 'test2', 0);
INSERT INTO `object` VALUES('Poste', '', 'Zürisäcke', 1);
INSERT INTO `object` VALUES('Poste', '', 'Essig', 1);
INSERT INTO `object` VALUES('Poste', '', 'Salz', 1);
INSERT INTO `object` VALUES('Poste', '', 'Geschirrspühl Salz', 1);
INSERT INTO `object` VALUES('Poste', '', 'Geschirrspühl Glanz', 1);
INSERT INTO `object` VALUES('Poste', '', 'Geschirrspühl Pulver', 1);
INSERT INTO `object` VALUES('Poste', '', 'Mehl', 1);
INSERT INTO `object` VALUES('test', '', 'ghggh', 1);
INSERT INTO `object` VALUES('Poste', '', 'Streichkäse', 1);
INSERT INTO `object` VALUES('Poste', '', 'Tomatensauce', 1);
INSERT INTO `object` VALUES('Poste', '', 'Reis', 1);
INSERT INTO `object` VALUES('Poste', '', 'Tiefkühlpizza', 1);
INSERT INTO `object` VALUES('Poste', '', 'Ersatztuch für Wischmop', 0);
INSERT INTO `object` VALUES('Poste', '', 'Pet, Alu, Glas Sammelsäcke', 0);
INSERT INTO `object` VALUES('Poste', '', 'Schnur', 1);
INSERT INTO `object` VALUES('Poste', '', 'Malerchlebband', 1);
INSERT INTO `object` VALUES('Poste', '', 'Leim', 1);
INSERT INTO `object` VALUES('Poste', '', 'Sekundeliim', 1);
INSERT INTO `object` VALUES('Poste', '', 'Putzmittel aller Art ;-)', 0);
INSERT INTO `object` VALUES('Poste', '', 'Frischhalte Folie', 1);
INSERT INTO `object` VALUES('poste', '1', 'badezimmerstange', 0);
INSERT INTO `object` VALUES('poste', '', 'badezimmerhacken', 1);
INSERT INTO `object` VALUES('poste', '', 'küchenhacken', 1);
INSERT INTO `object` VALUES('Poste', '2', 'boxeteppich', 0);
INSERT INTO `object` VALUES('poste', '1', 'badezimmerkomode', 0);
INSERT INTO `object` VALUES('poste', '1', 'besteckfach für küchenschublade', 0);
INSERT INTO `object` VALUES('Poste', '', 'Brotbrett', 0);
INSERT INTO `object` VALUES('Poste', '', 'Mixer', 0);
INSERT INTO `object` VALUES('Poste', '', 'Folienhalterset', 0);
INSERT INTO `object` VALUES('Poste', '', 'Toaster', 0);
INSERT INTO `object` VALUES('Poste', '', 'Stahlwolle', 0);
INSERT INTO `object` VALUES('Poste', '', 'Mikrowelle', 0);
INSERT INTO `object` VALUES('Poste', '', 'Salzstreuer', 0);
INSERT INTO `object` VALUES('Poste', '', 'Gratinform', 0);
INSERT INTO `object` VALUES('Poste', '', 'Balkon tisch und bank', 0);
INSERT INTO `object` VALUES('Poste', '', 'Fensterschaber', 0);
INSERT INTO `object` VALUES('Poste', '', 'Microfasertuech', 0);
INSERT INTO `object` VALUES('Poste', '', 'Duftspray', 1);
INSERT INTO `object` VALUES('Poste', '', 'Wöschzeine', 0);
INSERT INTO `object` VALUES('Poste', '', 'Vorhäng', 0);
INSERT INTO `object` VALUES('Poste', '', 'Schueablag', 0);
INSERT INTO `object` VALUES('Poste', '', 'Schueschrankunterlag', 0);
INSERT INTO `object` VALUES('Poste', '', 'Whitboard', 0);
