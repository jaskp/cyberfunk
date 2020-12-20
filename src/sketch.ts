import {Path, settings, view} from 'paper'
import './audio'
import { fm_synth } from './audio'

export default () => {
  settings.hitTolerance = 50
  const path = new Path.RegularPolygon(view.center, 3, 100)
  path.strokeColor = 'black' as any
  path.fillColor = 'black' as any
  let dragged_curve: paper.Curve | undefined

  path.onMouseDown = (event: any) => {
    dragged_curve = path.curves.find(({point1}) => point1.isClose(event.point, 30))
    // some_synth.triggerAttackRelease('C4', '8n')
  }

  path.onMouseDrag = (event: any) => {
    if (!dragged_curve) path.position = path.position.add(event.delta)
  }

  view.onMouseMove = (event: any) => {
    if (dragged_curve) {
      dragged_curve.point1 = event.point
      fm_synth.modulationIndex.value = dragged_curve.point1.getDistance(view.center) / 5
      console.log(fm_synth.modulationIndex.value)
    }
  }

  path.onMouseUp = () => {
    dragged_curve = undefined
  }
}
