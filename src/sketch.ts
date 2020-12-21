import {Path, settings, view} from 'paper'
import './audio'
import { fake_sidechain, fm_synth, master_envelope, meter, sub_bass } from './audio'
import { p5_map } from './utils'

export default () => {
  settings.hitTolerance = 200
  const path = new Path.RegularPolygon(view.center, 3, 100)

  // path.strokeColor = 'black' as any
  path.fillColor = 'yellow' as any
  let dragged_curve: paper.Curve | undefined
  let dragged_ix: number | undefined
  const shadow_path = path.clone()
  shadow_path.fillColor = undefined
  shadow_path.strokeColor = 'yellow' as any


  path.onMouseDown = (event: any) => {
    path.fullySelected = true
    dragged_ix = path.curves.findIndex(({point1}) => point1.isClose(event.point, 30))
    if (dragged_ix != null) dragged_curve = path.curves[dragged_ix]
    // some_synth.triggerAttackRelease('C4', '8n')
  }

  view.onFrame = () => {
    shadow_path.copyContent(path)
    shadow_path.fullySelected = false
    // console.log(meter.getValue())
    const meter_value = meter.getValue() as number
    const by = meter_value < -20 ? 0 : (meter_value + 20) / 10
    // console.log('scale', by)
    shadow_path.scale(by)
  }

  path.onMouseDrag = (event: any) => {
    if (!dragged_curve) {
      path.position = path.position.add(event.delta)
      fm_synth.detune.value -= event.delta.y
      sub_bass.detune.value -= event.delta.y
    }
  }

  view.onMouseMove = (event: any) => {
    if (dragged_curve) {
      dragged_curve.point1 = event.point
      const distance = dragged_curve.point1.getDistance(view.center)
      switch (dragged_ix!) {
        case 0:
          fm_synth.modulationIndex.value = distance / 5
          break
        case 1:
          fake_sidechain.attack = distance / 600
      }

    }
  }

  path.onMouseUp = () => {
    path.fullySelected = false
    dragged_curve = undefined
    dragged_ix = undefined
  }
}
