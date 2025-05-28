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
          className="text-7xl font-bold mb-6 mt-19"
        >
          Análisis
        </GradientText>
        <div className='bg-darkPrimaryPurple rounded-4xl w-11/12 h-11/12 flex items-start p-5 justify-between gap-20 mb-5 overflow-hidden'>
          {/* Texto a la izquierda */}
          <div className="flex flex-col overflow-hidden">
            <h1 className="text-darkBgText text-5xl font-bold mb-4 truncate">Gráficas</h1>
            <p className="text-darkBgText text-lg truncate">
              Descubre información sobre tu progreso con nuestras herramientas de análisis:
            </p>
            <ul className="list-disc list-inside mt-4 text-darkBgText text-lg">
              <li className="truncate">Visualiza tu tiempo de estudio diario con gráficos detallados.</li>
              <li className="truncate">Analiza tus puntuaciones en tests y evaluaciones a lo largo del tiempo.</li>
              <li className="truncate">Revisa la distribución de métodos de estudio que utilizas.</li>
              <li className="truncate">Consulta tu calendario de actividad para detectar patrones de estudio.</li>
              <li className="truncate">Monitorea el progreso de tus mazos de cartas con filtros personalizados.</li>
            </ul>
          </div>
          <div className="aspect-square w-4/13 bg-[#320f72ab] rounded-4xl">
            <ExampleChart />
          </div>
        </div>
      </>
    </div>
  );
}

export default AnalisisContainer;