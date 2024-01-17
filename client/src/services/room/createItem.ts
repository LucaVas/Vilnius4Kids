import type { ItemDetails } from '@/components/types/ItemDetails'
import paper from 'paper'
import { v4 as uuidv4 } from 'uuid'

export default (details: ItemDetails) => {
  const item = createItem(details)
  if (item) {
    addItemId(item)
  }
  return item
}

function addItemId(item: paper.Item) {
  item.data.id = uuidv4()
}

function createItem(details: ItemDetails): paper.Shape | undefined {
  if (details.type == 'rectangle') {
    const square = new paper.Shape.Rectangle({
      position: [details.x ?? 100, details.y ?? 100],
      size: [details.length, details.width],
      strokeColor: 'black',
      fillColor: details.fill ?? 'black',
    })
    square.data = details
    return square
  }

  if (details?.type == 'circle') {
    const circle = new paper.Shape.Circle({
      position: [details.x ?? 100, details.y ?? 100],
      radius: details.radius ?? 100,
      strokeColor: 'black',
      fillColor: details.fill ?? 'black',
    });
    circle.data = details
    return circle
  }

  if (details?.type == 'ellipse') {
    const ellipse = new paper.Shape.Ellipse({
      point: [details.x ?? 100, details.y ?? 100],
      size: [details.length, details.width],
      strokeColor: 'black',
      fillColor: details.fill ?? 'black',
    });

    ellipse.data = details
    return ellipse
  }
}
