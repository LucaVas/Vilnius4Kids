import paper from 'paper'

export default (eevent: paper.ToolEvent, tool: paper.Tool, dragging: boolean) => {
  tool.onMouseUp = () => {
    dragging = false
  }
}
