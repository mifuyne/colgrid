import { forwardRef } from 'react'
import { HexColorPicker, HexColorInput } from 'react-colorful'

/* function Picker(popover, color, onChange) {
    return (
        <div className="popover" ref={popover}>
            <HexColorPicker color={color} onChange={onChange} />
        </div>
    )
} */
const Picker = forwardRef( ({pos, cell, colour, isActive, handleChange}, ref) => {
    return (
        <>
            {isActive && (
            <div className="colour-picker" style={{ left: pos.x + "px", top: pos.y + "px" }} ref={ref}>
                <HexColorPicker color={colour} onChange={(col) => { handleChange(cell, col) }} />
                <HexColorInput color={colour} onChange={(col) => { handleChange(cell, col) }} />
            </div>)}
        </>
    )
})

Picker.displayName = 'Picker'

export default Picker