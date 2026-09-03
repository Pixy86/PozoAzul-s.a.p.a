# **Plan de Ejecución para Agente IA (Prompts SDD)** 

#### **INSTRUCCIONES PARA EL DESARROLLADOR/USUARIO:** 

Copia y pega cada bloque de texto que está dentro de las comillas (">") directamente en el chat de tu IA (Cursor, Copilot, Antigravity). NO saltes tareas. Espera a que la IA confirme la finalización de una tarea antes de enviar la siguiente. 

## **FASE 1: Inicialización Estricta** 

### **Task 1.1: Setup de Backend Laravel (API)** 

"Actúa como desarrollador Backend Senior. Basándote ESTRICTAMENTE en requirements.md y rules.md: 

1. Inicializa un proyecto Laravel 13 estructurado solo para API en /backend. 

2. Configura el .env para usar PostgreSQL. 

3. Instala y configura Laravel Sanctum. 

4. Asegúrate de que el middleware de API devuelva siempre application/json." 

### **Task 1.2: Setup de Frontend React (Vite)** 

"Actúa como desarrollador Frontend Senior. Basándote en requirements.md y architecture.md: 

1. En una carpeta raíz paralela llamada /frontend, inicializa un proyecto React con TypeScript y Vite. 

2. Instala: tailwindcss, postcss, autoprefixer, axios, react-router-dom, reacthook-form, zod, @hookform/resolvers. 

3. Inicializa la configuración de Tailwind CSS. 

4. Limpia App.tsx dejándolo vacío." 

## **FASE 2: Modelado de Datos (Backend)** 

### **Task 2.1: Migraciones Base (Usuarios, Galpones, Lotes)** 

"Revisa la sección '6. Modelo de Datos Relacional' en requirements.md. 

Crea migraciones, modelos Eloquent y factories exactos para users (con enum de roles), sheds y flocks. Aplica estricto tipado de retorno en PHP. Establece las relaciones (Shed hasMany Flocks)." 

### **Task 2.2: Migraciones del Reporte Diario** 

"Crea migraciones, modelos y relaciones para el núcleo del reporte: daily_reports, bird_movements, egg_productions, daily_dispatches, y health_logs. Usa foreignId()->constrained()->cascadeOnDelete() para vincularlas con daily_report_id." 

## **FASE 3: Lógica de Negocio y Controladores (Backend)** 

### **Task 3.1: Servicio de Inventario y Vacío Sanitario** 

"Basado en las reglas de 'Bioseguridad' de requirements.md. 

Crea un StoreFlockRequest. Añade un que consulte si el _after validation hook_ shed_id tiene status = SANITARY_VOID. Si han pasado menos de 14 días desde last_emptied_date, retorna error 422: 'El galpón no ha cumplido el vacío sanitario'." 

### **Task 3.2: Endpoint Transaccional del Reporte Diario** 

"Crea DailyReportController@store y su FormRequest. En el controlador, usa obligatoriamente DB::transaction(). 

Guarda el DailyReport. Calcula final_birds restando mortality y actualiza la tabla flocks. Calcula total_boxes (suma / 360) y guárdalo. Guarda los despachos y sanidad." 

## **FASE 4: Frontend y Formulario (React)** 

### **Task 4.1: Tipado e Interfaces (TypeScript)** 

"Crea src/types/index.ts. Define las interfaces TypeScript para User (con roles), y DailyReportPayload que incluya las 5 secciones requeridas. Asegura que concuerde con el API." 

### **Task 4.2: UI del Formulario de Reporte** 

"Crea src/components/DailyReportForm.tsx. Usa react-hook-form con Zod. Maqueta con TailwindCSS 5 secciones. Implementa axios.post hacia la API y maneja estados de carga." 

## **FASE 5: Dashboard Ejecutivo y Visualización (Tremor &** 

## **ApexCharts)** 

### **Task 5.1: Setup de Librerías de UI** 

"Instala las dependencias del Dashboard estipuladas en requirements.md: npm install @tremor/react react-apexcharts apexcharts @heroicons/react. 

Configura el tailwind.config.js del frontend para incluir el preset y los colores requeridos por Tremor según su documentación oficial." 

### **Task 5.2: Creación del Dashboard Ejecutivo** 

"Crea una vista src/features/dashboard/ExecutiveDashboard.tsx. 

1. Usa componentes de Tremor (Card, Metric, BadgeDelta) para mostrar los KPIs principales de la granja. 

2. Implementa una alerta visual prominente (tipo Banner) condicionada a si la API devuelve el flag is_alert_triggered = true (Merma > 10%). 

3. Integra un componente de react-apexcharts tipo 'Area' o 'Line' para graficar la serie temporal de Producción de Huevos vs Mortalidad en los últimos 7 días." 

