import { fromEvent, ObservableInput } from 'rxjs'
import { map, switchMap, takeUntil } from "rxjs/operators";
import { Mods, icons } from './constants';

export function hoveringButton(speechRecognition: SpeechRecognition) {
    const el = document.createElement("div");
    el.setAttribute("id", "abdullahaleiti_smart-voice-assistant");

    const handle = document.createElement("div")
    handle.id = "handle_smart-voice-assistant"

    const print = document.createElement("div")
    print.id = "print_smart-voice-assistant"

    const lang = document.createElement("div")
    lang.id = "lang_smart-voice-assistant"
    lang.className = "btn_smart-voice-assistant"
    lang.innerText = "tr"

    const retry = document.createElement("div")
    retry.id = "retry_smart-voice-assistant"
    retry.className = "btn_smart-voice-assistant"
    retry.innerHTML = icons.Retry

    el.append(handle)
    el.append(print)
    el.append(lang)
    el.append(retry)

    document.body.append(el)

    const mouseDown$ = fromEvent(handle, 'mousedown')
    const mouseMove$ = fromEvent(document.body, 'mousemove')
    const mouseUp$ = fromEvent(document.body, 'mouseup')
    const langClicked$ = fromEvent(lang, "click")
    const retryClicked$ = fromEvent(retry, "click")

    const drag$ = mouseDown$.pipe(switchMap((ev, _): ObservableInput<any> => {
        document.body.classList.add("prevent-select")
        return mouseMove$.pipe(map((e) => {
            let x = (e as MouseEvent).clientX
            let y = (e as MouseEvent).clientY
            moveTo([x, y])
        })).pipe(takeUntil(mouseUp$))
    }))

    const updateButton = (mod: Mods, text: String, gecersiz: boolean = false) => {
        print.innerHTML = `${icons[Mods[mod]]}<div style="padding-left:6px;display:inline-block;${gecersiz ? "text-decoration:line-through;" : ""}">${text}</div>`
    }

    const updateLanguage = (text: string) => lang.innerText = text

    const toggleVisibility = () => { el.style.display = el.style.display === "none" ? "block" : "none"; }

    const moveTo = ([x, y]: number[]) => {
        el.style.left = (x).toString() + "px";
        el.style.top = (y).toString() + "px";
    }

    drag$.subscribe()

    mouseUp$.subscribe(() => {
        document.body.classList.remove("prevent-select")
    })

    return {
        updateButton,
        updateLanguage,
        toggleVisibility,
        langClicked$,
        retryClicked$
    }
}