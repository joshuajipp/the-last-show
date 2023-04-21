import {useState} from "react";

function AddObituaryModal(props) {
    const[name,setName] = useState("");
    const[when, setWhen] = useState({
        born: "",
        died: "",
    })
    const[file,setFile] = useState(null);

    const newObituary= (e) => {
        e.preventDefault();
        props.onNew(name,when,file);
 
        // const data = new FormData();
        // data.append(file);
        // data.append(name);
        // data.append(when);
    }
    const onFileChange = (e) => {
        setFile(e.target.files[0]);
    }
    const onDateChange =(e) => {
        const{name, value} = e.target;
        setWhen(prevState => ({
            ...prevState,
            [name]:value
        }));
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
                            type = "text"
                            value={name}
                            onChange={(e)=> setName(e.target.value)}
                            placeholder="Name of the deceased"
                            />
                        </div>
                        <div className = "date-input">
                            <small>Born:</small>
                            <input  className = "date"
                            name="born"
                            onChange={onDateChange}
                            value = {when.born}
                            type ="datetime-local"
                            />
                            <small> Died:</small>
                            <input className = "date"
                            name="died"
                            value = {when.died}
                            onChange={onDateChange}
                            type="datetime-local"
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