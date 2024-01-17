import paper from 'paper'

export default (event: paper.ToolEvent, scope: paper.PaperScope) => {
  scope.project.activeLayer.selected = false
  if (event.item) {
    event.item.selected = true
  }
}
