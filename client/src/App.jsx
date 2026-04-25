
import { Routes, Route, Link } from 'react-router';
import { Home } from './Home';
import { Blog } from './Blog';
import { Contact } from './Contact';
import './App.css';
import Post from './components/Post.jsx';
import NewPost from './components/NewPost.jsx';
import Login from './components/Login.jsx';
import Author from './components/Author.jsx';

function App() {

  return (
    <>
    <nav>
      <Link to="/home">Home</Link>
      <Link to="/blog">Blog</Link>
      <Link to="/new">Nuevo Post</Link>
      <Link to="/contact">Contacto</Link>
    </nav>
    <Routes>
      <Route path="/" element={<Login></Login>}/>
      <Route path="/home" element={<Home></Home>}/>
      <Route path="/blog" element={<Blog></Blog>}/>
      <Route path="/contact" element={<Contact></Contact>}/>
      <Route path="/blog/:id_post" element={<Post></Post>}></Route>
      <Route path="/new" element={<NewPost></NewPost>}></Route>
      <Route path="/autores/:id_author" element={<Author></Author>}></Route>
      <Route path="/login" element={<Login></Login>}></Route>
    </Routes>
    </>
  )
}

export default App
