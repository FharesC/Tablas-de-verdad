# 1. OBJETIVO
Realizar un proyecto en lenguaje Python para la automatización de Tablas de Verdad, con interfaz de usuario tipo línea de comandos (CMD). El proyecto debe ser capaz de:

- Detectar el número de variables de una fórmula lógica ingresada.
- Generar automáticamente todas las combinaciones posibles de valores de verdad (Verdadero/Falso).
- Evaluar la fórmula para cada combinación.
- Mostrar los resultados en un formato tabular ordenado.

# 2. REQUISITOS TÉCNICOS
### **Entrada de Datos:**
El sistema debe solicitar al usuario el ingreso de una fórmula lógica utilizando el siguiente alfabeto:
- **Variables:** Letras mayúsculas (A, B, C, etc.).
- **Conectores Lógicos:**
  - Negación: `~` (o `¬` si se prefiere, pero debe ser consistente).
  - Conjunción: `&` (o `∧`).
  - Disyunción: `|` (o `∨`).
  - Implicación: `→`.
  - Coimplicación (Equivalencia): `↔`.
- **Constantes:**
  - `V` para Verdadero.
  - `F` para Falso.

*Ejemplo de entrada aceptada: `A & (B | ~C)`*

### **Procesamiento Interno:**
1. **Análisis de Variables:** Identificar todas las variables únicas presentes en la fórmula.
2. **Generación de Combinaciones:**
   - Si hay `n` variables, generar las `2^n` filas correspondientes.
   - Se debe mantener la convención: Fila 1 = Todos Verdaderos (VVV...).
3. **Evaluación:**
   - Se debe implementar un parser o evaluador capaz de resolver la jerarquía de operadores (Paréntesis → Negación → Conjunción → Disyunción → Implicación/Coimplicación).

### **Salida (Tablas de Verdad):**
El resultado debe mostrarse en formato tabular claro. Se debe imprimir la tabla completa con los siguientes encabezados:
1. Columna por cada Variable (A, B, C...).
2. Columna por cada Conector Intermedio (ej: `~B`, `A & B`).
3. Columna Final correspondiente a la **Fórmula Completa**.

*Ejemplo de formato deseado:*
```
| A | B | ~B | A & B |
-----------------------
| V | V | F  | V       |
| V | F | V  | F       |
| F | V | F  | F       |
| F | F | V  | F       |
-----------------------
```

# 3. ALGORITMO SUGERIDO

### **Paso 1: Parseo**
Recorrer la cadena de entrada para extraer: variables, constantes, operadores y paréntesis. Crear una estructura de datos (lista o árbol) que represente la fórmula de manera que pueda ser evaluada secuencialmente.

### **Paso 2: Generación de Valores**
Utilizar una función recursiva o un bucle que itere desde `0` hasta `2^n - 1`. Cada número de esta secuencia, convertido a binario, representará una fila de la tabla.

*Ejemplo (n=3):*
- Iteración 7 (Binario 111) -> Fila VVV
- Iteración 6 (Binario 110) -> Fila VVF

### **Paso 3: Evaluación y Dibujo**
Para cada fila generada:
1. Asignar valores a las variables.
2. Sustituir estos valores en la estructura de la fórmula.
3. Evaluar la expresión aplicando las reglas matemáticas de los conectores (recuerda: `p → q` es equivalente a `~p | q`).
4. Imprimir los valores de todas las columnas manteniendo el alineado visual.
