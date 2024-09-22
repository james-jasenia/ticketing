import { useState } from "react";
import axios from "axios";

function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        const response = await axios.post('/api/users/signup', { email, password });

        console.log(response.data);
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
            <button className="btn btn-primary">Sign Up</button>
        </form>
    )
}

export default SignupPage;