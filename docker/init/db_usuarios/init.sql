-- Usuarios database schema
CREATE TABLE IF NOT EXISTS socios (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  bloqueado BOOLEAN DEFAULT false
);

INSERT INTO socios (nombre, bloqueado) VALUES
('Juan Perez', false);
