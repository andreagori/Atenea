import GradientText from '../libs/reactbits/GradientText';
import ExampleChart from '../components/chart/exampleChart';

function AnalisisContainer() {
  return (
    <div id="analisis" className='h-screen w-full flex flex-col items-center justify-center font-primary' style={{
      backgroundImage: "radial-gradient(circle at center, #09003E, #1700A4)"
    }}>
      <>
        <GradientText
          colors={["#C6B3F8", "#A683FF", "#7525FF", "#C6B3F8", "#A683FF", "#7525FF", "#C6B3F8"]}
          animationSpeed={6}
          showBorder={false}
          className="text-7xl font-bold mb-8 mt-15"
        >
          Análisis
        </GradientText>
        <div className='bg-darkComponentElement rounded-4xl w-11/12 h-8/12 flex items-start p-8 justify-between gap-20 overflow-hidden'>
          {/* Texto a la izquierda */}
          <div className="flex flex-col overflow-hidden">
            <h1 className="text-darkBgText text-5xl font-bold mb-4 truncate">Análisis</h1>
            <p className="text-darkBgText text-lg truncate">
              Descubre información sobre tu progreso con nuestras herramientas de análisis:
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
          <div className="aspect-square w-4/13 bg-[#09090B] rounded-4xl">
            <ExampleChart />
          </div>
        </div>

        {/* Aquí puedes añadir el contenido analítico que desees */}
      </>
    </div>
  );
}

export default AnalisisContainer;