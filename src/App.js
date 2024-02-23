import logo from './logo.svg';
import './App.css';
import { Home } from './Pages/Home';

function App() {
  return (
    <div className="App" style={{ backgroundImage: "url('https://images.pexels.com/photos/3473569/pexels-photo-3473569.jpeg?auto=compress&cs=tinysrgb&w=600')",color:"white",height:"100vh",backgroundSize: "cover"}}>
      <Home/>
    </div>
  );
}

export default App;
