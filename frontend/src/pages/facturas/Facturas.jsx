import FormularioFactura from "../../components/factura/FormularioFactura";
import VistaPreviaFactura from "../../components/factura/VistaPreviaFactura";
import Navbar from "../../components/Navbar";
import { useEffect, useState } from "react";
import { obtenerSiguienteNumeroFactura } from "../../services/facturaService";

function Facturas() {
  const obtenerFechaColombiana = () => {
    const ahora = new Date();
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Bogota",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const partes = formatter.formatToParts(ahora);
    return `${partes.find((p) => p.type === "year").value}-${partes.find((p) => p.type === "month").value}-${partes.find((p) => p.type === "day").value}`;
  };

  const [factura, setFactura] = useState({
    numeroFactura: "",
    nombre: "",
    apellido: "",
    identificacion: "",
    telefono: "",
    tituloAviso: "",
    descripcion: "",
    categorias: [], // ← este es el que falla si no está
    cantidad: 1,
    valor: "",
    fechaPublicacion: "",
    fechaRecibido: obtenerFechaColombiana(),
    idCliente: null,
  });

  const cargarNumeroFactura = async () => {
    try {
      const data = await obtenerSiguienteNumeroFactura();
      setFactura((prev) => ({ ...prev, numeroFactura: data.numero_factura }));
      return data;
    } catch (error) {
      console.error("Error cargando número de factura", error);
    }
  };

  useEffect(() => {
    cargarNumeroFactura();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="container-fluid mt-3">
        <div className="row">
          <div className="col-lg-4 bg-light p-4 border-end">
            <FormularioFactura
              factura={factura}
              setFactura={setFactura}
              cargarNumeroFactura={cargarNumeroFactura}
            />
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
