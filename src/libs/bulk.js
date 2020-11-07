import {groupBy} from "./container"

export class Bulk {
  normal;

  light;

  constructor({ normal = 0, light = 0 } = {}) {
    this.normal = normal + Math.floor(light / 10);
    this.light = light % 10;
  }

  get isNegligible() {
    return this.normal === 0 && this.light === 0;
  }

  get isLight() {
    return this.toLightBulk() < 10 && !this.isNegligible;
  }

  toLightBulk() {
    return this.normal * 10 + this.light;
  }

  plus(bulk) {
    return new Bulk({
      normal: this.normal + bulk.normal,
      light: this.light + bulk.light,
    });
  }

  minus(bulk) {
    // 1 bulk is 10 light bulk
    const [thisBulk, otherBulk] = this._toSingleNumber(bulk);
    const result = thisBulk - otherBulk;

    // bulk can't get negative
    if (result < 0) {
      return new Bulk();
    }
    return new Bulk({
      normal: Math.floor(result / 10),
      light: result % 10,
    });
  }

  _toSingleNumber(bulk) {
    return [this.normal * 10 + this.light, bulk.normal * 10 + bulk.light];
  }

  times(factor) {
    return new Bulk({
      normal: this.normal * factor,
      light: this.light * factor,
    });
  }

  isSmallerThan(bulk) {
    const [thisBulk, otherBulk] = this._toSingleNumber(bulk);
    return thisBulk < otherBulk;
  }

  isBiggerThan(bulk) {
    const [thisBulk, otherBulk] = this._toSingleNumber(bulk);
    return thisBulk > otherBulk;
  }

  isEqualTo(bulk) {
    return this.normal === bulk.normal && this.light === bulk.light;
  }

  isPositive() {
    return this.normal > 0 || this.light > 0;
  }

  toString() {
    return `normal: ${this.normal}; light: ${this.light}`;
  }
}

export const defaultBulkConfig = {
  ignoreCoinBulk: false,
  ignoreContainerOverflow: false,
};

export function calculateBulk(items, stackDefinitions, nestedExtraDimensionalContainer = false, bulkConfig = defaultBulkConfig) {
  const inventory = new BulkItem({
    holdsItems: items,
  });
  return calculateCombinedBulk(inventory, stackDefinitions, nestedExtraDimensionalContainer, bulkConfig);
}

const lightBulkRegex = /^(\d*)l$/i;
const complexBulkRegex = /^(\d+);\s*(\d*)l$/i;

export function weightToBulk(weight) {
  if (weight === undefined || weight === null) {
    return undefined;
  }
  const trimmed = weight.trim();
  if (/^\d+$/.test(trimmed)) {
    return new Bulk({ normal: parseInt(trimmed, 10) });
  }
  const lightMatch = trimmed.match(lightBulkRegex);
  if (lightMatch) {
    return new Bulk({ light: parseInt(lightMatch[1] || "1", 10) });
  }
  const complexMatch = trimmed.match(complexBulkRegex);
  if (complexMatch) {
    const [, normal, light] = complexMatch;
    return new Bulk({
      normal: parseInt(normal, 10),
      light: parseInt(light || "1", 10),
    });
  }
  return undefined;
}

export function formatBulk(bulk) {
  if (bulk.normal === 0 && bulk.light === 0) {
    return "-";
  }
  if (bulk.normal > 0 && bulk.light === 0) {
    return `${bulk.normal}`;
  }
  if (bulk.light === 1 && bulk.normal === 0) {
    return `L`;
  }
  if (bulk.light > 0 && bulk.normal === 0) {
    return `${bulk.light}L`;
  }
  return `${bulk.normal}; ${bulk.light}L`;
}

export class BulkItem {
  id;

  bulk;

  quantity;

  stackGroup;

  isEquipped;

  unequippedBulk;

  equippedBulk;

  holdsItems;

  negateBulk;

  extraDimensionalContainer;

  constructor({
    id = "",
    bulk = new Bulk(),
    quantity = 1,
    stackGroup = undefined,
    isEquipped = false,
    // value to overrides bulk field when unequipped
    unequippedBulk = undefined,
    // value to overrides bulk field when equipped
    equippedBulk = undefined,
    holdsItems = [],
    // some containers like a backpack or back of holding reduce total bulk if
    // items are put into it
    negateBulk = new Bulk(),
    // extra dimensional containers cease to work when nested inside each other
    extraDimensionalContainer = false,
  } = {}) {
    this.id = id;
    this.bulk = bulk;
    this.quantity = quantity;
    this.stackGroup = stackGroup;
    this.holdsItems = holdsItems;
    this.negateBulk = negateBulk;
    this.unequippedBulk = unequippedBulk;
    this.equippedBulk = equippedBulk;
    this.isEquipped = isEquipped;
    this.extraDimensionalContainer = extraDimensionalContainer;
  }

