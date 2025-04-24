export default (id, list) => {
    return list.filter(e => e.id == id)[0]
}