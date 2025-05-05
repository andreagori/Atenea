// Here i'll put the two tables that show the decks and the cards in the decks.

// DECKS TABLE. For now, it is an example of how it would look.
interface TableRow {
    title: string;
    body: string;
  }
  
  interface DaisyTableProps {
    data: TableRow[];
  }
  
  const DecksTable: React.FC<DaisyTableProps> = ({ data }) => {
    return (
      <div className="overflow-x-auto w-full">
        <table className="table table-md border w-full text-lightComponent text-center">
        <thead className="text-base text-darkPrimary bg-darkInfo border-b-2 border-darkPrimary">
            <tr>
              <th className="px-2 py-2 w-1/12">#</th>
              <th className="px-4 py-2">Título</th>
              <th className="px-4 py-2">Descripción</th>
              <th className="px-4 py-2 w-1/4">Opciones</th>
            </tr>
          </thead>
          <tbody className="bg-darkInfo text-darkPrimary">
            {data.map((row, index) => (
              <tr
                key={row.title}
                className="hover:bg-darkAccent transition-all duration-200"
                style={{ height: '60px' }}
              >
                <td>{index + 1}</td>
                <td>{row.title}</td>
                <td>{row.body}</td>
                <td>
                  <div className="flex justify-center gap-2">
                    <button className="btn btn-sm btn-accent">Estudiar</button>
                    <button className="btn btn-sm btn-info">Editar</button>
                    <button className="btn btn-sm btn-error">Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };


// CARDS TABLE
interface TableRow2 {
    title: string;
    body: string;
    cardType: string;
  }
  
  interface DaisyTableProps2 {
    data: TableRow2[];
  }

const CardsTable: React.FC<DaisyTableProps2> = ({ data }) => {
    return (
        <div className="overflow-x-auto w-full">
            <table className="table table-md border w-full text-lightComponent text-center">
                <thead className="text-base text-darkPrimary bg-darkInfo border-b-2 border-darkPrimary">
                    <tr>
                        <th className="px-2 py-2 w-1/12">#</th>
                        <th className="px-4 py-2">Título</th>
                        <th className="px-4 py-2">Descripción</th>
                        <th className="px-4 py-2 w-1/4">Tipo de Carta</th>
                        <th className="px-4 py-2 w-1/4">Opciones</th>
                    </tr>
                </thead>
                <tbody className="bg-darkInfo text-darkPrimary">
                    {data.map((row, index) => (
                        <tr
                            key={row.title}
                            className="hover:bg-darkAccent transition-all duration-200"
                            style={{ height: '60px' }}
                        >
                            <td>{index + 1}</td>
                            <td>{row.title}</td>
                            <td>{row.body}</td>
                            <td>{row.cardType}</td>
                            <td>
                                <div className="flex justify-center gap-2">
                                    <button className="btn btn-sm btn-info">Editar</button>
                                    <button className="btn btn-sm btn-error">Eliminar</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export {DecksTable, CardsTable};