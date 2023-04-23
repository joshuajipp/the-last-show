function Obituary(props){
    return(
    <div className="obituary">
        <div className = "obituary-box">
            <img src={props.image} alt={props.name} className="squared" />
            <div className = "obituary-text">
                <p>{props.name}</p>
                <small>{props.birth}-{props.death}</small>
                <p className ="content">{props.content}</p>
            </div>
        </div>
    </div>
    )
}

export default Obituary;