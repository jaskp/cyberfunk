import {Path, settings, view} from 'paper'

export default () => {
  settings.hitTolerance = 200
  const path = new Path.RegularPolygon(view.center, 6, 100)
  path.strokeColor = 'black' as any
  path.fillColor = 'black' as any
  let dragged_curve: paper.Curve | undefined

  path.onMouseDown = (event: any) => {
    dragged_curve = path.curves.find(({point1}) => point1.isClose(event.point, 20))
  }

  view.onMouseMove = (event: any) => {
    if (dragged_curve) dragged_curve.point1 = event.point
  }

  path.onMouseUp = (event: any) => {
    dragged_curve = undefined
  }
}
