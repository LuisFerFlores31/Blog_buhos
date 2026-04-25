import './Blog.css'
// import { entries } from './data'
import { CardList } from './components/Cards'
import { useState, useEffect } from 'react'

export function Blog() {
    const [filteredText, setFilteredText] = useState('')
    const [entries, setEntries] = useState([{id_post:0, title:"", date:"", image:"", text:"", id_author:0}]);

    useEffect(() => {
        fetch(import.meta.env.VITE_API_URL+ '/posts')
            .then((res) => res.json())
            .then((posts) => setEntries(posts));
    }, []);

    function handleChange(e) {
    setFilteredText(e.target.value);
  }
  return (
    <>
    <h1>Mi blog de Buhos!</h1>
      <div className='filter'>
        <input type="text" placeholder='Busca tu buho favorito' value={filteredText} onChange={handleChange}></input>

      </div>
      <CardList entries={entries} filteredText={filteredText}> </CardList>
    </>
  ) 
}
