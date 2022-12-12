import Node from "./modules/Node"
import LinkedList from "./modules/LinkedList"
import { hoveringButton } from "./hoveringButton";
import { fromEvent } from "rxjs";
import { App, commands, getOffsetRect, Direction, Mods } from "./constants";
import { locateByText, addScript } from "./utils";

const maxOffset = 20
let language = "tr_TR"
let LinkedListArray: LinkedList<Element>[] = []
const selectors = ["input", "textarea", "button"]
let selectedNode: Node<Element>
let btn: any
let app = App.Uninitialized
let recording = false

var SpeechRecognition: any = SpeechRecognition || window['webkitSpeechRecognition'];

var recognition = new SpeechRecognition();
recognition.continuous = false;
recognition.lang = language;
recognition.interimResults = false;
recognition.maxAlternatives = 1;

let mod = Mods.Command

recognition.onresult = function (event: any) {
    // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
    // The first [0] returns the SpeechRecognitionResult at the last position.
    // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
    // These also have getters so they can be accessed like arrays.
    // The second [0] returns the SpeechRecognitionAlternative at position 0.
    // We then return the transcript property of the SpeechRecognitionAlternative object
    let resultsArray = event.results[event.results.length - 1][0].transcript.split(" ")
    let lastResult = resultsArray[resultsArray.length - 1].toLowerCase()
    let c = commands[language]
    console.log("Last word: " + lastResult);

    if (mod === Mods.Search && lastResult) {
        console.log("arama yapıldı");
        if (!selectNearestInput(lastResult)) {
            lastResult += " bulunamadı"
        }
        mod = Mods.Command
    }
    else if (mod === Mods.Input && selectedNode) {
        (selectedNode.element as HTMLInputElement).value = lastResult
        console.log("inputted: " + lastResult);
        mod = Mods.Command
    }
    else if (c.Next.includes(lastResult)) {
        moveToNeighborNodeAndFocus(Direction.Next);
    }
    else if (c.Prev.includes(lastResult)) {
        moveToNeighborNodeAndFocus(Direction.Prev);
    }
    else if (c.Up.includes(lastResult)) {
        moveToNeighborNodeAndFocus(Direction.Up);
    }
    else if (c.Down.includes(lastResult)) {
        moveToNeighborNodeAndFocus(Direction.Down);
    }
    else if (c.Input.includes(lastResult)) {
        mod = Mods.Input
        console.log("inputting...");
    }
    else if (c.Search.includes(lastResult)) {
        mod = Mods.Search
    }
    else if (c.Delete.includes(lastResult)) {
        emptyNodeText(selectedNode);
    }
    else if (c.Click.includes(lastResult)) {
        (selectedNode.element as HTMLInputElement).click()
        mod = Mods.Command
    } else {
        mod = Mods.Command
        btn.updateButton(mod, lastResult, true)
        return
    }
    btn.updateButton(mod, lastResult)
}

recognition.onend = function () {
    if (recording) {
        setTimeout(function () {
            try {
                recognition.start();
            }
            catch (e) {
                console.log(e);
            }
        }, 400);
    }
}

recognition.onerror = function (event: any) {
    console.log(event.error);
}

function initHtmlInputs() {
    const nodes: Element[] = [...document.querySelectorAll(selectors.join())]
    console.log("number of nodes: " + nodes.length);
    for (let i = 0; i < nodes.length; i++) {
        if (!nodes[i]) continue
        let elementAdded = false
        let inputElement = new Node(nodes[i])

        fromEvent(nodes[i], "focus").subscribe(
            () => {
                selectedNode = inputElement
                inputElement.focus()
            }
        )
        if (LinkedListArray.length === 0) {
            let list = new LinkedList<Element>()
            list.add(inputElement)
            LinkedListArray.push(list)
        }
        else {
            LinkedListArray.forEach((i) => {
                if (!i.head) return
                if (Math.abs(inputElement.y - i.head.y) < maxOffset) {
                    i.add(inputElement)
                    elementAdded = true
                }
            })

            if (elementAdded) continue

            let lastElement = LinkedListArray[LinkedListArray.length - 1].last()
            if (lastElement) {
                lastElement.next = inputElement
                inputElement.prev = lastElement
            }
            let list = new LinkedList<Element>()
            list.add(inputElement)
            LinkedListArray.push(list)
        }
    }
}

