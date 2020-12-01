import React, { Component } from "react";
import { getWSService } from './websocket';


class Canvas extends Component {
    state = {
        ws: null
    }

    componentDidMount() {
        // connect to websocket
        this.setState({
            ws: getWSService()
        })
        // api call to get board

    }
    componentWillUnmount() {
        this.state.ws.onclose();
    }

    constructor(props){
        super(props);
        this.setPixel = this.setPixel.bind(this);
    }

    setPixel(){
        var x = document.getElementById("x").value;
        var y = document.getElementById("y").value;
        var color = document.getElementById("color").value;
        var username = document.getElementById("username").value;
        // var canvas = document.getElementById("myCanvas");
        // var ctx = canvas.getContext("2d");
        // ctx.fillStyle = color;
        // ctx.fillRect(x, y, 1, 1 );
    }

    render() {
        return (
            <div>
                <canvas id="myCanvas" width="250" height="250"></canvas>
                <br/>
                <label>Username: </label>
                <input type="text" id="username" name="username" />
                <br/>
                <label>X Coordinate: </label>
                <input type="number" id="x" name="x" min="0" max="250"/>
                <br/>
                <label>Y Coordinate: </label>
                <input type="number" id="y" name="y" min="0" max="250"/>
                <br/>
                <br/>
                <label>Choose Color: </label>
                <input type="color" id="color" name="color"/>
                <br/>
                <br/>
                <button onClick={this.setPixel}>Change Pixel</button>
            </div>
        );
    }

}


export default Canvas;
