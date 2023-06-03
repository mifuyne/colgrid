import { useState, useRef, useEffect } from 'react'
import Cell from './Cell'
import Picker from './Picker'
import {SaveGrid, LoadGrid, ExportPalette} from './fileHandling'
import '../styles/Grid.css'

function Grid({ size }) {
    const cell_amount = size ** 2
    const app_metadata = {
        width: window.innerWidth,
        height: window.innerHeight,
    }

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

    // Custom right click in Grid only
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
        const filled_gaps = fillGaps(
            next_meta.coord, 
            new_filled_set, 
            next_colours)

        updateFilledCells(filled_gaps.filled_set)
        setColours(filled_gaps.gap_colours)

        handlePickerClose()
    }

    const handleClearGrid = () => {
        const clear_state = new Map(
            Array.from({ length: cell_amount }, (_, idx) => {
                const xCoord = idx % size
                const yCoord = Math.floor(idx / size)
                return [xCoord + "," + yCoord, {
                    userFilled: false,
                    colour: "inherit"
                }]
            })
        )
        setColours(clear_state)
        updateFilledCells(new Set())
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
            <div className="toolbar" id="toolbar">
                <button onClick={handleClearGrid}>New Grid</button>
                <SaveGrid gridSettings={colours} />
                <LoadGrid loadColours={setColours} loadFilled={updateFilledCells} />
                <ExportPalette colourList={colours} />
            </div>
            <div className="grid" ref={gridRef}>{rows}</div>
            <Picker {...pickerMeta} 
                appData={app_metadata}
                id="colour-picker"
                ref={pickerRef} 
                isActive={isPickerOpen} 
                handleClose={handlePickerClose}
                handleConfirm={handlePickerConfirm}
            />
        </>
    )
}

function fillGaps(current_coord, coord_set, coloursState) {
    const [x, y] = current_coord.split(",").map((n) => parseInt(n))
    const gap_colours = new Map(coloursState)
    const filled_set = new Set(coord_set)

    // Limit by which cells is the closest to the src in each cardinal direction
    const cardinals = {
        "0,1": null,    // down
        "1,0": null,    // right
        "-1,0": null,   // left
        "0,-1": null,   // up
    }

    // Check through all the user-filled cells,
    // store the cells with the shortest distance from the current_coord
    for (let coord of [...coord_set.values()].reverse()) {
        
        // Don't process the active cell
        if (current_coord !== coord) {
            const [it_x, it_y] = coord.split(",").map((n) => parseInt(n))
            const dir_vect = {
                x: 0,
                y: 0,
                magnitude: 0
            }
            
            // Which axis of two coordinates share the same value
            dir_vect.x = it_x - x
            dir_vect.y = it_y - y
            dir_vect.magnitude = Math.sqrt(dir_vect.x ** 2 + dir_vect.y ** 2)
            
            // normalize dir_vect.x and .y
            dir_vect.x /= dir_vect.magnitude
            dir_vect.y /= dir_vect.magnitude
            
            // No appropriate matches found, continue to the next entry
            if (dir_vect.x !== 0 && dir_vect.y !== 0) {
                continue
            }

            const direction_str = Object.values(dir_vect).slice(0,2).join(",")

            // Add coord and direction if cardinals[dir..._str] is empty or coord is closer.
            if (cardinals[direction_str] === null || 
                cardinals[direction_str].direction.magnitude > dir_vect.magnitude
            ) {
                cardinals[direction_str] = { 
                    coord: {x: it_x, y: it_y},
                    direction: dir_vect,
                }
            }
        }
    }

    // Start new loop, with cardinals' values
    for (let cell of Object.values(cardinals)) {
        if (cell) {
            const coord_str = Object.values(cell.coord).join(",")
            const new_colours = []
            // 1. Convert hex to RGB of src and dest colours
            const src_rgb = hexToRGB(gap_colours.get(current_coord).colour)
            const dest_rgb = hexToRGB(gap_colours.get(coord_str).colour)
        
            // 2. Calculate the distance between the colours, divided by magnitude
            const colour_distances = src_rgb.map(
                (channel, i) => (channel - dest_rgb[i]) / cell.direction.magnitude
            )
            
            // 3. Storing results from gradientColour into gradients
            const gradients = gradientColour({
                    x: x, 
                    y: y,
                    colour: src_rgb
                }, cell.direction, new_colours, colour_distances)
        
            // 4. Fill the gaps with the results from gradientColour
            if (gradients) {
                Array.from(gradients, entry => {
                    const new_coord = Object.values(entry[0]).join(",")
                    const new_colour = entry[1]
                    if (
                        gap_colours.get(new_coord).userFilled === false &&
                        gap_colours.get(new_coord).colour === "inherit"
                    ) {
                        gap_colours.get(new_coord).colour = new_colour
                        filled_set.add(new_coord)
                    }
                    
                })
            }
        }
    }
    return {filled_set, gap_colours}
}


function gradientColour(src, dir_vect, colour_map, colour_distances) {
    // base case
    // NOTE: 1 is base case to avoid unnecessary colour calculations
    if (dir_vect.magnitude === 1) {
        return
    }
    
    dir_vect.magnitude -= 1

    const new_coord = {
        x: src.x + (dir_vect.x * (dir_vect.magnitude)),
        y: src.y + (dir_vect.y * (dir_vect.magnitude)),
    }

    // calculate new colour
    const new_colour = src.colour.map((channel, i) => {
        return channel - (colour_distances[i] * dir_vect.magnitude)
    })
    
    // pass function back into itself
    gradientColour(src, dir_vect, colour_map, colour_distances)

    // convert back to hex
    const new_col_hex = RGBToHex(new_colour)
    
    // add new colours
    colour_map.push([new_coord, new_col_hex])
    
    return colour_map
}

function hexToRGB(colour) {
    // Source: https://css-tricks.com/converting-color-spaces-in-javascript/
    let channels = Array(3)

    // If hex code is shorthand (e.g: #fff)
    if (colour.length === 4) {
        channels[0] = "0x" + colour[1] + colour[1]
        channels[1] = "0x" + colour[2] + colour[2]
        channels[2] = "0x" + colour[3] + colour[3]
    } 
    // else if hex code is full length
    else if (colour.length === 7) {
        channels[0] = "0x" + colour[1] + colour[2]
        channels[1] = "0x" + colour[3] + colour[4]
        channels[2] = "0x" + colour[5] + colour[6]
    }

    return channels.map(val => +val)
}

function RGBToHex(channels) {
    // Source: https://css-tricks.com/converting-color-spaces-in-javascript/

    let hex = "#"

    Array.from(channels, val => {
        const h = Math.round(val).toString(16)
        if (h.length == 1) {
            hex += "0" + h
        } else {
            hex += h
        }
    })

    return hex
}

export default Grid