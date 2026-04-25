import {useState} from 'react';
import { useNavigate } from 'react-router';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();


    function handeleUsernameChange(e) {
        setUsername(e.target.value);
    }

    function handlePasswordChange(e) {
        setPassword(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();
        const formInfo = new FormData();
        formInfo.append('username', username);
        formInfo.append('password', password);

        fetch(import.meta.env.VITE_API_URL + '/login', {
            method: "POST",
            credentials: "include",
            body: formInfo,
        })
        .then((res) => {
            if (!res.ok) {
                throw new Error('Credenciales invalidas o sesion no iniciada');
            }
            return res.json();
        })
        .then((data) => {
            console.log(data);
            navigate('/autores/'+ data.id_author);
        })
        .catch((error) => console.log('ERROR:', error));
    }

    return (
        <div className="Login">
            <h1>Login</h1>
            <label>Usuario:</label>
            <input type="text" value={username} onChange={handeleUsernameChange}></input>
            <label>Contraseña:</label>
            <input type="password" value={password} onChange={handlePasswordChange}></input>
            <input type="submit" value="Entrar" onClick={handleSubmit} className="submit"></input>
        </div>
    );
}
