import {describe, test, expect } from 'vitest';
import fetch from 'node-fetch';

describe("is test file loaded correctly", () => {
    test("html loaded" ,()=>{
        return fetch("http://localhost:5500/index.html").then(response => response.text())
        .then((html) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html,"text/html")
            expect(doc.getElementById("name")?.innerHTML).toBe("Abdullah");
        });
    })
});
