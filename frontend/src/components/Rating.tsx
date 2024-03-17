
interface RatingProps {
    rating: number;
    numReviews?: number;
    caption?: string;
}

export const Rating = (props: RatingProps) => {
    return (
        <div className='rating'>
            <span>
                <i className={
                    props.rating >= 1
                        ? 'fas fa-star'
                        : props.rating >= 0.1
                            ? 'fas fa-star-half-alt'
                            : 'far fa-star'
                }/>
            </span>
            <span>
                <i className={
                    props.rating >= 2
                        ? 'fas fa-star'
                        : props.rating >= 1.1
                            ? 'fas fa-star-half-alt'
                            : 'far fa-star'
                }/>
            </span>
            <span>
                <i className={
                    props.rating >= 3
                        ? 'fas fa-star'
                        : props.rating >= 2.1
                            ? 'fas fa-star-half-alt'
                            : 'far fa-star'
                }/>
            </span>
            <span>
                <i className={
                    props.rating >= 4
                        ? 'fas fa-star'
                        : props.rating >= 3.1
                            ? 'fas fa-star-half-alt'
                            : 'far fa-star'
                }/>
            </span>
            <span>
                <i className={
                    props.rating >= 5
                        ? 'fas fa-star'
                        : props.rating >= 4.1
                            ? 'fas fa-star-half-alt'
                            : 'far fa-star'
                }/>
            </span>
            {
                props.caption ? <span>{props.caption}</span> 
                : props.numReviews != 0 ? <span>{props.numReviews} reviews</span>
                : ''
            }
        </div>
    )
}
