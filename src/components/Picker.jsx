import { forwardRef, useLayoutEffect, useState } from 'react'
import { useDebouncyFn } from 'use-debouncy'
import { HexColorPicker, HexColorInput } from 'react-colorful'

/* function Picker(popover, color, onChange) {
    return (
        <div className="popover" ref={popover}>
            <HexColorPicker color={color} onChange={onChange} />
        </div>
    )
} */
const Picker = forwardRef( ({mousePos, coord, cellProp, appData, id, isActive, handleClose, handleConfirm}, ref) => {
    const [colourSync, updateColourSync] = useState(cellProp.colour === "inherit" ? "#fff" : cellProp.colour)
    const [lastPos, updateLastPos] = useState(mousePos)
    const [pickerStyle, updateStyle] = useState({
        top: 0,
        left: 0,
    })
    
    // Update colourSync and lastPos if lastPos and mousePos don't match
    if (lastPos !== mousePos) {
        updateColourSync(cellProp.colour === "inherit" ? "#fff" : cellProp.colour)
        updateLastPos(mousePos)
    }

    useLayoutEffect(() => {
        // Prevent the colour picker from dipping below the available screen space
        if (ref.current) {
            const picker_size = {
                width: ref.current.clientWidth,
                height: ref.current.clientHeight,
            }

            const new_style = {...pickerStyle}

            new_style.top = mousePos.y + "px"
            new_style.left = mousePos.x + "px"

            if (appData.height - (mousePos.y + picker_size.height) < 0) {
                new_style.top = (mousePos.y - picker_size.height) + "px"
            }
            if (appData.width - (mousePos.x + picker_size.width) < 0) {
                new_style.left = (mousePos.x - picker_size.width) + "px"
            }

            updateStyle(new_style)
        }
    }, [mousePos, appData]) // eslint-disable-line react-hooks/exhaustive-deps

    const handleChange = useDebouncyFn((col) => {
        updateColourSync(col)
    }, 200)

    return (
        <>
            {isActive && (
            <div className="colour-picker" id={id} style={pickerStyle} ref={ref}>
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