  get reducesBulk() {
    return !this.negateBulk.isNegligible;
  }
}

function calculateCombinedBulk(item, stackDefinitions, nestedExtraDimensionalContainer = false, bulkConfig = defaultBulkConfig) {
  const [mainBulk, mainOverflow] = calculateItemBulk(item, stackDefinitions, bulkConfig);
  const [childBulk, childOverflow] = item.holdsItems
    .map((child) => calculateCombinedBulk(child, stackDefinitions, item.extraDimensionalContainer, bulkConfig))
    .reduce(combineBulkAndOverflow, [new Bulk(), {}]);

  // combine item overflow and child overflow
  const combinedOverflow = combineObjects(mainOverflow, calculateChildOverflow(childOverflow, item, bulkConfig.ignoreContainerOverflow), add);
  const [overflowBulk, remainingOverflow] = calculateStackBulk(combinedOverflow, stackDefinitions, bulkConfig);
  return [mainBulk.plus(reduceNestedItemBulk(childBulk, item, nestedExtraDimensionalContainer)).plus(overflowBulk), remainingOverflow];
}

function calculateItemBulk(item, stackDefinitions, bulkConfig) {
  const stackName = item.stackGroup;
  if (isBlank(stackName)) {
    return [calculateNonStackBulk(item).times(item.quantity), {}];
  }
  return calculateStackBulk({ [stackName]: item.quantity }, stackDefinitions, bulkConfig);
}

function combineObjects(first, second, mergeFunction) {
  const combinedKeys = new Set([...Object.keys(first), ...Object.keys(second)]);

  const combinedObject = {};
  for (const name of combinedKeys) {
    if (name in first && name in second) {
      combinedObject[name] = mergeFunction(first[name], second[name]);
    } else if (name in first) {
      combinedObject[name] = first[name];
    } else if (name in second) {
      combinedObject[name] = second[name];
    }
  }
  return combinedObject;
}

function calculateChildOverflow(overflow, item, ignoreContainerOverflow) {
  if (item.extraDimensionalContainer || ignoreContainerOverflow) {
    return {};
  }
  return overflow;
}

function calculateNonStackBulk(item) {
  if (item.unequippedBulk !== undefined && item.unequippedBulk !== null && !item.isEquipped) {
    return item.unequippedBulk;
  }
  if (item.equippedBulk !== undefined && item.equippedBulk !== null && item.isEquipped) {
    return item.equippedBulk;
  }
  return item.bulk;
}

function calculateStackBulk(itemStacks, stackDefinitions, bulkConfig = defaultBulkConfig) {
  return Object.entries(itemStacks)
    .filter(([stackType]) => !(bulkConfig.ignoreCoinBulk && stackType === "coins"))
    .map(([stackType, quantity]) => {
      if (!(stackType in stackDefinitions)) {
        throw new Error(`No stack definition found for stack ${stackType}`);
      }
      const { size, lightBulk } = stackDefinitions[stackType];
      const bulkRelevantQuantity = Math.floor(quantity / size);
      const itemBulk = new Bulk({ light: bulkRelevantQuantity * lightBulk });
      const overflow = { [stackType]: quantity % size };
      const result = [itemBulk, overflow];
      return result;
    })
    .reduce(combineBulkAndOverflow, [new Bulk(), {}]);
}

function reduceNestedItemBulk(bulk, item, nestedExtraDimensionalContainer) {
  if (isExtraDimensionalOrWorn(item, nestedExtraDimensionalContainer)) {
    return bulk.minus(item.negateBulk);
  }
  return bulk;
}

function add(x, y) {
  return x + y;
}

function isBlank(string) {
  return string === null || string === undefined || string.trim() === "";
}

function combineBulkAndOverflow(first, second) {
  const [firstBulk, firstOverflow] = first;
  const [secondBulk, secondOverflow] = second;
  return [firstBulk.plus(secondBulk), combineObjects(firstOverflow, secondOverflow, add)];
}

function isExtraDimensionalOrWorn(item, nestedExtraDimensionalContainer) {
  return (item.extraDimensionalContainer && !nestedExtraDimensionalContainer) || (item.reducesBulk && item.isEquipped);
}

