// Styling in Grid.css

import { memo } from 'react'

const Cell = memo(function Cell({ onClick, uid, properties }) {
    return (
        <button 
            className="grid-cells" 
            onClick={e => onClick(uid, e.target.value, e)}
            style={{ backgroundColor: properties.colour }}>&nbsp;</button>
    )
})

export default Cell