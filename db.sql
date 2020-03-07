-- phpMyAdmin SQL Dump
-- version 4.9.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 07, 2020 at 04:05 AM
-- Server version: 10.4.11-MariaDB
-- PHP Version: 7.4.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pos`
--

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `id` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'Drinks', '2020-01-22 18:12:07', '2020-01-22 18:12:07'),
(2, 'Foods', '2020-02-05 04:34:21', '2020-02-05 14:09:03'),
(16, 'Snack', '2020-02-05 14:41:59', '2020-02-05 14:41:59');

-- --------------------------------------------------------

--
-- Table structure for table `order_item`
--

CREATE TABLE `order_item` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `qty` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `price` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order_item`
--

INSERT INTO `order_item` (`id`, `order_id`, `product_id`, `qty`, `created_at`, `updated_at`, `price`) VALUES
(1, 4413203, 7, 1, '2020-03-03 17:05:51', '2020-03-03 17:05:51', 30000),
(2, 1966238, 21, 1, '2020-03-03 17:15:22', '2020-03-03 17:15:22', 5000),
(3, 1966238, 32, 1, '2020-03-03 17:15:22', '2020-03-03 17:15:22', 10000),
(4, 6606956, 7, 1, '2020-03-04 01:37:56', '2020-03-04 01:37:56', 30000),
(5, 9182199, 21, 1, '2020-03-04 01:46:14', '2020-03-04 01:46:14', 5000),
(6, 9182199, 39, 2, '2020-03-04 01:46:14', '2020-03-04 01:46:14', 92000),
(7, 4103208, 3, 1, '2020-03-04 02:14:06', '2020-03-04 02:14:06', 40000),
(8, 4103208, 32, 3, '2020-03-04 02:14:06', '2020-03-04 02:14:06', 30000);

-- --------------------------------------------------------

--
-- Table structure for table `order_session`
--

CREATE TABLE `order_session` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `invoice_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `price` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order_session`
--

INSERT INTO `order_session` (`id`, `user_id`, `invoice_id`, `created_at`, `updated_at`, `price`) VALUES
(1, 15, 4413203, '2020-03-03 17:05:52', '2020-03-03 17:05:52', 33000),
(2, 15, 1966238, '2020-03-03 17:15:22', '2020-03-03 17:15:22', 16500),
(3, 33, 6606956, '2020-03-04 01:37:56', '2020-03-04 01:37:56', 33000),
(4, 33, 9182199, '2020-03-04 01:46:14', '2020-03-04 01:46:14', 106700),
(5, 15, 4103208, '2020-03-04 02:14:06', '2020-03-04 02:14:06', 77000);

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `id` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(1000) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image` varchar(300) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category_id` int(11) NOT NULL,
  `price` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`id`, `name`, `description`, `image`, `category_id`, `price`, `created_at`, `updated_at`) VALUES
