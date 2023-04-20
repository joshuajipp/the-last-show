import React from "react";
import Header from "./components/Header";
import Obituary from "./components/Obituary";
import AddObituaryModal from "./components/AddObituaryModal";
import {useState} from "react";

function App() {
  const [showModal,setShowModal] = useState(false);
  function openModal() {
    setShowModal(true);
  }
  function closeModal() {
    setShowModal(false);
  }
  return(
    <div>
      <Header toggleModal={openModal} />
      <Obituary />
      <AddObituaryModal showModal={showModal} setShowModal= {setShowModal} closeModal={closeModal}/>
    </div>
    
  )
}

export default App;
