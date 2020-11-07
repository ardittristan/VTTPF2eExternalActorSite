import {
  Bulk,
  calculateBulk,
  defaultBulkConfig,
  formatBulk,
  weightToBulk,
} from './bulk';


class ContainerData {
  item;
  heldItems;
  negateBulk;
  heldItemBulk;
  isInContainer;
  formattedHeldItemBulk;
  formattedNegateBulk;
  formattedCapacity;
  capacity;

  constructor({ item, heldItems, negateBulk, capacity, heldItemBulk, isInContainer, formattedNegateBulk, formattedHeldItemBulk, formattedCapacity }) {
    this.item = item;
    this.heldItems = heldItems;
    this.negateBulk = negateBulk;
    this.heldItemBulk = heldItemBulk;
    this.isInContainer = isInContainer;
    this.formattedHeldItemBulk = formattedHeldItemBulk;
    this.formattedNegateBulk = formattedNegateBulk;
    this.formattedCapacity = formattedCapacity;
    this.capacity = capacity;
  }

  get isContainer() {
    return !this.capacity.isNegligible;
  }

  get isCollapsed() {
    return this.item?.data?.collapsed?.value ?? false;
  }

  get isNotInContainer() {
    return !this.isInContainer;
  }

  _getLightBulkCapacityThreshold() {
    if (this.capacity.normal > 0) {
      // light bulk don't count towards bulk limit
      return this.capacity.toLightBulk() + 10;
    }
    // but do if the container only stores light bulk
    return this.capacity.light;
  }

  get fullPercentage() {
    const capacity = this._getLightBulkCapacityThreshold();
    if (capacity === 0) {
      return 0;
    }
    const heldLightBulk = this.heldItemBulk.toLightBulk();
    return Math.floor((heldLightBulk / capacity) * 100);
  }

  get fullPercentageMax100() {
    const percentage = this.fullPercentage;
    if (percentage > 100) {
      return 100;
    }
    return percentage;
  }

  get isOverLoaded() {
    if (this.capacity.normal > 0) {
      return this.heldItemBulk.toLightBulk() >= this.capacity.toLightBulk() + 10;
    }
    return this.heldItemBulk.toLightBulk() > this.capacity.light;
  }
}

export function getContainerMap(items = [], bulkItemsById = new Map(), stackDefinitions, bulkConfig = defaultBulkConfig) {
  const allIds = groupBy(items, (item) => item._id);

  const containerGroups = groupBy(items, (item) => {
    const containerId = item?.data?.containerId?.value;
    if (allIds.has(containerId)) {
      return containerId;
    }
    return null;
  });

  const idIndexedContainerData = new Map();
  for (const item of items) {
    const isInContainer = containerGroups.has(item?.data?.containerId?.value);
    const heldItems = containerGroups.get(item._id) || [];

    idIndexedContainerData.set(
      item._id,
      toContainer(allIds.get(item._id)[0], heldItems, bulkItemsById.get(item._id)?.holdsItems ?? [], isInContainer, stackDefinitions, bulkConfig)
    );
  }

  return idIndexedContainerData;
}

/* -------------------------------------------- */

export function groupBy(array, criterion) {
  const result = new Map();
  for (const elem of array) {
    const key = criterion(elem);
    if (result.get(key) === undefined) {
      result.set(key, [elem]);
    } else {
      result.get(key).push(elem);
    }
  }
  return result;
}

/* -------------------------------------------- */

function toContainer(item, heldItems = [], heldBulkItems = [], isInContainer, stackDefinitions, bulkConfig) {
  const negateBulk = weightToBulk(item.data?.negateBulk?.value) ?? new Bulk();
  const [heldItemBulk] = calculateBulk(heldBulkItems, stackDefinitions, false, bulkConfig);
  const capacity = weightToBulk(item.data?.bulkCapacity?.value) ?? new Bulk();
  return new ContainerData({
    item,
    heldItems,
    negateBulk,
    capacity,
    heldItemBulk,
    isInContainer,
    formattedNegateBulk: formatBulk(negateBulk),
    formattedHeldItemBulk: formatBulk(heldItemBulk),
    formattedCapacity: formatBulk(capacity),
  });
}
