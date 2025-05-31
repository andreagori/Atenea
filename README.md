# 🏛️ Atenea - Plataforma de Aprendizaje Personalizada

<div align="center">
<img src="./FrontEnd/public/AteneaIcon.svg" alt="Atenea Logo" width="40"/>
  Una plataforma de aprendizaje adaptativa que emplea diferentes métodos de estudio para ofrecer una experiencia educativa única y personalizada.
</div>

## 📖 Descripción

Atenea es una aplicación web fullstack diseñada para ayudar a los estudiantes a alcanzar su máximo potencial mediante un enfoque adaptativo y centrado en el usuario. La plataforma ofrece múltiples métodos de estudio, análisis de rendimiento y herramientas personalizadas para optimizar el aprendizaje.

### ✨ Características Principales

- 🃏 **Sistema de Tarjetas de Estudio**: Soporte para múltiples tipos de tarjetas (Active Recall, Cornell, Visual)
- ⏱️ **Método Pomodoro**: Sesiones de estudio con intervalos de trabajo y descanso
- 📝 **Tests Simulados**: Evaluaciones cronometradas con retroalimentación inmediata
- 🔄 **Repetición Espaciada**: Sistema inteligente de revisión basado en curvas de olvido
- 📊 **Analytics Avanzados**: Gráficos interactivos para monitorear progreso y rendimiento
- 👤 **Perfil de Usuario**: Estadísticas personalizadas y seguimiento de metas
- 🎨 **Interfaz Intuitiva**: Diseño moderno y responsivo con experiencia de usuario optimizada

## 🛠️ Tecnologías Utilizadas

### Backend
- **Framework**: NestJS (Node.js)
- **Base de Datos**: PostgreSQL
- **ORM**: Prisma
- **Autenticación**: JWT (JSON Web Tokens)
- **Validación**: Class Validator
- **Documentación**: Swagger/OpenAPI
- **Logging**: Winston Logger
- **Testing**: Jest

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Routing**: React Router DOM
- **State Management**: React Hooks
- **Icons**: Lucide React

### DevOps & Deployment
- **Containerización**: Docker
- **Base de Datos**: PostgreSQL (Render)
- **Backend**: Render
- **Frontend**: Vercel
- **Control de Versiones**: Git

## 🏗️ Arquitectura del Proyecto

```
Atenea_AW/
├── BackEnd/                 # API REST con NestJS
│   ├── src/
│   │   ├── auth/           # Autenticación y autorización
│   │   ├── analytics/      # Servicios de análisis y métricas
│   │   ├── cards/          # Gestión de tarjetas de estudio
│   │   ├── deck/           # Gestión de mazos de cartas
│   │   ├── study-sessions/ # Lógica de sesiones de estudio
│   │   ├── user-stats/     # Estadísticas de usuario
│   │   └── prisma/         # Configuración de base de datos
│   ├── prisma/
│   │   ├── schema.prisma   # Esquema de base de datos
│   │   └── migrations/     # Migraciones de BD
│   └── Dockerfile
├── FrontEnd/               # Aplicación React
│   ├── src/
│   │   ├── components/     # Componentes reutilizables
│   │   ├── pages/          # Páginas principales
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # Servicios API
│   │   └── types/          # Definiciones TypeScript
│   └── Dockerfile
└── docker-compose.yml      # Configuración multi-container
```

## 🚀 Configuración y Instalación

### Prerrequisitos

- Node.js 20+
- npm o yarn
- PostgreSQL (local o remoto)
- Docker (opcional)

### 🔧 Configuración del Backend

