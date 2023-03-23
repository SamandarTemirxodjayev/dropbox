import {  Storage } from 'aws-amplify';
import { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';


function CreateFolder() { 
  const [name, setName] = useState('')
  const params = useLocation()

  async function onSubmit(e) {
    e.preventDefault()    
    try {
      console.log(params.pathname)

      if(params.pathname == '/'){
        const data = await Storage.put(name + "/", "", {
          level: "protected"
        });
      } else {

        const data = await Storage.put((params.pathname + '/' + name).slice(1) + "/", "", {
          level: "protected"
        });
      }
      window.location.reload()
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input type="text" value={name} onChange={(e)=>{
          setName(e.target.value)
        }}/>
        <input type='submit' value="Create Folder"/>
      </form>
    </div>
  )
}

export default CreateFolder;