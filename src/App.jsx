import { useState } from 'react';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';

function App() {
    const [selectedOption, setSelectedOption] = useState('');
    const [responseMessage, setResponseMessage] = useState('');
    const [averageDeviation, setAverageDeviation] = useState(null);
    const [plotUrl, setPlotUrl] = useState(null);
    const [loading, setLoading] = useState(false);

    const options = ['TCS.BO', 'AAPL', 'GOOGL', 'MSFT', 'AMZN'];

    const handleChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const handleSubmit = async () => {
        setLoading(true);  // Set loading to true when the request starts
        setResponseMessage('');
        setAverageDeviation(null);
        setPlotUrl(null);
    
        try {
            const response = await axios.post('https://6896-103-169-236-163.ngrok-free.app/stonks', {
                option: selectedOption
            });
            setResponseMessage(response.data.message);
            setAverageDeviation(response.data.averageDeviation);
            setPlotUrl(`data:image/png;base64,${response.data.plot}`);
        } catch (error) {
            console.error("Error submitting option", error);
            setResponseMessage("An error occurred while processing your request.");
        } finally {
            setLoading(false);  // Set loading to false after the request completes
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Select a Stock</h1>
            <select value={selectedOption} onChange={handleChange}>
                <option value="">--Select an option--</option>
                {options.map((option, index) => (
                    <option key={index} value={option}>
                        {option}
                    </option>
                ))}
            </select>
            <button onClick={handleSubmit} style={{ marginLeft: '10px' }}>
                Submit
            </button>

            {loading ? (
                <div style={{ marginTop: '20px' }}>
                    <ClipLoader size={50} color={"#123abc"} loading={loading} />
                    <p>Loading, please wait...</p>
                </div>
            ) : (
                <>
                    {responseMessage && <p>{responseMessage}</p>}
                    {averageDeviation && (
                        <p>Average Deviation: {averageDeviation.toFixed(2)}%</p>
                    )}
                    {plotUrl && (
                        <img src={plotUrl} alt="Stock Prediction Plot" style={{ marginTop: '20px', maxWidth: '100%' }} />
                    )}
                </>
            )}
        </div>
    );
}

export default App;