# **Plan de Ejecución para Agente IA (Prompts SDD)** 

#### **INSTRUCCIONES PARA EL DESARROLLADOR/USUARIO:** 

Copia y pega cada bloque de texto que está dentro de las comillas (">") directamente en el chat de tu IA (Cursor, Copilot, etc.). NO saltes tareas. Espera a que la IA confirme la finalización de una tarea antes de enviar la siguiente. 

## **FASE 1: Inicialización Estricta** 

### **Task 1.1: Setup de Backend Laravel (API)** 

"Actúa como desarrollador Backend Senior. Basándote ESTRICTAMENTE en requirements.md: 

1. Inicializa un proyecto Laravel 13 estructurado solo para API. 

2. Configura el .env para usar PostgreSQL (asume credenciales default db: sapa_db). 

3. Instala y configura Laravel Sanctum. 

4. Asegúrate de que el middleware de API devuelva siempre application/json. NO crees migraciones aún. Solo setup del framework." 

### **Task 1.2: Setup de Frontend React (Vite)** 

"Actúa como desarrollador Frontend Senior. Basándote en requirements.md: 

1. En una carpeta raíz paralela llamada /frontend, inicializa un proyecto React con TypeScript y Vite. 

2. Instala las siguientes dependencias exactas: tailwindcss, postcss, autoprefixer, axios, react-router-dom, react-hook-form, zod, @hookform/resolvers. 

3. Inicializa la configuración de Tailwind CSS (npx tailwindcss init -p). 

4. Limpia el componente App.tsx dejándolo como un contenedor vacío. NO crees componentes de UI todavía." 

## **FASE 2: Modelado de Datos (Backend)** 

### **Task 2.1: Migraciones y Modelos Base (Usuarios y Galpones)** 

"Revisa la sección '6. Modelo de Datos Relacional' en requirements.md. 

Crea las migraciones, modelos Eloquent y factories exactos para: 

1. La tabla users (modificando la migración por defecto para añadir el campo role como enum string: DIRECTIVO, EJECUTIVO, OPERATIVO, 

ADMINISTRATIVO). 

2. La tabla sheds (Galpones) con las columnas exactas especificadas. 

3. La tabla flocks (Lotes) con las columnas exactas. Asegúrate de incluir las relaciones Eloquent: Un Shed tiene muchos Flocks. Un Flock pertenece a un Shed. Aplica estricto tipado de retorno en PHP en los métodos del modelo." 

### **Task 2.2: Migraciones y Modelos del Reporte Diario (Transaccional)** 

"Revisa las secciones 5 y 6 de requirements.md. Necesitamos crear la estructura para el Reporte Diario. 

Crea migraciones, modelos y relaciones (hasOne, belongsTo) para: 

1. daily_reports 

2. bird_movements 

3. egg_productions 

4. daily_dispatches 

5. health_logs 

RESTRICCIÓN: Asegúrate de usar foreignId(...)->constrained()>cascadeOnDelete() para vincular correctamente estas 4 tablas con daily_report_id." 

## **FASE 3: Lógica de Negocio y Controladores (Backend)** 

### **Task 3.1: Lógica del Vacío Sanitario (Observer/Request)** 

"Basado en la regla 'E. Bioseguridad' de requirements.md. 

Crea un FormRequest llamado StoreFlockRequest. Dentro del método withValidator, añade una validación personalizada (after hook) que consulte el shed_id. 

Lógica estricta: Si el Shed seleccionado tiene status = SANITARY_VOID, calcula si han pasado 14 días desde su last_emptied_date. Si no han pasado, añade un error al validator: 'El galpón no ha cumplido los 14 días de vacío sanitario obligatorios.' Retorna HTTP 422." 

### **Task 3.2: El Mega-Endpoint del Reporte Diario** 

"Basado en la sección '5. Estructura Exacta' de requirements.md. 

1. Crea DailyReportController con un método store. 

2. Crea un StoreDailyReportRequest con validación estricta para las 5 secciones (arreglos e integers validando que no sean negativos). 

3. En el controlador, usa DB::transaction(). 

4. Guarda el DailyReport principal. 

5. Calcula automáticamente final_birds (initial_birds - mortality) y guárdalo en bird_movements. 

6. Actualiza el campo current_birds en la tabla flocks restando la mortalidad. 

7. Calcula automáticamente total_boxes sumando todos los huevos y dividiendo entre 360. Guárdalo en egg_productions. 

8. Guarda las tablas de despachos y sanidad." 

### **Task 3.3: Lógica de Merma de Molienda** 

"Basado en la regla 'D. Molienda y Alertas' de requirements.md. 

Crea un servicio MillingService.php con un método calculateYield(float $rawMaterialKg, float $pelletizedKg). 

Implementa exactamente esta fórmula: (($rawMaterialKg - $pelletizedKg) / $rawMaterialKg) * 100. 

Si el resultado es mayor a 10.00, el método debe retornar un array ['alert' => true, 'merma_percentage' => %]. Crea un pequeño test unitario en Laravel (PHPUnit) para verificar que 1000kg de entrada y 850kg de salida disparen la alerta." 

## **FASE 4: Frontend y Formulario React (UX/UI)** 

### **Task 4.1: Tipos TypeScript e Interfaz Base** 

"Basado en requirements.md. En el frontend React, crea un archivo src/types/index.ts. 

Exporta las interfaces exactas para: 

1. User (incluyendo el enum de Role). 

2. DailyReportPayload (que contenga las 5 secciones anidadas: birdMovement, eggProduction, dispatches, health). 

   - Asegúrate de que los tipos numéricos coincidan con lo esperado por el backend." 

### **Task 4.2: Esquema de Validación Zod** 

"Crea un archivo src/validations/dailyReportSchema.ts. 

Usa zod para construir el esquema de validación para el Reporte Diario. 

Reglas estrictas: 

- mortality: min 0. 

- Producción de huevos (jumbo, large, etc.): enteros positivos min 0. 

- Si vaccines_applied tiene texto, requiere al menos 5 caracteres. Exporta el tipo inferido de Zod." 

### **Task 4.3: Componente de Formulario de Reporte** 

"Crea un componente src/components/DailyReportForm.tsx. 

Usa useForm de react-hook-form combinado con zodResolver utilizando el esquema creado en la Task 4.2. 

Crea una UI con TailwindCSS dividida visualmente en las 5 secciones (Tarjetas o Acordeones). 

En el método onSubmit, implementa una llamada axios.post('/api/daily-reports', data) y maneja el estado de carga y un mensaje de éxito/error. No asumas librerías de componentes (como shadcn), usa clases puras de Tailwind." 

