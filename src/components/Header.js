function Header(props){
    return(
        <nav>
            <div className="empty"> </div>
            <div className = "header">
                <div className = "title">
                    <h1>The Last Show </h1>
                </div>
            </div>
            <div className = "menu-button">
                <button className = "button" onClick={props.toggleModal}>+ New Obituary</button>
            </div>
        </nav>
    )
}
export default Header;