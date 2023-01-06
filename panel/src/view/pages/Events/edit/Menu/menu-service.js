/**
 * @typedef MenuItemMain
 * @property title
 * @property sort
 * @property id
 * @property {null | number} parent
 * @property lang
 * @property eventMenuId
 *
 * @typedef MenuItemUrl
 * @property {'url'} type
 * @property url
 *
 * @typedef MenuItemPage
 * @property {'page'} type
 * @property eventPageId
 *
 * @typedef {MenuItemPage | MenuItemUrl} MenuItemType
 *
 * @typedef MenuItemChildren
 * @property {Array[MenuItemMain]} children
 *
 * @typedef {MenuItemMain & MenuItemType & MenuItemChildren} EventMenuItem
 */

/**
 * @param {EventMenuItem[]} menuItems
 * @param {EventMenuItem} newItem
 * @returns EventMenuItem[]
 */
export function addMenuItem(menuItems = [], newItem) {
  const lastItem = getLast(menuItems)

  const newItemSort = lastItem ? lastItem.sort : 0
  const menuItemsWithNewSort = menuItems.map((menuItem) => ({
    ...menuItem,
    sort: menuItem.sort + 1,
  }))
  return [
    ...menuItemsWithNewSort,
    {
      ...newItem,
      sort: newItemSort,
    },
  ]
}

/**
 * @param {EventMenuItem[]} menuItems
 * @param {number} index
 * @returns EventMenuItem[]
 */
export function removeMenuItem(menuItems, index) {
  const arr = [...menuItems]
  arr.splice(index, 1)
  return arr
}

/**
 * @param {EventMenuItem[]} menuItems
 * @returns {EventMenuItem || undefined}
 */
export function getLast(menuItems) {
  if (!menuItems?.length) {
    return
  }
  return menuItems[menuItems.length - 1]
}

/**
 * @returns EventMenuItem
 */
export function createDefaultMenuItem({ eventMenuId, lang, parentId }) {
  return {
    title: '',
    eventMenuId,
    lang,
    parentId,
    type: 'url',
    url: '',
  }
}

/**
 * @param {EventMenuItem[]} menuItems
 * @param {EventMenuItem} updatedItem
 * @param {number} index
 * @returns EventMenuItem[]
 */
export function updateItemInList(menuItems, updatedItem, index) {
  return menuItems.map((menuItem, i) => (i === index ? updatedItem : menuItem))
}

function swapSort(index1, index2, menuItems) {
  if (menuItems?.length < 2) return menuItems
  const upEl = menuItems[index1]
  const downEl = menuItems[index2]
  const upElSort = upEl.sort
  const dowElSort = downEl.sort

  // меняем значения сортировок у двух соседних элементов элементов
  const listUpdatedUp = updateItemInList(menuItems, { ...upEl, sort: dowElSort }, index1)
  return updateItemInList(listUpdatedUp, { ...downEl, sort: upElSort }, index2)
}

/**
 * @param {EventMenuItem[]} menuItems
 * @param {number} index
 * @returns EventMenuItem[]
 */
export function upItem(menuItems, index) {
  if (index === 0) return menuItems
  return sortItems(swapSort(index - 1, index, menuItems))
}

export function downItem(menuItems, index) {
  if (index >= menuItems?.length - 1) return menuItems

  return sortItems(swapSort(index, index + 1, menuItems))
}

export function sortItems(list = []) {
  const arr = [...list]
  arr.sort((a, b) => b.sort - a.sort)
  return arr
}
