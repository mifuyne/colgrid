import { useState } from 'react'
import Cell from './Cell'
import '../styles/Grid.css'

function Grid ({ size }) {

    const cell_amount = size ** 2
    const [colours, setColours] = useState(Array(cell_amount).fill("inherit"))

    // Event Handlers
    function handleColorChange(idx, value) {
        const new_colours = colours.slice()
        new_colours[idx] = "#3399ff"

        setColours(new_colours);
    }

    // Generate the 10x10 grid, but futureproof for variable grid size
    const rows = []
    let row = []

    for (let i = 0; i <= cell_amount; i++) {
        // Establishing x and y
        const x = Math.floor(i / size)
        const y = i % size
        const cell_key = x.toString(16) + "_" + y.toString(16)

        // Check if this is a new row before adding more to `row`.
        if (y === 0 && i !== 0) {
            rows.push(<div className="grid-row" key={cell_key}>{row}</div>)
            row = []
        }

        row.push(
            <Cell
                uid={i}
                key={cell_key} 
                value={colours[i]} 
                onColorChange={handleColorChange}
            />
        )
    }

    return <div className="grid">{rows}</div>
}

export default Grid