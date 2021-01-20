import React from 'react';
import {HashRouter,Route,Switch} from "react-router-dom";
import RegisterPage from "./RegisterPage";
import Home from "./Home";

const App=()=>{
    return( 
        <HashRouter>
            <Switch>
                <Route exact path="/register" component={RegisterPage}/>
                <Route path="/" component={Home}/>
            </Switch>
        </HashRouter>
    );
}

export default App;