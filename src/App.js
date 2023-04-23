import React from "react";
import Header from "./components/Header";
import Obituary from "./components/Obituary";
import AddObituaryModal from "./components/AddObituaryModal";
import {useState} from "react";

function App() {

  const [obituaries, setObituaries] = useState([]);
  const [showModal,setShowModal] = useState(false);
  function openModal() {
    setShowModal(true);
  }
  function closeModal() {
    setShowModal(false);
  }
  function newObituary(newObituary){
    setObituaries(prevObituaries => {
      return [...prevObituaries, newObituary];
    })
  }
  return(
    <div>
      <Header toggleModal={openModal} />
      {obituaries.map((obituaryItem) => 
      <Obituary
        image = {obituaryItem.image}
        name = {obituaryItem.name}
        birth = {obituaryItem.birth}
        death = {obituaryItem.death}
        content = {obituaryItem.content}
        />
      )}
      <AddObituaryModal onNew ={newObituary} showModal={showModal} setShowModal= {setShowModal} closeModal={closeModal}/>
    </div>
    
  )
}

export default App;
