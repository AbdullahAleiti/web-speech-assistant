import Node from "./modules/Node"
import LinkedList from "./modules/LinkedList"
import { hoveringButton } from "./modules/hoveringButton";
import { fromEvent } from "rxjs";
import { App, commands, Direction, Mods } from "./constants";
import { locateByText, addScript ,getOffsetRect} from "./utils";
import BrowserRecognition from "./modules/BrowserRecognition";
import { RecognitionHandler } from "./modules/RecognitionHandler";
import AzureRecognition from "./modules/AzureRecognition";

let language = "tr_TR" // recognition parametere 
const maxOffset = 20 //program config
let LinkedListArray: LinkedList<Element>[] = [] //program
const selectors = ["input", "textarea", "button"] //program
let btn: any //program
let selectedNode: Node<Element> // program
let app = App.Uninitialized // program
let mod = Mods.Command // program

let recognition : RecognitionHandler

// tag  : page related
// input: The web page
// output: A linked list array
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
    console.log(LinkedListArray);
}

// tag   : position related
// input : string,LinkedListArray,
// output: node
function selectNearestInput(text: string, _callback?: () => void): boolean {
    // Search for buttons first
    // ****** */
    for (const LinkedListItem of LinkedListArray) {
        let temp: Node<Element> | null = LinkedListItem.head
        while (temp) {
            let el = (temp.element as HTMLElement)
            if (el.innerText.toLocaleLowerCase() === text || el.getAttribute("placeholder")?.toLocaleLowerCase() === text) {
                selectedNode = temp
                selectedNode.focus()
                return true
            }
            temp = temp.next
        }
    }
    // ****** */
    let result = locateByText(text)
    if (!result) return false
    console.log("Found");
    console.log(result);
    let labelX = getOffsetRect(result).x
    let labelY = getOffsetRect(result).y

    for (const LinkedListItem of LinkedListArray) {
        if (!LinkedListItem.head || LinkedListItem.head.y < 0) continue
        
        if (Math.abs(labelY - LinkedListItem.head.y) < maxOffset) {
            // yatay
            selectedNode = LinkedListItem.head
            LinkedListItem.head.focus()
            return true
        } else if (labelY < Math.abs((LinkedListItem.head.y - maxOffset))) {
            // Dikey 
            let temp: Node<Element> | null = LinkedListItem.head
            let rawPosition = LinkedListItem.head.y

            while (temp) {
                if (Math.abs(labelX - temp.x) < maxOffset) {
                    selectedNode = temp;
                    temp.focus()
                    console.log(selectedNode.element);

                    return true
                }
                if(temp.next?.y === rawPosition) temp = temp.next
                else break
            }
        }
    }
    if (_callback) _callback()
    return false
}

// tag   : position related
// input : currentNode,direction
// output: node
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
    if (node) (node.element as HTMLInputElement).value = ""
}

function initApp(){
    app = App.On
    //recognition = new BrowserRecognition(language)
    recognition   = new AzureRecognition(language)
    btn = hoveringButton()
    let x = 1
    initHtmlInputs()
    recognition.start();
    recognition.onResult$.subscribe(
        {
            next(text){
                x++;
                console.log(x);
                console.log("Last word: " + text);
                if (mod === Mods.Search && text) {
                    console.log("arama yapıldı");
                    if (!selectNearestInput(text)) {
                        text += " bulunamadı"
                    }
                    mod = Mods.Command
                }
                else if (mod === Mods.Input && selectedNode) {
                    (selectedNode.element as HTMLInputElement).value = text
                    console.log("inputted: " + text);
                    mod = Mods.Command
                }
                else if (commands[language].Next.includes(text)) {
                    moveToNeighborNodeAndFocus(Direction.Next);
                }
                else if (commands[language].Prev.includes(text)) {
                    moveToNeighborNodeAndFocus(Direction.Prev);
                }
                else if (commands[language].Up.includes(text)) {
                    moveToNeighborNodeAndFocus(Direction.Up);
                }
                else if (commands[language].Down.includes(text)) {
                    moveToNeighborNodeAndFocus(Direction.Down);
                }
                else if (commands[language].Input.includes(text)) {
                    mod = Mods.Input
                }
                else if (commands[language].Search.includes(text)) {
                    mod = Mods.Search
                }
                else if (commands[language].Delete.includes(text)) {
                    emptyNodeText(selectedNode);
                }
                else if (commands[language].Click.includes(text)) {
                    (selectedNode.element as HTMLInputElement).click()
                    mod = Mods.Command
                } else {
                    mod = Mods.Command
                    btn.updateButton(mod, text, true)
                    return
                }
                btn.updateButton(mod, text)
            }
        })
    
    btn.langClicked$.subscribe(
        () => {
            language = language === "tr_TR" ? "en_US" : "tr_TR"
            recognition.updateLanguage(language)
            btn.updateLanguage(language === "tr_TR" ? "tr" : "en")
        }
    )

    btn.retryClicked$.subscribe(
        () => {
            selectedNode.focus()
            emptyNodeText(selectedNode)
            mod = Mods.Input
            btn.updateButton(Mods.Input, "...")
        }
    )

    btn.updateButton(Mods.Command, "Komut bekleniliyor..")
}

function toggleApp() {
    if (app === App.Uninitialized) {
        initApp()
    }
    else if (app === App.On) {
        app = App.Off
        recognition.stop();
        btn.toggleVisibility()
    }
    else if (app === App.Off) {
        app = App.On
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

addScript("https://code.iconify.design/iconify-icon/1.0.2/iconify-icon.min.js")