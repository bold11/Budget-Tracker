import { useState } from 'react';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

//import necessary pages
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import TransactionList from './components/TransactionList';
import CategoryList from './components/CategoryList';
import BudgetList from './components/BudgetList';
import AddTransaction from './components/AddTransaction';

function App() {

  // tracks current theme, starts on light
  const [darkMode, setDarkMode] = useState(false);
  const toggleTheme = () => setDarkMode(prev => !prev);

  return (
    // data-bs-theme tells Bootstrap to switch ALL components to dark mode
    <div data-bs-theme={darkMode ? 'dark' : 'light'} className="bg-body min-vh-100">

      <BrowserRouter>
        <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />

        <div className="container-fluid px-4">

          {/* Renders matching components */}
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/transactions" element={<TransactionList />} />
            <Route path="/categories" element={<CategoryList />} />
            <Route path="/budgets" element={<BudgetList />} />
            <Route path="/transactions/add" element={<AddTransaction />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;