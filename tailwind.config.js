/** @type {import('tailwindcss').Config} */
export default {
  content: ['./views/**/*.pug'],
  theme: {
    extend: {
      colors: {
        background: '#ffffff', // Fondo principal
        formBackground: '#faf5f0', // Fondo formularios 
        primaryText: '#000000', // Texto principal
        secondaryText: '#636363', // Textos secundarios
        action: '#ee7956', // Botones de acción
        action2: '#dda08a',
        hoverAction: '#5b92d1', // Hover en botones
        success: '#4CAF50', // Mensajes de éxito
        error: '#FF5252', // Mensajes de error
      },
    },
  },
  plugins: [],
}