1. **Navegar al directorio del backend**
   ```bash
   cd BackEnd
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   
   Crear un archivo `.env` en la raíz del directorio BackEnd:
   ```env
   # Base de datos
   DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/atenea_db"
   
   # JWT
   JWT_SECRET="tu_jwt_secret_super_seguro"
   
   # Cloudinary (para imágenes)
   CLOUDINARY_CLOUD_NAME="tu_cloud_name"
   CLOUDINARY_API_KEY="tu_api_key"
   CLOUDINARY_API_SECRET="tu_api_secret"
   
   # Entorno
   NODE_ENV="development"
   PORT=3000
   ```

4. **Configurar la base de datos**
   ```bash
   # Generar cliente Prisma
   npx prisma generate
   
   # Ejecutar migraciones
   npx prisma migrate deploy
   
   # (Opcional) Semilla de datos
   npx prisma db seed
   ```

5. **Iniciar el servidor de desarrollo**
   ```bash
   npm run start:dev
   ```

   El backend estará disponible en `http://localhost:3000`

### 🎨 Configuración del Frontend

1. **Navegar al directorio del frontend**
   ```bash
   cd FrontEnd
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   
   Crear un archivo `.env` en la raíz del directorio FrontEnd:
   ```env
   VITE_API_URL="http://localhost:3000"
   ```

4. **Iniciar el servidor de desarrollo**
   ```bash
   npm run dev
   ```

   El frontend estará disponible en `http://localhost:5173`

### 🐳 Configuración con Docker

1. **Construir y ejecutar con Docker Compose**
   ```bash
   docker-compose up --build
   ```

   Esto iniciará:
   - Backend en `http://localhost:3000`
   - Frontend en `http://localhost:5173`
   - PostgreSQL en `localhost:5432`

## 📚 Scripts Disponibles

### Backend
```bash
npm run start          # Iniciar en producción
npm run start:dev      # Modo desarrollo con watch
npm run start:debug    # Modo debug
npm run build          # Compilar para producción
npm run test           # Ejecutar tests
npm run test:watch     # Tests en modo watch
npm run test:cov       # Tests con cobertura
```

### Frontend
```bash
npm run dev            # Servidor de desarrollo
npm run build          # Compilar para producción
npm run preview        # Vista previa de build
npm run lint           # Ejecutar ESLint
npm run type-check     # Verificar tipos TypeScript
```

## 🔍 API Documentation

Una vez que el backend esté ejecutándose, puedes acceder a la documentación interactiva de la API en:

- **Swagger UI**: `http://localhost:3000/api`

## 📊 Características Detalladas

### Métodos de Estudio

1. **Pomodoro**: 
   - Configuración personalizable de tiempo de estudio y descanso
   - Seguimiento automático de ciclos
   - Estadísticas de productividad

2. **Tests Simulados**:
   - Preguntas aleatorias de mazos seleccionados
   - Límite de tiempo configurable
   - Evaluación automática y retroalimentación

3. **Repetición Espaciada**:
   - Algoritmo adaptativo basado en dificultad
   - Intervalos de revisión inteligentes
   - Optimización de retención a largo plazo

### Analytics y Métricas

- **Tiempo de estudio diario**: Gráfico de líneas con tendencias
- **Puntuaciones en tests**: Análisis de rendimiento por evaluación
- **Distribución de métodos**: Pie charts de uso de métodos
- **Calendario de actividad**: Heatmap de actividad de estudio
- **Eficiencia por método**: Scatter plots de rendimiento
- **Progreso por mazo**: Análisis detallado por conjunto de cartas

## 🔐 Autenticación y Seguridad

- Autenticación basada en JWT
- Passwords hasheados con bcrypt
- Middleware de validación en todas las rutas protegidas
- Sanitización de datos de entrada
- Configuración CORS para producción

## 🌐 Deployment

### Backend (Render)
1. Conectar repositorio a Render
2. Configurar variables de entorno
3. El deploy se realiza automáticamente con `render.yaml`

### Frontend (Vercel)
1. Conectar repositorio a Vercel
2. Configurar variables de entorno
3. Deploy automático en cada push a main

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para la feature (`git checkout -b feature/AmazingFeature`)
3. Commit los cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 👩‍💻 Autor

**Andrea** - Creadora de Atenea

---

<div align="center">
  Desarrollado con ❤️ para revolucionar la experiencia de aprendizaje
</div>