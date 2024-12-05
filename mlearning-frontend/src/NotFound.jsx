import React from 'react'
import { NavLink } from 'react-router-dom'

const NotFound = () => {
  return (
    <>
      <h1>Ova stranica ne postoji.</h1>
      <NavLink to="/">Vrati se na glavnu stranicu</NavLink>
    </>
  )
}

export default NotFound