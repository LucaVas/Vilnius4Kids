<script lang="ts" setup>
import { FwbInput, FwbSelect, FwbButton, FwbModal } from 'flowbite-vue';
import { ref, onMounted } from 'vue';
import { type ItemDetails } from '@/components/types/ItemDetails';
import {
  deselectAll,
  selectOnClick,
  drag,
  makeSelectableOnHover,
  move,
} from '../services/room/index';
import createItem from '@/services/room/createItem';
import mouseUp from '@/services/room/mouseUp';
import paper from 'paper';

const types = [
  { value: 'rectangle', name: 'Rectangle' },
  { value: 'circle', name: 'Circle' },
  { value: 'ellipse', name: 'Ellipse' },
  { value: 'line', name: 'Line' },
];

const colors = [
  { value: 'red', name: 'Red' },
  { value: 'blue', name: 'Blue' },
  { value: 'green', name: 'Green' },
  { value: 'yellow', name: 'Yellow' },
  { value: 'orange', name: 'Orange' },
  { value: 'purple', name: 'Purple' },
  { value: 'pink', name: 'Pink' },
  { value: 'black', name: 'Black' },
  { value: 'white', name: 'White' },
];

const hitOptions = {
  segments: true,
  stroke: true,
  fill: true,
};

const itemDetails = ref<ItemDetails>({
  name: '',
  width: 0.0,
  length: 0.0,
  radius: 0.0,
  type: '',
  fill: '',
  x: 100.0,
  y: 100.0,
});

const items = ref<paper.Item[]>([]);
const scope = ref<paper.PaperScope>();
const itemClicked = ref<paper.Item | undefined>();
const isItemSelected = ref<boolean>(false);
const path = ref<paper.Path>();
const dragging = ref<boolean>(false);

const isShowNewItemModal = ref(false);
const isShowEditItemModal = ref(false);

function activateNewItemModal() {
  isShowNewItemModal.value = !isShowNewItemModal.value;
}
function activateEditItemModal() {
  isShowEditItemModal.value = !isShowEditItemModal.value;
}

function resetItemDetails() {
  itemDetails.value = {
    name: '',
    width: 0.0,
    length: 0.0,
    radius: 0.0,
    type: '',
    fill: '',
    x: 100.0,
    y: 100.0,
  };
}

function deleteItem() {
  if (itemClicked.value) {
    itemClicked.value.remove();
    resetItemDetails();
    itemClicked.value = undefined;
    isItemSelected.value = false;
  }
}

function updateItem() {
  if (itemClicked.value) {
    itemClicked.value.remove();
    itemClicked.value = createItem({
      ...itemDetails.value,
      x: itemClicked.value.position.x,
      y: itemClicked.value.position.y,
    });
    itemClicked.value!.data = itemDetails.value;
  }
}

function addNewItem(detail: ItemDetails) {
  const item = createItem(detail);
  if (item) {
    addItemToCanvas(item);
  }
}

function addItemToCanvas(item: paper.Shape) {
  if (item.data.type == 'rectangle') {
    path.value = new paper.Path.Rectangle(item);
  }
  if (item.data.type == 'circle') {
    path.value = new paper.Path.Circle(item);
  }
  if (item.data.type == 'ellipse') {
    path.value = new paper.Path.Ellipse(item);
  }
  items.value.push(path.value!);
}

function controlEvents() {
  const tool = new paper.Tool();

  tool.onMouseDown = (event: paper.MouseEvent) => {
    const itemsOnLayer = scope.value!.project.activeLayer.children.filter(
      (el) => el.className == 'Shape'
    );

    const hitResult = scope.value!.project.hitTest(event.point, hitOptions);

    deselectAll(itemClicked, itemsOnLayer);
    isItemSelected.value = false;

    if (hitResult) {
      itemClicked.value = hitResult.item;
      isItemSelected.value = true;
      selectOnClick(hitResult.item, itemClicked, isItemSelected);

      tool.onMouseDrag = (event: paper.ToolEvent) => {
        drag(hitResult.item, event.point);
      };
    }
  };

  tool.onMouseUp = (event: paper.ToolEvent) => {
    mouseUp(event, tool, dragging.value);
  };

  tool.onMouseMove = (event: paper.ToolEvent) => {
    if (event.item) {
      makeSelectableOnHover(event.item);
    }
  };

  tool.onKeyDown = (event: paper.KeyEvent) => {
    if (itemClicked.value) {
      move(event.key, itemClicked.value);
    }
  };
}

