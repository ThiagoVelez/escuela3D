-- =============================================================================
-- SCRIPT DE BASE DE DATOS MYSQL - EduColombia Inmersiva 3D (EduCol 3D)
-- Motor: MySQL 8.0+ / MariaDB 10.5+
-- Fecha: 2026-07-28
-- =============================================================================

CREATE DATABASE IF NOT EXISTS `educol3d_db` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `educol3d_db`;

-- Deshabilitar llaves foráneas temporalmente para reinicio limpio si aplica
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `notificaciones`;
DROP TABLE IF EXISTS `calificaciones`;
DROP TABLE IF EXISTS `entregas_laboratorio`;
DROP TABLE IF EXISTS `inscripciones_materia`;
DROP TABLE IF EXISTS `laboratorios_3d`;
DROP TABLE IF EXISTS `unidades`;
DROP TABLE IF EXISTS `materias`;
DROP TABLE IF EXISTS `usuarios`;
DROP TABLE IF EXISTS `instituciones`;

SET FOREIGN_KEY_CHECKS = 1;

-- -----------------------------------------------------------------------------
-- 1. TABLA: instituciones
-- Almacena las instituciones educativas asociadas al campus virtual.
-- -----------------------------------------------------------------------------
CREATE TABLE `instituciones` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `nombre` VARCHAR(150) NOT NULL,
    `codigo_snies` VARCHAR(20) UNIQUE NOT NULL,
    `departamento` VARCHAR(80) NOT NULL DEFAULT 'Cundinamarca',
    `municipio` VARCHAR(80) NOT NULL DEFAULT 'Bogotá D.C.',
    `logo_url` VARCHAR(500) DEFAULT NULL,
    `sitio_web` VARCHAR(255) DEFAULT NULL,
    `creado_en` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `actualizado_en` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 2. TABLA: usuarios
-- Admins, Rectores, Coordinadores, Docentes y Estudiantes del sistema.
-- -----------------------------------------------------------------------------
CREATE TABLE `usuarios` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `institucion_id` INT NOT NULL,
    `nombre` VARCHAR(80) NOT NULL,
    `apellido` VARCHAR(80) NOT NULL,
    `email` VARCHAR(150) UNIQUE NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `rol` ENUM('RECTOR', 'COORDINADOR', 'ADMINISTRADOR', 'DOCENTE', 'ESTUDIANTE') NOT NULL DEFAULT 'ESTUDIANTE',
    `avatar_url` VARCHAR(500) DEFAULT NULL,
    `banner_url` VARCHAR(500) DEFAULT NULL,
    `grado_nivel` VARCHAR(50) DEFAULT '10° Bachillerato',
    `jornada` ENUM('Mañana', 'Tarde', 'Noche') DEFAULT 'Mañana',
    `activo` TINYINT(1) DEFAULT 1,
    `ultimo_acceso` DATETIME DEFAULT NULL,
    `creado_en` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `actualizado_en` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_usuarios_institucion` 
        FOREIGN KEY (`institucion_id`) REFERENCES `instituciones` (`id`) 
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 3. TABLA: materias
-- Materias o asignaturas disponibles en la plataforma.
-- -----------------------------------------------------------------------------
CREATE TABLE `materias` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `institucion_id` INT NOT NULL,
    `docente_id` INT DEFAULT NULL,
    `codigo` VARCHAR(30) UNIQUE NOT NULL,
    `nombre` VARCHAR(120) NOT NULL,
    `descripcion` TEXT DEFAULT NULL,
    `icono_symbol` VARCHAR(50) DEFAULT 'menu_book',
    `color_hex` VARCHAR(10) DEFAULT '#715c00',
    `nivel_academico` VARCHAR(50) DEFAULT 'Secundaria',
    `creado_en` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_materias_institucion` 
        FOREIGN KEY (`institucion_id`) REFERENCES `instituciones` (`id`) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_materias_docente` 
        FOREIGN KEY (`docente_id`) REFERENCES `usuarios` (`id`) 
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 4. TABLA: unidades
-- Unidades temáticas pertenecientes a una materia.
-- -----------------------------------------------------------------------------
CREATE TABLE `unidades` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `materia_id` INT NOT NULL,
    `numero_unidad` INT NOT NULL,
    `titulo` VARCHAR(150) NOT NULL,
    `descripcion` TEXT DEFAULT NULL,
    `orden` INT DEFAULT 1,
    `creado_en` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_unidades_materia` 
        FOREIGN KEY (`materia_id`) REFERENCES `materias` (`id`) 
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 5. TABLA: laboratorios_3d
-- Escenas inmersivas e interactiva en 3D asociadas a materias/unidades.
-- -----------------------------------------------------------------------------
CREATE TABLE `laboratorios_3d` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `unidad_id` INT NOT NULL,
    `titulo` VARCHAR(150) NOT NULL,
    `descripcion` TEXT DEFAULT NULL,
    `tipo_escena` ENUM('BIOLOGIA_FLORA_ANDINA', 'MATEMATICAS_GEOMETRIA', 'LITERATURA_MACONDO', 'QUIMICA_MOLECULAR') NOT NULL,
    `modelo_glbf_url` VARCHAR(500) DEFAULT NULL,
    `duracion_estimada_min` INT DEFAULT 45,
    `fecha_limite` DATETIME DEFAULT NULL,
    `puntos_experiencia` INT DEFAULT 100,
    `creado_en` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_laboratorios_unidad` 
        FOREIGN KEY (`unidad_id`) REFERENCES `unidades` (`id`) 
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 6. TABLA: inscripciones_materia
-- Relación de estudiantes inscritos a materias con seguimiento de avance.
-- -----------------------------------------------------------------------------
CREATE TABLE `inscripciones_materia` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `estudiante_id` INT NOT NULL,
    `materia_id` INT NOT NULL,
    `porcentaje_progreso` DECIMAL(5,2) DEFAULT 0.00,
    `unidad_actual_id` INT DEFAULT NULL,
    `fecha_inscripcion` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `estado` ENUM('CURSANDO', 'COMPLETADO', 'RETIRADO') DEFAULT 'CURSANDO',
    CONSTRAINT `fk_inscripciones_estudiante` 
        FOREIGN KEY (`estudiante_id`) REFERENCES `usuarios` (`id`) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_inscripciones_materia` 
        FOREIGN KEY (`materia_id`) REFERENCES `materias` (`id`) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_inscripciones_unidad` 
        FOREIGN KEY (`unidad_actual_id`) REFERENCES `unidades` (`id`) 
        ON DELETE SET NULL ON UPDATE CASCADE,
    UNIQUE KEY `uk_estudiante_materia` (`estudiante_id`, `materia_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 7. TABLA: entregas_laboratorio
