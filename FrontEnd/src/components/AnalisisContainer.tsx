import GradientText from '../libs/reactbits/GradientText';
import BasicBars from '../libs/materialUI/chartExample';

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
        <div className="bg-darkNeutralText w-[95vw] h-[30vw] flex items-start p-8 rounded-lg justify-between gap-4">
          {/* Texto a la izquierda */}
          <div className="flex flex-col w-1/2">
            <h1 className="text-darkBgText text-5xl font-bold mb-4">Análisis</h1>
            <p className="text-darkBgText text-lg">
              Descubre información valiosa sobre tu progreso con nuestras herramientas de análisis:
            </p>
            <ul className="list-disc list-inside mt-4 text-darkBgText text-lg">
              <li>Visualiza tu rendimiento académico a lo largo del tiempo.</li>
              <li>Compara la efectividad de diferentes métodos de estudio y aprendizaje.</li>
              <li>Revisa tus hábitos de estudio y detecta patrones de mejora.</li>
              <li>Consulta estadísticas detalladas de sesiones, mazos y tarjetas.</li>
              <li>Evalúa la relación entre tiempo de estudio y calificaciones obtenidas.</li>
            </ul>
          </div>

          {/* Gráfica a la derecha */}
          <div className="w-1/2 h-full flex items-center justify-center">
            <BasicBars />
          </div>
        </div>

        {/* Aquí puedes añadir el contenido analítico que desees */}
      </>
    </div>
  );
}

export default AnalisisContainer;