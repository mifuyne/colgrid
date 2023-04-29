import { useState, useRef, useEffect } from 'react'
import Cell from './Cell'
import Picker from './Picker'
import '../styles/Grid.css'

function Grid ({ size }) {
    const cell_amount = size ** 2
    const [colours, setColours] = useState(Array(cell_amount).fill({userFilled: false, colour: "inherit"}))
    const [pickerMeta, setPickerMeta] = useState({pos: {x: 0, y: 0}, colour: null})
    const [isPickerOpen, togglePicker] = useState(false)
    
    // References
    const gridRef = useRef(null)
    const pickerRef = useRef(null)

    // Event Handlers
    function handleClick(idx, value, evt) {
        // change the picker's position
        let new_meta = {...pickerMeta}
        new_meta.pos = {
            x: evt.clientX,
            y: evt.clientY
        }
        new_meta.colour = colours[idx].colour

        const new_colours = colours.slice()
        new_colours[idx] = {
            userFilled: true,
            colour: "#3399ff"
        }


        setPickerMeta(new_meta)
        setColours(new_colours)
    }

    // -- checking where the mouse is clicking on
    useEffect(() => {
        window.onclick = (event) => {
            if (!gridRef.current.contains(event.target) 
                && (pickerRef.current === null
                    || (pickerRef.current !== null && !pickerRef.current.contains(event.target))
                )
            ) {
                togglePicker(false)
            } else {
                togglePicker(true)
            }
        }
    }, [])

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
                properties={colours[i]} 
                onClick={handleClick}
            />
        )
    }

    return (
        <>
            <div className="grid" ref={gridRef}>{rows}</div>
            {/* {isPickerOpen && <Picker pos={pickerMeta.pos} />} */}
            <Picker {...pickerMeta} ref={pickerRef} isActive={isPickerOpen} />
        </>
    )
}

export default Grid