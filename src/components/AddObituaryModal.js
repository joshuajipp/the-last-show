import {useState} from "react";

function AddObituaryModal(props) {
    const[name,setName] = useState("");
    const[birth_date, setBirth] = useState("");
    const[death_date, setDeath] = useState("");
    const[image,setImage] = useState(null);
    const[isWriting, setIsWriting] = useState(false);

    const newObituary = async (e) => {
        e.preventDefault();
        if(name == ""){
            alert("Name field must be filled out");
            return;
        }
        const obituaryObject = {
            image: image,
            name: name,
            birth_date: birth_date,
            death_date: death_date,
           
        };
        setIsWriting(true);
        await props.onNew(obituaryObject);
        setIsWriting(false);

    }
    const onFileChange = (e) => {
        const selectedFile = e.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            const base64Image = reader.result.split(",")[1];
            setImage(base64Image) // This is the Base64-encoded image data
          };
          reader.readAsDataURL(selectedFile);


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
                    <button className="close-button" onClick={props.closeModal}>{" "}X{" "}</button>
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
                                required
                            />
                        </div>
                        <div className = "date-input">
                            <small>Born:</small>
                            <input  className = "date"
                            onChange={onBirthChange}
                            value = {birth_date}
                            type ="date"
                            />
                            <small> Died:</small>
                            <input className = "date"
                            value = {death_date}
                            onChange={onDeathChange}
                            type="date"
                            />
                        </div>
                        <div className = "Obituary-button">
                            <button onClick={newObituary} >{isWriting ? "Please Wait..." : "Write Obituary"}</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    
        
    )
}
export default AddObituaryModal;