import {useState} from "react";

function AddObituaryModal(props) {
    const[name,setName] = useState("");
    const[when,setWhen] = useState("");
    const[file,setFile] = useState(null);

    const onSubmitForm = (e) => {
        e.preventDefault();
        console.log(name,when,file);
        const data = new FormData();
        data.append(file);
        data.append(name);
        data.append(when);
    }
    const onFileChange = (e) => {
        console.log(e.target.files);
        setFile(e.target.files[0]);
    }
    return(
        <div>
            {props.showModal && (
                <div className="modal-overlay">
                <div className= "modal-container">
                    <button onClick={props.closeModal}> X </button>
                    <h2>Create a New Obituary</h2>
                    
                    {/* <form onSubmit={(e) =>onSubmitForm(e)}>  */}
                    <form>
                        <input type="file" required accept="images/*" onChange={(e)=>onFileChange(e)}/>
                        <input
                            type = "text"
                            value={name}
                            onChange={(e)=> setName(e.target.value)}
                            placeholder="Name of the deceased"
                        />
                        <input type ="datetime-local"/>
                    </form>
                </div>
                </div>
            )}
        </div>
    
        
    )
}
export default AddObituaryModal;