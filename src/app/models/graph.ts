export class Graph {
  public nodes: any[];
  public neighbours: any;

  constructor() {
    this.nodes = [];
    this.neighbours = {};

  }

  public addNode(node: string): void {
    this.nodes.push(node);
    this.neighbours[node] = [];

  }

  public addNeighbour(node1: string, node2: string, time: number): void {
    this.neighbours[node1].push({ node: node2, time: time });
    this.neighbours[node2].push({ node: node1, time: time });
  }
}
