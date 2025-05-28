export default (client) => {
    client.on('ready', () => {
        console.log(`🔥 Estou online em ${client.user.username}!`)
    })
}
  