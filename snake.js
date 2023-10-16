class Node {
  constructor(value, next = null) {
    this.value = value;
    this.next = next;
  }
}
class Snake {
  constructor(pos) {
    this.prevHeadPos = null;
    this.head = new Node(pos);
    this.tail = this.head;
  }

  unshift() {
    if (this.prevHeadPos === null) {
      return;
    }
    console.log("prevHead =>", this.prevHeadPos);
    let newNode = new Node(this.prevHeadPos);
    newNode.next = this.head;
    this.head = newNode;
  }

  moveSnake(newPos) {
    this.prevHeadPos = [...this.head.value];
    let cur = this.head;

    while (cur.next) {
      cur.value = cur.next.value;
      cur = cur.next;
    }

    this.tail.value = newPos;
  }
}

export default Snake;