function selectNearestInput(text: string, _callback?: () => void): boolean {
    for (const LinkedListItem of LinkedListArray) {
        let temp: Node<Element> | null = LinkedListItem.head
        while (temp) {
            if ((temp.element as HTMLElement).innerText.toLocaleLowerCase() === text) {
                selectedNode = temp
                selectedNode.focus()
                return true
            }
            temp = temp.next
        }
    }
    let result = locateByText(text)
    if (!result) return false
    console.log("Found");
    console.log(result);
    let labelX = getOffsetRect(result).x
    let labelY = getOffsetRect(result).y

    for (const LinkedListItem of LinkedListArray) {
        if (!LinkedListItem.head || LinkedListItem.head.y < 0) continue

        if (Math.abs(labelY - LinkedListItem.head.y) < maxOffset) {
            selectedNode = LinkedListItem.head
            LinkedListItem.head.focus()
            return true
        } else if (labelY < Math.abs((LinkedListItem.head.y - maxOffset))) {
            let temp: Node<Element> | null = LinkedListItem.head

            while (temp) {
                console.log(labelX + " - " + temp.x + "=" + Math.abs(labelX - temp.x));
                if (Math.abs(labelX - temp.x) < maxOffset) {
                    selectedNode = temp;
                    temp.focus()
                    console.log("looking by y:");
                    console.log(selectedNode.element);

                    return true
                }
                temp = temp.next
            }
        }
    }
    if (_callback) _callback()
    return false
}

function moveToNeighborNodeAndFocus(direction: Direction = Direction.Next, _callback?: () => void) {
    if (selectedNode == null) return
    if (direction === Direction.Next && selectedNode.next)
        selectedNode = selectedNode.next
    else if (direction === Direction.Prev && selectedNode.prev)
        selectedNode = selectedNode.prev
    else if (direction === Direction.Up || direction === Direction.Down) {
        let currentXPosition = selectedNode.x
        let temp: Node<Element> | null = selectedNode

        while (temp = direction === Direction.Up ? temp.prev : temp.next) {
            if (Math.abs(currentXPosition - temp.x) < maxOffset) {
                selectedNode = temp
                break
            }
        }
    }
    selectedNode.focus()
    if (_callback) {
        _callback();
    }
}

function emptyNodeText(node: Node<Element>) {
    if (node) {
        (node.element as HTMLInputElement).value = ""
    }
}

function updateLanguage(lang: string) {
    recognition.lang = lang;
    recognition.stop();

    setTimeout(function () {
        try {
            recognition.start();
        } catch {
            console.log("hata");
        }
    }, 400);
    btn.updateLanguage(recognition.lang === "tr_TR" ? "tr" : "en")
}

function toggleApp() {
    if (app === App.Uninitialized) {
        app = App.On
        addScript("https://code.iconify.design/iconify-icon/1.0.2/iconify-icon.min.js")
        initHtmlInputs()
        console.log(LinkedListArray);
        recognition.start();
        recording = true
        btn = hoveringButton(recognition)
        btn.langClicked$.subscribe(
            () => {
                language = recognition.lang === "tr_TR" ? "en_US" : "tr_TR"
                updateLanguage(language)
            }
        )
        btn.retryClicked$.subscribe(
            () => {
                selectedNode.focus()
                emptyNodeText(selectedNode)
                mod = Mods.Input
                btn.updateButton(Mods.Input, "inputting...")
            }
        )
        btn.updateButton(Mods.Command, "Komut dinleniyor..")
    }
    else if (app === App.On) {
        app = App.Off
        recording = false
        recognition.abort();
        btn.toggleVisibility()
    }
    else if (app === App.Off) {
        app = App.On
        recording = true
        try {
            recognition.start()
        } catch {
            console.log("already started");
        }
        btn.toggleVisibility()
    }
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.command === "iconClick") toggleApp()
});
