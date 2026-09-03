# **Contexto Global y Reglas de Desarrollo (SAPA)** 

**INSTRUCCIÓN PARA LA IA:** Las siguientes reglas son de cumplimiento OBLIGATORIO en cada iteración de código. Si alguna regla entra en conflicto con una petición del usuario, debes consultar antes de proceder. 

## **1. Reglas Generales de Arquitectura** 

- **Separación Estricta:** El proyecto funciona como una API RESTful (Backend) y una SPA (Frontend). NUNCA mezcles lógica de vistas (como Blade) en el backend, excepto para correos electrónicos. 

- **Idioma:** El código (variables, métodos, clases, tablas de base de datos) DEBE estar en **Inglés** . Los comentarios, mensajes de commit, interfaz de usuario (UI) y respuestas de la API (mensajes de error/éxito) DEBEN estar en **Español** . 

- **No "Over-engineering":** Escribe código simple, directo y legible. Evita abstracciones prematuras. Si un controlador puede manejar la lógica limpiamente, no crees capas de repositorios innecesarias. 

## **2. Reglas Estrictas de Backend (Laravel 13 + PHP 8.3)** 

- **Tipado Fuerte en PHP:** Utiliza siempre _type hints_ para parámetros y tipos de retorno en todos los métodos (public function calculateYield(float $input): float). Utiliza _strict_types=1_ si es posible. 

- **FormRequests Obligatorios:** NUNCA valides datos directamente en el controlador. Utiliza siempre clases FormRequest personalizadas. 

- **Cero Lógica en Rutas:** El archivo api.php SOLO debe contener definiciones de rutas llamando a controladores. No uses _closures_ en las rutas. 

- **Transacciones DB:** Cualquier operación que afecte a más de una tabla (ej. Guardar reporte diario + actualizar inventario) DEBE estar envuelta en un DB::transaction(). 

- **Respuestas API Uniformes:** Utiliza un formato estándar para las respuestas JSON (ej. ['success' => boolean, 'data' => array|null, 'message' => string]) o utiliza los API Resources de Laravel de forma consistente. 

## **3. Reglas Estrictas de Frontend (React + TypeScript)** 

- **TypeScript Obligatorio:** NO uses any. Define interfaces o tipos concretos para todos los props, estados y respuestas de la API. 

- **Componentes Funcionales:** Utiliza exclusivamente componentes funcionales y Hooks. No uses componentes de clase. 

- **Estructura de Archivos (Feature-based):** Agrupa los archivos por funcionalidad, no por tipo (ej. src/features/daily-reports/components, src/features/daily-reports/hooks). 

- **Manejo de Formularios:** Utiliza SIEMPRE react-hook-form con validación mediante zod (@hookform/resolvers/zod). 

- **Estilos (Tailwind CSS):** NUNCA escribas CSS personalizado a menos que sea estrictamente necesario. Utiliza exclusivamente clases utilitarias de Tailwind. Evita dependencias de UI pesadas (como Material UI o Bootstrap) que no estén aprobadas; construye la UI con Tailwind puro. 

- **Fetching de Datos:** Utiliza Axios para todas las peticiones HTTP, encapsulado en servicios o hooks personalizados. Maneja siempre los estados de carga (loading) y error (error). 

## **4. Reglas de Base de Datos (PostgreSQL)** 

- **Integridad Referencial:** Todas las relaciones deben tener llaves foráneas (foreign keys) explícitas con acciones en cascada (onDelete('cascade')) o restricción (onDelete('restrict')) según corresponda a la lógica de negocio. 

- **Precisión de Datos:** Usa el tipo decimal (no float) para campos monetarios, cálculos de merma o equivalencias (ej. total_boxes). 

- **Timestamps:** Usa los timestamps() nativos de Laravel (created_at, updated_at) en todas las tablas. 

## **5. Prevención de Alucinaciones** 

- **Dependencias:** NUNCA instales paquetes de npm o composer que no estén especificados en requirements.md o sin pedir permiso explícito al usuario. 

- **Nombres de Entidades:** Usa estrictamente los nombres de tablas y campos definidos en la sección "Modelo de Datos Relacional" del requirements.md. No inventes campos intermedios o tablas pivote a menos que la lógica relacional lo exija ineludiblemente (ej. relaciones muchos a muchos). 

