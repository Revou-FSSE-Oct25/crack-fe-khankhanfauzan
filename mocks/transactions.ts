export type TxStatus = "dibayar" | "pending" | "terlambat" | "dibatalkan";
export type TxItem = {
  id: string;
  method: string;
  dueDate: Date;
  paidDate?: Date;
  amount: number;
  status: TxStatus;
};

export const MOCK_TRANSACTIONS: TxItem[] = [
  { id: "TRX001", method: "Bank Transfer", dueDate: new Date(2026, 2, 1), paidDate: new Date(2026, 1, 28), amount: 1500000, status: "dibayar" },
  { id: "TRX002", method: "Bank Transfer", dueDate: new Date(2026, 3, 1), amount: 1500000, status: "pending" },
  { id: "TRX003", method: "Bank Transfer", dueDate: new Date(2026, 1, 1), amount: 1500000, status: "terlambat" },
  { id: "TRX004", method: "Bank Transfer", dueDate: new Date(2026, 1, 1), amount: 1500000, status: "dibatalkan" },
  { id: "TRX005", method: "Virtual Account", dueDate: new Date(2026, 2, 1), paidDate: new Date(2026, 1, 28), amount: 1600000, status: "dibayar" },
  { id: "TRX006", method: "E-Wallet", dueDate: new Date(2026, 3, 1), amount: 1400000, status: "pending" },
  { id: "TRX007", method: "Bank Transfer", dueDate: new Date(2026, 4, 1), amount: 1500000, status: "pending" },
  { id: "TRX008", method: "E-Wallet", dueDate: new Date(2026, 5, 1), amount: 1500000, status: "dibayar", paidDate: new Date(2026, 4, 30) },
  { id: "TRX009", method: "Virtual Account", dueDate: new Date(2026, 6, 1), amount: 1550000, status: "terlambat" },
  { id: "TRX010", method: "Bank Transfer", dueDate: new Date(2026, 7, 1), amount: 1500000, status: "dibatalkan" },
  { id: "TRX011", method: "E-Wallet", dueDate: new Date(2026, 8, 1), amount: 1500000, status: "dibayar", paidDate: new Date(2026, 7, 30) },
  { id: "TRX012", method: "Virtual Account", dueDate: new Date(2026, 9, 1), amount: 1500000, status: "dibayar", paidDate: new Date(2026, 8, 28) },
  { id: "TRX013", method: "Bank Transfer", dueDate: new Date(2026, 10, 1), amount: 1500000, status: "pending" },
  { id: "TRX014", method: "E-Wallet", dueDate: new Date(2026, 11, 1), amount: 1500000, status: "terlambat" },
  { id: "TRX015", method: "Virtual Account", dueDate: new Date(2027, 0, 1), amount: 1500000, status: "dibayar", paidDate: new Date(2026, 11, 30) },
  { id: "TRX016", method: "Bank Transfer", dueDate: new Date(2027, 1, 1), amount: 1500000, status: "pending" },
  { id: "TRX017", method: "E-Wallet", dueDate: new Date(2027, 2, 1), amount: 1500000, status: "dibayar", paidDate: new Date(2027, 1, 28) },
  { id: "TRX018", method: "Virtual Account", dueDate: new Date(2027, 3, 1), amount: 1500000, status: "dibatalkan" },
  { id: "TRX019", method: "Bank Transfer", dueDate: new Date(2027, 4, 1), amount: 1500000, status: "terlambat" },
  { id: "TRX020", method: "E-Wallet", dueDate: new Date(2027, 5, 1), amount: 1500000, status: "pending" },
];
