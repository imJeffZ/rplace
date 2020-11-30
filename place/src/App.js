import './App.css';
import { Route, HashRouter } from "react-router-dom";
import Landing from "./Landing";


function App() {
  return (
    <div className="App">
      <HashRouter >
        <Route exact path="/" component={Landing} />
      </HashRouter> 
    </div>
  );
}

export default App;
