# 💰 FinanzasApp - Prueba Técnica Fullstack

Este proyecto es una solución integral para la gestión de ingresos y egresos, administración de usuarios y generación de reportes financieros. Desarrollado como parte de la prueba técnica para el rol de Desarrollador Fullstack.

## 🚀 Enlaces del Proyecto
* **URL de Despliegue:** [INSERTAR_AQUÍ_TU_URL_DE_VERCEL]
* **Repositorio:** [https://github.com/Deivid1Silva/my-fullstack-test](https://github.com/Deivid1Silva/my-fullstack-test)

## 🛠️ Stack Tecnológico
* **Frontend:** Next.js 14 (Pages Router), TypeScript, Tailwind CSS.
* **Componentes UI:** Shadcn/UI & Lucide React.
* **Backend:** Next.js API Routes (REST).
* **Base de Datos:** PostgreSQL hospedado en Supabase.
* **ORM:** Prisma.
* **Autenticación:** Better Auth con GitHub/Google provider.
* **Pruebas:** Jest.

## ✨ Funcionalidades Principales

### 🔐 Control de Acceso (RBAC)
* **Rol Administrador:** Acceso total al sistema, incluyendo reportes, gestión de usuarios y creación de movimientos.
* **Rol Usuario:** Acceso restringido únicamente a la visualización de la tabla de movimientos.
* **Registro:** Por requisitos de la prueba, todo nuevo usuario es asignado automáticamente como **ADMIN**.

### 📊 Gestión Financiera
* CRUD completo de ingresos y egresos.
* Visualización de datos con **Recharts**.
* Exportación de reportes en formato **CSV**.

### 👥 Gestión de Usuarios
* Vista administrativa para listar usuarios.
* Formulario para edición de perfiles y cambio de roles.

## ⚙️ Configuración Local

1. **Clonar el repositorio:**
   ```bash
   git clone [https://github.com/Deivid1Silva/my-fullstack-test.git](https://github.com/Deivid1Silva/my-fullstack-test.git)
   cd my-fullstack-test