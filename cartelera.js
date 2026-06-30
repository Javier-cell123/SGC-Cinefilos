import React from 'react';

// 1. Las funciones auxiliares globales
const obtenerClaseRol = (rol) => {
    if (rol === 'ADMIN') return 'bg-red-500/20 text-red-500';
    if (rol === 'VENDEDOR') return 'bg-green-500/20 text-green-500';
    return 'bg-orange-500/20 text-orange-500';
};

const obtenerEmojiProducto = (id) => {
    if (id === 1) return '🍿';
    if (id === 2) return '🥤';
    return '🧀';
};

export default function MiComponenteCine({ usuario, peliculas, productos, vista, setVista, logout, setPeliSeleccionada, venderProducto, nuevaPeli, setNuevaPeli, setPeliculas }) {
    
    // El return SIEMPRE debe estar envuelto dentro de la función del componente
    return (
        <div className="min-h-screen bg-slate-950 text-white">
            {/* NAVBAR */}
            <nav className="bg-slate-900 border-b border-slate-800 p-4 sticky top-0 z-50">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <h1 className="text-xl font-black text-indigo-500">CINEFLOW</h1>
                        <span className={`role-badge ${obtenerClaseRol(usuario?.rol)}`}>
                            {usuario?.rol}
                        </span>
                    </div>
                    
                    <div className="flex gap-2">
                        {(usuario?.rol === 'ADMIN' || usuario?.rol === 'VENDEDOR') && (
                            <button onClick={() => setVista('cartelera')} className={`px-4 py-2 rounded-lg ${vista === 'cartelera' ? 'bg-indigo-600' : ''}`}>Cartelera</button>
                        )}
                        {usuario?.rol === 'ADMIN' && (
                            <button onClick={() => setVista('admin')} className={`px-4 py-2 bg-red-600 rounded-lg font-bold ${vista === 'admin' ? 'ring-2 ring-white' : ''}`}>Gestión</button>
                        )}
                        {(usuario?.rol === 'ADMIN' || usuario?.rol === 'CONFITERIA') && (
                            <button onClick={() => setVista('confiteria')} className={`px-4 py-2 bg-orange-600 rounded-lg font-bold ${vista === 'confiteria' ? 'ring-2 ring-white' : ''}`}>Venta Dulces</button>
                        )}
                        <button onClick={logout} className="ml-4 text-slate-500 hover:text-white text-sm">Salir</button>
                    </div>
                </div>
            </nav>

            <main className="container mx-auto py-10 px-4">
                {/* VISTA: CARTELERA */}
                {vista === 'cartelera' && (usuario?.rol === 'ADMIN' || usuario?.rol === 'VENDEDOR') && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {peliculas?.map(p => (
                            <div key={p.id} className="movie-card group">
                                <img 
                                    src={p.poster} 
                                    alt={`Póster de la película ${p.titulo}`} 
                                    className="..." 
                                    onError={e => { e.target.src='...'; }}
                                />
                                <div className="p-5">
                                    <h3 className="font-bold text-lg">{p.titulo}</h3>
                                    <p className="text-slate-400 text-sm mb-4">{p.genero} • {p.horario}</p>
                                    <button onClick={() => setPeliSeleccionada(p)} className="w-full bg-indigo-600 p-2 rounded-lg font-bold">Vender Entrada</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* VISTA: CONFITERIA */}
                {vista === 'confiteria' && (usuario?.rol === 'ADMIN' || usuario?.rol === 'CONFITERIA') && (
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold mb-8 text-orange-500 text-center">Punto de Venta de Productos</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {productos?.map(prod => (
                                <div key={prod.id} className="product-card border border-slate-800 hover:border-orange-500 transition">
                                    <div className="text-5xl mb-4">{obtenerEmojiProducto(prod.id)}</div>
                                    <h3 className="font-bold text-xl">{prod.nombre}</h3>
                                    <p className="text-indigo-400 text-lg font-bold mb-2">${prod.precio}</p>
                                    <p className={`text-sm mb-4 p-2 rounded ${prod.stock < 3 ? 'bg-red-500/20 text-red-500 animate-pulse font-black' : 'text-slate-500 bg-slate-800'}`}>Stock Disponible: {prod.stock}</p>
                                    <button 
                                        onClick={() => venderProducto(prod.id)} 
                                        disabled={prod.stock === 0}
                                        className={`w-full p-3 rounded-xl font-bold transition ${prod.stock === 0 ? 'bg-slate-700 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-500 shadow-lg shadow-orange-900/20'}`}
                                    >
                                        {prod.stock === 0 ? 'SIN STOCK' : 'REGISTRAR VENTA'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* GESTIÓN */}
                {vista === 'admin' && usuario?.rol === 'ADMIN' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="bg-slate-900 p-8 rounded-3xl border border-red-900/20 admin-form shadow-2xl">
                            <h2 className="text-xl font-bold mb-6 text-red-500 uppercase tracking-widest">Panel de Control: Películas</h2>
                            <input type="text" placeholder="Título" value={nuevaPeli?.titulo} onChange={e=>setNuevaPeli({...nuevaPeli, titulo:e.target.value})} />
                            <input type="text" placeholder="Ruta Poster" value={nuevaPeli?.poster} onChange={e=>setNuevaPeli({...nuevaPeli, poster:e.target.value})} />
                            <button onClick={() => {setPeliculas([...peliculas, {...nuevaPeli, id:Date.now()}]); setNuevaPeli({titulo:'', poster:'', genero:'', horario:''});}} className="w-full bg-red-600 p-3 rounded-xl font-bold shadow-lg shadow-red-900/30">Publicar Estreno</button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}