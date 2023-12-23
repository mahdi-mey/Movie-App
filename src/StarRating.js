const containerStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
}

const starContainerStyles = {
    display: 'flex',
    gap: '4px'
}

const textStyles = {
    lineHeight: '1',
    margin: '0'
}

export default function StarRating({maxLength = 10}){

    return(
        <div style={containerStyles}>
            <div style={starContainerStyles}>
                {Array.from({length: maxLength}, (_, i) => (
                    <span>⭐</span>
                ))}
            </div>
            <p style={textStyles}>{maxLength}</p>
        </div>
    )
}