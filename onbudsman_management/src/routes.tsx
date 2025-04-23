import React from "react";
import { Route, BrowserRouter } from "react-router-dom";

import Home from "./Home";
import Sobre from "./Sobre"
import Usuario from "./usuario"

const Routes = () => {
    return(
        <BrowserRouter>
            <Route Component = { Home }  path="/" >
            <Route Component = { Sobre }  path="/sobre" />
            <Route Component = { Usuario }  path="/usuario" />
        </BrowserRouter>
    )
 }

export default {Routes};