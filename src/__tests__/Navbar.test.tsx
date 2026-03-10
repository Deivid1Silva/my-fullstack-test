import { render, screen } from '@testing-library/react';
import { Navbar } from '@/components/Navbar';
import { authClient } from "@/lib/auth-client";

// Mockeamos el cliente de auth
jest.mock("@/lib/auth-client", () => ({
  authClient: {
    useSession: jest.fn()
  }
}));

describe('Navbar RBAC', () => {
  it('no debe mostrar el link de Usuarios si el rol es USER', () => {
    // Usamos 'as jest.Mock' para evitar errores de tipo
    (authClient.useSession as jest.Mock).mockReturnValue({
      data: { user: { role: 'USER', email: 'test@test.com' } }
    });

    render(<Navbar />);
    expect(screen.queryByText('Usuarios')).not.toBeInTheDocument();
  });

  it('debe mostrar el link de Usuarios si el rol es ADMIN', () => {
    (authClient.useSession as jest.Mock).mockReturnValue({
      data: { user: { role: 'ADMIN', email: 'admin@test.com' } }
    });

    render(<Navbar />);
    expect(screen.getByText('Usuarios')).toBeInTheDocument();
  });
});