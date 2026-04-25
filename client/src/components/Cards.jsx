import { Link } from 'react-router'
export function CardList({entries, filteredText}) {
  const cards = entries
    .filter(entry => entry.title?.toLowerCase().includes(filteredText.toLowerCase()))
    .map(entry => (
      <Card
        key={entry.id_post ?? entry.id}
        id_post={entry.id_post ?? entry.id}
        title={entry.title}
        date={entry.date}
        image={entry.image ?? entry.img}
        text={entry.text}
      />
    ))
  return (
    <div className='card-list'>
      {cards}
    </div>
  )
}

export function Card({image, title, date, text, id_post}) {
  const imageSrc = image && image.startsWith('./') ? image.slice(1) : image
  const formattedDate = date ? new Date(date).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : ''

  return (
    <div className='card'>
      <Link to={"/blog/"+id_post}>
      <img src={imageSrc} alt={title}/>
      <h1>{title}</h1>
      <p>{formattedDate}</p>
      <p>{text}</p>
      </Link>
    </div>
  )
}

//function Card({image, title, date, text}) {
//  const imageSrc = image && image.startsWith('./') ? image.slice(1) : image
//
//  return (
//   <div className='card'>
//      <img src={imageSrc} alt={title}/>
//      <h1>{title}</h1>
//      <p>{date}</p>
//      <p>{text}</p>
//    </div>
//  )
// }