class Loan {
  constructor(id, memberId, bookId, date, active = true) {
    this.id = id;
    this.memberId = memberId;
    this.bookId = bookId;
    this.date = date;
    this.active = active;
  }
}
module.exports = Loan;
