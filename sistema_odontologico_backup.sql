-- ============================================================
-- Sistema Odontológico - Esquema completo
-- Compatible con MariaDB / XAMPP
-- ============================================================

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- --------------------------------------------------------
-- 1. clinicas
-- --------------------------------------------------------
DROP TABLE IF EXISTS `clinicas`;
CREATE TABLE `clinicas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) NOT NULL,
  `ruc` varchar(20) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `estado` tinyint DEFAULT 1,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `clinicas` VALUES
(1,'Clinica Dental Sonrisa','12345678901','Trujillo, Peru','999999999','contacto@sonrisa.com',1,NOW(),NOW());

-- --------------------------------------------------------
-- 2. sedes  (sucursales de una clinica)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `sedes`;
CREATE TABLE `sedes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `clinica_id` int NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `estado` tinyint DEFAULT 1,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `clinica_id` (`clinica_id`),
  CONSTRAINT `sedes_ibfk_1` FOREIGN KEY (`clinica_id`) REFERENCES `clinicas` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `sedes` VALUES
(1,1,'Sede Central - Trujillo','Av. Principal 123, Trujillo','999999999','sede1@sonrisa.com',1,NOW(),NOW());

-- --------------------------------------------------------
-- 3. roles
-- --------------------------------------------------------
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `roles` VALUES
(1,'super_admin'),
(2,'admin_clinica'),
(3,'dentista'),
(4,'recepcionista'),
(5,'asistente');

