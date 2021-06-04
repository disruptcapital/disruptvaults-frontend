import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Vaults } from './components/Vaults'

function App() {
  return (
    <div id="app" class="d-flex h-100 text-center text-white bg-dark">
      <div class="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
        <header class="mb-auto">
          <div>
            <h3 class="float-md-start mb-0">Disrupt Vaults</h3>
            <nav class="nav nav-masthead justify-content-center float-md-end">
              <a class="nav-link" href="#">
                Contact
              </a>
            </nav>
          </div>
        </header>

        <main class="px-3">
          <h1>Compounding...</h1>
          <p class="lead">Binance Smart Chain yield aggregators with a fresh perspective.</p>
          <Vaults />
        </main>

        <footer class="mt-auto text-white-50">
          <p>
            Yield Optimizing Strategies by{' '}
            <a href="https://twitter.com/disrupttechno" class="text-white">
              @disruptcapital
            </a>
            .
          </p>
        </footer>
      </div>
    </div>
  )
}

export default App
