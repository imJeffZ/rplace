import React, { Component } from "react";
import { getWSService } from './websocket';
import $ from 'jquery';


class Canvas extends Component {
    state = {
        ws: null
    }

    componentDidMount() {
        // connect to websocket
        this.setState({
            ws: getWSService()
        })
        
        $.ajax({
            method: "GET",
            url: "https://br1rakedib.execute-api.us-east-1.amazonaws.com/production",
            success:function(data){
                for (let i in data){
                    var pixel = data[i].pixel;
                    var color = data[i].color;
                    var x = pixel%1000;
                    var y = Math.floor(pixel/1000);
                    console.log(x,y)
                    var canvas = document.getElementById("myCanvas");
                    var ctx = canvas.getContext("2d");
                    ctx.fillStyle = color;
                    ctx.fillRect(x, y, 1, 1 );
                }

            }
        })
    }
    componentWillUnmount() {
        this.state.ws.onConnClose();
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
        // this.state.ws.sendMessage('sendmessage', 'test');
        this.state.ws.sendMessage('sendmessage', {x, y, color, username});
        // var canvas = document.getElementById("myCanvas");
        // var ctx = canvas.getContext("2d");
        // ctx.fillStyle = color;
        // ctx.fillRect(x, y, 1, 1 );
    }

    render() {
        return (
            <div>
                <canvas id="myCanvas" width="999" height="999"></canvas>
                <br/>
                <label>Username: </label>
                <input type="text" id="username" name="username" />
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