(2, 'Americano', 'Americano terdiri dari satu shot espresso yang dituangkan dalam cangkir berukuran 178 mililiter yang dicampur dengan air panas hingga memenuhi gelas. Jenis lainnya adalah doppio, yakni segelas Americano dengan dua shot espresso.', '1580265614845.jpg', 1, 35000, '2020-01-29 02:40:14', '2020-03-01 02:15:23'),
(3, 'Cappucino', 'A cappuccino (/ˌkæpʊˈtʃiːnoʊ/ (About this soundlisten); Italian pronunciation: [kapputˈtʃiːno]; Italian plural: cappuccini) is an espresso-based coffee drink that originated in Italy, and is traditionally prepared with steamed milk foam (microfoam).', '1580265665101.jpg', 1, 40000, '2020-01-29 02:41:05', '2020-02-13 06:05:52'),
(4, 'Macchiato', 'The origin of the name \"macchiato\" stems from baristas needing to show the serving waiters the difference between an espresso and an espresso with a tiny bit of milk in it; the latter was \"marked\". The idea is reflected in the Portuguese name for the drink: café pingado, meaning coffee with a drop.', '1580265730852.jpg', 1, 10000, '2020-01-29 02:42:10', '2020-02-13 06:00:52'),
(5, 'Cortado', 'A cortado is a beverage consisting of espresso mixed with a roughly equal amount of warm milk to reduce the acidity. The milk in a cortado is steamed, but not frothy and \"texturized\" as in many Italian coffee drinks.', '1580265775149.jpg', 1, 45000, '2020-01-29 02:42:55', '2020-02-13 05:58:54'),
(6, 'Latte', 'Caffè e latte, Milchkaffee, café au lait and café con leche are domestic terms of traditional ways of drinking coffee, usually as part of breakfast in the home. Public cafés in Europe and the US seem to have no mention of the terms until the 20th century, although Kapuziner is mentioned in Austrian coffee houses in Vienna and Trieste in the 2nd half of 1700s as \"coffee with cream, spices and sugar\" (being the origin of the Italian cappuccino).', '1580265855381.jpg', 1, 55000, '2020-01-29 02:44:15', '2020-02-13 06:00:08'),
(7, 'French press', 'A French press, also known as a cafetière, cafetière à piston, Cafeteria, press pot, coffee press, or coffee plunger, is a coffee brewing device invented by Paolini Ugo and patented by Italian designer Attilio Calimani and Giulio Moneta in 1929.', '1580739942734.jpg', 1, 30000, '2020-01-29 02:45:56', '2020-02-03 14:25:42'),
(8, 'Doppio', 'Doppio espresso is a double shot, extracted using a double coffee filter in the portafilter. This results in 60 ml of drink, double the amount of a single shot espresso. More commonly called a standard double, it is a standard in judging the espresso quality in barista competitions. Doppio is Italian multiplier, meaning \"double\".', '1580266050968.jpg', 1, 42000, '2020-01-29 02:47:30', '2020-01-29 02:47:30'),
(10, 'Kimbab', 'Gimbap (김밥) is a Korean dish made from cooked rice and other ingredients that are rolled in gim—dried sheets of nori seaweed—and served in bite-sized slices.', '1580316903337.jpg', 2, 20000, '2020-01-29 16:55:03', '2020-02-13 05:58:03'),
(11, 'Dorayaki', 'Dorayaki  a type of Japanese confection, a red-bean pancake which consists of two small pancake-like patties made from castella wrapped around a filling of sweet azuki bean paste.', '1580316969672.jpg', 2, 25000, '2020-01-29 16:56:09', '2020-02-13 05:57:24'),
(12, 'Pecel', 'Pecel is a traditional Javanese salad, consisting of mixed vegetables in a peanut sauce dressing, usually served with steamed rice, or lontong or ketupat compressed rice cakes.', '1580340957788.jpg', 2, 10000, '2020-01-29 23:35:57', '2020-02-13 06:04:46'),
(21, 'Hot Tea', 'Tea is an aromatic beverage commonly prepared by pouring hot or boiling water over cured leaves of the Camellia sinensis, an evergreen shrub native to East Asia.', '1581573370096.jpg', 1, 5000, '2020-02-06 04:49:20', '2020-03-01 02:16:02'),
(30, 'Espresso', 'Espresso coffee can be made with a wide variety of coffee beans and roasts. Espresso is generally thicker than coffee brewed by other methods, has a higher concentration of suspended and dissolved solids, and has crema on top (a foam with a creamy consistency).', '1580265548237.jpg', 1, 25000, '2020-01-29 02:39:08', '2020-02-13 06:04:04'),
(32, 'Fried Rice', 'Fried rice is a dish of cooked rice that has been stir-fried in a wok or a frying pan and is usually mixed with other ingredients such as eggs, vegetables, seafood, or meat. It is often eaten by itself or as an accompaniment to another dish. Fried rice is a popular component of East Asian, Southeast Asian and certain South Asian cuisines.', '1581431465262.jpg', 2, 10000, '2020-02-11 14:31:05', '2020-03-01 02:17:50'),
(36, 'Turkish Coffee', 'Beans for Turkish coffee are ground to a fine powder. Turkish coffee is prepared by immersing the coffee grounds in water and heating until it just boils. This method produces the maximum amount of foam. If the coffee is left to boil longer, less foam remains. In Turkey, four degrees of sweetness are used. The Turkish terms and approximate amounts are as follows: sade (plain; no sugar), az şekerli (little sugar; half a level teaspoon of sugar), orta şekerli (medium sugar; one level teaspoon), çok şekerli (a lot of sugar). Before boiling, the coffee and the desired amount of sugar are stirred until all coffee sinks and the sugar is dissolved.', '1581574070629.jpg', 1, 35000, '2020-02-13 06:07:23', '2020-02-13 06:07:50'),
(37, 'Caffè Americano', 'Caffè Americano or simply Americano (the name is also spelled with varying capitalization and use of diacritics: e.g. Café Americano, Cafe Americano, etc.) is a style of coffee prepared by adding hot water to espresso, giving a similar strength to but different flavor from brewed coffee. The drink consists of a single or double-shot of espresso combined with between 1 and 16 fluid ounces (30–470 ml) of hot water. The strength of an Americano varies with the number of shots of espresso added. In the United States, \"Americano\" is used broadly to mean combining hot water and espresso in either order. Variations include long black and lungo.', '1581574146419.jpg', 1, 45000, '2020-02-13 06:08:47', '2020-02-13 06:09:06'),
(38, 'Bailey\'s Irish Cream', 'Baileys Irish Cream is an Irish cream liqueur - an alcoholic beverage flavored with cream, cocoa, and Irish whiskey - made by Diageo at Nangor Road, in Dublin, Republic of Ireland and in Mallusk, Northern Ireland owned by Gilbeys of Ireland, the trademark is currently owned by Diageo. It has a declared alcohol content of 17% by volume.', '1581574238992.jpg', 1, 65000, '2020-02-13 06:10:14', '2020-02-13 06:10:38'),
(39, 'Caffè corretto', 'Caffè corretto (pronounced [kafˈfɛ kkorˈrɛtto]), an Italian beverage, consists of a shot of espresso with a small amount of liquor.', '1581574344869.jpg', 1, 46000, '2020-02-13 06:11:50', '2020-03-01 01:58:46');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(300) NOT NULL,
  `name` varchar(255) NOT NULL,
  `photo` varchar(300) DEFAULT NULL,
  `gender` int(11) DEFAULT NULL,
  `role` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `username`, `password`, `name`, `photo`, `gender`, `role`, `status`, `created_at`, `updated_at`) VALUES
