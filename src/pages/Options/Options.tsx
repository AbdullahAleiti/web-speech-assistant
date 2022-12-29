import React from 'react';
import './Options.css';

interface Props {
  title: string;
}

export const enum options {
  Browser,
  Azure
}

function changeVoiceRecognitionMethod() : void{

}

const Options: React.FC<Props> = ({ title }: Props) => {
  return <div>
    <div className="OptionsContainer">{title} Page</div>
    <h1>I am saying hello here!</h1>
    </div>;
};

export default Options;
