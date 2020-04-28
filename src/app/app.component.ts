import { Component, OnInit } from '@angular/core';
import { Graph } from "./models/graph";
import { RouteService } from "./services/route.service";
import { Queue } from "./models/queue";
import { ToastService } from 'ng-uikit-pro-standard'
import { HelpersService } from "./services/helpers.service";
import { RouteInfo } from "./models/route-info.model";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  private routeGraph: Graph;
  public routeData: any;
  public pysakitDropDownData: any[];
  public routePoints = {
    startNode: null,
    endNode: null
  };
  public routeInfo: RouteInfo;
  public buslines: any[] = [];
  public routeCalculated: boolean;

  constructor(
    private routeService: RouteService,
    private toastServce: ToastService,
    private helpers: HelpersService
  ) {}

  ngOnInit(): void {
    this.routeData = this.routeService.getRouteData();
    this.routeGraph = this.helpers.buildGraph(this.routeData);
    this.pysakitDropDownData = [];
    this.routeData.pysakit.forEach(pysakki => {
      this.pysakitDropDownData.push({ value: pysakki, label: pysakki });
    });
  }

  public getRoute(): void {
    if (this.routePoints.startNode === this.routePoints.endNode) {
      this.toastServce.info("Olet jo kulkenut valitsemasi matkan...", "", { opacity: 1 });
    } else {
      this.buslines = [];
      this.routeInfo = this.calculateRoute(this.routePoints.startNode, this.routePoints.endNode);
      this.getBuslines(this.routeInfo.route);
      this.routeCalculated = true;
    }
  }

  private getBuslines(route: string[]): void {
    let lineFound = false;
    let selectedBusline = null;
    for (let routeIndex = route.length; routeIndex > 0; routeIndex--) {
      for (let line of Object.keys(this.routeData.linjastot)) {
        if (this.helpers.isRouteInSingleBusline(route.slice(0, routeIndex), this.routeData.linjastot[line])) {
          selectedBusline = {
            route: route.slice(0, routeIndex),
            line: line
          }
          lineFound = true;
          break;
        }
      }
      if (lineFound) {
        break;
      }
    }
    if (selectedBusline === null) {
      //Tänne ei pitäisi päätyä missään vaiheessa, koska bussittomat reitit on lähtökohtaisesti karsittu pois, mutta null-check varmuuden vuoksi kuitenkin...
      selectedBusline = {
        route: route,
        line: "I walk the line..."
      }
    }

    this.buslines.push(selectedBusline);
    const lastNodeOfSelectedBusline = selectedBusline.route[selectedBusline.route.length - 1];

    if (lastNodeOfSelectedBusline !== this.routePoints.endNode) {
      const nextRoutePart = route.slice(route.indexOf(lastNodeOfSelectedBusline), route.length);
      this.getBuslines(nextRoutePart);
    }
  }

  private calculateRoute(startNode: string, endNode: string): RouteInfo {
    const times = {};
    const backtrace = {};
    const queue = new Queue();

    times[startNode] = 0;

    this.routeGraph.nodes.forEach(node => {
      if (node !== startNode) {
        times[node] = Infinity;
      }
    });

    queue.addToQueue([startNode, 0]);

    while (!queue.isEmpty()) {
      const shortestStep = queue.deQueue();
      const currentNode = shortestStep[0];
      this.routeGraph.neighbours[currentNode].forEach(neighbour => {
        const time = times[currentNode] + neighbour.time;
        if (time < times[neighbour.node]) {
          times[neighbour.node] = time;
          backtrace[neighbour.node] = currentNode;
          queue.addToQueue([neighbour.node, time]);
        }
      });
    }

    const route = [endNode];
    let lastStep = endNode;
    while (lastStep !== startNode) {
      route.unshift(backtrace[lastStep]);
      lastStep = backtrace[lastStep];
    }

    return {
      route: route,
      time: times[endNode]
    }
  }
}

