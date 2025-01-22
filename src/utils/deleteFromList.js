export function deleteFromList(list, target) {
    const index = list.findIndex(item => {
        return item === target
    })
    list.splice(index, 1)
}
