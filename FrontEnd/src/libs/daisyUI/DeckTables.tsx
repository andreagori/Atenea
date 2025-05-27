// Here i'll put the two tables that show the decks and the cards in the decks.
// import { BookOpenIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/hooks/useCards';
import { CreateDeckModal } from '@/components/CreateDeckModal';
import StudyIcon from '../../assets/studyIcon.svg';
import EditIcon from '../../assets/editIcon.svg';
import DeleteIcon from '../../assets/deleteIcon.svg';
import { useState } from 'react';
import { EditCardModal } from '@/components/EditCardModal';

type PageSize = 5 | 10 | 25 | 50 | 'Todas';

// DECKS TABLE. For now, it is an example of how it would look.
interface TableRow {
  deckId: number;
  title: string;
  body: string;
}

interface DaisyTableProps {
  data: TableRow[];
  onDelete?: (deckId: number) => Promise<void>;
  onUpdate?: (deckId: number, title: string, body: string) => Promise<void>;
}

const DecksTable: React.FC<DaisyTableProps> = ({ data, onDelete, onUpdate }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deckToEdit, setDeckToEdit] = useState<TableRow | null>(null);

  const handleRowClick = (index: number) => {
    const titleSlug = encodeURIComponent(data[index].title);
    navigate(`/mazos/${titleSlug}`);
  };

  function onEdit(index: number, event: React.MouseEvent): void {
    event.stopPropagation();
    setDeckToEdit(data[index]);
    setIsModalOpen(true);
  }

  async function handleDelete(deck: TableRow, event: React.MouseEvent): Promise<void> {
    event.stopPropagation();
    try {
      if (window.confirm(`¿Estás seguro de eliminar el mazo "${deck.title}"?`)) {
        onDelete && await onDelete(deck.deckId);
      }
    } catch (error: any) {
      console.error('Error al eliminar el mazo:', error.message);
    }
  }

  // Función para redirigir a sesión de estudio con el mazo seleccionado
  async function onStudy(deck: TableRow, event: React.MouseEvent) {
    event.stopPropagation();
    // Redirigir a sesión de estudio con el deckId como parámetro
    navigate(`/sesionesEstudio?deckId=${deck.deckId}`);
  }

  return (
    <div className="overflow-x-auto w-full rounded-4xl">
      <table className="table table-md border-10 w-full text-lightComponent text-center border-darkComponent">
        <thead className="text-xl text-white bg-darkComponent border-b-3 border-white">
          <tr>
            <th className="px-2 py-2 w-1/12">#</th>
            <th className="px-4 py-2">Título</th>
            <th className="px-4 py-2">Descripción</th>
            <th className="px-4 py-2 w-1/4">Opciones</th>
          </tr>
        </thead>
        <tbody className="text-white bg-darkComponent">
          {data.map((deck, index) => (
            <tr
              key={index}
              className="hover:bg-darkComponentElement transition-all duration-200"
              style={{ height: '60px' }}
              onClick={() => handleRowClick(index)}
            >
              <td>{index + 1}</td>
              <td>{deck.title}</td>
              <td>{deck.body}</td>
              <td>
                <div className="flex justify-center gap-2">
                  <button
                    className="btn btn-sm btn-info"
                    onClick={(e) => onStudy(deck, e)}
                    title="Estudiar mazo"
                  >
                    <img
                      src={StudyIcon}
                      alt="Study Icon"
                      className="w-5 h-5"
                      style={{ marginLeft: '4px' }}
                    />
                    Estudiar
                  </button>
                  <button
                    className="btn btn-sm btn-accent"
                    onClick={(e) => onEdit?.(index, e)}
                    title='Editar mazo'
                  >
                    <img
                      src={EditIcon}
                      alt="Edit Icon"
                      className="w-5 h-5"
                      style={{ marginLeft: '2px' }}
                    />
                  </button>
                  <button
                    className="btn btn-sm btn-error"
                    onClick={(e) => handleDelete(deck, e)}
                    title='Eliminar mazo'
                  >
                    <img
                      src={DeleteIcon}
                      alt="Delete Icon"
                      className="w-5 h-5"
                      style={{ marginLeft: '2px' }}
                    />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isModalOpen && (
        <CreateDeckModal
          onClose={() => {
            setIsModalOpen(false);
            setDeckToEdit(null);
          }}
          onCreate={async (title, body) => {
            try {
              if (deckToEdit && onUpdate) {
                await onUpdate(deckToEdit.deckId, title, body);
              }
            } catch (error) {
              console.error('Error updating deck:', error);
            } finally {
              setIsModalOpen(false);
              setDeckToEdit(null);
            }
          }}
          initialTitle={deckToEdit?.title || ''}
          initialDescription={deckToEdit?.body || ''}
          editMode={!!deckToEdit}
        />
      )}
    </div>
  );
};

// CARDS TABLE. For now, it is an example of how it would look.
// Actualiza la interfaz para incluir el deckId
// ... imports existentes ...

interface DaisyTableProps2 {
  deckId: number;
  displayedCards: Card[];
  pageSize: number | 'Todas';
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: PageSize) => void;
  totalCards: number;
  onDeleteCard: (cardId: number) => Promise<void>;
  onUpdateCard: (cardId: number, cardData: any) => Promise<void>;
}

