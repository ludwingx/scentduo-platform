# 🌹 ScentDuo - Perfumería Premium

<div align="center">
  <h3>E-commerce de Perfumes con Panel Administrativo</h3>
  <p>Next.js 16 • Prisma • PostgreSQL • NextAuth • Tailwind CSS</p>
</div>

---

## ✨ Características

### 🛍️ Tienda Pública

- ✅ Catálogo de perfumes elegante (tema negro y dorado)
- ✅ Detalle de productos con imágenes
- ✅ Carrito de compras persistente (Zustand)
- ✅ Checkout directo por WhatsApp
- ✅ Sistema de pago con QR
- ✅ Formulario para envío de comprobantes

### 🔐 Panel Administrativo

- ✅ Login seguro con NextAuth v5
- ✅ Dashboard con estadísticas
- ✅ CRUD completo de productos
- ✅ Gestión de comprobantes de pago
- ✅ Upload de imágenes con UploadThing

---

## 🚀 Tech Stack

| Categoría         | Tecnología                 |
| ----------------- | -------------------------- |
| **Framework**     | Next.js 16 (App Router)    |
| **Lenguaje**      | TypeScript                 |
| **Base de Datos** | PostgreSQL + Prisma ORM    |
| **Autenticación** | NextAuth v5                |
| **UI**            | Tailwind CSS 4 + Shadcn/UI |
| **State**         | Zustand (Carrito)          |
| **Upload**        | UploadThing                |
| **Validación**    | Zod + React Hook Form      |
| **Deploy**        | Vercel + Neon/Supabase     |

---

## 📦 Instalación

### Prerrequisitos

- Node.js 18+
- PostgreSQL (local o cloud)
- Cuenta en [UploadThing](https://uploadthing.com)

### 1. Clonar el Proyecto

\`\`\`bash
git clone <repo-url>
cd scent-duo
\`\`\`

### 2. Instalar Dependencias

\`\`\`bash
npm install
\`\`\`

### 3. Configurar Variables de Entorno

Copia \`.env.example\` a \`.env\` y completa:

\`\`\`env
DATABASE_URL="postgresql://..."
AUTH_SECRET="<generar-con-openssl>"
AUTH_URL="http://localhost:3000"
UPLOADTHING_TOKEN="<tu-token>"
\`\`\`

**Generar AUTH_SECRET:**
\`\`\`bash
openssl rand -base64 32
\`\`\`

### 4. Configurar Base de Datos

\`\`\`bash
npx prisma generate
npx prisma migrate dev --name init
\`\`\`

### 5. Crear Usuario Admin

\`\`\`bash
npx prisma studio
\`\`\`
Agregar un registro en la tabla \`User\`:

- email: \`admin@scentduo.com\`
- password: \`admin123\` (cambiar en producción)
- role: \`ADMIN\`

### 6. Iniciar Desarrollo

\`\`\`bash
npm run dev
\`\`\`

Abre [http://localhost:3000](http://localhost:3000)

---

## 📁 Estructura del Proyecto

\`\`\`
scent-duo/
├── app/
│ ├── (public)/ # Rutas públicas
│ │ ├── page.tsx # Home
│ │ ├── catalogo/ # Catálogo
│ │ ├── producto/[id]/ # Detalle
│ │ ├── pago-qr/ # QR
│ │ └── enviar-comprobante/
│ ├── panel-admin/
│ │ ├── page.tsx # Login
│ │ └── (protected)/ # Admin protegido
│ │ ├── dashboard/
│ │ ├── productos/
│ │ └── comprobantes/
│ ├── actions/ # Server Actions
│ └── api/ # API Routes
├── components/
│ ├── cart/
│ ├── layout/
│ ├── product/
│ └── ui/ # Shadcn
├── lib/
│ └── store/ # Zustand
├── prisma/
│ └── schema.prisma
└── auth.ts # NextAuth config
\`\`\`

---

## 🎨 Diseño

### Tema

- **Colores**: Negro (#0A0A0A) + Dorado (#D4AF37)
- **Tipografía**: Geist Sans
- **Estilo**: Premium, elegante, moderno

### Características de UI

- Dark mode por defecto
- Animaciones sutiles
- Componentes glassmorphism
- Responsive design
- Micro-interacciones

---

## 🔧 Scripts Disponibles

\`\`\`bash
npm run dev # Desarrollo
npm run build # Build producción
npm run start # Iniciar producción
npm run lint # Linter
npx prisma studio # Abrir Prisma Studio
npx prisma migrate # Crear migración
\`\`\`

---

## 🌐 Deployment

### Vercel (Recomendado)

1. **Push a GitHub**
   \`\`\`bash
   git add .
   git commit -m "Ready for deployment"
   git push
   \`\`\`

2. **Conectar en Vercel**

   - Ir a [vercel.com](https://vercel.com)
   - Import repository
   - Configurar variables de entorno

3. **Base de Datos**

   - Usar [Neon](https://neon.tech) o [Supabase](https://supabase.com)
   - Copiar \`DATABASE_URL\`

4. **Migrar DB**
   \`\`\`bash
   npx prisma migrate deploy
   \`\`\`

5. **Deploy** 🚀

---

## 📚 Documentación

- 📖 [Documentación Técnica](./DOCUMENTACION_TECNICA.md)
- 👤 [Guía del Administrador](./GUIA_ADMINISTRADOR.md)

---

## 🛡️ Seguridad

- ✅ NextAuth v5 para autenticación
- ✅ Server Actions con validación Zod
- ✅ Rutas protegidas con middleware
- ⚠️ **IMPORTANTE**: Hashear contraseñas en producción (bcrypt)

---

## 🤝 Contribuir

Pull requests son bienvenidos. Para cambios mayores, abre un issue primero.

---

## 📄 Licencia

[MIT](LICENSE)

---

## 📞 Contacto

**ScentDuo**  
📧 Email: info@scentduo.com  
📱 WhatsApp: +591 XXXXXXXX

---

<div align="center">
  <p>Hecho con ❤️ usando Next.js 16</p>
</div>
