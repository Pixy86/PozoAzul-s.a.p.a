# **SAPA: Sistema Administrativo Pozo Azul** 

## **DOCUMENTO CENTRAL DE ESPECIFICACIONES (SDD - FUENTE ÚNICA DE VERDAD)** 

#### **INSTRUCCIÓN ESTRICTA PARA EL AGENTE IA:** 

1. NO asumas entidades, campos en bases de datos o lógicas de negocio que no estén explícitamente definidas en este documento. 

2. NO instales librerías que no estén en el stack. 

3. Si falta un detalle para implementar una regla, solicita aclaración al usuario, NO lo inventes. 

## **1. Contexto y Objetivos** 

Distribuidora Pozo Azul C.A. requiere el SAPA para digitalizar su gestión avícola. El corazón del sistema es la digitalización del **Reporte Diario de Producción** , integrando inventario vivo (aves), recolección (huevos), control de almacén (PEPS) y sanidad. 

## **2. Stack Tecnológico Estricto** 

- **Backend:** PHP 8.3+, Laravel 13 (API RESTful exclusiva). 

- **Base de Datos:** PostgreSQL (Uso estricto de Foreign Keys y transacciones para los reportes diarios). 

- **Autenticación:** Laravel Sanctum (Tokens Bearer). 

- **Frontend Base:** React 18+, TypeScript (Tipado estricto obligatorio), Vite, TailwindCSS. 

- ● **Visualización y Dashboard (ACTUALIZADO):** 

   - **Tremor:** Framework de componentes nativo de Tailwind para estructuras de KPIs, tarjetas de métricas y paneles ejecutivos. 

   - **ApexCharts (react-apexcharts):** Motor de gráficas interactivas para visualizar series temporales de mortalidad y recolección. 

- **Manejo de Formularios (Frontend):** React Hook Form + Zod (para validación de esquemas). 

- **Peticiones HTTP:** Axios. 

## **3. Control de Accesos (Roles y Permisos)** 

El modelo de roles debe ser un enum o tabla catálogo con exactamente 4 niveles: 

1. DIRECTIVO: Acceso total (lectura) a métricas financieras, paneles de control y auditorías. 

2. EJECUTIVO: Aprobación de reportes, control de inventario PEPS, gestión de mermas y visualización de alertas. 

3. OPERATIVO: Permiso exclusivo de ESCRITURA para el formulario del Reporte Diario de 

Producción. No puede borrar. 

4. ADMINISTRATIVO: Acceso a facturación, datos INSAI/SENIAT, visualización de despachos. 

## **4. Reglas de Negocio Matemáticas y Lógicas (OBLIGATORIAS)** 

### **A. Inventario Avícola** 

- **Fórmula:** Inventario Final = Inventario Inicial + Ingresos - Mortalidad. 

- El Inventario Final del día _X_ es obligatoriamente el Inventario Inicial del día _X+1_ . No puede ser modificado manualmente. 

### **B. Producción de Huevos** 

- **Conversión Constante:** 1 Caja = 360 huevos. 

- **Fórmula Total Cajas:** Total Cajas = (Jumbo + Grande + Mediano + Pequeño + Rotos) / 360. 

### **C. Almacén e Insumos (Estricto PEPS/FIFO)** 

- Las salidas de alimento para consumo deben descontarse obligatoriamente del lote con la entry_date más antigua que tenga saldo disponible. 

- Zonas estáticas: Zona A (Maíz, Soya), Zona B (Núcleos, Vitaminas), Zona C (Producto Peletizado). 

- Unidad de medida base: Kilogramos (kg) y Sacos (40kg). 1 Saco = 40kg. 

### **D. Molienda y Alertas de Merma** 

- **Fórmula Merma:** Porcentaje Merma = ((Materia Prima Entrante (kg) - Alimento Obtenido (kg)) / Materia Prima Entrante (kg)) * 100. 

- **Trigger de Alerta:** Si Porcentaje Merma > 10.00%, el sistema debe registrar un flag booleano is_alert_triggered = true y notificar (vía UI en el Dashboard) al rol EJECUTIVO. 

### **E. Bioseguridad (Vacío Sanitario)** 

- Cuando un Galpon cambia su status a vacio_sanitario, el sistema debe registrar el last_emptied_date. 

- **Regla:** Un galpón NO puede recibir un nuevo lote de aves si current_date < (last_emptied_date + 14 días). El backend debe rechazar la creación del lote (HTTP 422). 

## **5. Estructura Exacta del Reporte Diario de Producción** 

## **(5 Secciones)** 

El endpoint POST /api/daily-reports debe recibir un payload JSON estructurado con estas 5 secciones (que representan tablas relacionadas): 

1. **Movimiento de Aves:** lote_id, date, initial_birds, mortality, final_birds (calculado en backend). 

2. **Producción:** jumbo, large, medium, small, broken. 

3. **Consumo de Alimento:** Array de objetos { feed_inventory_id, quantity_sacks_consumed }. 

4. **Despachos (Logística):** boxes_shipped, live_birds_shipped, manure_sacks (sacos gallinaza), invoice_number (nota de entrega). 

5. **Sanidad:** vaccines_applied (texto/array), infrastructure_notes (texto). 

## **6. Modelo de Datos Relacional (Migraciones Backend)** 

El agente debe ceñirse a crear estas tablas con estos campos (añadir timestamps nativos de Laravel): 

- users: id, name, email, password, role (enum: DIRECTIVO, EJECUTIVO, OPERATIVO, ADMINISTRATIVO). 

- sheds (Galpones): id, name, zone, capacity (int), status (enum: ACTIVE, SANITARY_VOID), last_emptied_date (date, nullable). 

- flocks (Lotes): id, shed_id (FK), start_date, initial_birds (int), current_birds (int), status (enum: ACTIVE, DEPLETED). 

- daily_reports: id, flock_id (FK), user_id (FK), report_date (date). 

- bird_movements: id, daily_report_id (FK), initial_birds (int), mortality (int), entries (int), final_birds (int). 

- egg_productions: id, daily_report_id (FK), jumbo (int), large (int), medium (int), small (int), broken (int), total_boxes (decimal 8,2). 

- feed_inventories: id, name, zone (enum: A,B,C), sacks_stock (int), kg_stock (decimal), entry_date (date), expiration_date (date). 

- daily_dispatches: id, daily_report_id (FK), boxes_shipped (int), live_birds_shipped (int), manure_sacks (int), invoice_number (string). 

- health_logs: id, daily_report_id (FK), vaccines_applied (text), infrastructure_notes (text). 

