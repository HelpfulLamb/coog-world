import { useState } from "react";

function AddShow({isOpen, onClose, onAddShow}){
    const [newShow, setNewShow] = useState({
        Show_name: '',
        Stage_ID: '',
        Show_start: '',
        Show_end: '',
        daily_runs: '',
        Perf_num: '',
        Show_cost: ''
    });

    const [message, setMessage] = useState({error: '', success: ''});

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setNewShow({...newShow, [name]: value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!newShow.Show_name || !newShow.Stage_ID || !newShow.Show_start || !newShow.Show_end || !newShow.daily_runs || !newShow.Perf_num || !newShow.Show_cost){
            setMessage({error: 'All fields required.', success: ''});
            return;
        }
        if(isNaN(newShow.Perf_num) || isNaN(newShow.daily_runs) || isNaN(newShow.Stage_ID)){
            setMessage({error: 'Total Performers, daily runnings, and Stage ID of the show MUST be a number.', success: ''});
            return;
        }
        try {
            const response = await fetch('http://localhost:3305/api/shows/create-show', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(newShow),
            });
            const data = await response.json();
            console.log('Backend response: ', data);
            if(response.ok){
                setMessage({success: 'Show added successfully.', error: ''});
                setNewShow({
                    Show_name: '',
                    Stage_ID: '',
                    Show_start: '',
                    Show_end: '',
                    daily_runs: '',
                    Perf_num: '',
                    Show_cost: '',
                });
                onAddShow(data.show);
                setTimeout(() => {onClose(); window.location.href = window.location.href;});
            } else {
                setMessage({error: data.message || 'Failed to add show.', success: ''});
            }
        } catch (error) {
            setMessage({error: 'An error occurred. Please try again.', success: ''});
        }
    };
    if(!isOpen) return null;
    return(
        <div className="modal-overlay">
            <div className="modal">
                <h2>Add New Show</h2>
                <form onSubmit={handleSubmit}>
                    {['Show_name', 'Stage_ID', 'Show_start', 'Show_end', 'Perf_num', 'daily_runs', 'Show_cost'].map((field) => (
                        <div className="modal-input-group" key={field}>
                            <label htmlFor={field}>
                                {field.replace(/_/g, ' ').replace(/([A_Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim()}
                            </label>
                            <input 
                            id={field}
                            type={field === 'Stage_ID' ? 'number' : field === 'Perf_num' ? 'number' : field === 'daily_runs' ? 'number' : field === 'Show_start' ? 'time' : field === 'Show_end' ? 'time' : 'text'}
                            name={field}
                            required
                            autoComplete="off" 
                            value={newShow[field]}
                            onChange={handleInputChange}
                            placeholder={field.replace(/_/g, ' ').toLowerCase()} />
                        </div>
                    ))}
                    {message.error && <p className="error-message">{message.error}</p>}
                    {message.success && <p className="success-message">{message.success}</p>}
                    <div className="modal-buttons">
                        <button type="submit" className="button button-block">Add Show</button>
                        <button type="button" onClick={onClose} className="button button-block cancel-button">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddShow;