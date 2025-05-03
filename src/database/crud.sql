CREATE DATABASE IF NOT EXISTS crud;
USE crud;

-- Crear tabla personas
CREATE TABLE IF NOT EXISTS personas (
	id_persona INT AUTO_INCREMENT PRIMARY KEY,  -- identificador unico autoincremental
	nombre VARCHAR(100),						-- Cadena para el nombre
	apellido VARCHAR(100),						-- Cadena para el apellido
    tipo_identificacion VARCHAR(50),			-- Tipo de documento: CC, TI, CE, etc.
    nuip INT,									-- Numero unico de identificacion (ej: cedula)	
    email VARCHAR(100),							-- Correo electronico del usuario
    clave VARCHAR(500),							-- Contraseña encriptada
    salario DECIMAL(10,2),						-- Valor numerico decimal para el salario
    activo BOOLEAN DEFAULT TRUE,				-- Valor booleano 1 (activo), 0 (inactivo)
    fecha_registro DATE DEFAULT (CURRENT_DATE),	-- Fecha en la que se registra la persona 
    imagen LONGBLOB								-- Imagen en binario (para subir una foto)
);

-- Crear tabla productos

CREATE TABLE IF NOT EXISTS productos (
	id_productos INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    precio DECIMAL(10,2),
    descripcion VARCHAR(100)
);

-- Ver los registros actuales de la tabla personas
	
SELECT * FROM personas; 
SELECT * FROM productos;

drop database crud;

show databases;

INSERT INTO personas (nombre, apellido, tipo_identificacion, nuip, email, clave, salario, activo)
VALUES ('Test', 'User', 'CC', 123456, 'test@test.com', 'password', 1000.50, 1);
