
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

