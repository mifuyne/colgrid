// Styling in Grid.css

import { memo } from 'react'

const Cell = memo(function Cell({ onClick, coord, properties }) {
     return (
        <button 
            className="grid-cells" 
            onClick={e => onClick(coord, e)}
            style={{ backgroundColor: properties.colour }}>
            {/* &nbsp; */}
            {coord}
        </button>
    ) 
})

export default Cell