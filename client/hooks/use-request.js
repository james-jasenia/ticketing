import axios from "axios";
import { useState } from "react";

function useRequest({ url, method, body }) {
    const [errors, setErrors] = useState([]);

    const doRequest = async () => {
        try {
            const response = await axios[method](url, body);
            return response.data;
        } catch (err) {
            setErrors(<div className="alert alert-danger">
                <h4>Oooops...</h4>
                <ul className="my-0">
                    {err.response.data.errors.map((error, index) => (
                        <li key={index}>{error.message}</li>
                    ))}
                </ul>
            </div>
            );
        }
    }

    return { doRequest, errors };
}

export default useRequest;