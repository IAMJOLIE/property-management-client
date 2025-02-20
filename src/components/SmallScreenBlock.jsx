import { FaLaptop } from "react-icons/fa"; // Ikon för att förstärka budskapet

const SmallScreenBlock = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-6">
      <div className="bg-white bg-opacity-10 backdrop-blur-md shadow-2xl rounded-2xl p-8 max-w-sm text-center border border-white/20">
        <FaLaptop className="text-white text-6xl mb-4 mx-auto drop-shadow-lg" /> 
        <h2 className="text-2xl font-bold font-color-black text-gray-500 tracking-wide">Skärmstorlek ej stödd</h2>
        <p className="text-gray-500 mt-2 leading-relaxed">
          Denna applikation fungerar endast på större skärmar. Vänligen använd en dator eller en större enhet för full funktionalitet.
        </p>
       
      </div>
    </div>
  );
};

export default SmallScreenBlock;


  