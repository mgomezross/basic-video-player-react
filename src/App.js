
import "./App.css";
import VideoPlayer from "./components/VideoPlayer";
import Volume from "./components/Volume";
function App() {

 
  return (
    <div className="App">
      <header className="App-header">
      <>
     {/* <Volume direction={'horizontal'}/>
     <Volume direction={'vertical'}/> */}
     <VideoPlayer/>
      </>
      </header>
    </div>
  );
}


export default App;
