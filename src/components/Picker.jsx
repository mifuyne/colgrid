import { forwardRef, useState } from 'react'
import { useDebouncyFn } from 'use-debouncy'
import { HexColorPicker, HexColorInput } from 'react-colorful'

/* function Picker(popover, color, onChange) {
    return (
        <div className="popover" ref={popover}>
            <HexColorPicker color={color} onChange={onChange} />
        </div>
    )
} */
const Picker = forwardRef( ({mousePos, coord, cellProp, isActive, handleClose, handleConfirm}, ref) => {
    const [colourSync, updateColourSync] = useState(cellProp.colour === "inherit" ? "#fff" : cellProp.colour)
    const [lastPos, updateLastPos] = useState(mousePos)
    
    // Update colourSync and lastPos if lastPos and mousePos don't match
    if (lastPos !== mousePos) {
        updateColourSync(cellProp.colour === "inherit" ? "#fff" : cellProp.colour)
        updateLastPos(mousePos)
    }

    const handleChange = useDebouncyFn((col) => {
        updateColourSync(col)
    }, 200)

    return (
        <>
            {isActive && (
            <div className="colour-picker" style={{ left: mousePos.x + "px", top: mousePos.y + "px" }} ref={ref}>
                <button type="button" className="delete close" onClick={handleClose}></button>
                <HexColorPicker color={colourSync} onChange={(col) => { handleChange(col) }} />
                <HexColorInput 
                    color={colourSync}
                    onChange={(col) => { handleChange(col) }}
                    className="input is-small"
                />
                    <button type="button" className="button is-small" onClick={() => { handleConfirm(coord, colourSync) }}>Save</button>
            </div>)}
        </>
    )
})

Picker.displayName = 'Picker'

export default Picker