export function ActiveRecall() {
    return (
        <div className="font-primary text-white">
            <label className="block text-m mb-1 font-semibold">
                Titulo:
            </label>
            <textarea className="w-full bg-darkInfo h-24 rounded p-2 text-darkPrimaryPurple2" />

            <label className="block text-m mb-1 mt-2 font-semibold">
                Descripción:
            </label>
            <textarea className="w-full bg-darkInfo h-24 rounded p-2 text-darkPrimaryPurple2" />
        </div>
    );
}

export function CornellMethod() {
    return (
        <div className="font-primary font-semibold text-white">
            <label className="block text-sm mb-2">Titulo:</label>
            <input className="w-full p-2 rounded text-darkPrimaryPurple2 bg-darkInfo mb-2"/>
            <label className="block text-sm mb-2">Nota principal:</label>
            <textarea className="w-full p-2 rounded text-darkPrimaryPurple2 bg-darkInfo mb-2" />
            {/* Aqui en estas, deberia de hacer una mejor opcion para agregar las preguntas de manera automatica. */}
            <label className="block text-sm mb-2">Preguntas de la nota:</label>
            <textarea className="w-full p-2 rounded text-darkPrimaryPurple2 bg-darkInfo mb-2" />
            <label className="block text-sm mb-2">Nota corta:</label>
            <textarea className="w-full p-2 rounded text-darkPrimaryPurple2 bg-darkInfo mb-2" />
        </div>
    );
}

export function VisualCard() {
    return (
        <div className="font-primary text-white">
            <label className="block text-m mb-1 font-semibold">
                Titulo:
            </label>
            <textarea className="w-full text-darkPrimaryPurple2 bg-darkInfo h-24 rounded p-2" />
            <label className="block text-m mb-1 font-semibold">
                Seleccionar imagen:
            </label>
            <input className="w-full p-2 rounded text-darkPrimaryPurple2 font-semibold bg-darkInfo " type="file" accept="image/*" />
        </div>
    );
}
