export default function({ redirect, store }) {
  const isAuthenticated = store.state.auth.token ? true : false
  if (!isAuthenticated) {
    redirect('/login')
  }
}