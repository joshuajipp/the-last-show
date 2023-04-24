import React, { useEffect } from "react";
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

  async function newObituary(newObituary){
    const res = await fetch("https://yjru7bpx6g7uk6utxa76m526re0gmwce.lambda-url.ca-central-1.on.aws/",
    {
      method: "POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify(newObituary)
    });
    getObituary();
  }

  async function getObituary(){
    const res = await fetch ("https://jbuz7pyvhj4xta57aexulh3xry0dncjp.lambda-url.ca-central-1.on.aws/",
    {
      method: "GET",
      headers: {"Content-Type":"application/json"},
    })
    const data = await res.json();
    console.log(data);
    setObituaries(data);
  
  }
  useEffect(()=> {
    getObituary();
  },[]);
  
  return(
    <div>
      <Header toggleModal={openModal} />
      {obituaries.map((obituaryItem) => 
      <Obituary
        image = {obituaryItem.image_url}
        name = {obituaryItem.name}
        birth = {obituaryItem.birth_date}
        death = {obituaryItem.death_date}
        content = {obituaryItem.text}
        audio = {obituaryItem.mp3_url}
        />
      )}
      <AddObituaryModal onNew ={newObituary} showModal={showModal} setShowModal= {setShowModal} closeModal={closeModal}/>
    </div>
    
  )
}

export default App;
