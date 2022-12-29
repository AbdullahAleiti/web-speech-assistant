export const icons = {
    Command: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="#ffc526" d="M6.5 21q-1.45 0-2.475-1.025Q3 18.95 3 17.5q0-1.45 1.025-2.475Q5.05 14 6.5 14H8v-4H6.5q-1.45 0-2.475-1.025Q3 7.95 3 6.5q0-1.45 1.025-2.475Q5.05 3 6.5 3q1.45 0 2.475 1.025Q10 5.05 10 6.5V8h4V6.5q0-1.45 1.025-2.475Q16.05 3 17.5 3q1.45 0 2.475 1.025Q21 5.05 21 6.5q0 1.45-1.025 2.475Q18.95 10 17.5 10H16v4h1.5q1.45 0 2.475 1.025Q21 16.05 21 17.5q0 1.45-1.025 2.475Q18.95 21 17.5 21q-1.45 0-2.475-1.025Q14 18.95 14 17.5V16h-4v1.5q0 1.45-1.025 2.475Q7.95 21 6.5 21Zm0-2q.625 0 1.062-.438Q8 18.125 8 17.5V16H6.5q-.625 0-1.062.438Q5 16.875 5 17.5t.438 1.062Q5.875 19 6.5 19Zm11 0q.625 0 1.062-.438Q19 18.125 19 17.5t-.438-1.062Q18.125 16 17.5 16H16v1.5q0 .625.438 1.062q.437.438 1.062.438ZM10 14h4v-4h-4ZM6.5 8H8V6.5q0-.625-.438-1.062Q7.125 5 6.5 5t-1.062.438Q5 5.875 5 6.5t.438 1.062Q5.875 8 6.5 8ZM16 8h1.5q.625 0 1.062-.438Q19 7.125 19 6.5t-.438-1.062Q18.125 5 17.5 5t-1.062.438Q16 5.875 16 6.5Z"/></svg>',
    Search: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="#ffc526" d="m19.6 21l-6.3-6.3q-.75.6-1.725.95Q10.6 16 9.5 16q-2.725 0-4.612-1.887Q3 12.225 3 9.5q0-2.725 1.888-4.613Q6.775 3 9.5 3t4.613 1.887Q16 6.775 16 9.5q0 1.1-.35 2.075q-.35.975-.95 1.725l6.3 6.3ZM9.5 14q1.875 0 3.188-1.312Q14 11.375 14 9.5q0-1.875-1.312-3.188Q11.375 5 9.5 5Q7.625 5 6.312 6.312Q5 7.625 5 9.5q0 1.875 1.312 3.188Q7.625 14 9.5 14Z"/></svg>',
    Input: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="#ffc526" d="M4 20q-.825 0-1.412-.587Q2 18.825 2 18v-3h2v3h16V6H4v3H2V6q0-.825.588-1.412Q3.175 4 4 4h16q.825 0 1.413.588Q22 5.175 22 6v12q0 .825-.587 1.413Q20.825 20 20 20Zm7.5-3.5l-1.4-1.45L12.175 13H2v-2h10.175L10.1 8.95l1.4-1.45L16 12Z"/></svg>',
    Retry: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="M2 12a9 9 0 0 0 9 9c2.39 0 4.68-.94 6.4-2.6l-1.5-1.5A6.706 6.706 0 0 1 11 19c-6.24 0-9.36-7.54-4.95-11.95C10.46 2.64 18 5.77 18 12h-3l4 4h.1l3.9-4h-3a9 9 0 0 0-18 0Z"/></svg>'
}

export const commands = {
    "tr_TR": {
        Search: ["ara", "bul"],
        Input: ["gir", "yaz"],
        Next: ["sonraki", "sağ"],
        Prev: ["önceki", "sol"],
        Up: ["yukarı", "üstteki", "üst"],
        Down: ["aşağı", "alttaki"],
        Delete: ["sil", "temizle"],
        Click: ["tıkla"]
    },
    "en_US": {
        Search: ["search", "find"],
        Input: ["enter", "input"],
        Next: ["next", "right"],
        Prev: ["previous", "left"],
        Up: ["up", "above"],
        Down: ["down", "bellow"],
        Delete: ["clear", "delete", "remove"],
        Click: ["press", "go"]
    }
}

export enum Direction {
    Next,
    Prev,
    Up,
    Down
}

export enum Mods {
    Search,
    Input,
    Command
}

export enum App {
    Uninitialized,
    On,
    Off
}