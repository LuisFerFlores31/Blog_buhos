import { useEffect, useState } from "react";
import { useParams } from "react-router";

export default function Post() {
	const { id_post } = useParams();
	const [post, setPost] = useState({});
	const imageSrc = post.image ?? post.img;// formato de imagen para compatibilidad con datos del servidor
	const formattedDate = post.date ? new Date(post.date).toLocaleDateString('es-MX', { //formato de fecha para que se vea bonito
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : ''
  

	useEffect(() => {
		fetch(`${import.meta.env.VITE_API_URL}/posts/${id_post}`)
			.then((res) => res.json())
			.then((data) => setPost(data));
	}, [id_post]);

	

	return (
		<>
			{imageSrc && <img src={imageSrc.startsWith('./') ? imageSrc.slice(1) : imageSrc} alt="Imagen del post"></img>}
			<h1>{post.title}</h1>
			<h2>Escrito por: {post.id_author}</h2>
			<h2>{formattedDate}</h2>
			<p>{post.text}</p>
		</>
	);
}