const formatLearningMethod = (method: string): string => {
  const methodMap: { [key: string]: string } = {
    activeRecall: "Repaso Activo",
    cornell: "Método de Cornell",
    visualCard: "Carta Visual",
  };
  return methodMap[method] || method;
};

const CardsTable: React.FC<DaisyTableProps2> = ({
  displayedCards,
  pageSize,
  currentPage,
  onDeleteCard,
  onUpdateCard
}) => {
  const [editingCard, setEditingCard] = useState<Card | null>(null);

  if (!displayedCards || displayedCards.length === 0) {
    return <div>No hay cartas en este mazo</div>;
  }

  function onEdit(card: Card): void {
    setEditingCard(card);
  }

  async function onDelete(card: Card) {
    try {
      if (window.confirm(`¿Estás seguro de eliminar la carta "${card.title}"?`)) {
        await onDeleteCard(card.cardId);
      }
    } catch (error: any) {
      console.error('Error al eliminar la carta:', error.message);
    }
  }

  const getCardNumber = (index: number): number => {
    if (pageSize === 'Todas') return index + 1;
    return (currentPage - 1) * Number(pageSize) + index + 1;
  };

  return (
    <div className="overflow-x-auto w-full rounded-4xl mt-2">
      <table className="table table-md border-10 w-full text-lightComponent text-center border-darkPrimaryPurple2">
        <thead className="text-xl text-white bg-darkPrimaryPurple2 border-b-3 border-white">
          <tr>
            <th className="px-2 py-2 w-1/12">#</th>
            <th className="px-4 py-2">Título</th>
            <th className="px-4 py-2">Tipo de Carta</th>
            <th className="px-4 py-2 w-1/4">Opciones</th>
          </tr>
        </thead>
        <tbody className="text-white bg-darkPrimaryPurple2">
          {displayedCards.map((card, index) => (
            <tr
              key={card.cardId}
              className="hover:bg-darkComponentElement transition-all duration-200"
              style={{ height: '60px' }}
            >
              <td>{getCardNumber(index)}</td>
              <td className='text-start'>{card.title}</td>
              <td>{formatLearningMethod(card.learningMethod)}</td>
              <td>
                <div className="flex justify-center gap-2">
                  <button
                    className="btn btn-sm btn-accent"
                    onClick={() => onEdit(card)}
                    title='Editar carta'
                  >
                    <img
                      src={EditIcon}
                      alt="Edit Icon"
                      className="w-5 h-5"
                    />
                  </button>
                  <button
                    className="btn btn-sm btn-error"
                    onClick={() => onDelete(card)}
                    title='Eliminar carta'
                  >
                    <img
                      src={DeleteIcon}
                      alt="Delete Icon"
                      className="w-5 h-5"
                    />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {editingCard && (
        <EditCardModal
          card={editingCard}
          onClose={() => setEditingCard(null)}
          onUpdate={async (cardId, cardData) => {
            try {
              await onUpdateCard(cardId, cardData);
              setEditingCard(null);
            } catch (error) {
              console.error("Error updating card:", error);
            }
          }}
        />
      )}
    </div>
  );
};

export { DecksTable, CardsTable };