# Tabla de Usuarios

Aplicación web moderna para la gestión de usuarios, construida con Next.js, TypeScript y PostgreSQL.

## 🚀 Características

- Gestión completa de usuarios (CRUD)
- Interfaz moderna y responsiva con Tailwind CSS
- Validación de formularios con Zod
- Estado global con React Query
- Base de datos PostgreSQL
- Docker para desarrollo y producción
- Despliegue optimizado para Google Cloud Platform

## 🛠️ Tecnologías

- **Frontend:**
  - Next.js 14
  - TypeScript
  - Tailwind CSS
  - React Query
  - Zod
  - React Hook Form

- **Backend:**
  - Next.js API Routes
  - PostgreSQL
  - Prisma ORM

- **DevOps:**
  - Docker
  - Docker Compose
  - Google Cloud Platform

## 📋 Prerrequisitos

- Node.js 18 o superior
- Docker y Docker Compose
- PostgreSQL (si se ejecuta localmente)
- Cuenta en Google Cloud Platform (para despliegue)

## 🔧 Instalación

1. Clonar el repositorio:
```bash
git clone [URL_DEL_REPOSITORIO]
cd user-table
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env.local
```
Editar `.env.local` con tus configuraciones.

4. Iniciar con Docker:
```bash
docker-compose up -d
```

## 🚀 Desarrollo

1. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

2. Construir para producción:
```bash
npm run build
```

3. Ejecutar tests:
```bash
npm test
```

## 📦 Estructura del Proyecto

```
src/
├── app/              # Rutas y páginas de Next.js
├── components/       # Componentes React reutilizables
├── services/         # Servicios y lógica de negocio
├── types/           # Definiciones de TypeScript
├── schemas/         # Esquemas de validación Zod
└── utils/           # Utilidades y helpers
```

## 🐳 Docker

### Desarrollo
```bash
docker-compose up -d
```

### Producción
```bash
docker build -t user-table .
docker run -p 3000:3000 user-table
```



## 📝 API Endpoints

- `GET /api/users` - Obtener todos los usuarios
- `GET /api/users/:id` - Obtener usuario por ID
- `POST /api/users` - Crear nuevo usuario
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario
- `GET /api/analytics` - Obtener estadísticas de usuarios

## 🔐 Variables de Entorno

```env
DATABASE_URL=postgresql://user:password@localhost:5422/users_db
NODE_ENV=development
```

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 👥 Autores

- fasuttoxDev -
