import { useState, useEffect } from "react";

export function UpdateShow({isOpen, onClose, showToEdit, onUpdateShow}){
    const [formData, setFormData] = useState({
        Stage_ID: '',
        Show_name: '',
        Show_cost: '',
        Show_start: '',
        Show_end: '',
        Show_date: '',
        Perf_num: ''
    });
    const [allStages, setAllStages] = useState([]);
    const [message, setMessage] = useState({error: '', success: ''});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [stages] = await Promise.all([fetch('/api/stages/all')]);
                const stageData = await stages.json();
                setAllStages(stageData);
            } catch (error) {
                setMessage({error: 'Failed to load stages.', success: ''});
            }
        };
        if(isOpen) fetchData();
    }, [isOpen]);

    useEffect(() => {
        if(showToEdit){
            const formattedDate = showToEdit.Show_date ? new Date(showToEdit.Show_date).toISOString().split('T')[0] : '';
            setFormData({
                Stage_ID: showToEdit.Stage_ID || '',
                Show_ID: showToEdit.Show_ID || '',
                Show_name: showToEdit.Show_name || '',
                Show_cost: showToEdit.Show_cost || '',
                Show_start: showToEdit.Show_start || '',
                Show_end: showToEdit.Show_end || '',
                Show_date: formattedDate,
                Perf_num: showToEdit.Perf_num || '',
            });
        }
    }, [showToEdit]);
    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/shows/${showToEdit.Show_ID}`, {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if(response.ok){
                setMessage({success: 'Show updated successfully!', error: ''});
                if(onUpdateShow) onUpdateShow({...data.show, Show_ID: showToEdit.Show_ID});
                setTimeout(() => {onClose(); window.location.href = window.location.href;});
            } else {
                setMessage({error: data.message || 'Update failed.', success: ''});
            }
        } catch (error) {
            setMessage({error: 'An error occurred while updating show.', success: ''});
        }
    };
    if(!isOpen || !showToEdit) return null;
    const getPlaceholders = (field) => {
        const placeholders = {
            'Show_name': 'e.g. The Great Coogs',
            'Show_cost': 'e.g. 5000000',
            'Perf_num': 'e.g. 5'
        };
        return placeholders[field] || '';
    };
    return(
        <div className="modal-overlay">
            <div className="modal">
                <h2>Edit Show #{showToEdit.Show_ID}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="modal-form-group">
                        {['Show_name', 'Show_cost', 'Show_start', 'Show_end', 'Show_date', 'Perf_num'].map((field) => (
                            <div className="modal-input-group" key={field}>
                                <label htmlFor={field}>
                                    {field === 'Perf_num' ? 'Performers' : field.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim()}
                                </label>
                                <input 
                                id={field} 
                                type={field === 'Perf_num' ? 'number' : field === 'Show_start' ? 'time' : field === 'Show_end' ? 'time' : field === 'Show_date' ? 'date' : 'text'} 
                                name={field} 
                                required
                                autoComplete="off"
                                value={formData[field]}
                                onChange={handleInputChange}
                                placeholder={getPlaceholders(field)}
                                min={field === 'Show_date' ? new Date().toISOString().split('T')[0] : undefined} />
                            </div>
                        ))}
                        <div className="modal-input-group">
                            <label htmlFor="Stage_ID">Stage</label>
                            <select name="Stage_ID" id="Stage_ID" required value={formData.Stage_ID} onChange={handleInputChange}>
                                <option value="">-- Select a Stage --</option>
                                {allStages.map(stage => (
                                    <option key={stage.Stage_ID} value={stage.Stage_ID}>{stage.Stage_name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {message.error && <p className="error-message">{message.error}</p>}
                    {message.success && <p className="success-message">{message.success}</p>}
                    <div className="modal-buttons">
                        <button type="submit">Update Show</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function AddShow({isOpen, onClose, onAddShow}){
    const [newShow, setNewShow] = useState({
        Show_name: '',
        Stage_ID: '',
        Show_start: '',
        Show_end: '',
        Perf_num: '',
        Show_cost: '',
        Show_date: ''
    });
    const [allStages, setAllStages] = useState([]);

    const [message, setMessage] = useState({error: '', success: ''});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [stages] = await Promise.all([fetch('/api/stages/all')]);
                const stageData = await stages.json();
                setAllStages(stageData);
            } catch (error) {
                setMessage({error: 'Failed to load stages.', success: ''});
            }
        };
        if(isOpen) fetchData();
    }, [isOpen]);

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setNewShow({...newShow, [name]: value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!newShow.Show_name || !newShow.Stage_ID || !newShow.Show_start || !newShow.Show_end || !newShow.Show_date || !newShow.Perf_num || !newShow.Show_cost){
            setMessage({error: 'All fields required.', success: ''});
            return;
        }
        if(isNaN(newShow.Perf_num) || isNaN(newShow.Stage_ID)){
            setMessage({error: 'Total Performers and Stage ID of the show MUST be a number.', success: ''});
            return;
        }
        try {
            const response = await fetch('/api/shows/create-show', {
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
                    Perf_num: '',
                    Show_cost: '',
                    Show_date: '',
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
    const getPlaceholders = (field) => {
        const placeholders = {
            'Show_name': 'e.g. The Great Coog',
            'Show_cost': 'e.g. 500000',
            'Perf_num': 'e.g. 20',
            'Stage_ID': 'Select a stage',
            'Show_start': 'Select a start time',
            'Show_end': 'Select an end time',
            'Show_date': 'Select the date of performance'
        };
        return placeholders[field] || '';
    };
    return(
        <div className="modal-overlay">
            <div className="modal">
                <h2>Add New Show</h2>
                <form onSubmit={handleSubmit}>
                    {['Show_name', 'Show_start', 'Show_end', 'Perf_num', 'Show_cost', 'Show_date'].map((field) => (
                        <div className="modal-input-group" key={field}>
                            <label htmlFor={field}>
                                {field === 'Perf_num' ? 'Performers' : field.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim()}
                            </label>
                            <input 
                            id={field}
                            type={field === 'Show_date' ? 'date' : field === 'Perf_num' ? 'number' : field === 'Show_start' ? 'time' : field === 'Show_end' ? 'time' : 'text'}
                            name={field}
                            required
                            autoComplete="off" 
                            value={newShow[field]}
                            onChange={handleInputChange}
                            placeholder={getPlaceholders(field)}
                            min={field === 'Show_date' ? new Date().toISOString().split('T')[0] : undefined} />
                        </div>
                    ))}
                    <div className="modal-input-group">
                        <label htmlFor="Stage_ID">Stage</label>
                        <select id="Stage_ID" name="Stage_ID" required value={newShow.Stage_ID} onChange={handleInputChange}>
                            <option value="">-- Select a Stage --</option>
                            {allStages.map(stage => (
                                <option key={stage.Stage_ID} value={stage.Stage_ID}>{stage.Stage_name}</option>
                            ))}
                        </select>
                    </div>
                    {message.error && <p className="error-message">{message.error}</p>}
                    {message.success && <p className="success-message">{message.success}</p>}
                    <div className="modal-buttons">
                        <button type="submit">Add Show</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddShow;
