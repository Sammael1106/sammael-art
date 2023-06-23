import { forwardRef } from 'react'
import { BlendFunction, Effect } from 'postprocessing'
import { Uniform } from 'three'
import fragmentShader from "../glsl/drunk.glsl";

class DrunkEffect extends Effect {
  constructor({ frequency, amplitude, blendFunction = BlendFunction.MULTIPLY }) {
    super(
      'DrunkEffect',
      fragmentShader, {
        blendFunction: blendFunction,
        uniforms: new Map([
          ['frequency', new Uniform(frequency)],
          ['amplitude', new Uniform(amplitude)],
          ['offset', new Uniform(0)]
        ])
      }
    )
  }
  update(renderer, inputBuffer, deltaTime) {
    this.uniforms.get('offset').value += deltaTime
  }
}

const Drunk = forwardRef((props, ref) => {
  const effect = new DrunkEffect(props)
  return <primitive object={effect} />
})

export { Drunk }