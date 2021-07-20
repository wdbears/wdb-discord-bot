class Queue {
  constructor() {
    this.items = [];
  }

  enqueue(element) {
    // adding element to the queue
    this.items.push(element);
  }

  dequeue() {
    if (this.isEmpty()) return 'Underflow';
    return this.items.shift();
  }

  front() {
    if (this.isEmpty()) return 'No elements in Queue';
    return this.items[0];
  }

  isEmpty() {
    return this.items.length === 0;
  }

  // printQueue function
  printQueue() {
    let str = '';
    for (let i = 0; i < this.items.length; i += 1) str += `${this.items[i]}  `;
    return str;
  }
}

export default Queue;
