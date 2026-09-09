# REGLAS PERMANENTES DEL PROYECTO (AGENTS.md)

## 1. PROHIBICIÓN ESTRICTA DE EMOJIS
- **NUNCA usar emojis** (ej. ⚡, 🏆, 📐, 🚀, 💡, ☕, etc.) en ninguna parte del código, interfaces de usuario (UI), textos, opciones de formulario o componentes.
- **Usar SIEMPRE iconos reales**: Utilizar componentes de **Lucide React** (`lucide-react`) o iconos vectoriales SVG limpios.

## 2. OPTIMIZACIÓN Y CONSUMO DE RECURSOS
- No incluir simuladores ni componentes 3D pesados (WebGL / Three.js) que consuman recursos excesivos de CPU, GPU o memoria.
- Priorizar gráficos SVG ligeros, diseño CSS moderno, animaciones eficientes y renderizado rápido.

## 3. DISEÑO TOTALMENTE ADAPTATIVO (RESPONSIVE)
- Toda vista o componente debe adaptarse perfectamente a dispositivos móviles, tablets y escritorios.
- Las tablas deben incluir siempre contenedores con `overflow-x-auto`.
- Los menús, modales y barras laterales deben poseer comportamiento táctil y drawer responsivo.
