import React, { Component } from "react";
import { getWSService } from './websocket';
import $ from 'jquery';


class Canvas extends Component {
    state = {
        ws: null
    }

    

    componentDidMount() {
        // connect to websocket


        $.ajax({
            method: "GET",
            url: "https://br1rakedib.execute-api.us-east-1.amazonaws.com/production",
            success:function(data){
                for (let i in data){
                    var pixel = data[i].pixel;
                    var color = data[i].color;
                    var x = pixel%1000;
                    var y = Math.floor(pixel/1000);
                    console.log(x, y, color);
                    this.updatePixel(x, y, color);
                }

                this.setState({
                    ws: getWSService()
                }, this.initWSListener)
                
            }.bind(this)
        })
    }

    componentWillUnmount() {
        this.state.ws.onConnClose();
    }

    updatePixel(x, y, color) {
        var canvas = document.getElementById("myCanvas");
        var ctx = canvas.getContext("2d");
        ctx.fillStyle = color;
        ctx.fillRect(x, y, 100, 100);
    }

    updateListener(data) {
        console.log("triggered update listener");
        const {pixel, color} = data;
        const x = pixel % 1000;
        const y = Math.floor(pixel / 1000);
        
        this.updatePixel(x, y, color);
    }

    initWSListener() {
        this.state.ws.addMessageListener("room", "message", this.updateListener.bind(this));
    }

    constructor(props){
        super(props);
        this.setPixel = this.setPixel.bind(this);
        this.initWSListener = this.initWSListener.bind(this);
    }

    setPixel(){
        var x = parseInt(document.getElementById("x").value);
        var y = parseInt(document.getElementById("y").value);
        var color = document.getElementById("color").value;
        var pixel = x+1000*y;
        this.state.ws.sendMessage('sendmessage', {pixel, color});
        var canvas = document.getElementById("myCanvas");
        var ctx = canvas.getContext("2d");
        ctx.fillStyle = color;
        ctx.fillRect(x, y, 100, 100);
    }

    render() {
        return (
            <div>
                <canvas id="myCanvas" width="999" height="999"></canvas>
                <br/>
                <label>X Coordinate: </label>
                <input type="number" id="x" name="x" min="0" max="999"/>
                <br/>
                <label>Y Coordinate: </label>
                <input type="number" id="y" name="y" min="0" max="999"/>
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
