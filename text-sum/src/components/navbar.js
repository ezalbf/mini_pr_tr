import React from 'react'
import '../css/navbar.css'

function navbar() {
  return (
      <nav class="navbar">

        <div class="logo">Logo</div>

        <div class="user-icon">
          <lord-icon
            src="https://cdn.lordicon.com/kthelypq.json"
            trigger="hover">
          </lord-icon>
          </div>
    </nav>
  )
}

export default navbar
