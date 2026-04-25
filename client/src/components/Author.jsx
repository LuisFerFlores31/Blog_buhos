import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import { CardList } from './Cards'

export default function Author() {
    const { id_author } = useParams()
    const [author, setAuthor] = useState({})
    const [posts, setPosts] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        fetch(import.meta.env.VITE_API_URL + '/authors/' + id_author, {
            method: 'GET',
            credentials: 'include'
        })
        .then((res) => {
            if (res.status === 401) {
                navigate('/login')
                return null
            }
            return res.json()
        })
        .then((data) => {
            if (data) setAuthor(data)
        })
        .catch((error) => console.log(error))

        fetch(import.meta.env.VITE_API_URL + '/authors/' + id_author + '/posts', {
            method: 'GET',
            credentials: 'include'
        })
        .then((res) => res.json())
        .then((data) => setPosts(data))
        .catch((error) => console.log(error))
    }, [id_author, navigate])

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Autor</h1>
            <h1>{author.name}</h1>
            <p>Email:</p>
            <p>{author.email}</p>
            <p>{author.date_of_birth}</p>
            <h2>Posts</h2>
            <CardList entries={posts} filteredText='' />
        </div>
    )
}