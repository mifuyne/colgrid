import { useRef } from 'react'
function ChangeBackground({updater}) {
    const inputRef = useRef(null)
    const handleOnChange = () => {
        updater(inputRef.current.value)
    }

    return (
        <>
        <label htmlFor="bg-colour">Change background colour</label>
        <input 
            type="color" 
            name="bg-colour" 
            id="bg-colour" 
            ref={inputRef} 
            onChange={handleOnChange}
        />
        </>
    )
}

export default ChangeBackground