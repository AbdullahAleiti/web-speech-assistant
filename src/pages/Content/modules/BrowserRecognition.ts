import { fromEvent, Observable , Subject} from "rxjs";
import { RecognitionHandler } from "./RecognitionHandler";

export default class BrowserRecognition implements RecognitionHandler {
    recognitionObject: any;
    onResult$ : Subject<string>
    onEnd$    : Observable<Event>
    recording: boolean;

    constructor(language: string){
        var SpeechRecognition: any = SpeechRecognition || window['webkitSpeechRecognition']; // recognition init
        this.recognitionObject = new SpeechRecognition();
        this.recognitionObject.continuous = false;
        this.recognitionObject.lang = language;
        this.recognitionObject.interimResults = false;
        this.recognitionObject.maxAlternatives = 1;
        this.onResult$  = new Subject()
        this.onEnd$     = fromEvent(this.recognitionObject,"end")
        this.recording = false
        this.recognitionObject.onend = () => {
            if (this.recording) {
                setTimeout(()=>{
                    try {
                        this.recognitionObject.start();
                    }
                    catch (e) {
                        console.log(e);
                    }
                }, 400);
            }
        }

        this.recognitionObject.onresult = (event : any)=>{
            // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
            // The first [0] returns the SpeechRecognitionResult at the last position.
            // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
            // These also have getters so they can be accessed like arrays.
            // The second [0] returns the SpeechRecognitionAlternative at position 0.
            // We then return the transcript property of the SpeechRecognitionAlternative object
            let resultsArray : string = event.results[event.results.length - 1][0].transcript.split(" ")
            
            this.onResult$.next(resultsArray[resultsArray.length - 1].toLowerCase())
        }

        this.recognitionObject.onerror = (event: any)=>{
            console.log(event.error);
        }
    }

    updateLanguage(lang : string){
        let recognition = this.recognitionObject
        recognition.lang = lang;
        recognition.stop();
    
        setTimeout(function () {
            try {
                recognition.start();
            } catch {
                console.log("hata");
            }
        }, 400);
    }

    start(){
        this.recognitionObject.start()
        this.recording = true
    }

    stop(){
        this.recognitionObject.abort()
        this.recording = false
    }
}