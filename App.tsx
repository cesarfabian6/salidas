import React, { useState, useEffect } from 'react';

interface SalidaParticular {
  fecha: string;
  horaSalida: string;
  horaRegreso: string;
  motivo: string;
  tiempoUtilizado: string;
}

const SalidasParticularesApp = () => {
  const [salidasParticulares, setSalidasParticulares] = useState<SalidaParticular[]>([]);
  const [fecha, setFecha] = useState('');
  const [horaSalida, setHoraSalida] = useState('');
  const [horaRegreso, setHoraRegreso] = useState('');
  const [motivo, setMotivo] = useState('');
  const [sinRetorno, setSinRetorno] = useState(false);
  const [tiempoTotal, setTiempoTotal] = useState(12 * 60);
  const [tiempoUtilizado, setTiempoUtilizado] = useState(0);

  useEffect(() => {
    const storedSalidasParticulares = localStorage.getItem('salidasParticulares');
    if (storedSalidasParticulares) {
      setSalidasParticulares(JSON.parse(storedSalidasParticulares));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('salidasParticulares', JSON.stringify(salidasParticulares));
    calcularTiempoUtilizado();
  }, [salidasParticulares]);

  const calcularTiempoUtilizado = () => {
    let tiempoUtilizado = 0;
    salidasParticulares.forEach((salida) => {
      const horaSalidaParts = salida.horaSalida.split(':');
      const horaRegresoParts = salida.horaRegreso.split(':');
      const horaSalidaMinutes = parseInt(horaSalidaParts[0]) * 60 + parseInt(horaSalidaParts[1]);
      const horaRegresoMinutes = parseInt(horaRegresoParts[0]) * 60 + parseInt(horaRegresoParts[1]);
      tiempoUtilizado += horaRegresoMinutes - horaSalidaMinutes;
    });
    setTiempoUtilizado(tiempoUtilizado);
  };

  const handleAgregarSalida = () => {
    const nuevaSalida: SalidaParticular = {
      fecha,
      horaSalida,
      horaRegreso: sinRetorno ? 'Sin retorno' : horaRegreso,
      motivo,
      tiempoUtilizado: '',
    };
    setSalidasParticulares([...salidasParticulares, nuevaSalida]);
    setFecha('');
    setHoraSalida('');
    setHoraRegreso('');
    setMotivo('');
    setSinRetorno(false);
  };

  const handleBorrarDatos = () => {
    setSalidasParticulares([]);
    setTiempoTotal(12 * 60);
    setTiempoUtilizado(0);
    localStorage.removeItem('salidasParticulares');
  };

  const handleExportarInforme = () => {
    const informe = salidasParticulares.map((salida) => {
      return `Fecha: ${salida.fecha}, Hora de salida: ${salida.horaSalida}, Hora de regreso: ${salida.horaRegreso}, Motivo: ${salida.motivo}`;
    }).join('\n');
    navigator.clipboard.writeText(informe);
  };

  const tiempoRemanente = tiempoTotal - tiempoUtilizado;
  const horasRemanentes = Math.floor(tiempoRemanente / 60);
  const minutosRemanentes = tiempoRemanente % 60;
  const horasUtilizadas = Math.floor(tiempoUtilizado / 60);
  const minutosUtilizados = tiempoUtilizado % 60;

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Salidas Particulares</h1>
      <form className="mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fecha">
            Fecha
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="fecha"
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="horaSalida">
            Hora de salida
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="horaSalida"
            type="time"
            value={horaSalida}
            onChange={(e) => setHoraSalida(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="horaRegreso">
            Hora de regreso
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="horaRegreso"
            type="time"
            value={horaRegreso}
            onChange={(e) => setHoraRegreso(e.target.value)}
            disabled={sinRetorno}
          />
          <div className="mt-2">
            <input
              className="mr-2"
              id="sinRetorno"
              type="checkbox"
              checked={sinRetorno}
              onChange={(e) => setSinRetorno(e.target.checked)}
            />
            <label className="text-gray-700 text-sm font-bold" htmlFor="sinRetorno">
              Sin retorno
            </label>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="motivo">
            Motivo
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="motivo"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
          />
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
          onClick={handleAgregarSalida}
        >
          Agregar salida
        </button>
      </form>
      <h2 className="text-2xl font-bold mb-4">Salidas particulares registradas</h2>
      <ul>
        {salidasParticulares.map((salida, index) => (
          <li key={index} className="mb-4">
            <p>Fecha: {salida.fecha}</p>
            <p>Hora de salida: {salida.horaSalida}</p>
            <p>Hora de regreso: {salida.horaRegreso}</p>
            <p>Motivo: {salida.motivo}</p>
          </li>
        ))}
      </ul>
      <p className="mb-4">
        Tiempo utilizado: {horasUtilizadas} horas {minutosUtilizados} minutos
      </p>
      <p className="mb-4">
        Tiempo remanente: {horasRemanentes} horas {minutosRemanentes} minutos
      </p>
      <button
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        type="button"
        onClick={handleBorrarDatos}
      >
        Borrar datos
      </button>
      <button
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-4"
        type="button"
        onClick={handleExportarInforme}
      >
        Exportar informe
      </button>
    </div>
  );
};

export default SalidasParticularesApp;