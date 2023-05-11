// Styling in Grid.css

import { memo } from 'react'

const Cell = memo(function Cell({ onContextMenu, onClick, coord, properties }) {
     return (
        <button 
            className="grid-cells" 
            onClick={e => onClick(coord, e)}
             onContextMenu={e => onContextMenu(coord, e)}
            style={{ backgroundColor: properties.colour }}>
            {/* &nbsp; */}
            {coord}
        </button>
    ) 
})

export default Cell