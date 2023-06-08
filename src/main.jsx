import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/main.css'
import 'bulma/css/bulma.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App size={10} />
  </React.StrictMode>,
)
