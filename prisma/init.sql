-- Crear secuencia para IDs de usuarios
CREATE SEQUENCE IF NOT EXISTS user_id_seq START 1;

-- Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(5) PRIMARY KEY DEFAULT 'U' || LPAD(nextval('user_id_seq')::text, 4, '0'),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de analytics
CREATE TABLE IF NOT EXISTS analytics (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(5) REFERENCES users(id),
    page_views INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insertar datos de ejemplo
INSERT INTO users (name, email) VALUES
    ('Juan Pérez', 'juan@example.com'),
    ('María García', 'maria@example.com'),
    ('Carlos López', 'carlos@example.com'),
    ('Ana Martínez', 'ana@example.com'),
    ('Pedro Rodríguez', 'pedro@example.com'),
    ('Laura Gómez', 'laura@example.com'),
    ('Miguel Sánchez', 'miguel@example.com'),
    ('Isabel García', 'isabel@example.com'),
    ('Jorge López', 'jorge@example.com'),
    ('Elena Martínez', 'elena@example.com')
ON CONFLICT (email) DO NOTHING;

-- Insertar datos de analytics de ejemplo
INSERT INTO analytics (user_id, page_views) VALUES
    ('U0001', 10),
    ('U0002', 15),
    ('U0003', 5)
ON CONFLICT DO NOTHING; 