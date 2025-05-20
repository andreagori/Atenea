// Here i'll put the two tables that show the decks and the cards in the decks.
// import { BookOpenIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, useCards } from '@/hooks/useCards';
import { CreateDeckModal } from '@/components/CreateDeckModal';
import StudyIcon from '../../assets/studyIcon.svg';
import EditIcon from '../../assets/editIcon.svg';
import DeleteIcon from '../../assets/deleteIcon.svg';
import { useState } from 'react';
import { EditCardModal } from '@/components/EditCardModal';

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

  async function onStudy(index: number) {
    console.log('Estudiando mazo:', data[index]);
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
                    onClick={() => onStudy?.(index)}
                  >
                    <img
                      src={StudyIcon}
                      alt="Study Icon"
                      className="w-5 h-5"
                      style={{ marginLeft: '4px' }}
                    >
                    </img>
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
                    >
                    </img>
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
                    >
                    </img>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isModalOpen && (
        <CreateDeckModal
          onClose={() => setIsModalOpen(false)}
          onCreate={async (title, body) => {
            if (deckToEdit) {
              await onUpdate?.(deckToEdit.deckId, title, body);
              setDeckToEdit(null);
            }
            setIsModalOpen(false);
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
interface DaisyTableProps2 {
  deckId: number;
  displayedCards: Card[];
  pageSize: number | 'Todas';
  onPageSizeChange: (size: number | 'Todas') => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalCards: number;
}

const formatLearningMethod = (method: string): string => {
  const methodMap: { [key: string]: string } = {
    activeRecall: "Repaso Activo",
    cornell: "Método de Cornell",
    visual: "Carta Visual",
    // Add more methods as needed
  };

  return methodMap[method] || method;
};

const CardsTable: React.FC<DaisyTableProps2> = ({
  deckId,
  displayedCards,
  pageSize,
  totalCards,
  currentPage,
  totalPages,
  onPageChange,
  onPageSizeChange,
}) => {
  const { cards, loading, error, deleteCard, updateCard } = useCards(deckId);
  const [editingCard, setEditingCard] = useState<Card | null>(null);

  // Check the time. 
  if (loading) {
    return (
      <div className="w-full rounded-4xl mt-2 animate-fade-in">
        <div className="flex items-center justify-center p-8">
          <div className="loading loading-spinner loading-lg text-darkSecondaryPurple"></div>
        </div>
      </div>
    );
  }
  if (error) return <div>Error: {error}</div>;
  if (!cards || cards.length === 0) return <div>No hay cartas en este mazo</div>;



  function onEdit(index: number): void {
    setEditingCard(cards[index]);
  }

  async function onDelete(index: number) {
    try {
      const card = cards[index];
      if (window.confirm(`¿Estás seguro de eliminar la carta "${card.title}"?`)) {
        await deleteCard(card.cardId);  // Usar la función deleteCard del hook
      }
    } catch (error: any) {
      console.error('Error al eliminar la carta:', error.message);
    }
  }

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
          {cards.map((card, index) => (
            <tr
              key={card.cardId}
              className="hover:bg-darkComponentElement transition-all duration-200"
              style={{ height: '60px' }}
            >
              <td>{index + 1}</td>
              <td className='text-start'>{card.title}</td>
              <td>{formatLearningMethod(card.learningMethod)}</td>
              <td>
                <div className="flex justify-center gap-2">
                  <button
                    className="btn btn-sm btn-accent"
                    onClick={() => onEdit(index)}
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
                    onClick={() => onDelete(index)}
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
              await updateCard(cardId, cardData);
              setEditingCard(null);
            } catch (error) {
              console.error("Error updating card:", error);
            }
          }}
        />
      )}
    </div>
  );
}

export { DecksTable, CardsTable };