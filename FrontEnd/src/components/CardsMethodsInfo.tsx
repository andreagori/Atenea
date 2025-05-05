import GradientText from '../libs/reactbits/GradientText';
import SpotlightCard from '../libs/reactbits/SpotlightCard';

function MetodosCardsHome() {
  return (
    <section id="metodos" className="w-full px-6 py-12 flex flex-col items-center bg-darkBg font-primary">
      {/* Título */}
      <GradientText
        colors={["#193AB7", "#001144", "#193AB7", "#001144", "#193AB7"]}
        animationSpeed={4}
        showBorder={false}
        className="text-5xl md:text-6xl lg:text-7xl font-bold mb-10 lg:mb-16 text-center"
      >
        Métodos
      </GradientText>

      {/* Contenedor principal - ahora con 3 breakpoints */}
      <div className="grid grid-cols-1 md:grid-cols-[minmax(440px,1fr)_auto] lg:grid-cols-[minmax(550px,1fr)_auto] gap-6 w-full max-w-7xl">
        {/* Carta grande - tamaños escalables */}
        <SpotlightCard
          className="aspect-square w-full min-h-[440px] lg:min-h-[550px]"
          spotlightColor="var(--color-darkPrimary)"
          backgroundColor="var(--color-darkComponent2)"
        >
          <div className="flex flex-col justify-between h-full p-6 lg:p-8">
            <h2 className="text-darkBgText text-3xl md:text-4xl lg:text-5xl font-bold mb-4 lg:mb-6 text-left">
              Memorización Espaciada
            </h2>
            <p className="text-darkBgText text-base md:text-lg lg:text-xl text-left">
              Active Recall es una técnica de estudio que se basa en la recuperación activa de información.
              El usuario intentará responder preguntas o recordar conceptos sin mirar las respuestas, obligándose a recuperar información de su memoria.
            </p>
          </div>
        </SpotlightCard>

        {/* Cartas pequeñas - con tamaño escalable */}
        <div className="grid grid-cols-2 gap-4 lg:gap-6 h-fit">
          {[
            {
              title: 'Método de Cornell',
              text: 'Le permitirá al usuario tomar notas organizadas en tres columnas diferentes (notas principales, preguntas derivadas de las notas y resumen).',
            },
            {
              title: 'Pomodoro',
              text: 'Técnica para gestionar el tiempo de estudio, alternando entre períodos de trabajo y descanso.',
            },
            {
              title: 'Pruebas Simuladas',
              text: 'Simula exámenes para evaluar tus conocimientos antes de una evaluación real.',
            },
            {
              title: 'Tarjetas Visuales',
              text: 'Tarjetas con imágenes y texto que ayudan a memorizar conceptos clave.',
            },
          ].map(({ title, text }, index) => (
            <SpotlightCard
              key={index}
              className="w-[220px] h-[220px] lg:w-[275px] lg:h-[275px] p-4 lg:p-5 flex flex-col justify-between"
              spotlightColor="var(--color-darkPrimary)"
              backgroundColor="var(--color-darkComponent2)"
            >
              <h3 className="text-darkBgText text-lg lg:text-xl font-bold mb-2 lg:mb-3 leading-tight">
                {title}
              </h3>
              <p className="text-darkBgText text-sm lg:text-base line-clamp-5">
                {text}
              </p>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
}

export default MetodosCardsHome;