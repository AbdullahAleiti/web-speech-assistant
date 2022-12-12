export default class Node<T> {
    element: T;
    x: number;
    y: number;
    prev: Node<T> | null;
    next: Node<T> | null;

    constructor(element: T) {
        this.element = element;
        this.x = (element as HTMLElement).getBoundingClientRect().x + window.scrollX
        this.y = (element as HTMLElement).getBoundingClientRect().y + window.scrollY
        this.next = null
        this.prev = null
    }

    focus() {
        (this.element as HTMLElement).focus()
    }
}