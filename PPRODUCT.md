# **Contexto de Negocio: SAPA (Sistema Administrativo Pozo Azul)** 

### **PROPÓSITO DE ESTE DOCUMENTO:** 

Este archivo define el "Por qué" y el "Qué" del proyecto. Proporciona a la IA el vocabulario de negocio y los límites estrictos del producto para evitar desviaciones. 

## **1. Visión del Producto** 

SAPA es una plataforma web interna desarrollada para **Distribuidora Pozo Azul C.A.** , una empresa del sector avícola. El objetivo principal del sistema es digitalizar, centralizar y auditar la gestión de las granjas, enfocándose en la trazabilidad diaria de la población de aves, la producción de huevos, el consumo de alimento y el control sanitario. 

## **2. El Problema a Resolver** 

Actualmente, el control operativo de la granja (mortalidad, recolección de huevos, despacho) requiere una consolidación manual que es propensa a errores matemáticos y retrasos en la toma de decisiones. SAPA eliminará el uso de papel para el "Reporte Diario de Producción" y automatizará el cálculo de mermas, cierres de inventario vivo y rotación de almacén mediante el método PEPS (Primeras Entradas, Primeras Salidas). 

## **3. Vocabulario del Negocio (Ubiquitous Language)** 

La IA debe usar EXCLUSIVAMENTE estos términos para nombrar variables, tablas o interfaces relacionadas con estos conceptos: 

- **Shed (Galpón):** Estructura física que alberga a las aves. Tiene una capacidad máxima y puede estar activo o en cuarentena (Vacío Sanitario). 

- **Flock (Lote):** Grupo de aves de la misma edad y características que ingresa a un galpón. 

- **Daily Report (Reporte Diario):** Formulario transaccional que consolida el movimiento de un galpón en un día específico. 

- **Mortality (Mortalidad):** Cantidad de aves muertas en un día. Se resta directamente del inventario. 

- **Egg Box (Caja de Huevos):** Unidad de medida estándar para la venta. Matemáticamente, **1 Caja = 360 huevos** . 

- **Feed Sack (Saco de Alimento):** Unidad de medida para el almacén de consumo. Matemáticamente, **1 Saco = 40 kg** . 

- **Sanitary Void (Vacío Sanitario):** Período de descanso e higienización obligatoria de un 

galpón vacío (mínimo 14 días). 

- **Yield Loss (Merma):** Porcentaje de pérdida durante el proceso de molienda y peletizado de alimento. 

## **4. Usuarios del Sistema (Actores)** 

- **Directivos:** Monitorean métricas financieras y viabilidad. (Solo lectura de reportes 

- consolidados). 

- **Ejecutivos / Gerentes:** Toman decisiones basadas en las alertas de mermas y autorizan movimientos de inventario PEPS. 

- **Operativos:** Personal de campo. Su única función en el sistema es llenar el Reporte Diario. 

- **Administrativos:** Personal de oficina que requiere ver los despachos y producción para 

- integrarlo con sistemas gubernamentales (INSAI, SENIAT). 

## **5. Límites del Sistema (Fuera de Alcance - OUT OF SCOPE)** 

**ADVERTENCIA PARA LA IA:** NO debes programar, proponer ni estructurar nada relacionado con los siguientes puntos, ya que están fuera del alcance de este MVP: 

1. **NO hay E-commerce:** Este sistema es estrictamente de uso interno administrativo. No hay carritos de compra, ni pasarelas de pago (Stripe, PayPal, etc.). 

2. **NO hay Integración IoT (Hardware):** La recolección de datos de los silos, peso de aves o temperatura es de ingreso **manual** por los operadores. No intentes crear webhooks para sensores IoT. 

3. **NO hay Módulo de Nómina (RRHH):** El sistema no gestiona pagos a empleados, vacaciones ni asistencia laboral. Solo gestiona la autenticación básica de los usuarios. 

4. **NO hay Contabilidad Compleja:** El sistema registra guías de despacho y números de factura, pero NO calcula impuestos (IVA) ni genera libros contables mayores. 

