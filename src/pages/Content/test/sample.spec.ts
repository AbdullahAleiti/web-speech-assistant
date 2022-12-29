import {describe, test, expect } from 'vitest';

describe("Example File", () => {
    test("Sample test", () => {
        document.body.innerHTML = "<h1>hello world</h1>"
        expect(window.innerHeight).equal(4);
    });
});
