import React, { useEffect, useRef, useState } from 'react'
import { Amplify, Storage } from 'aws-amplify';
import awsConfig from './aws-exports';
import { withAuthenticator,  } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import CreateFolder from './components/CreateFolder/CreateFolder';
import Files from './pages/Files/Files';
import { useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, NavDropdown, Form, FormControl, Button } from 'react-bootstrap';
import './App.css'

Amplify.configure(awsConfig);

function App({ signOut, user }) { 
  const params = useLocation()
  const inputFile = useRef(null)

    const [allFiles, setAllFiles] = useState({});
    const [loading, setLoading] = useState(true)

  function processStorageList(response) {
    const filesystem = {};
    const add = (source, target, item) => {
      const elements = source.split('/');
      const element = elements.shift();
      if (!element) return; // blank
      target[element] = target[element] || { __data: item }; // element;
      if (elements.length) {
        target[element] =
          typeof target[element] === 'object' ? target[element] : {};
        add(elements.join('/'), target[element], item);
      }
    };
    response.results.forEach((item) => add(item.key, filesystem, item));
    return filesystem;
  }

  async function onSubmit(e) {
    e.preventDefault()
    const file = inputFile.current.files[0];
    
    try {
      if(params.pathname == '/'){
        const data = await Storage.put(file.name, file, {
          level: "protected"
        });
      } else {

        const data = await Storage.put((params.pathname + '/' + file.name).slice(1), file, {
          level: "protected"
        });
      }
      window.location.reload()
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  useEffect(() =>{
    Storage.list('',{ level: "protected" }) 
      .then(( results ) => setAllFiles(processStorageList(results)))
      .catch((err) => console.log(err));
      setLoading(false)
  },[]);

  console.log(allFiles)
  if(loading){
    return (
      <div className="loader center" ></div>
    )
  }
  return (
    <div className='container'>
      <Navbar bg="light" expand="lg">
      <Navbar.Brand href="#">Dropbox</Navbar.Brand>
      <Navbar.Toggle aria-controls="navbarSupportedContent" />
      <Navbar.Collapse id="navbarSupportedContent">
        <Nav className="mr-auto">
          <Nav.Link>
            <FormControl 
              type='file' 
              ref={inputFile} 
              onChange={onSubmit} 
            />
          </Nav.Link>
        </Nav>
        <Form inline>
          <Button 
            variant="outline-success" 
            value="Create Folder">
              <CreateFolder />
          </Button>
        </Form>
      </Navbar.Collapse>
      </Navbar>
      <div>
        
        
      </div>
      <Files
        files={allFiles}
      />
    </div>
  )
}

export default withAuthenticator(App);