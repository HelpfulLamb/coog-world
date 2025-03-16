function Modal({open, onClose}){
    if(!open) return null;
    return(
        <div className="overlay">
            <div className="modal-container">
                <p className="closebtn" onClick={onClose}>X</p>
                <p>Hello we are in the modal popup</p>
            </div>
        </div>
    )
}
export default Modal