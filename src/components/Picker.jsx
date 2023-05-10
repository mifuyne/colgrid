import { forwardRef } from 'react'
import { HexColorPicker, HexColorInput } from 'react-colorful'

/* function Picker(popover, color, onChange) {
    return (
        <div className="popover" ref={popover}>
            <HexColorPicker color={color} onChange={onChange} />
        </div>
    )
} */
const Picker = forwardRef( ({mousePos, coord, cellProp, isActive, handleChange}, ref) => {
    return (
        <>
            {isActive && (
            <div className="colour-picker" style={{ left: mousePos.x + "px", top: mousePos.y + "px" }} ref={ref}>
                <HexColorPicker color={cellProp.colour} onChange={(col) => { handleChange(coord, col) }} />
                <HexColorInput 
                    color={cellProp.colour === "inherit" ? "#fff" : cellProp.colour}
                    onChange={(col) => { handleChange(coord, col) }}
                />
            </div>)}
        </>
    )
})

Picker.displayName = 'Picker'

export default Picker