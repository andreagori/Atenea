// The select for the decks in the study session. Testing the daisyUI select component.
const SelectDecksStudySession: React.FC = () => {
    return (
    <select defaultValue="" className="select select-lg select-primary bg-darkPSText font-primary font-bold text-lg text-darkComponent rounded-2xl">
        <option disabled value="">
          Nombre del mazo:
        </option>
        <option value="vscode">VScode</option>
        <option value="vscode-fork">VScode fork</option>
        <option value="another-fork">Another VScode fork</option>
      </select>
    );
  };
  
export default SelectDecksStudySession