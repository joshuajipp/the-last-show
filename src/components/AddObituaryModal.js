import {useState} from "react";
import { v4 as uuidv4 } from "uuid";

function AddObituaryModal(props) {
    const[name,setName] = useState("");
    const[birth, setBirth] = useState("");
    const[death, setDeath] = useState("");
    const[file,setFile] = useState(null);

    const newObituary= (e) => {
        e.preventDefault();
        const obituaryObject = {
            name: name,
            birth: birth,
            death:death,
            image: file,
        };
        props.onNew(obituaryObject);
 
        // const data = new FormData();
        // data.append(file);
        // data.append(name);
        // data.append(when);
    }
    const onFileChange = (e) => {
        setFile(e.target.files[0]);
    }
    const onBirthChange =(e) => {
        setBirth(e.target.value)
    };
    const onDeathChange =(e) => {
        setDeath(e.target.value)
    };
    return(
        <div>
            {props.showModal && (
                <div className= "modal-container">
                    <button className="close-button" onClick={props.closeModal}> X </button>
                    <form className = "modal-content">
                        <div className="title">
                        <h2 className="add-title">Create a New Obituary</h2>
                        </div>
                        <div className="file-input">
                            <input type="file" required accept="images/*" onChange={(e)=>onFileChange(e)}/>
                        </div>
                        <div className="name-input">
                        <input className = "name"
                            required
                            type = "text"
                            value={name}
                            onChange={(e)=> setName(e.target.value)}
                            placeholder="Name of the deceased"
                            />
                        </div>
                        <div className = "date-input">
                            <small>Born:</small>
                            <input  className = "date"
                            onChange={onBirthChange}
                            value = {birth}
                            type ="date"
                            />
                            <small> Died:</small>
                            <input className = "date"
                            value = {death}
                            onChange={onDeathChange}
                            type="date"
                            />
                        </div>
                        <div className = "Obituary-button">
                            <button onClick={newObituary} >Write Obituary</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    
        
    )
}
export default AddObituaryModal;