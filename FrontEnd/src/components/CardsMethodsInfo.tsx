import GradientText from '../libs/reactbits/GradientText';
import SpotlightCard from '../libs/reactbits/SpotlightCard';

function MetodosCardsHome() {
  return (
    <section
      id="metodos"
      className="w-full h-screen px-6 flex flex-col items-center font-primary"
      style={{
        backgroundImage: "radial-gradient(circle at center, #09003E, #1700A4)"
      }}
    >
      <GradientText
        colors={["#A994E9", "#7525FF", "#5E00FF", "#A994E9", "#7525FF", "#5E00FF", "#A994E9"]}
        animationSpeed={6}
        showBorder={false}
        className="text-7xl font-bold text-center mb-5 mt-20"
      >
        Métodos
      </GradientText>
      <p className='text-white text-2xl font-bold mb-5 text-center'>
        Estos son los métodos de estudio que puedes usar en la aplicación
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center mb-10">
        {[
          {
            title: "Memorización espaciada",
            text: "Memorización Espaciada: Técnica que fortalece la memoria repasando información en intervalos crecientes.",
            backgroundColor: "#027CE6",
          },
          {
            title: "Pomodoro",
            text: "Técnica para gestionar el tiempo de estudio, alternando entre períodos de trabajo y descanso.",
            backgroundColor: "#002FE1",
          },
          {
            title: "Pruebas simuladas",
            text: "Simula exámenes para evaluar tus conocimientos antes de una evaluación real.",
            backgroundColor: "#5311F8",
          },
        ].map(({ title, text, backgroundColor }, index) => (
          <SpotlightCard
            key={index}
            className="aspect-square max-w-[300px] justify-between overflow-hidden"
            withBorder={true}
            spotlightColor="var(--color-white)"
            backgroundColor={backgroundColor}
            borderColor="var(--color-white)"
          >
            <h3 className="text-white text-2xl font-bold mb-3">
              {title}
            </h3>
            <p className="text-white text-xl line-clamp-5">
              {text}
            </p>
          </SpotlightCard>
        ))}
      </div>
    </section>
  );
}

export default MetodosCardsHome;
