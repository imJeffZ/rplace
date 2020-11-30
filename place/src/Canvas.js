import React, { Component } from "react";

class Canvas extends Component {
    constructor(props){
        super(props);
        this.setPixel = this.setPixel.bind(this);
    }

    setPixel(){
        var x = document.getElementById("x").value;
        var y = document.getElementById("y").value;
        var color = document.getElementById("color").value;
        var canvas = document.getElementById("myCanvas");
        var ctx = canvas.getContext("2d");
        ctx.fillStyle = color;
        ctx.fillRect(x, y, 1, 1 );
    }

    render() {
        return (
            <div>
                <canvas id="myCanvas" width="250" height="250"></canvas>
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
