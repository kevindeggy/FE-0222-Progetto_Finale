import { Comune } from "./comune";

export interface Sede {
  id: number,
  via: string,
  civico: string,
  cap: string,
  localita: string,
  comune: Comune
}
