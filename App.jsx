import React, { useState } from 'react';

export default function CineApp() {
  const [seleccionado, setSeleccionado] = useState(null);
  const [efectivo, setEfectivo] = useState(0);

  const asientosDemo = [
    { id: 1, codigo: 'A1', estado: 'disponible' },
    { id: 2, codigo: 'A2', estado: 'vendido' },
    { id: 3, codigo: 'A3', estado: 'disponible' },
    { id: 4, codigo: 'A4', estado: 'bloqueado' }
  ];

  const handleVenta = () => {
    const total = 5000;
    if (efectivo < total) return alert("Efectivo insuficiente");
    alert(`Venta exitosa!\nAsiento: ${seleccionado.codigo}\nVuelto: $${efectivo - total}`);
    setSeleccionado(null);
  };

  return (
    <div style={{ background: '#121212', color: 'white', minHeight: '100vh', padding: '40px' }}>
      <h1>🎥 SGC - Taquilla</h1>
      <div style={{ display: 'flex', gap: '50px' }}>
        {/* Mapa de Asientos (Objetivo 3) */}
        <div>
          <h3>Sala 1 - Avengers</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 60px)', gap: '15px' }}>
            {asientosDemo.map(a => (
              <button
                key={a.id}
                onClick={() => setSeleccionado(a)}
                disabled={a.estado !== 'disponible'}
                style={{
                  padding: '20px',
                  backgroundColor: seleccionado?.id === a.id ? '#3b82f6' : 
                                   a.estado === 'vendido' ? '#ef4444' : '#22c55e',
                  border: 'none', borderRadius: '5px', color: 'white', cursor: 'pointer'
                }}
              >
                {a.codigo}
              </button>
            ))}
          </div>
        </div>

        {/* Panel de Pago (Objetivo 4) */}
        <div style={{ background: '#1e1e1e', padding: '20px', borderRadius: '10px', width: '300px' }}>
          <h3>Registro de Pago</h3>
          <p>Asiento: {seleccionado?.codigo || '---'}</p>
          <input 
            type="number" 
            placeholder="Efectivo" 
            style={{ width: '100%', padding: '10px', marginBottom: '15px' }}
            onChange={(e) => setEfectivo(e.target.value)}
          />
          <button 
            onClick={handleVenta}
            style={{ width: '100%', padding: '10px', backgroundColor: '#2563eb', color: 'white', fontWeight: 'bold' }}
          >
            CONFIRMAR VENTA
          </button>
        </div>
      </div>
    </div>
  );
}