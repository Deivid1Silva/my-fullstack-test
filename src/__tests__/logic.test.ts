import { describe, test, expect } from '@jest/globals';

const calculateBalance = (movements: { amount: number }[]) => {
  return movements.reduce((acc, curr) => acc + curr.amount, 0);
};

describe('Cálculos Financieros', () => {
  test('debe calcular el saldo actual correctamente con ingresos y egresos', () => {
    const movements = [
      { amount: 1000 },  // Ingreso
      { amount: -200 },  // Egreso
      { amount: 500 },   // Ingreso
      { amount: -100 }   // Egreso
    ];
    
    const balance = calculateBalance(movements);
    expect(balance).toBe(1200);
  });
});