import SpotlightCard from '../libs/reactbits/SpotlightCard';

function MetodosCardsHome() {
  return (
    <div className="grid grid-cols-[40vw_1fr] gap-2"> {/* Reducir gap */}
      {/* Primera carta más grande */}
      <SpotlightCard
        className="w-[60vw] h-[60vw]" // Mantener tamaño
        spotlightColor="var(--color-darkPrimary)"
        backgroundColor="var(--color-darkComponent2)">
        <p className='text-darkBgText text-7xl font-bold justify-content-start'> Active Recall </p>
        <br />
        <span className="text-m text-darkBgText justify-start">
        Active Recall es una técnica de estudio que se basa en la recuperación activa de información.
        El usuario intentara responder preguntas o recordar conceptos sin mirar las respuestas, obligándose a recuperar información de su memoria. 
        </span>
        <br />
      </SpotlightCard>

      {/* Contenedor para las 4 cartas más pequeñas */}
      <div className="grid grid-cols-2 gap-2"> {/* Reducir gap */}
        <SpotlightCard
          className="w-full h-[60vw]" // Sin márgenes adicionales
          spotlightColor="var(--color-darkPrimary)"
          backgroundColor="var(--color-darkComponent2)">
          <p className='text-darkBgText text-2xl font-bold'> Metodo de Cornell </p>
            <br />
            <span className="text-m text-darkBgText justify-center">
            Le permitirá al usuario tomar notas organizadas en tres columnas diferentes 
            (notas principales, preguntas derivadas de las notas y resumen).
            </span>
            <br />
        </SpotlightCard>
        <SpotlightCard
          className="w-full h-[60vw]" // Sin márgenes adicionales
          spotlightColor="var(--color-darkPrimary)"
          backgroundColor="var(--color-darkComponent2)">
          <p className='text-darkBgText text-2xl font-bold'> Pomodoro </p>
            <br />
            <span className="text-m text-darkBgText justify-center">
            El usuario podrá utilizar la técnica Pomodoro para gestionar su tiempo de estudio, alternando entre períodos de trabajo y descanso.
            </span>
            <br />
        </SpotlightCard>
        <SpotlightCard
          className="w-full h-[60vw]" // Sin márgenes adicionales
          spotlightColor="var(--color-darkPrimary)"
          backgroundColor="var(--color-darkComponent2)">
          <p className='text-darkBgText text-2xl font-bold'> Pruebas Simuladas </p>
            <br />
            <span className="text-m text-darkBgText justify-center">
            El usuario podrá realizar pruebas simuladas para evaluar su conocimiento y habilidades en un tema específico.
            </span>
            <br />
        </SpotlightCard>
        <SpotlightCard
          className="w-full h-[60vw]" // Sin márgenes adicionales
          spotlightColor="var(--color-darkPrimary)"
          backgroundColor="var(--color-darkComponent2)">
          <p className='text-darkBgText text-2xl font-bold'> Tarjetas Visuales </p>
            <br />
            <span className="text-m text-darkBgText justify-center">
            El usuario podrá crear tarjetas visuales con imágenes y texto para ayudar a recordar conceptos o ideas clave.
            </span>
            <br />
        </SpotlightCard>
      </div>
    </div>
  );
}

export default MetodosCardsHome;