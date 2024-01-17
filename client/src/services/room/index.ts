import paper from 'paper';
import { type Ref } from 'vue';

export function deselectAll(itemClicked: Ref<paper.Item | undefined>, items: paper.Item[]) {
  items.map((item) => {
    item.selected = false;
    item.bounds.selected = false;
  });

  if (itemClicked) {
    itemClicked.value = undefined;
  }
}

export function selectOnClick(
  hitResultItem: paper.Item,
  itemClicked: Ref<paper.Item | undefined>,
  isItemClicked: Ref<boolean>
) {
  itemClicked.value = hitResultItem;
  itemClicked.value.selected = true;
  itemClicked.value.bounds.selected = true;
  isItemClicked.value = true;
}

export function makeSelectableOnHover(item: paper.Item) {
  item.selected = true;
}

export function move(key: string, itemClicked: paper.Item) {
  if (itemClicked !== undefined) {
    if (key == 'right') {
      itemClicked.position.x += 5;
    }
    if (key == 'left') {
      itemClicked.position.x -= 5;
    }
    if (key == 'up') {
      itemClicked.position.y -= 5;
    }
    if (key == 'down') {
      itemClicked.position.y += 5;
    }
  }
}

export function drag(item: paper.Item, point: paper.Point) {
  item.position = point;
}
