# Tabla de Usuarios - Next.js Application

Aplicación web moderna construida con Next.js, TypeScript y PostgreSQL para la gestión de usuarios.

## 🚀 Características

- Interfaz de usuario moderna con Tailwind CSS
- API RESTful para gestión de usuarios
- Base de datos PostgreSQL
- Contenedores Docker para desarrollo y producción
- Pruebas unitarias con Jest
- Endpoints de salud y monitoreo

## 📋 Prerrequisitos

- Node.js 18.x o superior
- Docker y Docker Compose
- PostgreSQL (si se ejecuta localmente sin Docker)

## 🛠️ Instalación

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

## 🚀 Ejecución

### Desarrollo Local

1. Iniciar la aplicación con Docker Compose:
```bash
docker-compose up
```

2. O ejecutar sin Docker:
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### Pruebas

Ejecutar las pruebas unitarias:
```bash
npm test
```

Ejecutar las pruebas con cobertura:
```bash
npm run test:coverage
```

## 📁 Estructura del Proyecto

```
├── src/
│   ├── app/              # Rutas y páginas de Next.js
│   ├── components/       # Componentes React reutilizables
│   ├── services/         # Servicios y lógica de negocio
│   └── types/           # Definiciones de tipos TypeScript
├── prisma/              # Configuración y migraciones de la base de datos
├── public/              # Archivos estáticos
└── tests/              # Pruebas unitarias
```

## 🔧 Tecnologías Principales

- Next.js 14
- TypeScript
- PostgreSQL
- Prisma ORM
- Tailwind CSS
- Jest
- Docker

## 📝 API Endpoints

- `GET /api/health` - Verificación de estado del sistema
- `GET /api/users` - Listar usuarios
- `POST /api/users` - Crear usuario
- `GET /api/users/:id` - Obtener usuario específico
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario
- `GET /api/analytics` - Obtener estadísticas de usuarios

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para más detalles.
