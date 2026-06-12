-- Crear tabla de factura si no existe
CREATE TABLE IF NOT EXISTS factura (
    id_factura SERIAL PRIMARY KEY,
    numero_factura VARCHAR(50) UNIQUE NOT NULL,
    id_cliente INTEGER REFERENCES cliente(id_cliente),
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    identificacion VARCHAR(50) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    titulo_aviso TEXT NOT NULL,
    descripcion TEXT NOT NULL,
    categorias JSONB NOT NULL,
    valor DECIMAL(12, 2) NOT NULL,
    fecha_publicacion DATE NOT NULL,
    fecha_recibido DATE NOT NULL,
    estado BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices para mejorar búsquedas
CREATE INDEX IF NOT EXISTS idx_factura_cliente ON factura(id_cliente);
CREATE INDEX IF NOT EXISTS idx_factura_numero ON factura(numero_factura);
CREATE INDEX IF NOT EXISTS idx_factura_identificacion ON factura(identificacion);
CREATE INDEX IF NOT EXISTS idx_factura_estado ON factura(estado);
