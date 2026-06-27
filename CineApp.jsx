import React, { useState, useEffect } from 'react';

const CineApp = () => {
    const [seats, setSeats] = useState([
        { id: 1, codigo: 'A1', estado: 'disponible' },
        { id: 2, codigo: 'A2', estado: 'bloqueado' },
        { id: 3, codigo: 'A3', estado: 'vendido' },
        { id: 4, codigo: 'A4', estado: 'disponible' },
    ]);
    const [selectedSeat, setSelectedSeat] = useState(null);
    const [cash, setCash] = useState(0);

    const handleSale = () => {
        if (!selectedSeat || cash <= 0) return alert("Seleccione asiento y monto");
        alert(`Venta exitosa. Asiento ${selectedSeat.codigo}.`);
        // Aquí llamarías a tu API interna
    };

    return (
        <div className="p-8 bg-gray-900 min-h-screen text-white">
            <h1 className="text-3xl font-bold mb-6">SGC - Taquilla de Cine</h1>
            
            <div className="grid grid-cols-2 gap-10">
                {/* Mapa de Asientos */}
                <div className="bg-gray-800 p-6 rounded-lg">
                    <h2 className="text-xl mb-4">Mapa de Sala</h2>
                    <div className="grid grid-cols-4 gap-4">
                        {seats.map(seat => (
                            <button
                                key={seat.id}
                                onClick={() => setSelectedSeat(seat)}
                                className={`p-4 rounded font-bold ${
                                    seat.estado === 'vendido' ? 'bg-red-600' :
                                    seat.estado === 'bloqueado' ? 'bg-yellow-600' : 'bg-green-600'
                                } ${selectedSeat?.id === seat.id ? 'ring-4 ring-white' : ''}`}
                            >
                                {seat.codigo}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Formulario de Venta */}
                <div className="bg-gray-800 p-6 rounded-lg">
                    <h2 className="text-xl mb-4">Detalle de Venta</h2>
                    <p>Asiento: <span className="text-yellow-400">{selectedSeat?.codigo || 'Ninguno'}</span></p>
                    <div className="mt-4">
                        <label className="block text-sm">Pago en Efectivo:</label>
                        <input 
                            type="number" 
                            className="w-full p-2 bg-gray-700 rounded mt-1"
                            onChange={(e) => setCash(e.target.value)}
                        />
                    </div>
                    <button 
                        onClick={handleSale}
                        className="w-full mt-6 bg-blue-600 hover:bg-blue-500 p-3 rounded font-bold"
                    >
                        Confirmar Venta y Emitir Comprobante
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CineApp;