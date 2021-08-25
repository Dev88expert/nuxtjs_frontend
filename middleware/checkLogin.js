export default function({ redirect, store }) {
  const isAuthenticated = store.state.auth.token ? true : false
  console.log(store.state.auth.token,'dmiddle')
  if (isAuthenticated) {
    redirect('/')
  }
}