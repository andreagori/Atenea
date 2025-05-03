/*
La diferencia entre rfc y rfce es que rfce incluye la exportación del componente por defecto, mientras que rfc no lo hace.
rfc se recomienda si tengo varios componentes en el mismo archivo y rfce si tengo un solo componente por archivo.

*/

function Footer() {
  return (
    <footer className="bg-darkComponent2 text-darkBgText mt-10 py-6 px-4 flex flex-col md:flex-row justify-between items-center text-sm">
      <div className="mb-4 md:mb-0 text-center md:text-left">
        <h2 className="text-lg font-semibold mb-1">Atenea</h2>
        <p>© {new Date().getFullYear()} Todos los derechos reservados.</p>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-6">
        <a href="#quienesomos" className="hover:text-accent transition-colors">¿Quiénes somos?</a>
        <a className="hover:text-accent transition-colors">Contacto: rivas.andrea@uabc.edu.mx</a>
      </div>
    </footer>
  );
}

export default Footer;
