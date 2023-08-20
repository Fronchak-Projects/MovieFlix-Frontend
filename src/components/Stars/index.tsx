import Star from "../Star";

type Props = {
  rating: number;
}

const Stars = ({ rating }: Props) => {

  return (
    <div className="flex gap-1">
      { new Array<number>(5).fill(0).map((_, index) => (
        <Star rating={rating - (index)} key={index}/>
      )) }
    </div>
  )
}

export default Stars;
