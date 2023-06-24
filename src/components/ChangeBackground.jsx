import { useEffect, useRef, useState } from 'react'
import { useDebouncyFn } from 'use-debouncy'
import { HexColorPicker, HexColorInput } from 'react-colorful'

function ChangeBackground({updater, classes}) {
  const [isBgPickerOpen, toggleBgPicker] = useState(false)
  const [colour_selected, updateSelectedColour] = useState("#eeeeee")

  const handleOnChange = useDebouncyFn((col) => {
    updateSelectedColour(col)
  }, 200)

  const handleBgPickerClick = () => {
  // console.log(`BG Picker should open`)
    toggleBgPicker(true)
  }

  const handleBgPickerClose = () => {
    toggleBgPicker(false)
  }

  const handleSave = (col) => {
    updater(col)
    handleBgPickerClose()
  }

  return (
    <>
      <a 
        className={classes}
        name="bg-colour" 
        id="bg-colour" 
        onClick={handleBgPickerClick}
      >Change Background Colour</a>
        <div className={"modal " + (isBgPickerOpen ? "is-active": "")}>
          <div className="modal-background" onClick={handleBgPickerClose}></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <h2>Select A Background Colour</h2>
            </header>
            <section className="modal-card-body">
              <HexColorPicker color={colour_selected} onChange={handleOnChange} />
              <HexColorInput color={colour_selected} onChange={handleOnChange} />
            </section>
            <footer className="modal-card-foot">
              <button className="button is-success" onClick={() => handleSave(colour_selected)}>Save Changes</button>
              <button className="button" onClick={handleBgPickerClose}>Cancel</button>
            </footer>
          </div>
          <button className="modal-close is-large" aria-label='close' onClick={handleBgPickerClose}></button>
        </div>
      {/* )} */}
    </>
  )
}

export default ChangeBackground