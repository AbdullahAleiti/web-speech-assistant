import Node from "./modules/Node"
import LinkedList from "./modules/LinkedList"
import { hoveringButton } from "./modules/hoveringButton";
import { fromEvent } from "rxjs";
import { App, commands, Direction, Mods } from "./constants";
import { locateByText, addScript ,getOffsetRect} from "./utils";
import BrowserRecognition from "./modules/BrowserRecognition";
import { RecognitionHandler } from "./modules/RecognitionHandler";
import AzureRecognition from "./modules/AzureRecognition";

let language = "tr_TR"
const maxOffset = 20
let LinkedListArray: LinkedList<Element>[] = []
const selectors = ["input", "textarea", "button"]
let btn: any
let selectedNode: Node<Element>
let app = App.Uninitialized
let mod = Mods.Command

let recognition : RecognitionHandler

function initHtmlInputs(_callback?:()=>void) {
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
    if (_callback) _callback()
}

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
            let temp: Node<Element> | null = LinkedListItem.head
            while (temp) {
                if (labelX > temp.x) {
                    temp = temp.next
                    continue
                }
                selectedNode = temp
                selectedNode.focus()
                return true
            }
        } else if (labelY < Math.abs((LinkedListItem.head.y - maxOffset))) {
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

async function setupRecognitionService(){
    await chrome.storage.local.get(["azure_recognition"]).then((storage) => {
        if (storage["azure_recognition"] && storage["azure_recognition"].key && storage["azure_recognition"].region)
            recognition = new AzureRecognition(language,storage["azure_recognition"].key,storage["azure_recognition"].region)
        else
            recognition = new BrowserRecognition(language)
    })
}

async function initApp(){
    app = App.On
    await setupRecognitionService()
    btn = hoveringButton()
    initHtmlInputs()
    recognition.start();
    recognition.onResult$.subscribe(
        {
            next(text){
                console.log("Last word: " + text);
                if (mod === Mods.Search && text) {
                    if (!selectNearestInput(text)) text += " bulunamadı"
                    mod = Mods.Command
                }
                else if (mod === Mods.Input && selectedNode) {
                    (selectedNode.element as HTMLInputElement).value = text
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