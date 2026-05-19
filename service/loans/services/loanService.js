const loanDao = require('../dao/loanDao');
const bookDao = require('../dao/bookDao');
const memberDao = require('../dao/memberDao');

// Business rules for loan creation and returns live here.
// This service coordinates the validation of member state, book stock, and loan counts.
exports.createLoan = async (memberId, bookId) => {
  const member = await memberDao.findById(memberId);
  if (!member) throw new Error("Member not found");
  if (member.bloqueado) throw new Error("Blocked member cannot request loans");

  const activeLoans = await loanDao.countActiveByMember(memberId);
  if (activeLoans >= 3) throw new Error("Maximum of 3 active loans allowed");

  const book = await bookDao.findById(bookId);
  if (!book) throw new Error("Book not found");
  if (book.stock <= 0) throw new Error("No available copies");

  // Decrement stock immediately before creating the loan to avoid overselling.
  await bookDao.updateStock(bookId, book.stock - 1);
  return await loanDao.create({ memberId, bookId, date: new Date() });
};

exports.returnLoan = async (loanId) => {
  const loan = await loanDao.findById(loanId);
  if (!loan || !loan.active) throw new Error("Loan not found or already returned");

  await loanDao.updateStatus(loanId, false);
  const book = await bookDao.findById(loan.book_id);
  if (book) {
    await bookDao.updateStock(book.id, book.stock + 1);
  }

  return { message: "Book returned successfully" };
};

exports.findAll = async () => {
  return await loanDao.findAll();
};
