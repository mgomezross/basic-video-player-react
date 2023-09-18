
import "./App.css";
import Volume from "./components/Volume";
function App() {

 
  return (
    <div className="App">
      <header className="App-header">
      <>
     <Volume direction={'horizontal'}/>
     <Volume direction={'vertical'}/>
      </>
      </header>
    </div>
  );
}


export default App;