onMounted(() => {
  scope.value = new paper.PaperScope();
  scope.value.activate();
  scope.value.setup('canvasId');
  controlEvents();
});
</script>

<template>
  <div class="mb-5 flex w-full flex-row gap-4">
    <FwbButton
      @click="
        activateNewItemModal();
        resetItemDetails();
      "
    >
      New Item
    </FwbButton>
    <FwbButton @click="isItemSelected ? activateEditItemModal() : null"> Edit Item </FwbButton>
    <FwbButton @click="isItemSelected ? deleteItem() : null"> Delete Item </FwbButton>

    <FwbModal v-if="isShowNewItemModal" @close="activateNewItemModal">
      <template #header>
        <div class="flex items-center text-lg">Add new item</div>
      </template>
      <template #body>
        <form class="flex flex-col gap-4" @submit.prevent="addNewItem(itemDetails)">
          <FwbInput
            type="text"
            v-model="itemDetails.name"
            :required="true"
            placeholder="Item name"
            class="border-gray-200"
          />

          <FwbSelect v-model="itemDetails.type" :options="types" placeholder="Type" />

          <!-- @vue-skip -->
          <FwbInput
            placeholder="Radius"
            name="radius"
            type="number"
            v-model="itemDetails.radius"
            :required="true"
            class="border-gray-200"
            v-if="itemDetails.type === 'circle'"
          />

          <!-- @vue-skip -->
          <FwbInput
            placeholder="Width"
            name="width"
            type="number"
            v-model="itemDetails.width"
            :required="true"
            class="border-gray-200"
            v-if="itemDetails.type !== 'circle'"
          />

          <!-- @vue-skip -->
          <FwbInput
            placeholder="Length"
            name="length"
            type="number"
            v-model="itemDetails.length"
            :required="true"
            class="border-gray-200"
            v-if="itemDetails.type !== 'circle'"
          />

          <FwbSelect v-model="itemDetails.fill" :options="colors" placeholder="Color" />
        </form>
      </template>
      <template #footer>
        <div class="flex justify-end">
          <FwbButton
            @click="
              activateNewItemModal();
              addNewItem(itemDetails);
            "
            color="green"
            >Create item</FwbButton
          >
        </div>
      </template>
    </FwbModal>

    <FwbModal v-if="isShowEditItemModal" @close="activateEditItemModal">
      <template #header>
        <div class="flex items-center text-lg">Edit item</div>
      </template>
      <template #body>
        <form class="flex flex-col gap-4">
          <FwbInput
            type="text"
            v-model="itemDetails.name"
            :required="true"
            placeholder="Item name"
            class="border-gray-200"
          />

          <!-- @vue-skip -->
          <FwbInput
            placeholder="Radius"
            name="radius"
            type="number"
            v-model="itemDetails.radius"
            :required="true"
            class="border-gray-200"
            v-if="itemDetails.type === 'circle'"
          />

          <!-- @vue-skip -->
          <FwbInput
            placeholder="Width"
            name="width"
            type="number"
            v-model="itemDetails.width"
            :required="true"
            class="border-gray-200"
            v-if="itemDetails.type !== 'circle'"
          />

          <!-- @vue-skip -->
          <FwbInput
            placeholder="Length"
            name="length"
            type="number"
            v-model="itemDetails.length"
            :required="true"
            class="border-gray-200"
            v-if="itemDetails.type !== 'circle'"
          />

          <FwbSelect v-model="itemDetails.fill" :options="colors" placeholder="Color" />
        </form>
      </template>
      <template #footer>
        <div class="flex justify-end">
          <FwbButton
            @click="
              activateEditItemModal();
              updateItem();
            "
            color="green"
          >
            Create item
          </FwbButton>
        </div>
      </template>
    </FwbModal>
  </div>
</template>
