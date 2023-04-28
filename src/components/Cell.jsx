// Styling in Grid.css

import { memo } from 'react'

const Cell = memo(function Cell({ onColorChange, uid, value }) {
    return (
        <button 
            className="grid-cells" 
            onClick={e => onColorChange(uid, e.target.value)}
            style={{ backgroundColor: value }}>&nbsp;</button>
    )
})

export default Cell