(15, 'admin', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 'Admins', '1581581105222.jpg', NULL, 0, 0, '2020-02-05 06:39:34', '2020-03-03 04:07:20'),
(18, 'irvan', 'cc85112931f36474564f4a638dd26d508d08d0610571628a73a156fe95b32aac', 'irvan', NULL, NULL, 1, 0, '2020-02-06 04:46:00', '2020-02-11 15:59:51'),
(27, 'admin6', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 'Adminnnnnnnnnnnnnnnnnn', '1581435017580.jpg', NULL, 1, 1, '2020-02-11 15:27:00', '2020-03-01 02:18:56'),
(29, 'admine', '7f4779dc919adf95c8fae37a2bd44e710b0bf3490a4b86c5ef4d9bb81972a5fc', 'Admine', NULL, NULL, 2, 1, '2020-02-13 04:02:41', '2020-02-13 04:02:41'),
(32, 'najih', '2a5ce8af414a8e5099b29cc940d837fb51c14cdc6eff6a3412d24c4109b4e3ea', 'Najih najih', '1581587441672.jpg', NULL, 0, 0, '2020-02-13 09:44:15', '2020-03-01 02:18:28'),
(33, 'madmin', 'bec5fb6c64e77dc03b2677671222125769ed383ed9ca6806cfaf306dcf0d9c1e', 'Muhammad Admin', NULL, NULL, 2, 0, '2020-03-03 17:18:49', '2020-03-03 17:18:49'),
(35, 'user001', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 'user user', NULL, NULL, 0, 1, '2020-03-04 17:38:18', '2020-03-04 17:38:18'),
(36, 'user002', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 'Adminnnnnnnnnnnnnnnnnn', '1583344207416.PNG', NULL, 0, 1, '2020-03-04 17:39:27', '2020-03-04 17:50:07'),
(37, 'user003', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 'user user', NULL, NULL, 0, 1, '2020-03-04 17:45:20', '2020-03-04 17:45:20'),
(39, 'user004', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 'user user', '1583343932136.PNG', NULL, 0, 1, '2020-03-04 17:45:32', '2020-03-04 17:45:32'),
(40, 'user005', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 'user user', '1583344221002.PNG', NULL, 0, 1, '2020-03-04 17:50:21', '2020-03-04 17:50:21');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `order_item`
--
ALTER TABLE `order_item`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `order_session`
--
ALTER TABLE `order_session`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `order_item`
--
ALTER TABLE `order_item`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `order_session`
--
ALTER TABLE `order_session`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
