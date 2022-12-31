import { fromEvent, Observable,Subject } from "rxjs";
import { RecognitionHandler } from "./RecognitionHandler";
import { ResultReason } from 'microsoft-cognitiveservices-speech-sdk';

const speechsdk = require('microsoft-cognitiveservices-speech-sdk');

export interface TokenObj {
    subkey : string,
    region: string
}

export default class AzureRecognition implements RecognitionHandler {
    recognitionObject: any;
    onResult$ : Subject<string>
    onEnd$    : Observable<Event>
    recording : boolean;
    language  : string;
    key       : string;
    region    : string;

    constructor(language: string,key:string,region:string){
        this.language = language
        this.onResult$  = new Subject()
        this.onEnd$     = fromEvent(document.body,"click")
        this.recording = false
        this.key = key
        this.region = region
        this.configureAudio(language)
    }
    
    configureAudio(language : string)
    {
        const speechConfig = speechsdk.SpeechConfig.fromSubscription(this.key, this.region);
        speechConfig.speechRecognitionLanguage = language.replace("_","-");
        // disable punctuation
        speechConfig.setServiceProperty('punctuation', 'explicit', speechsdk.ServicePropertyChannel.UriQueryParameter)
        
        const audioConfig = speechsdk.AudioConfig.fromDefaultMicrophoneInput();
        this.recognitionObject = new speechsdk.SpeechRecognizer(speechConfig, audioConfig);
    }

    start(){
        this.recording = true
        this.startRecording()
    }
    
    startRecording(){
        this.recognitionObject.recognizeOnceAsync( (result : any) => {
            if (result.reason === ResultReason.RecognizedSpeech) 
                this.onResult$.next(result.text.toLowerCase())
            else 
                this.onResult$.next("...")
            if(this.recording) this.startRecording()
        });
    }

    stop(){
        this.recording = false
    }

    updateLanguage(language:string){
        this.configureAudio(language)
    };
}