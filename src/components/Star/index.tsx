type Props = {
  rating: number;
}

const Star = ({ rating }: Props) => {

  if(rating >= 1) {
    return <i className="bi bi-star-fill text-yellow-400"></i>
  }
  if(rating >= 0.5) {
    return <i className="bi bi-star-half text-yellow-400"></i>
  }
  return <i className="bi bi-star text-yellow-400"></i>
}

export default Star;
