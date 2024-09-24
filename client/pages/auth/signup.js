import { useState } from "react";
import axios from "axios";

function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState([]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('/api/users/signup', { email, password });
            console.log(response.data);
        } catch (error) {   
            setErrors(error.response.data.errors);
            console.log(errors);
        }
    }

    return(
        <form onSubmit={handleSubmit}>
            <h1>Signup</h1>
            <div className="form-group">
                <label>Email</label>
                <input className="form-control" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="form-group">
                <label>Password</label>
                <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            {errors.length > 0 && <div className="alert alert-danger">
                <h4>Oooops...</h4>
                <ul className="my-0">
                    {errors.map((error, index) => (
                        <li key={index}>{error.message}</li>
                    ))}
                </ul>
            </div>}
            <button className="btn btn-primary">Sign Up</button>
        </form>
    )
}

export default SignupPage;