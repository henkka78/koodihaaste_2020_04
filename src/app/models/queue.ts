export class Queue {
  private queue: any[];

  constructor() {
    this.queue = [];
  }

  public addToQueue(element: any[]): void {
    if (this.isEmpty()) {
      this.queue.push(element);
    } else {
      let added = false;
      for (let i = 1; i <= this.queue.length; i++) {
        if (element[1] < this.queue[i - 1][1]) {
          this.queue.splice(i - 1, 0, element);
          added = true;
          break;
        }
      }
      if (!added) {
        this.queue.push(element);
      }
    }
  };

  public deQueue(): any {
    return this.queue.shift();
  };

  public isEmpty(): boolean {
    return this.queue.length === 0;
  };

}
