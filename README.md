# Mapa Interactivo de Distribuciones Univariadas · Actuaría

Mapa interactivo en español de **57 distribuciones de probabilidad** (16 discretas y 41 continuas) y **221 relaciones** entre ellas, diseñado para los cursos de la **Licenciatura en Actuaría** e inspirado en el diagrama clásico de L. M. Leemis y J. T. McQueston (2008), *«Univariate Distribution Relationships»*.

---

## Características principales

- **Mapa 2.5D interactivo (Three.js + CSS2D + KaTeX):**
  - Zona superior con las distribuciones **discretas** y zona inferior con las **continuas**, separadas espacialmente y dispuestas en rejilla uniforme optimizada.
  - Tarjetas con notación matemática en $\LaTeX$, insignias de propiedades de cerradura (`C`, `L`, `S`, `F`, `M`, `X`, `P`, `I`, `R`, `V`) y color distintivo por **materia**.
  - Flechas curvas con partículas animadas que indican el sentido de cada relación (*caso especial*, *transformación*, *suma/convolución*, *límite*, *mezcla*, *condicional*, *construcción estocástica* y *truncamiento*).
- **Esquema y filtro por materia curricular:**
  - Permite activar o desactivar cada curso de forma individual o usar el modo **«Acumulado hasta…»** para explorar las distribuciones conforme avanzan los semestres de la carrera.
- **Panel lateral de detalle actuarial:**
  - Gráfica 2D interactiva de la función de masa/densidad ($f(x)$) y de distribución acumulada ($F(x)$).
  - **Superficie 3D** interactiva en Three.js que muestra cómo cambia la densidad al variar un parámetro.
  - Deslizadores de parámetros en tiempo real con cálculo de $E[X]$, $\operatorname{Var}(X)$, $\operatorname{DE}(X)$ y $\operatorname{CV}(X)$.
  - Fórmulas completas: soporte, fmp/fdp, FDA, función de supervivencia $S(x)$, tasa de riesgo / fuerza de mortalidad $h(x)$ o $\mu_{x+t}$, FGM, FGP, $\operatorname{VaR}_p$, $\operatorname{TVaR}_p$, esperanza limitada $E[X \wedge d]$, **clase $(a, b, 0)$ y $(a, b, 1)$ de Panjer**, y relaciones entrantes y salientes.
- **Buscador de caminos dirigidos:** encuentra la secuencia más corta de transformaciones, casos especiales o límites para ir de una distribución a otra.
- **7 temas visuales clásicos** (oscuros y claros): *Cobalt2*, *Catppuccin*, *Gruvbox Material*, *Solarized Clear*, *Monokai*, *Atom One Light* y *Dracula At Night*.
- **Validador matemático y numérico integrado (`validar.html`):** verifica automáticamente referencias, sintaxis $\LaTeX$ y que cada densidad sume o integre a $1$ y coincida numéricamente con sus fórmulas cerradas de media y varianza.

---

## Distribuciones por materia (57)

| # | Materia | Etiqueta | Distribuciones incluidas |
|---|---------|----------|--------------------------|
| 1 | **Probabilidad** | `PROB. I` | Bernoulli, Binomial, Poisson, Geométrica (fracasos), Geométrica (ensayos), Hipergeométrica, Binomial negativa (fracasos), Binomial negativa (ensayos), Uniforme discreta, Normal, Normal estándar, Exponencial *(fuerza constante de mortalidad)*, Uniforme continua *(ley de De Moivre)*, Gamma, Chi-cuadrada, Weibull, Lognormal, Pareto I, Pareto II (Lomax), Beta |
| 2 | **Probabilidad Avanzada** | `PROB. AVANZADA` | Multinomial, $t$ de Student, $F$ de Fisher, Cauchy, Laplace, Logística, Dirichlet, Normal bivariada, Beta prima |
| 3 | **Inferencia Estadística** | `INFERENCIA` | Chi-cuadrada no central, $t$ no central, $F$ no central, Hipergeométrica negativa, Potencia |
| 4 | **Matemáticas Actuariales** | `MAT. ACTUARIALES` | Gompertz, Makeham *(más ley de De Moivre en Uniforme y fuerza constante en Exponencial)* |
| 5 | **Teoría del Riesgo / Modelos Actuariales** | `T. DEL RIESGO` | Burr (tipo XII), Log-logística (Fisk), Gamma inversa, Weibull inversa (Fréchet), Pareto generalizada (GPD), Logarítmica, Poisson cero-inflada (ZIP), Poisson compuesta (Tweedie / Cramér–Lundberg) |
| 6 | **Procesos Estocásticos / Simulación** | `P. ESTOCÁSTICOS` | Gaussiana inversa (Wald), Lévy, Arcoseno, Rayleigh, Hipoexponencial, Hiperexponencial, Gumbel |
| 7 | **Estadística Bayesiana / Credibilidad** | `BAYESIANA` | Beta-Binomial, Beta-Binomial negativa (Waring), Dirichlet-Multinomial, $t$ de localización-escala, Chi-cuadrada inversa escalada, Normal-Gamma (Credibilidad de Bühlmann) |

