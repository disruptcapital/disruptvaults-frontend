import 'bootstrap/scss/bootstrap.scss';
import './App.scss';

import { Vaults } from './components/Vaults';
import { Header } from 'components/Header';

function App() {
  return (
    <div id="app" className="h-100 text-light bg-dark">
      <div class="container d-flex w-100 h-100 p-3 mx-auto flex-column">
        <Header />
        <main className="px-3 text-center">
          <h2>Compounding...</h2>
          <p>Binance Smart Chain yield aggregators with a fresh perspective.</p>
          <Vaults />
        </main>
        <footer class="mt-auto text-white-50 text-center">
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
  );
}

export default App;
