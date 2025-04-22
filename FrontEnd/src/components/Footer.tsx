/*
La diferencia entre rfc y rfce es que rfce incluye la exportación del componente por defecto, mientras que rfc no lo hace.
rfc se recomienda si tengo varios componentes en el mismo archivo y rfce si tengo un solo componente por archivo.

*/

function Footer() {
  return (
    <div className="bg-darkComponent2 h-[5vw] text-darkBgText flex items-center justify-center">
        Footer
    </div>
  )
}

export default Footer