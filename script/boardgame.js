const canvas = document.getElementById("boardgame");
const ctx = canvas.getContext("2d");

let dice;
let newBoardPlaceNumber;

class Player {
    constructor(boardPlaceNumber,xPos,yPos,img) {
        this.boardPlaceNumber = boardPlaceNumber;
        this.xPos = xPos;
        this.yPos = yPos;
        this.img = img;
    }
    updatePosition() {
        console.log("updatePosition er tilkalt");
    }
    animateSliding() {
        console.log("animateSliding er tilkalt");
    }
}

//lag players ut av player klassen
let player1 = new Player(1,20,20,"#");
let player2 = new Player(1,20,20,"#");

function rollDice(token) {
    dice = Math.floor(Math.random()*6)+1;
    token.boardPlaceNumber += dice;
    calculatePosition(token, token.boardPlaceNumber);
    console.log("du rullet " + dice + " og er nå på " + token.boardPlaceNumber);
    //return dice;
}

function calculatePosition(token, boardPlaceNumber) {
    //regn ut hvor Y er ut fra 6 mulige y posisjoner
    let YPosRow = Math.trunc((boardPlaceNumber/6)-0.1);
    token.yPos = (YPosRow*90)+20;
    //X pos varierer om den skal gå til høyre eller venstre
    //sjekk y pos for om det er heltall om den skal gå til venstre
    if (YPosRow%2==0) {
        if (boardPlaceNumber%6 == 0) {
            token.xPos = 470;
        } else {
            token.xPos = (((boardPlaceNumber%6)-1)*90+20);
        }
    }
    //hvis y er et deltall skal x posisjon gå til høyre
    if (YPosRow%2==1) {
        if (boardPlaceNumber%6 == 0) {
            token.xPos = 20;
        } else {
            token.xPos = 560-((boardPlaceNumber%6)*90);
        }
    }
    console.log("X posisjon er: " + token.xPos + " og Y posisjon er: " + token.yPos);
    console.log("Regnet ut row: " + (YPosRow + 1));
    update();
}

function update() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawTokens();
}update();

function drawTokens() {
    ctx.beginPath();
    ctx.fillStyle="#000000";
    ctx.rect(player1.xPos,player1.yPos,90,90);
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.fillStyle="tomato";
    ctx.rect(player2.xPos,player2.yPos,90,90);
    ctx.fill();
    ctx.closePath();
}