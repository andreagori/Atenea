import GradientText from '../libs/reactbits/GradientText';
import Footer from './Footer';

function QuienesSomosContainer() {
  return (
    <div id="quienesomos" className='h-screen w-full flex flex-col items-center justify-center font-primary'
      style={{
        backgroundImage: "radial-gradient(circle at center, #0D1529, #000416)"
      }}>
      <>
        <GradientText
          colors={["#75CDF8", "#027CE6", "#002FE1", "#75CDF8", "#027CE6", "#002FE1", "#75CDF8"]}
          animationSpeed={6}
          showBorder={false}
          className="text-7xl font-bold">
          ¿Quiénes somos?
        </GradientText>
        {/* Contenedor con padding-top para dejar espacio para el círculo */}
        <div className="relative w-11/12 bg-darkComponentElement rounded-3xl flex flex-col pt-[6rem] mt-25">
          {/* Círculo encima del contenedor, con la mitad dentro y la otra mitad fuera. Agregar foto. */}
          <div className="absolute top-[-6rem] left-1/2 transform -translate-x-1/2 w-[12rem] h-[12rem] bg-darkAccent rounded-full shadow-xl z-20" />
          {/* Contenido del contenedor */}
          <h1 className="text-darkBgText text-2xl mb-8 text-center">Creado por: <strong>Andrea</strong></h1>
          {/* Agrega aquí más contenido si deseas */}
          <p className='text-darkBgText text-lg text-center mb-5'>
            Atenea es una plataforma de aprendizaje personalizada empleando diferentes métodos de estudio para ofrecer una experiencia educativa única. <br />
            Nuestro objetivo es ayudar a los estudiantes a alcanzar su máximo potencial mediante un enfoque adaptativo y centrado en el usuario. <br />
            Con una interfaz intuitiva y el uso de análisis de datos, Atenea brindará las respuestas necesarias para mejorar el rendimiento académico del usuario. <br />
          </p>
        </div>
          <footer className="w-full">
            <Footer />
          </footer>
      </>
    </div>
  );
}

export default QuienesSomosContainer;
