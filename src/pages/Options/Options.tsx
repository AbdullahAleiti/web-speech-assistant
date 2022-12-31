import React, { useState ,useEffect} from 'react';
import './Options.css';

interface Props {
  _key: string;
  _region:string
}

const Connect: React.FC<Props> = ({_key,_region}: Props) => {
  const [key,setKey] = useState(_key)
  const [region,setRegion] = useState(_region)

  const save = ()=>{
    chrome.storage.local.set({ "azure_recognition" : {
      key,region
    } })
  }

  return <div>
    <input type="text" placeholder='Azure Speech key' onChange={(e)=>setKey(e.target.value)} value={key}/>
    <input type="text" placeholder='region' onChange={(e)=>setRegion(e.target.value)} value={region}/><button onClick={save}>Save</button>
  </div>
}

const Options: React.FC = () => {
  const [azure,setAzure] = useState(false)
  const [auth,setAuth] = useState<Props>({_key:"",_region:""})

  const emptyStorage = ()=>{chrome.storage.local.clear()}

  useEffect(()=>{
    chrome.storage.local.get(["azure_recognition"]).then((storage) => {
      console.log("from options");
      
      console.log(storage["azure_recognition"].key);
      if (storage["azure_recognition"].key && storage["azure_recognition"].region) {
          setAuth({
            _key:storage["azure_recognition"].key,
            _region:storage["azure_recognition"].region
          })
          setAzure(true)
      } else setAzure(false)
    })
  },[])
  return <div>
    <div className="OptionsContainer">Ayarlar</div>
    <div>
      <input type="radio" name="recognition_method" value="google" checked={!azure} onChange={()=>{setAzure(false);emptyStorage()}}/>
      <label htmlFor="recognition_method"> Google </label>
      <input type="radio" name="recognition_method" value="azure" checked={azure} onChange={()=>{setAzure(true)}}/>
      <label htmlFor="recognition_method"> Azure </label>
      {azure ? <Connect _key={auth._key} _region={auth._region} /> : null}
    </div>
    </div>;
};

export default Options;