-- Registro de sesiones e interacciones de estudiantes en laboratorios 3D.
-- -----------------------------------------------------------------------------
CREATE TABLE `entregas_laboratorio` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `laboratorio_id` INT NOT NULL,
    `estudiante_id` INT NOT NULL,
    `estado` ENUM('EN_PROGRESO', 'ENTREGADO', 'CALIFICADO') DEFAULT 'EN_PROGRESO',
    `calificacion` DECIMAL(3,1) DEFAULT NULL, -- Escala colombiana 1.0 a 5.0
    `retroalimentacion_docente` TEXT DEFAULT NULL,
    `datos_simulacion_json` JSON DEFAULT NULL,
    `tiempo_permanencia_seg` INT DEFAULT 0,
    `fecha_entrega` DATETIME DEFAULT NULL,
    `actualizado_en` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_entregas_laboratorio` 
        FOREIGN KEY (`laboratorio_id`) REFERENCES `laboratorios_3d` (`id`) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_entregas_estudiante` 
        FOREIGN KEY (`estudiante_id`) REFERENCES `usuarios` (`id`) 
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 8. TABLA: calificaciones
-- Boletín de notas parciales y definitivas por materia.
-- -----------------------------------------------------------------------------
CREATE TABLE `calificaciones` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `estudiante_id` INT NOT NULL,
    `materia_id` INT NOT NULL,
    `concepto` VARCHAR(150) NOT NULL, -- ej. "Evaluación Unidad 4 - Trigonometría 3D"
    `nota` DECIMAL(3,1) NOT NULL, -- 1.0 - 5.0
    `porcentaje_peso` INT NOT NULL DEFAULT 20, -- Ej. 20%
    `periodo_academico` VARCHAR(20) DEFAULT '2026-1',
    `fecha_registro` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_calificaciones_estudiante` 
        FOREIGN KEY (`estudiante_id`) REFERENCES `usuarios` (`id`) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_calificaciones_materia` 
        FOREIGN KEY (`materia_id`) REFERENCES `materias` (`id`) 
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 9. TABLA: asignaciones
-- Trabajos, talleres y cuestionarios asignados por los docentes.
-- -----------------------------------------------------------------------------
CREATE TABLE `asignaciones` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `materia_id` INT NOT NULL,
    `docente_id` INT NOT NULL,
    `titulo` VARCHAR(150) NOT NULL,
    `descripcion` TEXT DEFAULT NULL,
    `tipo` ENUM('TALLER', 'TRABAJO', 'CUESTIONARIO') DEFAULT 'TALLER',
    `grado_destino` VARCHAR(50) DEFAULT 'Todos',
    `jornada_destino` VARCHAR(50) DEFAULT 'Todas',
    `fecha_limite` DATETIME DEFAULT NULL,
    `puntos` INT DEFAULT 100,
    `creado_en` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_asignaciones_materia` 
        FOREIGN KEY (`materia_id`) REFERENCES `materias` (`id`) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_asignaciones_docente` 
        FOREIGN KEY (`docente_id`) REFERENCES `usuarios` (`id`) 
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 10. TABLA: entregas_asignacion
-- Entregas de los estudiantes para los trabajos/talleres.
-- -----------------------------------------------------------------------------
CREATE TABLE `entregas_asignacion` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `asignacion_id` INT NOT NULL,
    `estudiante_id` INT NOT NULL,
    `contenido_respuesta` TEXT DEFAULT NULL,
    `archivo_url` VARCHAR(500) DEFAULT NULL,
    `estado` ENUM('PENDIENTE', 'ENTREGADO', 'CALIFICADO') DEFAULT 'PENDIENTE',
    `nota` DECIMAL(3,1) DEFAULT NULL,
    `fecha_entrega` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_entregas_asignacion` 
        FOREIGN KEY (`asignacion_id`) REFERENCES `asignaciones` (`id`) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_entregas_asig_estudiante` 
        FOREIGN KEY (`estudiante_id`) REFERENCES `usuarios` (`id`) 
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 11. TABLA: notificaciones
-- Sistema de notificaciones en tiempo real para usuarios.
-- -----------------------------------------------------------------------------
CREATE TABLE `notificaciones` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `usuario_id` INT NOT NULL,
    `titulo` VARCHAR(150) NOT NULL,
    `mensaje` TEXT NOT NULL,
    `tipo` ENUM('ANUNCIO', 'LABORATORIO', 'CALIFICACION', 'SISTEMA') DEFAULT 'ANUNCIO',
    `leida` TINYINT(1) DEFAULT 0,
    `creado_en` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_notificaciones_usuario` 
        FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) 
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- DATOS INICIALES DE PRUEBA (SEED DATA)
-- =============================================================================

INSERT INTO `instituciones` (`id`, `nombre`, `codigo_snies`, `departamento`, `municipio`, `logo_url`) VALUES
(1, 'Institución Educativa Colombian Future', 'SNIES-994821', 'Bogotá D.C.', 'Bogotá D.C.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuALy1tdYIB64Ed_uo1GTsH3xD-NYVfanKwZH1R3WWYS9H5Hx4v3B-f8ZS0-gWgXJH-xL6z1J1fbCq3BWza9pb7b4oluyEz0RAEiBAgUFlNoISwJxJ1L27hsaePuWpJI-QXA8Wuu8Oq5G21DnYv3kfv13-k4SFN4jKAdcvVaGQhF5FUdtebdiKQV39axInnfDe9MUH5DwGHkOfYmwW_h35zeUNsTrUTxnkBfKZ1VAehRUTpnuve2ABwqyA');

INSERT INTO `usuarios` (`id`, `institucion_id`, `nombre`, `apellido`, `email`, `password_hash`, `rol`, `grado_nivel`) VALUES
(1, 1, 'Mateo', 'Gómez', 'estudiante@educol.edu.co', '$2a$12$eImiTXuWVxfM37uY4JANjO9Zl6eS8N8uXWwO04k2Fm0Q0V3G0b1y2', 'ESTUDIANTE', '10° A'),
(2, 1, 'Dra. Valentina', 'Ríos', 'docente@educol.edu.co', '$2a$12$eImiTXuWVxfM37uY4JANjO9Zl6eS8N8uXWwO04k2Fm0Q0V3G0b1y2', 'DOCENTE', 'Docente de Ciencias'),
(3, 1, 'Carlos', 'Administrador', 'admin@educol.edu.co', '$2a$12$eImiTXuWVxfM37uY4JANjO9Zl6eS8N8uXWwO04k2Fm0Q0V3G0b1y2', 'ADMINISTRADOR', 'Coordinador TIC');

INSERT INTO `materias` (`id`, `institucion_id`, `docente_id`, `codigo`, `nombre`, `descripcion`, `icono_symbol`, `color_hex`) VALUES
(1, 1, 2, 'MAT-101', 'Matemáticas 3D', 'Álgebra, Trigonometría espacial y funciones vectoriales en 3D.', 'calculate', '#715c00'),
(2, 1, 2, 'BIO-202', 'Biología 3D', 'Estructura celular de la flora endémica andina y ecosistemas de Colombia.', 'science', '#335ab4'),
(3, 1, 2, 'LIT-303', 'Literatura Colombiana', 'Análisis inmersivo de obras cumbre como Cien Años de Soledad.', 'menu_book', '#c0001f');

INSERT INTO `unidades` (`id`, `materia_id`, `numero_unidad`, `titulo`, `descripcion`, `orden`) VALUES
(1, 1, 4, 'Trigonometría Esférica y Geometría 3D', 'Cálculo de volúmenes y proyecciones espaciales.', 4),
(2, 2, 2, 'Células Vegetales y Flora de los Páramos', 'Exposición interactiva a nivel microscópico de la frailejón andino.', 2),
(3, 3, 3, 'Realismo Mágico y Simbolismo Macondiano', 'Recorrido 3D por la arquitectura e historia de Macondo.', 3);

INSERT INTO `laboratorios_3d` (`id`, `unidad_id`, `titulo`, `descripcion`, `tipo_escena`, `duracion_estimada_min`, `fecha_limite`, `puntos_experiencia`) VALUES
(1, 2, 'Laboratorio 3D: Célula de Frailejón Andino', 'Explora los cloroplastos, pared celular y adaptación al frío en el entorno 3D.', 'BIOLOGIA_FLORA_ANDINA', 45, '2026-07-30 23:59:00', 150),
(2, 1, 'Simulador 3D: Vectores en el Espacio', 'Manipula ejes X, Y, Z y observa transformaciones de cuerpos convexos.', 'MATEMATICAS_GEOMETRIA', 30, '2026-08-05 23:59:00', 100);

INSERT INTO `inscripciones_materia` (`estudiante_id`, `materia_id`, `porcentaje_progreso`, `unidad_actual_id`) VALUES
(1, 1, 65.00, 1),
(1, 2, 80.00, 2),
(1, 3, 40.00, 3);

INSERT INTO `calificaciones` (`estudiante_id`, `materia_id`, `concepto`, `nota`, `porcentaje_peso`) VALUES
(1, 1, 'Taller Vectores 3D', 4.5, 20),
(1, 1, 'Evaluación Parcial 1', 4.8, 30),
(1, 2, 'Informe Lab Célula Vegetal', 5.0, 25),
(1, 3, 'Control de Lectura Capítulos 1-3', 4.2, 15);

INSERT INTO `notificaciones` (`usuario_id`, `titulo`, `mensaje`, `tipo`, `leida`) VALUES
(1, '¡Nuevo Laboratorio Disponible!', 'Se ha habilitado el Lab 3D de Biología: Flora Andina.', 'LABORATORIO', 0),
(1, 'Nota Registrada', 'Tu docente asignó 5.0 en el Informe Lab Célula Vegetal.', 'CALIFICACION', 1);

-- =============================================================================
-- VISTAS RECOMENDADAS PARA EL FRONTEND
-- =============================================================================

CREATE OR REPLACE VIEW `vw_resumen_estudiante` AS
SELECT 
    u.id AS estudiante_id,
    CONCAT(u.nombre, ' ', u.apellido) AS nombre_completo,
    u.email,
    i.nombre AS institucion,
    COUNT(im.materia_id) AS total_materias_inscritas,
    ROUND(AVG(im.porcentaje_progreso), 1) AS promedio_progreso_general,
    ROUND(AVG(c.nota), 2) AS promedio_academico_acumulado
FROM usuarios u
JOIN instituciones i ON u.institucion_id = i.id
LEFT JOIN inscripciones_materia im ON u.id = im.estudiante_id
LEFT JOIN calificaciones c ON u.id = c.estudiante_id
WHERE u.rol = 'ESTUDIANTE'
GROUP BY u.id, u.nombre, u.apellido, u.email, i.nombre;

-- FIN DEL SCRIPT SQL
