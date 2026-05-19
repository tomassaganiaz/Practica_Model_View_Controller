class User {
  constructor(id, nombre, bloqueado = false) {
    this.id = id;
    this.nombre = nombre;
    this.bloqueado = bloqueado;
  }
}
module.exports = User;
