import {useState} from 'react'
import Markdown from 'markdown-to-jsx'

function Popup ({name, props}) {
  const [isPopupOpen, togglePopup] = useState(false)

  const handleClick = () => {
    togglePopup(true)
  }
  const handleClose = () => {
    togglePopup(false)
  }

  return (
    <>
      <a 
        className={"menu-" + name.toLowerCase()}
        name={name.toLowerCase()}
        onClick={handleClick}
      >{name}</a>
      <div className={"modal " + (isPopupOpen ? "is-active": "")}>
        <div className="modal-background" onClick={handleClose}></div>
        <div className="modal-card">
          {props.header !== '' &&
          <header className="modal-card-head">
            <Markdown>{props.header}</Markdown>
          </header>
          }
          <section className="modal-card-body">
            <Markdown>{props.content}</Markdown>
          </section>
          <footer className="modal-card-foot">
            <button className="button" onClick={handleClose}>Close</button>
          </footer>
        </div>
        <button className="modal-close is-large" aria-label='close' onClick={handleClose}></button>
      </div>
    </>
  )
}

export default Popup