
import "./App.css";
import Timeline from "./components/Timeline";
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
     <Timeline/>
      </>
      </header>
    </div>
  );
}


export default App;
