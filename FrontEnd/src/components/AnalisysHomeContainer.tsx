import GradientText from '../libs/reactbits/GradientText';

function AnalisisContainer() {
  return (
    <div id="analisis" className='h-full w-full flex flex-col items-center justify-center font-primary'>
      <>
        <GradientText
          colors={["#193AB7", "#001144", "#193AB7", "#001144", "#193AB7", "#001144"]}
          animationSpeed={5}
          showBorder={false}
          className="text-5xl font-bold mb-8"
        >
          Análisis
        </GradientText>
        <div className="bg-darkNeutralText w-11/12 h-7/12 flex items-start p-8 rounded-lg justify-between gap-4 overflow-hidden">
          {/* Texto a la izquierda */}
          <div className="flex flex-col w-6/8 overflow-hidden">
            <h1 className="text-darkBgText text-5xl font-bold mb-4 truncate">Análisis</h1>
            <p className="text-darkBgText text-lg truncate">
              Descubre información valiosa sobre tu progreso con nuestras herramientas de análisis:
            </p>
            <ul className="list-disc list-inside mt-4 text-darkBgText text-lg">
              <li className="truncate">Visualiza tu rendimiento académico a lo largo del tiempo.</li>
              <li className="truncate">Compara la efectividad de diferentes métodos de estudio y aprendizaje.</li>
              <li className="truncate">Revisa tus hábitos de estudio y detecta patrones de mejora.</li>
              <li className="truncate">Consulta estadísticas detalladas de sesiones, mazos y tarjetas.</li>
              <li className="truncate">Evalúa la relación entre tiempo de estudio y calificaciones obtenidas.</li>
            </ul>
          </div>

          {/* Gráfica a la derecha */}
          <div className="w-3/8 h-full flex items-center justify-center bg-darkComponent2 rounded-2xl">
          </div>
        </div>

        {/* Aquí puedes añadir el contenido analítico que desees */}
      </>
    </div>
  );
}

export default AnalisisContainer;