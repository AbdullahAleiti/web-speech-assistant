import Node from "./Node";

export default class LinkedList<T>{
    head: Node<T> | null;
    size: number;
    constructor() {
        this.head = null;
        this.size = 0;
    }

    add(node: Node<T>) {

        let current: Node<T>;

        if (this.head == null)
            this.head = node;
        else {
            current = this.head;

            while (current.next) {
                current = current.next;
            }

            current.next = node;
            node.prev = current;
        }
        this.size++;
    }

    last(): Node<T> | null {
        let temp = this.head
        while (temp && temp.next) {
            temp = temp.next
        }
        return temp
    }
}