-- --------------------------------------------------------
-- 4. usuarios
--    sede_id es NULL para super_admin y admin_clinica
-- --------------------------------------------------------
DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `clinica_id` int NOT NULL,
  `sede_id` int DEFAULT NULL,
  `rol_id` int NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) DEFAULT NULL,
  `email` varchar(120) NOT NULL,
  `clave` varchar(255) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `estado` tinyint DEFAULT 1,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `clinica_id` (`clinica_id`),
  KEY `sede_id` (`sede_id`),
  KEY `rol_id` (`rol_id`),
  CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`clinica_id`) REFERENCES `clinicas` (`id`),
  CONSTRAINT `usuarios_ibfk_2` FOREIGN KEY (`sede_id`) REFERENCES `sedes` (`id`),
  CONSTRAINT `usuarios_ibfk_3` FOREIGN KEY (`rol_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Contraseña: Admin123! (bcrypt)
INSERT INTO `usuarios` VALUES
(1,1,NULL,1,'Danny','Morales','dannymorces@sonrisa.com','$2b$10$aKqWqK1CAijHyrBGH0qVyulwWR5McDleJ2bofkOWQoF8iRHgIBBCu','949446220',1,NOW(),NOW()),
(2,1,1,3,'Dr. Carlos','Quispe','carlos@sonrisa.com','$2b$10$aKqWqK1CAijHyrBGH0qVyulwWR5McDleJ2bofkOWQoF8iRHgIBBCu','999888777',1,NOW(),NOW());

-- --------------------------------------------------------
-- 5. doctor_sedes  (un doctor puede atender en varias sedes)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `doctor_sedes`;
CREATE TABLE `doctor_sedes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `doctor_id` int NOT NULL,
  `sede_id` int NOT NULL,
  `estado` tinyint DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `doctor_sede_unique` (`doctor_id`, `sede_id`),
  KEY `doctor_id` (`doctor_id`),
  KEY `sede_id` (`sede_id`),
  CONSTRAINT `doctor_sedes_ibfk_1` FOREIGN KEY (`doctor_id`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `doctor_sedes_ibfk_2` FOREIGN KEY (`sede_id`) REFERENCES `sedes` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `doctor_sedes` VALUES (1,2,1,1);

-- --------------------------------------------------------
-- 6. pacientes
-- --------------------------------------------------------
DROP TABLE IF EXISTS `pacientes`;
CREATE TABLE `pacientes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `clinica_id` int NOT NULL,
  `dni` varchar(15) DEFAULT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `genero` varchar(20) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `notas_medicas` text,
  `estado` tinyint DEFAULT 1,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `clinica_id` (`clinica_id`),
  CONSTRAINT `pacientes_ibfk_1` FOREIGN KEY (`clinica_id`) REFERENCES `clinicas` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `pacientes` VALUES
(1,1,'48248169','Danny Nelson','Morales Cespedes','1994-04-22','masculino','949446220','dannymorces18@gmail.com','Mz F lote 11, Trujillo',NULL,1,NOW(),NOW()),
(2,1,'12345678','Maria','Garcia Lopez','1990-06-15','femenino','987654321','maria@example.com','Av. Los Pinos 456',NULL,1,NOW(),NOW()),
(3,1,'87654321','Pedro','Ramirez','1985-11-30','masculino','912345678','pedro@example.com','Jr. Las Flores 789',NULL,1,NOW(),NOW());

-- --------------------------------------------------------
-- 7. servicios  (catálogo de tratamientos por clínica)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `servicios`;
CREATE TABLE `servicios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `clinica_id` int NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `descripcion` text,
  `duracion_minutos` int DEFAULT 30,
  `precio` decimal(10,2) DEFAULT 0.00,
  `estado` tinyint DEFAULT 1,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `clinica_id` (`clinica_id`),
  CONSTRAINT `servicios_ibfk_1` FOREIGN KEY (`clinica_id`) REFERENCES `clinicas` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `servicios` VALUES
(1,1,'Consulta General','Evaluación odontológica general',30,50.00,1,NOW(),NOW()),
(2,1,'Limpieza Dental','Profilaxis y limpieza completa',45,80.00,1,NOW(),NOW()),
(3,1,'Extracción Simple','Extracción de pieza dental',30,120.00,1,NOW(),NOW()),
(4,1,'Endodoncia','Tratamiento de conducto radicular',90,350.00,1,NOW(),NOW()),
(5,1,'Blanqueamiento','Blanqueamiento dental profesional',60,200.00,1,NOW(),NOW());

-- --------------------------------------------------------
-- 8. citas
-- --------------------------------------------------------
DROP TABLE IF EXISTS `citas`;
CREATE TABLE `citas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `clinica_id` int NOT NULL,
  `sede_id` int NOT NULL,
  `paciente_id` int NOT NULL,
  `doctor_id` int NOT NULL,
  `servicio_id` int DEFAULT NULL,
  `fecha` date NOT NULL,
  `hora_inicio` time NOT NULL,
  `hora_fin` time NOT NULL,
  `estado` enum('pendiente','confirmada','en_atencion','completada','cancelada','no_asistio') DEFAULT 'pendiente',
  `notas` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `clinica_id` (`clinica_id`),
  KEY `sede_id` (`sede_id`),
  KEY `paciente_id` (`paciente_id`),
  KEY `doctor_id` (`doctor_id`),
  KEY `servicio_id` (`servicio_id`),
  CONSTRAINT `citas_ibfk_1` FOREIGN KEY (`clinica_id`) REFERENCES `clinicas` (`id`),
  CONSTRAINT `citas_ibfk_2` FOREIGN KEY (`sede_id`) REFERENCES `sedes` (`id`),
  CONSTRAINT `citas_ibfk_3` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`),
  CONSTRAINT `citas_ibfk_4` FOREIGN KEY (`doctor_id`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `citas_ibfk_5` FOREIGN KEY (`servicio_id`) REFERENCES `servicios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `citas` VALUES
(1,1,1,1,2,'2026-05-10','09:00:00','09:30:00','confirmada','Primera consulta del paciente',NOW(),NOW()),
(2,1,1,2,2,'2026-05-10','10:00:00','10:45:00','pendiente',NULL,NOW(),NOW());

-- --------------------------------------------------------
-- 9. historia_clinica
-- --------------------------------------------------------
DROP TABLE IF EXISTS `historia_clinica`;
CREATE TABLE `historia_clinica` (
  `id` int NOT NULL AUTO_INCREMENT,
  `paciente_id` int NOT NULL,
  `clinica_id` int NOT NULL,
  `alergias` text,
  `enfermedades_base` text,
  `medicamentos_actuales` text,
  `grupo_sanguineo` varchar(5) DEFAULT NULL,
  `observaciones_generales` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `paciente_clinica_unique` (`paciente_id`, `clinica_id`),
  KEY `paciente_id` (`paciente_id`),
  KEY `clinica_id` (`clinica_id`),
  CONSTRAINT `historia_ibfk_1` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`),
  CONSTRAINT `historia_ibfk_2` FOREIGN KEY (`clinica_id`) REFERENCES `clinicas` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 10. historia_clinica_detalle  (cada atención registrada)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `historia_clinica_detalle`;
CREATE TABLE `historia_clinica_detalle` (
  `id` int NOT NULL AUTO_INCREMENT,
  `historia_id` int NOT NULL,
  `sede_id` int NOT NULL,
  `doctor_id` int NOT NULL,
  `cita_id` int DEFAULT NULL,
  `fecha_atencion` date NOT NULL,
  `motivo_consulta` text,
  `diagnostico` text,
  `tratamiento_realizado` text,
  `observaciones` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `historia_id` (`historia_id`),
  KEY `sede_id` (`sede_id`),
  KEY `doctor_id` (`doctor_id`),
  KEY `cita_id` (`cita_id`),
  CONSTRAINT `hcd_ibfk_1` FOREIGN KEY (`historia_id`) REFERENCES `historia_clinica` (`id`),
  CONSTRAINT `hcd_ibfk_2` FOREIGN KEY (`sede_id`) REFERENCES `sedes` (`id`),
  CONSTRAINT `hcd_ibfk_3` FOREIGN KEY (`doctor_id`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `hcd_ibfk_4` FOREIGN KEY (`cita_id`) REFERENCES `citas` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
