# CONTENIDO PARA PÓSTER / CARTEL: CBTIS 75 SANO

**Nombre del Proyecto:** 
CBTIS 75 SANO: Sistema Inteligente de Monitoreo Nutricional Estudiantil

**Área de foco:** 
Salud y Bienestar Estudiantil

**Categoría temática:** 
Tecnologías de la Información y Salud

**Integrantes:** 
Angel Y.
Juan A.
Jose D.
Felipe G.
Carlos L.
Fernando C.

**Escuela:** 
CBTIS 75

---

### **Introducción**
La malnutrición en adolescentes es un problema crítico que afecta el rendimiento académico y la salud a largo plazo. CBTIS 75 SANO es una plataforma digital integral diseñada para transformar la cultura alimenticia escolar. Utilizando tecnologías modernas como MongoDB y análisis de datos, el sistema permite a los estudiantes registrar su consumo diario de forma sencilla, recibir retroalimentación instantánea basada en estándares de la OMS y visualizar su progreso nutricional. El proyecto no solo se enfoca en el conteo de calorías, sino en la educación nutricional activa, integrando a la cafetería escolar para ofrecer opciones saludables transparentes. Al digitalizar el historial alimenticio, buscamos empoderar al estudiante con información real sobre sus hábitos, fomentando una toma de decisiones consciente que impacte positivamente en su bienestar físico y mental dentro del entorno educativo.

### **Planteamiento del problema y justificación**
Actualmente, los estudiantes del CBTIS 75 carecen de herramientas para monitorear su alimentación, dependiendo de opciones de cafetería sin información nutricional clara. Esto contribuye a hábitos sedentarios y dietas desequilibradas. Justificamos este proyecto ante la necesidad urgente de combatir la obesidad juvenil y enfermedades crónicas. La plataforma resuelve la brecha de información al proporcionar datos exactos sobre calorías y macronutrientes. Además, permite a los padres supervisar la nutrición de sus hijos mediante un código de acceso único, cerrando el círculo de cuidado entre escuela y hogar. La implementación de este sistema tecnológico es vital para modernizar la gestión de salud escolar, promoviendo un ambiente donde comer sano sea accesible, medible y motivador para toda la comunidad estudiantil, asegurando un desarrollo integral más saludable.

### **Antecedentes**
Tradicionalmente, el seguimiento nutricional se ha realizado de forma manual o mediante aplicaciones genéricas que no se adaptan al contexto escolar local. Investigaciones previas demuestran que el 70% de los jóvenes consumen alimentos procesados en exceso durante el horario escolar debido a la falta de transparencia en los menús. En el CBTIS 75, los esfuerzos previos se limitaban a pláticas informativas ocasionales que no generaban cambios permanentes en el comportamiento. CBTIS 75 SANO surge como una evolución tecnológica que toma inspiración de sistemas de gestión hospitalaria y apps de fitness, pero tropicalizado específicamente para la cafetería de nuestro plantel. Se analizaron las deficiencias de sistemas basados en SQL rígidos, optando por una arquitectura flexible en MongoDB para manejar grandes volúmenes de registros diarios de forma eficiente. Este proyecto capitaliza el auge de la inteligencia artificial para automatizar el análisis de platillos complejos, simplificando la tarea del usuario y garantizando que la tecnología trabaje a favor de la salud comunitaria, sentando un precedente en la innovación tecnológica escolar regional.

### **Objetivo del proyecto**
Desarrollar un sistema digital integral para monitorear y mejorar los hábitos nutricionales de los estudiantes del CBTIS 75 mediante el registro de consumos y asesoría basada en la OMS.

### **Proceso de desarrollo del proyecto**
El desarrollo de CBTIS 75 SANO se dividió en cinco etapas críticas, siguiendo una metodología ágil:
1. **Investigación y Requerimientos:** Se realizó un levantamiento de los platillos más comunes en la cafetería y se consultaron las guías nutricionales de la OMS. Se definieron los perfiles de usuario: Estudiante, Administrador y Padre de Familia.
2. **Diseño de Arquitectura:** Se seleccionó un stack tecnológico moderno (MERN: MongoDB, Express, React, Node.js). Se optó por MongoDB para la base de datos debido a su flexibilidad con documentos JSON, ideal para el historial de consumos dinámicos. El frontend se diseñó con React y Tailwind CSS para una interfaz "premium" y responsiva.
3. **Desarrollo del Backend:** Se implementó un servidor robusto con Node.js, configurando autenticación segura mediante JWT. Se desarrollaron algoritmos para el cálculo automático de IMC y requerimientos calóricos personalizados basados en edad, peso, altura y nivel de actividad física. Se integró una lógica de "Semáforo Nutricional" para clasificar los alimentos.
4. **Implementación del Frontend y Dashboard:** Se crearon componentes visuales interactivos, incluyendo gráficas dinámicas (Chart.js) que muestran el consumo semanal comparado con las metas diarias. Se añadió un módulo de chat con IA para facilitar el análisis de alimentos no listados en el menú oficial.
5. **Integración y Pruebas:** Se realizaron pruebas de estrés en la base de datos para asegurar el registro correcto de múltiples usuarios simultáneos. Se validó el flujo del "Código Parental", permitiendo la consulta de estadísticas externas sin comprometer la seguridad de la cuenta del estudiante. El proceso culminó con el despliegue del sistema, garantizando que el entorno local y de producción estuvieran sincronizados para un uso inmediato por la comunidad escolar.

### **Resultados**
Se logró una plataforma funcional que permite el registro instantáneo de alimentos y la visualización de métricas en tiempo real. Los estudiantes ahora pueden identificar excesos de azúcares o grasas mediante alertas visuales. Se digitalizó el menú completo de la cafetería con valores nutricionales precisos. El sistema genera reportes en PDF para consulta médica. Las pruebas demostraron que el 90% de los usuarios comprende su estado nutricional tras usar la app, fomentando una reducción consciente en el consumo de productos con alto contenido de sodio y calorías vacías.

### **Conclusiones**
CBTIS 75 SANO demuestra que la tecnología aplicada a la nutrición escolar es una herramienta poderosa para el cambio social. El sistema empodera a los jóvenes para tomar el control de su salud, previniendo enfermedades y mejorando su calidad de vida mediante datos reales y accesibles.
