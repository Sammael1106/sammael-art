import { forwardRef } from 'react'
import DrunkEffect from './DrunkEffect'
import PencilEffect from './PencilEffect'


// Pencil
const Pencil = forwardRef((props, ref) => {
  const effect = new PencilEffect(props)
  return <primitive object={effect} />
})

// Drunk
const Drunk = forwardRef((props, ref) => {
  const effect = new DrunkEffect(props)
  return <primitive object={effect} />
})

export { Drunk, Pencil }