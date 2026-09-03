# **Arquitectura del Sistema: SAPA (Sistema Administrativo Pozo Azul)** 

#### **PROPÓSITO DE ESTE DOCUMENTO:** 

Este archivo define las decisiones técnicas de alto nivel, la estructura de directorios y los patrones de diseño obligatorios. Antigravity (o cualquier agente de IA) debe acatar estas directrices estructurales de forma inquebrantable. 

## **1. Topología del Sistema (Monorepo Lógico)** 

El proyecto operará bajo una arquitectura de cliente-servidor estrictamente separada, pero mantenida en el mismo repositorio raíz para facilitar el desarrollo local y el despliegue. 

- **Backend:** API RESTful (Laravel 13). Actúa como el único punto de entrada a la base de datos PostgreSQL. 

- **Frontend:** Single Page Application (SPA) en React (Vite). Actúa como un cliente de la API. No tiene estado persistente propio más allá del almacenamiento local temporal (tokens). 

### **1.1 Estructura de Directorios Raíz** 

La raíz del proyecto DEBE tener exactamente esta separación de responsabilidades: 

/sapa-root ├── /backend        <-- Proyecto Laravel 13 (API) │ ├── app/ │ ├── routes/    <-- (Solo api.php, web.php no se usa para vistas) └── │ ... ├── /frontend       <-- Proyecto React + TypeScript (Vite) │ ├── src/ │ ├── package.json └── │ ... ├── requirements.md <-- Contexto de Negocio ├── plan.md         <-- Hoja de Ruta ├── rules.md        <-- Restricciones de IA └── architecture.md <-- (Este documento) 

## **2. Decisiones de Arquitectura: Backend (Laravel)** 

### **2.1 Patrón MVC Modificado (API First)** 

- **Modelos (M):** Los modelos Eloquent son la única vía para interactuar con la DB. Contendrán relaciones (belongsTo, hasMany) pero NO lógica de negocio compleja. 

- **Vistas (V):** INEXISTENTES. Laravel no servirá vistas Blade (excepto para correos electrónicos en el futuro). Toda respuesta debe ser JSON puro (usando JsonResponse o API Resources). 

- **Controladores (C):** Deben ser delgados (Skinny Controllers). Se encargarán de recibir la petición HTTP, llamar a FormRequests para validación, y delegar la lógica compleja a Servicios. 

### **2.2 Capa de Servicios (Service Layer)** 

Toda lógica de negocio que involucre cálculos matemáticos (mermas) o transacciones sobre múltiples tablas (Guardar reporte diario) DEBE extraerse a clases de servicio en app/Services/. 

- _Ejemplo:_ app/Services/DailyReportService.php o app/Services/InventoryService.php. 

### **2.3 Manejo de Errores y Excepciones** 

La API debe seguir un formato predecible para que el Frontend (Axios) lo maneje globalmente. 

- **Éxito (200/201):** {"status": "success", "data": {...}} 

- **Error de Validación (422):** Formato estándar de Laravel (interceptado por Axios). 

- **Error de Negocio (400/409):** {"status": "error", "message": "Galpón en vacío sanitario"} 

## **3. Decisiones de Arquitectura: Frontend (React)** 

### **3.1 Estructura Feature-Based (Vertical Slicing)** 

En lugar de agrupar por tipo (todos los componentes juntos, todos los hooks juntos), la estructura de /src agrupará por funcionalidad (Features). Esto es obligatorio. 

#### /frontend/src/ 

├── /assets         <-- Imágenes, iconos ├── /components     <-- Componentes UI compartidos (Botones, Inputs base) ├── /config         <-- Configuración global (ej. instancia Axios) ├── /features       <-- Lógica aglutinada por módulo │ ├── /daily-reports │ │ ├── components/ │ │ ├── hooks/ └── │ │ types.ts │ ├── /inventory │ └── /auth ├── /layouts        <-- Contenedores estructurales (Sidebar, Header) ├── └── /routes         <-- Definición de React Router /types          <-- Tipos globales de TypeScript compartidos 

### **3.2 Gestión del Estado Local vs Global** 

- **Estado de Formularios:** Se gestionará EXCLUSIVAMENTE con react-hook-form. El estado local de los inputs no debe almacenarse en variables useState separadas si pertenecen al reporte. 

- **Estado Global:** Para los datos del usuario autenticado (Token JWT, Rol, Nombre) se utilizará React Context. NO usar Redux (evitar over-engineering). 

### **3.3 Comunicación API (Axios Interceptors)** 

Toda petición hacia el backend debe pasar por una instancia preconfigurada de Axios (/src/config/axios.ts). 

- **Request Interceptor:** Debe adjuntar el Token Bearer de Sanctum automáticamente a cada petición. 

- **Response Interceptor:** Debe capturar errores globales (ej. 401 Unauthorized para redirigir al Login). 

## **4. Flujo de Datos del Sistema (El "Viaje" del Reporte)** 

1. **UI (React):** El Operativo llena el DailyReportForm.tsx. 

2. **Validación Cliente (Zod):** Zod verifica que no haya letras en mortality antes de enviar la 

petición. 

3. **Transporte:** Axios hace un POST a /api/daily-reports con el Payload JSON. 

4. **Validación Servidor (Laravel):** StoreDailyReportRequest revalida los datos (Cero confianza en el cliente). 

5. **Procesamiento (Service):** DailyReportService inicia un DB::transaction(). Guarda el reporte, calcula el nuevo inventario de aves, debita los sacos de alimento y cierra la transacción. 

6. **Respuesta:** Laravel envía un HTTP 201. React muestra notificación de éxito y resetea el 

formulario. 

