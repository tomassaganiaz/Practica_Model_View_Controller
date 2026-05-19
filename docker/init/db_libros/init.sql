-- Libros database schema
CREATE TABLE IF NOT EXISTS libros (
  id SERIAL PRIMARY KEY,
  titulo TEXT NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0
);

INSERT INTO libros (titulo, stock) VALUES
('El Quijote', 5),
('Cien Años de Soledad', 3);
