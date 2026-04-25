import { useEffect, useState} from 'react';
import { useNavigate } from 'react-router';

export default function Author() {
    const {id_author} = useParams();
    const [author, setAuthor] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        fetch('htttps://localhost:8000/authors/' + id_author, {
            method: "GET",
            credentials: "include"
        })
        .then((res) => {
            if (res.status === 401) {
                navigate('/login');
            }
            return res.json();
        })
        .then((data) => setAuthor(data))
        .catch((error) => console.log(error))
    }, [id_author, navigate]);

    return (
        <div>
            <h1>Autor</h1>
            <h1>{author.name}</h1>
            <p>Email:</p>
            <p>{author.email}</p>
            <p>{author.date_of_birth}</p>
        </div>
    );
}