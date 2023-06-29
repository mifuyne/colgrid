import { forwardRef, useLayoutEffect, useState } from 'react'
import { useDebouncyFn } from 'use-debouncy'
import { HexColorPicker, HexColorInput } from 'react-colorful'

const Picker = forwardRef( ({mousePos, coord, cellProp, appData, id, isActive, handleClose, handleConfirm}, ref) => {
  const [colourSync, updateColourSync] = useState(cellProp.colour === "inherit" ? "#fff" : cellProp.colour)
  const [lastPos, updateLastPos] = useState(mousePos)
  const [pickerStyle, updatePickerStyle] = useState({})
  const [pointerStyle, updatePointerStyle] = useState({})
  
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

      const mouse_dir = {
        x: appData.width - (mousePos.x + picker_size.width),
        y: appData.height - (mousePos.y + picker_size.height)
      }

      const new_picker_style = {...pickerStyle}
      const new_pointer_style = {}

      new_picker_style.top = mousePos.y + "px"
      new_picker_style.left = mousePos.x + "px"
      new_picker_style.borderTopLeftRadius = null
      new_picker_style.borderTopRightRadius = null
      new_picker_style.borderBottomRightRadius = null
      new_picker_style.borderBottomLeftRadius = null

      // border radius to 0 based on which side of the picker is opened from
      switch (true) {
        // Top left
        case mouse_dir.x > 0 && mouse_dir.y > 0:
          new_picker_style.borderTopLeftRadius = "0px"
          new_pointer_style.top = "-10px"
          new_pointer_style.left = "-10px"
          break
        // Top Right
        case mouse_dir.x < 0 && mouse_dir.y > 0:
          new_picker_style.borderTopRightRadius = "0px"
          new_pointer_style.top = "-10px"
          new_pointer_style.right = "-10px"
          break
        // Bottom Right
        case mouse_dir.x < 0 && mouse_dir.y < 0:
          new_picker_style.borderBottomRightRadius = "0px"
          new_pointer_style.bottom = "-10px"
          new_pointer_style.right = "-10px"
          break
        // Bottom Left
        case mouse_dir.x > 0 && mouse_dir.y < 0:
          new_picker_style.borderBottomLeftRadius = "0px"
          new_pointer_style.bottom = "-10px"
          new_pointer_style.left = "-10px"
          break
      }

      if (mouse_dir.y < 0) {
        new_picker_style.top = (mousePos.y - picker_size.height) + "px"
      }
      if (mouse_dir.x < 0) {
        new_picker_style.left = (mousePos.x - picker_size.width) + "px"
      }

      updatePickerStyle(new_picker_style)
      updatePointerStyle(new_pointer_style)
    }
  }, [mousePos, appData]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = useDebouncyFn((col) => {
    updateColourSync(col)
  }, 200)

  return (
    <>
      {isActive && (
      <div className="colour-picker p-4 has-background-light" id={id} style={pickerStyle} ref={ref}>
        <HexColorPicker color={colourSync} onChange={handleChange} />
        <HexColorInput 
          color={colourSync}
          onChange={handleChange}
          className="input is-small my-2"
        />
        <div className="button-bar is-flex is-justify-content-flex-end">
          <button type="button" className="button is-small is-success" onClick={() => { handleConfirm(coord, colourSync) }}>Save</button>
          <button type="button" className="button is-small" onClick={handleClose}>Cancel</button>
        </div>
        <div className="pointer" style={pointerStyle}></div>
      </div>)}
    </>
  )
})

Picker.displayName = 'Picker'

export default Picker