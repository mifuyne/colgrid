import { useState, useRef, useEffect } from 'react'
import { useDebouncyFn } from 'use-debouncy'
import Cell from './Cell'
import Picker from './Picker'
import '../styles/Grid.css'

function Grid({ size }) {
    const cell_amount = size ** 2

    const [colours, setColours] = useState(Array.from({ length: cell_amount }, (_, i) => {
        const xCoord = Math.floor(i / size)
        const yCoord = i % size
        return {
            coord: {
                x: xCoord,
                y: yCoord
            },
            userFilled: false,
            colour: "inherit"
        }
    }))

    // Picker States
    const [pickerMeta, updatePickerMeta] = useState({ cell: null, pos: { x: 0, y: 0 }, colour: null })
    const [isPickerOpen, togglePicker] = useState(false)

    // References
    const gridRef = useRef(null)
    const pickerRef = useRef(null)

    // Event Handlers

    // When Cell is clicked on
    function handleClick(idx, evt) {
        const new_meta = { ...pickerMeta }
        // change the picker's position
        new_meta.pos = {
            x: evt.clientX,
            y: evt.clientY
        }

        // change the cell index referenced
        new_meta.cell = idx

        // change the referenced colour (to be passed into the picker component itself)
        new_meta.colour = colours[idx].colour === "inherit" ? "#fff" : colours[idx].colour

        updatePickerMeta(new_meta)
        // setColourPicked(new_meta.colour)
    }

    // When react-colorful picker detects changes
    const handlePickerChange = useDebouncyFn((idx, colour) => {
        const new_meta = { ...pickerMeta }
        // update colour in pickerMeta
        new_meta.colour = colour

        const new_colours = colours.slice()
        new_colours[idx].userFilled = true
        new_colours[idx].colour = colour

        setColours(new_colours)
        updatePickerMeta(new_meta)

        console.log('handlePickerChage: ', idx, colour, new_colours)
    }, 200)

    // TODO: Update the grid and fill in appropriate cells!
    useEffect(() => {
        if (!isPickerOpen) {
            console.log("Grid - TODO: Update the grid and fill in appropriate cells!")
        }
    }, [isPickerOpen])

    // -- Escaping React to check where the mouse is clicking on
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

    for (let i = 0; i < cell_amount; i++) {
        // Establishing x and y from the colours state array
        const x = colours[i].coord.x
        const y = colours[i].coord.y

        // Generating unique key based on cell's "coordinates"
        const cell_key = x + "_" + y

        // Add a cell to `row` array
        row.push(
            <Cell
                uid={i}
                key={cell_key}
                properties={colours[i]}
                onClick={handleClick}
            />
        )

        // End of the row? Add it to `rows` array
        if (y === (size - 1) && i !== 0) {
            rows.push(<div className="grid-row" key={cell_key}>{row}</div>)
            row = []
        }
    }

    return (
        <>
            <div className="grid" ref={gridRef}>{rows}</div>
            <Picker {...pickerMeta} ref={pickerRef} isActive={isPickerOpen} handleChange={handlePickerChange} />
        </>
    )
}

export default Grid