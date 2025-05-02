import GradientText from '../libs/reactbits/GradientText';

function QuienesSomosContainer() {
  return (
    <div id="quienesomos" className='h-full w-full flex flex-col items-center justify-center font-primary'>
      <>
        <GradientText
          colors={["#193AB7", "#001144", "#193AB7", "#001144", "#193AB7", "#001144"]}
          animationSpeed={5}
          showBorder={false}
          className="text-5xl font-bold"> ¿Quiénes somos?
        </GradientText>
        {/* Contenedor con padding-top para dejar espacio para el círculo */}
        <div className="relative w-[95vw] h-[30vw] bg-darkComponentElement rounded-3xl flex flex-col pt-[6rem] mt-30">
          {/* Círculo encima del contenedor, con la mitad dentro y la otra mitad fuera */}
          <div className="absolute top-[-6rem] left-1/2 transform -translate-x-1/2 w-[12rem] h-[12rem] bg-darkAccent rounded-full shadow-xl z-20" />
          {/* Contenido del contenedor */}
          <h1 className="text-darkBgText text-2xl font-bold mb-8 text-center">Andrea</h1>
          {/* Agrega aquí más contenido si deseas */}
          <p className='text-darkBgText text-lg text-center'>
            Atenea es una plataforma de aprendizaje personalizada que utiliza inteligencia artificial para ofrecer una experiencia educativa única. Nuestro objetivo es ayudar a los estudiantes a alcanzar su máximo potencial mediante un enfoque adaptativo y centrado en el usuario.
          </p>
        </div>
      </>
    </div>
  );
}

export default QuienesSomosContainer;
