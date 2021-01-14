import React from 'react';
import {HashRouter,Route,Switch} from "react-router-dom";
import RegisterPage from "./RegisterPage";
import App from "./App";

const Home=()=>{
    return( 
        <HashRouter>
            <Switch>
                <Route exact path="/register" component={RegisterPage}/>
                <Route path="/" component={App}/>
            </Switch>
        </HashRouter>
    );
}

export default Home;