export function indexBulkItemsById(bulkItems = []) {
  const result = new Map();
  bulkItems.forEach(bulkItem => fillBulkIndex(bulkItem, result));
  return result;
}

function fillBulkIndex(bulkItem, resultMap) {
  resultMap.set(bulkItem.id, bulkItem);
  bulkItem.holdsItems.forEach(heldBulkItem => fillBulkIndex(heldBulkItem, resultMap));
}

export function itemsFromActorData(actorData) {
  return toBulkItems(actorData.items.filter(isPhysicalItem));
}

function toBulkItems(items) {
  const allIds = new Set(items.map(item => item._id));
  const itemsInContainers = groupBy(items, item => {
      // we want all items in the top level group that are in no container
      // or are never referenced because we don't want the items to
      // disappear if the container is being deleted or doesn't have a reference
      const ref = item.data?.containerId?.value ?? null;
      if (ref === null || !allIds.has(ref)) {
          return null;
      }
      return ref;
  });
  if (itemsInContainers.has(null)) {
      const topLevelItems = itemsInContainers.get(null);
      return buildContainerTree(topLevelItems, itemsInContainers);
  }
  return [];
}

function buildContainerTree(items, groupedItems) {
  return items
      .map((item) => {
          const itemId = item._id;
          if (itemId !== null && itemId !== undefined && groupedItems.has(itemId)) {
              const itemsInContainer = buildContainerTree(groupedItems.get(itemId), groupedItems);
              return toBulkItem(item, itemsInContainer);
          }
          return toBulkItem(item);

      });
}

function toBulkItem(item, nestedItems = []) {
  const id = item._id;
  const weight = item.data?.weight?.value;
  const quantity = item.data?.quantity?.value ?? 0;
  const isEquipped = item.data?.equipped?.value ?? false;
  const equippedBulk = item.data?.equippedBulk?.value;
  const unequippedBulk = item.data?.unequippedBulk?.value;
  const stackGroup = item.data?.stackGroup?.value;
  const negateBulk = item.data?.negateBulk?.value;
  const extraDimensionalContainer = item.data?.traits?.value?.includes('extradimensional') ?? false;

  return new BulkItem({
      id,
      bulk: weightToBulk(normalizeWeight(weight)) ?? new Bulk(),
      negateBulk: weightToBulk(normalizeWeight(negateBulk)) ?? new Bulk(),
      // this stuff overrides bulk so we don't want to default to 0 bulk if undefined
      unequippedBulk: weightToBulk(normalizeWeight(unequippedBulk)),
      equippedBulk: weightToBulk(normalizeWeight(equippedBulk)),
      holdsItems: nestedItems,
      stackGroup,
      isEquipped,
      quantity,
      extraDimensionalContainer,
  });
}

function normalizeWeight(weight) {
  if (weight === null || weight === undefined) {
      return undefined;
  }
  // turn numbers into strings
  const stringWeight = `${weight}`;
  return stringWeight.toLowerCase()
      .trim();
}

function isPhysicalItem(item) {
  return ('data' in item) && ('quantity' in item.data);
}

export const stacks = {
  bolts: {
      size: 10,
      lightBulk: 1,
  },
  arrows: {
      size: 10,
      lightBulk: 1,
  },
  slingBullets: {
      size: 10,
      lightBulk: 1,
  },
  blowgunDarts: {
      size: 10,
      lightBulk: 1,
  },
  rations: {
      size: 7,
      lightBulk: 1,
  },
  coins: {
      size: 1000,
      lightBulk: 10,
  },
  gems: {
      size: 2000,
      lightBulk: 10,
  },
};

export const bulkConversions = {
  Tiny: {
      bulkLimitFactor: 0.5,
      treatsAsLight: '-',
      treatsAsNegligible: null,
  },
  Small: {
      bulkLimitFactor: 1,
      treatsAsLight: 'L',
      treatsAsNegligible: '-',
  },
  Medium: {
      bulkLimitFactor: 1,
      treatsAsLight: 'L',
      treatsAsNegligible: '-',
  },
  Large: {
      bulkLimitFactor: 2,
      treatsAsLight: '1',
      treatsAsNegligible: 'L',
  },
  Huge: {
      bulkLimitFactor: 4,
      treatsAsLight: '2',
      treatsAsNegligible: '1',
  },
  Gargantuan: {
      bulkLimitFactor: 8,
      treatsAsLight: '4',
      treatsAsNegligible: '2',
  },
};
