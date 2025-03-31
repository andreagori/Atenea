const Home = () => {
  return (
    <div
      className="flex flex-col items-center justify-center h-screen bg-darkBackground ">
      <h1 className="text-4xl font-bold font-primary text-darkBgText">Bienvenido a Atenea</h1>
      <p className="text-lg mt-4 text-darkSecondary font-primary">Tu plataforma de estudio inteligente.</p>
      <a href="/Login" className="mt-6 px-4 py-2 bg-darkAccent text-white rounded-lg shadow-lg hover:bg-darkAccentHover transition duration-300">
        Iniciar Sesión
      </a>
    </div>
  
  );
};

export default Home;
