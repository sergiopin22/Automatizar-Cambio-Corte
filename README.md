# Automatizador de Moción para Cambio de Corte de Inmigración

## Descripción
Esta aplicación web está diseñada específicamente para ayudar a los inmigrantes en Estados Unidos a generar correctamente una moción para cambio de corte de inmigración. El sistema sigue estrictamente el manual de procedimientos de la corte de inmigración y cumple con todos los requisitos legales establecidos.

## Características Principales

### 1. Formulario Inteligente
- **Información Personal del Inmigrante**
  - Nombre completo
  - Número A (número de registro de extranjero)
  - Dirección actual completa
  - Ciudad, Estado y Código Postal

- **Información de Cortes**
  - Corte actual con detalles del juez y fechas de audiencia
  - Nueva corte solicitada
  - Información de la oficina OPLA correspondiente

- **Gestión de Dependientes**
  - Capacidad para agregar hasta 3 dependientes
  - Campos para nombre y número A de cada dependiente
  - Sistema de guardado y validación de dependientes

- **Información Adicional**
  - Fecha de presentación
  - Método de entrega
  - Razón del cambio de corte con plantillas predefinidas

### 2. Base de Datos de Cortes
La aplicación utiliza una base de datos completa (`courts.json`) que incluye:
```json
[
    {
        "state": "Nombre del Estado",
        "courts": [
            {
                "name": "Nombre de la Corte",
                "city": "Ciudad",
                "address": "Dirección completa",
                "oplaOffice": "Dirección de la oficina OPLA",
                "judges": [
                    "Nombre del Juez 1",
                    "Nombre del Juez 2"
                ]
            }
        ]
    }
]
```

### 3. Funcionalidades Avanzadas
- **Validación en Tiempo Real**
  - Verificación de campos requeridos
  - Control de dependientes no guardados
  - Validación de fechas y formatos

- **Generación de PDF**
  - Animación durante la generación
  - Formato estandarizado
  - Inclusión automática de información de cortes

- **Plantillas de Razones**
  - Selección de razones predefinidas
  - Personalización de texto
  - Sistema de plantillas inteligente

## Estructura del Proyecto
```
src/
├── components/         # Componentes reutilizables
│   ├── FormFields/    # Campos de formulario
│   ├── FormSections/  # Secciones del formulario
│   └── PdfGenerationAnimation/ # Animación de generación
├── hooks/             # Hooks personalizados
├── data/             # Datos estáticos
│   └── courts.json   # Base de datos de cortes
├── pages/            # Páginas principales
└── styles/           # Estilos globales
```

## Tecnologías Utilizadas
- React.js para el frontend
- React Router para la navegación
- Hooks personalizados para la lógica de negocio
- Sistema de componentes reutilizables
- Generación de PDFs

## Características de Usabilidad
- Formulario paso a paso
- Validación en tiempo real
- Mensajes de error claros
- Interfaz intuitiva
- Soporte para múltiples dependientes
- Generación automática de documentos

## Base de Datos de Cortes
### Contenido
- **Estados**: Lista completa de estados con cortes de inmigración
- **Cortes por Estado**: Cada estado contiene sus cortes de inmigración
- **Información por Corte**:
  - Nombre oficial de la corte
  - Ciudad donde se encuentra
  - Dirección física completa
  - Dirección de la oficina OPLA correspondiente
  - Lista completa de jueces asignados

### Funcionalidades Basadas en la Base de Datos
1. **Selección de Corte**
   - Autocompletado de estados
   - Filtrado de cortes por estado
   - Validación de jurisdicción

2. **Información de Jueces**
   - Lista actualizada de jueces por corte
   - Verificación de asignación de jueces
   - Historial de cambios de juez

3. **Información de OPLA**
   - Direcciones correctas de oficinas OPLA
   - Correspondencia corte-OPLA
   - Información de contacto actualizada

## Requisitos Legales Implementados
- Formato correcto según el manual de la corte
- Plazos de presentación
- Requisitos de notificación
- Especificaciones de formato
- Requisitos de firma
- Documentación de respaldo necesaria

## Uso
1. Ingresar información personal del inmigrante
2. Seleccionar la corte actual y la nueva corte deseada
3. Elegir una razón válida para el cambio
4. Agregar información de dependientes si aplica
5. Generar el documento PDF
6. Revisar y firmar el documento
7. Presentar según las instrucciones de la corte

## Beneficios
1. **Precisión Legal**
   - Cumplimiento exacto con los requisitos de la corte
   - Reducción de errores en la presentación
   - Formato estandarizado

2. **Eficiencia**
   - Generación rápida del documento
   - Validación automática de requisitos
   - Ahorro de tiempo en la preparación

3. **Accesibilidad**
   - Interfaz en español
   - Instrucciones claras
   - Guía paso a paso

## Importante
- La aplicación ayuda a generar el documento pero no garantiza su aprobación
- Se recomienda consultar con un abogado de inmigración
- Los usuarios son responsables de la precisión de la información proporcionada
- La presentación debe hacerse según los plazos y métodos especificados por la corte

## Actualizaciones
La base de datos de cortes, jueces y oficinas OPLA se mantiene actualizada para reflejar:
- Cambios en las ubicaciones de las cortes
- Nuevos jueces asignados
- Cambios en las oficinas de fiscalía
- Actualizaciones en los requisitos de presentación
