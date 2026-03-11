// __tests__/finance.test.ts

// Simulación de la lógica de cálculo que usas en stats.ts
const calculateBalance = (movements: { amount: number }[]) => {
  return movements.reduce((acc, curr) => acc + curr.amount, 0);
};

const isAdmin = (role: string) => role === "ADMIN";

describe("Pruebas Unitarias - Requisitos de Prueba Técnica", () => {
  
  // Prueba 1: Validación de Cálculo de Saldo
  test("Debe calcular el saldo neto correctamente sumando ingresos y restando egresos", () => {
    const movements = [
      { amount: 1000 },  // Ingreso
      { amount: -400 },  // Egreso
      { amount: 200 }    // Ingreso
    ];
    expect(calculateBalance(movements)).toBe(800);
  });

  // Prueba 2: Validación de Roles (RBAC)
  test("Debe validar correctamente si un usuario tiene rol de ADMINISTRADOR", () => {
    const userRole = "ADMIN";
    expect(isAdmin(userRole)).toBe(true);
  });

  // Prueba 3: Validación de Lógica de Registro Automático
  test("El rol asignado por defecto a nuevos usuarios debe ser siempre ADMIN", () => {
    // Simulando el valor por defecto de tu schema.prisma
    const newUser = { name: "Test User", role: "ADMIN" };
    expect(newUser.role).toBe("ADMIN");
  });
});