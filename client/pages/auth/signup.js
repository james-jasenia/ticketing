import { useState } from "react";
import axios from "axios";
import useRequest from "../../hooks/use-request";

function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { doRequest, errors } = useRequest({
        url: '/api/users/signup',
        method: 'post',
        body: { email, password }
    });

    const handleSubmit = async (event) => {
        event.preventDefault();
        await doRequest();
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
            {errors}
            <button className="btn btn-primary">Sign Up</button>
        </form>
    )
}

export default SignupPage;