---

## Ejecución local

No requiere Node.js ni pasos de compilación; todas las dependencias (`Three.js`, `KaTeX`, `ELK.js`) están incluidas localmente en la carpeta `vendor/`.

### En Windows (doble clic)
Haz doble clic en **`iniciar.bat`**. Esto iniciará el servidor local en el puerto `8080` y abrirá `http://localhost:8080` en el navegador.

### Desde la terminal
```powershell
python servidor.py
```
- **Mapa principal:** `http://localhost:8080`
- **Validador de datos y fórmulas:** `http://localhost:8080/validar.html`

---

## Publicación en GitHub Pages

El repositorio incluye `.nojekyll` y rutas 100 % relativas, por lo que funciona directamente en **GitHub Pages**:
1. Sube el repositorio a GitHub.
2. En **Settings → Pages**, selecciona **Deploy from a branch** → rama **`main`** y carpeta **`/ (root)`**.

---

## Estructura del proyecto

```text
distribuciones-univariadas/
├── index.html                  # Aplicación principal del mapa interactivo
├── validar.html                # Página de pruebas automáticas (LaTeX + integración numérica)
├── servidor.py                 # Servidor HTTP local sin caché (puerto 8080)
├── iniciar.bat                 # Lanzador rápido para Windows
├── css/
│   └── estilos.css             # Estilos de la interfaz, tarjetas y temas
├── src/
│   ├── main.js                 # Punto de entrada y conexión de eventos/filtros
│   ├── datos/
│   │   ├── index.js            # Índice general de datos
│   │   ├── materias.js         # Catálogo de las 7 materias y colores curriculares
│   │   ├── propiedades.js      # Propiedades de cerradura (C, L, S, F, M, X, P, I, R, V)
│   │   ├── tiposRelacion.js    # Tipos de relación (aristas)
│   │   ├── relaciones.js       # Las 221 relaciones matemáticas entre distribuciones
│   │   ├── validar.js          # Validador de referencias, KaTeX y momentos numéricos
│   │   └── distribuciones/     # Un módulo ES por cada una de las 57 distribuciones
│   ├── grafo/
│   │   ├── layout.js           # Acomodo por zonas (discretas arriba, continuas abajo)
│   │   ├── mapa.js             # Escena Three.js + CSS2DRenderer + partículas
│   │   └── caminos.js          # Búsqueda en anchura (BFS) de caminos dirigidos
│   ├── graficas/
│   │   ├── grafica2d.js        # Gráfica 2D en Canvas de fmp/fdp y FDA
│   │   └── superficie3d.js     # Superficie 3D en Three.js al variar un parámetro
│   ├── mate/
│   │   ├── especiales.js       # Funciones especiales (lgamma Lanczos, erf, combinaciones)
│   │   └── muestreo.js         # Muestreo numérico de densidades y mallas 3D
│   └── ui/
│       ├── panel.js            # Panel lateral de detalle
│       ├── temas.js            # Catálogo de 10 temas visuales
│       └── tex.js              # Renderizado de fórmulas con KaTeX
└── vendor/                     # Librerías locales (Three.js r170, KaTeX 0.16.11, ELK 0.9.3)
```

---

## Referencias

- Leemis, L. M., & McQueston, J. T. (2008). *Univariate Distribution Relationships*. **The American Statistician**, 62(1), 45–53.
- Klugman, S. A., Panjer, H. H., & Willmot, G. E. (2019). *Loss Models: From Data to Decisions* (5th ed.). Wiley.
- Dickson, D. C. M., Hardy, M. R., & Waters, H. R. (2020). *Actuarial Mathematics for Life Contingent Risks* (3rd ed.). Cambridge University Press.
