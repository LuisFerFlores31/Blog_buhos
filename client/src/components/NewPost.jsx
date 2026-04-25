import { useState } from "react";
import { useNavigate } from "react-router";

export default function NewPost() {
	const navigate = useNavigate();
	const [title, setTitle] = useState("");
	const [text, setText] = useState("");
	const [authorId, setAuthorId] = useState("");
	const [img, setImg] = useState(null);
	const [statusMessage, setStatusMessage] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	function handleTitleChange(e) {
		setTitle(e.target.value);
	}

	function handleFile(e) {
		const selectedFile = e.target.files?.[0];
		if (!selectedFile) return;

		const fileInfo = {
			file: selectedFile,
			filename: selectedFile.name,
		};

		setImg(fileInfo);
	}

	function handleSubmit(e) {
		e.preventDefault();
		if (!title.trim() || !img) {
			setStatusMessage("Escribe un titulo y selecciona una imagen.");
			return;
		}

		setIsSubmitting(true);
		setStatusMessage("");

		const formInfo = new FormData();
		formInfo.append("title", title.trim());
		formInfo.append("text", text.trim());
		formInfo.append("id_author", authorId);
		formInfo.append("img", img.file, img.filename);

		fetch(import.meta.env.VITE_API_URL + '/posts/new', {
			method: "POST",
			body: formInfo,
		})
			.then(async (res) => {
				if (!res.ok) {
					const errorData = await res.json();
					throw new Error(errorData.message || "No se pudo guardar el post.");
				}
				return res.json();
			})
			.then(() => {
				setTitle("");
				setText("");
				setAuthorId("");
				setImg(null);
				setStatusMessage("Post agregado correctamente.");
				navigate("/blog");
			})
			.catch((error) => {
				setStatusMessage(error.message);
			})
			.finally(() => {
				setIsSubmitting(false);
			});
	}

	return (
		<form className="form" onSubmit={handleSubmit}>
			<h2>Nuevo post</h2>
			<input
				type="text"
				value={title}
				onChange={handleTitleChange}
				placeholder="Titulo"
			/>
			<textarea
				value={text}
				onChange={(e) => setText(e.target.value)}
				placeholder="Descripcion del post"
			/>
			<input
				type="number"
				value={authorId}
				onChange={(e) => setAuthorId(e.target.value)}
				placeholder="ID del autor"
			/>
			<input type="file" accept="image/*" onChange={handleFile} />
			<button type="submit" disabled={isSubmitting}>
				{isSubmitting ? "Guardando..." : "Agregar"}
			</button>
			{statusMessage && <p>{statusMessage}</p>}
		</form>
	);
}