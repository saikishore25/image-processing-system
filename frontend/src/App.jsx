
import { useEffect, useState } from "react";

function App() {

    const [message, setMessage] = useState("Loading...");

    useEffect(() => {
        fetch("http://localhost:5000/api/status")
            .then(res => res.json())
            .then(data => setMessage(data.message))
            .catch(err => setMessage("Backend connection failed"));
    }, []);

    return (
        <div>
            <h1>Image Processing System</h1>
            <h2>Frontend Server is Running!</h2>

            <h3>Backend Response:</h3>
            <p>{message}</p>
        </div>
    );
}

export default App;
