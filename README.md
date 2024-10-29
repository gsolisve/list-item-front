# Front List Items

Aplicación web desarrollada en Angular 17, basada en la plantilla MaterialPRO https://www.wrappixel.com/templates/materialpro/ y utilizando Angular Material para la interfaz de usuario.

## 🚀 Tecnologías Utilizadas

- Angular 17.3.x
- Angular Material 17.3.7
- Node.js 20.x
- TypeScript 5.4.5
- RxJS 7.8.1
- Express 4.18.2
- ApexCharts 3.49.0
- STOMP para WebSockets

## 📋 Prerrequisitos

- Node.js 20.x
- NPM 10.x
- Angular CLI 17.3.6

## ⚙️ Instalación

1. **Clonar el repositorio**
   ```bash
   git clone [url-del-repositorio]
   cd front-list-items
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo**
   ```bash
   ng serve
   ```

   La aplicación estará disponible en `http://localhost:4200/`

## 🏗️ Construcción

Para construir el proyecto para producción:
```bash
npm run build
```

El resultado de la construcción se encontrará en el directorio `dist/`.

## 🎨 Diseño y Estilos

### MaterialPRO Template
Este proyecto está basado en la plantilla MaterialPRO, que proporciona:
- Diseño moderno y profesional
- Componentes prediseñados
- Layouts responsivos
- Temas personalizables
- Dashboard y páginas comunes preconfiguradas

### Angular Material
Se utiliza Angular Material como biblioteca principal de componentes UI, ofreciendo:
- Componentes Material Design
- Temas personalizables
- Componentes interactivos
- Diseño responsivo
- Accesibilidad incorporada

## 📊 Características Principales

- Integración con WebSockets usando STOMP
- Gráficos interactivos con ApexCharts
- Selector de colores con ngx-colors
- Soporte para gestos táctiles con HammerJS
- Diseño responsivo
- Optimización para producción

## 🌐 Despliegue

La aplicación está configurada para desplegarse en plataformas que soporten Node.js. Incluye un servidor Express básico para servir la aplicación en producción.

```bash
# Iniciar en producción
npm start
```

## 📁 Estructura del Proyecto

```
front-list-items/
├── src/
│   ├── app/
│   │   ├── components/
│   │   ├── services/
│   │   ├── models/
│   │   └── shared/
│   ├── assets/
│   └── environments/
├── package.json
└── angular.json
```



## 📦 Scripts Disponibles

- `npm start`: Inicia el servidor de producción
- `npm run build`: Construye el proyecto para producción
- `npm test`: Ejecuta los tests unitarios
- `npm run watch`: Construye el proyecto en modo watch
- `ng serve`: Inicia el servidor de desarrollo

## 🔧 Configuración del Entorno

La aplicación requiere las siguientes versiones de Node.js y npm:
```json
"engines": {
  "node": "20.x",
  "npm": "10.x"
}
```

