import React from 'react'
import { Storage } from 'aws-amplify';
import { Link } from 'react-router-dom';

const File = ({files}) => {
  console.log(files)
  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'download';
    const clickHandler = () => {
      setTimeout(() => {
        URL.revokeObjectURL(url);
        a.removeEventListener('click', clickHandler);
      }, 150);
    };
    a.addEventListener('click', clickHandler, false);
    a.click();
    return a;
  }
  
  async function download(fileKey) {
    const result = await Storage.get(fileKey, { download: true, level: "protected" });
    downloadBlob(result.Body, 'filename');
  }
  async function deleteFolder(key){
    await Storage.remove(key, { level: 'protected' });
    window.location.reload()
  }
  return (
    <div className='container'>
    <ul>
      <li>
        
        <Link to=".."><img src="../../back.png" alt="" height={50} width={50} />Back</Link>
      </li>
      {Object.keys(files).map((file, index) => (
        file !== "__data" && 
        (files[file].__data.size === 0 ? (
          
          <div key={index} className='d-flex'>
          <Link  to={file} style={{display: "flex", alignItems: "center"}}>
            <img src="../../folder.png" alt="not found" height={50} width={50}/>
            <li className='mx-4'>{file}</li>
          </Link>
          <button className='btn red' onClick={()=>{
              deleteFolder(files[file].__data.key)
            }}>
              Delete
              </button>
          </div>
        ) : (
          <div key={index} className='d-flex'>
            <img src="../../file.png" alt="not found" height={50} width={50} />
            <li className='mx-4'>{file}</li>
          <div style={{marginLeft: "auto"}}>
          <button style={{marginLeft: "0"}} className='btn' onClick={() => {
            download(files[file].__data.key)
          }}>Download</button>
            <button className='btn red m-0' onClick={()=>{
              deleteFolder(files[file].__data.key)
            }}>Delete</button> 
          </div>
          </div>
        ))
      ))}
    </ul>
  </div>
  )
}

export default File