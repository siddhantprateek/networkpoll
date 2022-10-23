import React from 'react';
import { Suspense } from 'react';
import { Header } from './components';
// import { Home, Register } from './views';
import './App.css';
import { Route, Routes } from 'react-router-dom';

const Home = React.lazy(() => import("./views/home/home.views.jsx"));
const Register = React.lazy(() => import("./views/register/register.views.jsx"));

function App() {
  return (
    <div className="App">
      <Suspense fallback={<div>Loading...</div>}>
        <Header/>
        <Routes>
          <Route index element={<Home/>}/> 
          <Route path='/register' element={<Register/>}/>
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
