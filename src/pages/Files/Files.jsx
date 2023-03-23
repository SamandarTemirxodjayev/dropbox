import React from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import File from '../../components/File/FIle'

const Files = ({ files }) => {

  return (
    <Routes>
      <Route index element={
        <File files={files}/>
      }/>
      {Object.keys(files).map((file, index) => (
        file !== "__data" && 
        <Route 
          key={index}
          path={file + "/*"}
          element={<Files files={files[file]}/>}
        />
      ))}
    </Routes>
  )
}

export default Files