export function locateByText(text: string): Element | null {
    // iterate through all nodes in depth first (preOrder) fashion
    // return the node as soon as it's found
    let wantedNode: Element | null = null;
    for (let node of walkPreOrder(document.body)) {
        if (node.textContent?.toLowerCase()?.split(/[,*."\s]/)?.includes(text) && node.tagName !== 'BODY' && node.tagName !== 'SCRIPT') {
            wantedNode = node
        }
    }
    return wantedNode
}

export function* walkPreOrder(node: Element): any {
    if (!node) return
    yield node
    for (let child of node.children) {
        yield* walkPreOrder(child)
    }
}

export function addScript(src: string) {
    return new Promise((resolve, reject) => {
        const s = document.createElement('script');

        s.setAttribute('src', src);
        s.addEventListener('load', resolve);
        s.addEventListener('error', reject);

        document.body.appendChild(s);
    });
}