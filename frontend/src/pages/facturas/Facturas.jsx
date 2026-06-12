import FormularioFactura from "../../components/factura/FormularioFactura";
import VistaPreviaFactura from "../../components/factura/VistaPreviaFactura";
import Navbar from "../../components/Navbar";
import { useState } from "react";

function Facturas() {
  // Función para obtener la fecha actual en zona horaria de Colombia
  const obtenerFechaColombiana = () => {
    const ahora = new Date();
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Bogota',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    const partes = formatter.formatToParts(ahora);
    const fecha = `${partes.find(p => p.type === 'year').value}-${partes.find(p => p.type === 'month').value}-${partes.find(p => p.type === 'day').value}`;
    return fecha;
  };

  const [factura, setFactura] = useState({
    nombre: "",

    apellido: "",

    identificacion: "",

    telefono: "",

    tituloAviso: "",

    descripcion: "",

    categorias: [],

    cantidad: 1,

    valor: "",

    fechaPublicacion: "",

    fechaRecibido: obtenerFechaColombiana(),

    idCliente: null,
  });

  return (
    <div>
      <Navbar />
      <div className="container-fluid mt-3">
        <div className="row">
          <div className="col-lg-4 bg-light p-4 border-end">
            <FormularioFactura factura={factura} setFactura={setFactura} />
          </div>

          <div className="col-lg-8 p-4">
            <VistaPreviaFactura factura={factura} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Facturas;
