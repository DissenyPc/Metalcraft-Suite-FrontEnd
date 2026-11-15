# Carpintería Metálica — aplicación web

Frontend Angular 19 para gestionar presupuestos y operaciones habituales de un taller de carpintería metálica. Consume la API REST del directorio `API`.

## Funcionalidades disponibles

- **Acceso de usuarios** mediante nombre de usuario y contraseña. Las rutas de trabajo requieren iniciar sesión; inventario, clientes y administración de usuarios están reservados al rol `ADMIN`.
- **Panel de control** con resumen de presupuestos, inventario y agenda.
- **Presupuestos**: listado y búsqueda, estados, clientes, partidas, descuentos y duplicación. El asistente técnico calcula despieces de estructura, persiana y acristalamiento y permite añadir el resultado como partida.
- **Agenda**: creación y edición de citas, asignación de trabajadores, consulta y cambios de estado.
- **Inventario y tarifas** (administración): consulta y búsqueda de perfiles de aluminio y hierro, herrajes y materiales de relleno; edición de precios y existencias, importación CSV y actualización porcentual masiva por catálogo.
- **Productos especiales**: cálculo de rejas, barandillas y mosquiteras; sus resultados se pueden añadir a un presupuesto.
- **Artículos de reventa**: cálculo orientativo de toldos y mamparas con margen e instalación, y opción de añadirlos a un presupuesto.
- **Clientes y usuarios** (administración): mantenimiento de clientes, alta de usuarios y asignación de roles.

## Alcance actual y límites

- El panel de inicio muestra cifras generales y agenda, pero su lista de alertas de stock bajo no funciona actualmente: consulta `/api/hardware-accessories/low-stock`, ruta que la API no expone. En la pantalla de inventario sí se muestran avisos calculados para el stock de herrajes.
- La opción «Todo el Inventario» del ajuste masivo no actualiza todos los catálogos: actualmente solo aplica el ajuste a perfiles de aluminio.
- La aplicación prepara y gestiona presupuestos, pero no genera facturas fiscales ni ofrece contabilidad, cobros o pagos.
- Las existencias se consultan y editan como cantidades; no hay movimientos de almacén, pedidos a proveedores ni trazabilidad de entradas y salidas.
- No incluye portal público o de autoservicio para clientes.
- Los precios que muestran los asistentes de fabricación, productos especiales y reventa son estimaciones calculadas en el frontend; no se obtienen de tarifas reales del inventario ni de un proveedor.
- No se encontraron archivos de pruebas unitarias ni pruebas end-to-end. Aunque `npm test` está configurado con Karma, no hay una suite de pruebas implementada; `ng e2e` requiere añadir y configurar un framework externo.

## Requisitos

- Node.js y npm compatibles con Angular CLI 19.
- La API arrancada en `http://localhost:8080` y una base de datos MySQL configurada para ella. La URL de la API está definida en `src/environments/environment.ts` y `src/environments/environment.prod.ts`.

## Desarrollo

```bash
npm install
npm start
```

Abre `http://localhost:4200`. El servidor de desarrollo recarga la aplicación al guardar cambios.

## Compilación y pruebas

```bash
npm run build
npm test
```

`npm run build` compila la aplicación. `npm test` lanza Karma; actualmente no hay pruebas unitarias implementadas.
