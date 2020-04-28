export class RouteData {
  pysakit: string[];
  tiet: Edge[];
  linjastot: {
    keltainen: string[];
    punainen: string[];
    vihreä: string[];
    sininen: string[];
  };
  haettavaReitti: ReitinPaat;
}

export class Edge {
  mista: string;
  mihin: string;
  kesto: number;
}

export class ReitinPaat {
  alku: string;
  loppu: string;
}
