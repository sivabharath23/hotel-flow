export interface DailyFinancials {
  openingBalance: number;
  totalSales: number;
  cashSales: number;
  upiSales: number;
  cardSales: number;
  bankSales: number;
  totalExpenses: number;
  cashExpenses: number;
  totalInvestments: number;
  cashInvestments: number;
  cashInHand: number;
  profit: number;
  roi: number;
}

export function calculateFinancials({
  openingBalance = 0,
  sales = [],
  expenses = [],
  investments = [],
}: {
  openingBalance: number;
  sales: Array<{ amount: number; paymentMethod: string }>;
  expenses: Array<{ amount: number; paymentMethod: string }>;
  investments?: Array<{ amount: number; paymentMethod: string }>;
}): DailyFinancials {
  const totalSales = sales.reduce((sum, item) => sum + item.amount, 0);
  const cashSales = sales
    .filter((s) => s.paymentMethod === "CASH")
    .reduce((sum, item) => sum + item.amount, 0);
  const upiSales = sales
    .filter((s) => s.paymentMethod === "UPI")
    .reduce((sum, item) => sum + item.amount, 0);
  const cardSales = sales
    .filter((s) => s.paymentMethod === "CARD")
    .reduce((sum, item) => sum + item.amount, 0);
  const bankSales = sales
    .filter((s) => s.paymentMethod === "BANK")
    .reduce((sum, item) => sum + item.amount, 0);

  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
  const cashExpenses = expenses
    .filter((e) => e.paymentMethod === "CASH")
    .reduce((sum, item) => sum + item.amount, 0);

  const totalInvestments = investments.reduce((sum, item) => sum + item.amount, 0);
  const cashInvestments = investments
    .filter((i) => i.paymentMethod === "CASH")
    .reduce((sum, item) => sum + item.amount, 0);

  const cashInHand = openingBalance + cashSales + cashInvestments - cashExpenses;
  const profit = totalSales - totalExpenses;

  let roi = 0;
  if (totalExpenses > 0) {
    roi = Number(((profit / totalExpenses) * 100).toFixed(2));
  } else if (profit > 0) {
    roi = 100;
  }

  return {
    openingBalance,
    totalSales,
    cashSales,
    upiSales,
    cardSales,
    bankSales,
    totalExpenses,
    cashExpenses,
    totalInvestments,
    cashInvestments,
    cashInHand,
    profit,
    roi,
  };
}
