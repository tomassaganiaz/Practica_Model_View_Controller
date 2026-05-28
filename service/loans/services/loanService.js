const loanDao = require('../dao/loanDao');
const booksClient = require('../clients/booksClient');
const usersClient = require('../clients/usersClient');

// Aquí se encuentran las reglas de negocio para la creación y devolución de préstamos.
// Este servicio coordina la validación del estado miembro, el inventario contable y el número de préstamos.
// La comunicación con otros microservicios se realiza mediante clientes HTTP.
exports.createLoan = async (memberId, bookId) => {
  // Obtener información del miembro desde el microservicio de usuarios
  const member = await usersClient.getUserById(memberId);
  if (!member) throw new Error("Member not found");
  if (member.bloqueado) throw new Error("Blocked member cannot request loans");

  const activeLoans = await loanDao.countActiveByMember(memberId);
  if (activeLoans >= 3) throw new Error("Maximum of 3 active loans allowed");

  // Obtener información del libro desde el microservicio de libros
  const book = await booksClient.getBookById(bookId);
  if (!book) throw new Error("Book not found");
  if (book.stock <= 0) throw new Error("No available copies");
  
  // Disminuya el stock inmediatamente antes de crear el préstamo para evitar la sobreventa.
  await booksClient.updateBookStock(bookId, book.stock - 1);
  return await loanDao.create({ memberId, bookId, date: new Date() });
};

exports.returnLoan = async (loanId) => {
  const loan = await loanDao.findById(loanId);
  if (!loan || !loan.active) throw new Error("Loan not found or already returned");

  await loanDao.updateStatus(loanId, false);
  
  // Obtener información del libro desde el microservicio de libros
  const book = await booksClient.getBookById(loan.book_id);
  if (book) {
    await booksClient.updateBookStock(book.id, book.stock + 1);
  }

  return { message: "Book returned successfully" };
};

exports.findAll = async () => {
  return await loanDao.findAll();
};

exports.getLoansByMember = async (memberId) => {
  // Verificar que el miembro existe
  await usersClient.getUserById(memberId);
  return await loanDao.findByMemberId(memberId);
};
