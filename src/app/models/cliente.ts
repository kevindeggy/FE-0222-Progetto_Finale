import { Sede } from "./sede"

export interface Cliente {
  id: number,
  ragioneSociale: string,
  partitaIva: number,
  tipoCliente: "SRL" | "SPA" | "SAS" | "PA",
  email: string,
  pec: string,
  telefono: string,
  nomeContatto: string,
  cognomeContatto: string,
  telefonoContatto: string,
  emailContatto: string,
  indirizzoSedeOperativa: Sede,
  indirizzoSedeLegale: Sede,
  dataInserimento: Date,
  dataUltimoContatto: Date,
  fatturatoAnnuale: number
}
