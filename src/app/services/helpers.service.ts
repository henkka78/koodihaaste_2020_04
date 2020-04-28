import { Injectable } from '@angular/core';
import { Graph } from "../models/graph";

@Injectable({
  providedIn: 'root'
})
export class HelpersService {

  public isRouteInSingleBusline(route: string[], line: string[]): boolean {
    //Välivaihe, jossa käännetään reitti toisin päin, ellei löydy oikein päin linjasta.
    const hasRoute = this.buslineHasRoute(route, line);
    if (hasRoute) {
      return hasRoute;
    }
    return this.buslineHasRoute([...route].reverse(), line);
  }

  private buslineHasRoute(route: string[], line: string[]): boolean {
    for (let lineIndex = 0; lineIndex < 1 + (line.length - route.length); lineIndex++) {
      let routeIndex = 0;
      for (; routeIndex < route.length; routeIndex++) {
        if (line[lineIndex + routeIndex] !== route[routeIndex]) {
          break;
        }
      }
      if (routeIndex === route.length) {
        return true;
      }
    }
    return false;
  }

  public buildGraph(routeData: any): Graph {
    const graph = new Graph;
    routeData.pysakit.forEach(pysakki => {
      graph.addNode(pysakki);
    });

    routeData.tiet.forEach(tie => {
      //Lisätään reittigraafiin vain ne tiet, joilla kulkee bussi, sillä käsittääkseni vain sellaiset reitit hyväksytään lopputulokseen,
      //jotka pääsee bussin kyydissä alusta loppuun.
      if (this.isRouteInAnyBusline([tie.mista, tie.mihin], routeData.linjastot)) {
        graph.addNeighbour(tie.mista, tie.mihin, tie.kesto);
      }
    });
    return graph;
  }

  private isRouteInAnyBusline(route: string[], lines: any): boolean {
    for (let line of Object.keys(lines)) {
      if (this.isRouteInSingleBusline(route, lines[line])) {
        return true;
      }
    }
    return false;
  }
}
