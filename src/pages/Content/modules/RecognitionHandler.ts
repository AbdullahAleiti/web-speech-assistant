import { Observable, Subject } from "rxjs"

export interface RecognitionHandler {
    recognitionObject : any
    start     : () =>void
    stop      : () => void
    recording : boolean
    onResult$ : Subject<string>
    onEnd$     : Observable<Event>
    updateLanguage : (lang: string) => void
}