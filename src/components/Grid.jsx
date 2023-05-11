import { useState, useRef, useEffect } from 'react'
import { useDebouncyFn } from 'use-debouncy'
import Cell from './Cell'
import Picker from './Picker'
import '../styles/Grid.css'

function Grid({ size }) {
    const cell_amount = size ** 2
    
    // -- Setting state variables
    // Using map instead
    const [colours, setColours] = useState(new Map(
        Array.from({ length: cell_amount }, (_, idx) => {
            const xCoord = idx % size
            const yCoord = Math.floor(idx / size)
            return [xCoord + "," + yCoord, {
                userFilled: false,
                colour: "inherit"
            }]
        })
    ))
    
    // Picker States
    const [pickerMeta, updatePickerMeta] = useState(
        {
            coord: null,
            mousePos: {x: 0, y: 0},
            cellProp: {
                userFilled: false,
                colour: "inherit"
            }
        }
    )
    const [isPickerOpen, togglePicker] = useState(false)

    // Filled cells Set
    const [filledCells, updateFilledCells] = useState(new Set())
    
    // References
    const gridRef = useRef(null)
    const pickerRef = useRef(null)

    // Event Handlers
    // When Cell is clicked on
    const handleClick = (coord, evt) => {
        const current_cell_props = colours.get(coord)
        const new_meta = {...pickerMeta}

        // change the picker's position based on the mouse's position relative to the page.
        new_meta.mousePos = {
            x: evt.pageX,
            y: evt.pageY
        }

        // change the cell referenced
        new_meta.coord = coord

        // change the referenced cell properties
        new_meta.cellProp = current_cell_props

        updatePickerMeta(new_meta)
    }

    // Disble right click in Grid only
    const handleContextMenu = (coord, e) => {
        e.preventDefault()
        console.info(e, coord)
        
        // Update filledCells to REMOVE the colour
        const new_filled_set = new Set(filledCells)
        new_filled_set.delete(coord)

        // Update colours to change the cell back to "inherit"
        const next_colours = new Map(colours)
        next_colours.get(coord).userFilled = false
        next_colours.get(coord).colour = "inherit"

        // Update states
        updateFilledCells(new_filled_set)
        setColours(next_colours)
    }

    const handlePickerClose = () => {
        togglePicker(false)
    }

    const handlePickerConfirm = (coord, colour) => {
        // TODO: Update the grid and fill in appropriate cells!
        console.log('Saving picker colour!')
        // console.log(coord, colour, pickerMeta)

        // update colour in pickerMeta
        const next_meta = { ...pickerMeta }
        next_meta.cellProp.colour = colour

        // update colour Map
        const next_colours = new Map(colours)
        next_colours.get(coord).userFilled = true
        next_colours.get(coord).colour = colour

        // update filled colour set
        const new_filled_set = new Set(filledCells)
        new_filled_set.add(coord)

        // update states
        setColours(next_colours)
        updatePickerMeta(next_meta)
        updateFilledCells(new_filled_set)

        console.info("TODO: Update the grid and fill in appropriate cells")

        handlePickerClose()
    }

    // -- Escaping React to check where the mouse is clicking on, to show or hide the Picker modal
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

    colours.forEach((colourProps, coord) => {
        const [x, y] = coord.split(",").map((n) => parseInt(n))
        
        // Add a cell to `row` array
        row.push(
            <Cell
                coord={coord}
                key={coord}
                properties={colourProps}
                onClick={handleClick}
                onContextMenu={handleContextMenu}
            />
        )
        
        // End of the row? Add it to `rows` array
        if (x === (size - 1)) {
            rows.push(<div className="grid-row" key={"row_" + y}>{row}</div>)
            row = []
        }
    })

    return (
        <>
            <div className="grid" ref={gridRef}>{rows}</div>
            <Picker {...pickerMeta} 
                id="colour-picker"
                ref={pickerRef} 
                isActive={isPickerOpen} 
                // handleChange={handlePickerChange} 
                handleClose={handlePickerClose}
                handleConfirm={handlePickerConfirm}
            />
        </>
    )
}

export default Grid