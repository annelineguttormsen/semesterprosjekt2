const canvas = document.getElementById("boardgame");
const ctx = canvas.getContext("2d");

function canvasEventListener() {
    mousePosition(event);
}
canvas.addEventListener("click",canvasEventListener);

let dice;

let oldBoardPlaceNumber;

//audio
let victoryAudio = new Audio("./audio/victory.WAV");
let introAudio = new Audio("./audio/introtoot.WAV");

//klasser
class Player {
    constructor(boardPlaceNumber,xPos,yPos,img) {
        this.boardPlaceNumber = boardPlaceNumber;
        this.xPos = xPos;
        this.yPos = yPos;
        this.img = img;
    }
    animateSliding(oBPC, bPC) {
        //deklarer en variabel som bestemmer lengen på timeout
        let i = 0;
        for (oBPC;oBPC<=bPC;oBPC++) {
            //lag closure til this objektet for loopen
            let thisObject = this;
            //for hver loop sett en timeout som hver er
            //300 millisekunder lengre enn forrige
            (function(oBPC) {
                setTimeout(function(){calculatePosition(thisObject,oBPC)},300*i);
                i++;
            }(oBPC));
            if (oBPC == 30) {
                setTimeout(function(){console.log("du vant!")},300*i);
                break;
            }
            if (oBPC == bPC) {
                setTimeout(function(){canvas.addEventListener("click",canvasEventListener)},300*i);
            }
        }
    }
}

class Traps {
    constructor(infoText,boardPlaceNumber) {
        this.infoText = infoText;
        this.boardPlaceNumber = boardPlaceNumber;
    }
}

//objekter, deklarert med og uten klasse
let diceObject = {
    width:220,
    height:230,
    xPos:560,
    yPos:250
}

//lag players ut av player klassen
let player1 = new Player(1,20,20,"#");
let player2 = new Player(1,20,20,"#");

//lag posisjoner til fem tilfeldige feller
/*let trapPosition = new Array();

for (var i = 0;i<5;i++) {
    let tilfeldigTall = (Math.ceil(Math.random()*28)+1);
    for (var i = 0;i<trapPosition.length;i++) {
        if (tilfeldigTall == trapPosition[i]) {
            if (tilfeldigTall == 29) {
                trapPosition.push(28);
            }
            else {
                tilfeldigTall = trapPosition[i]++;
            }
        }
    }
    trapPosition.push(tilfeldigTall);
}
console.log(trapPosition);*/

function rollDice(token) {
    dice = Math.floor(Math.random()*6)+1;
    oldBoardPlaceNumber = token.boardPlaceNumber;
    //endre token sitt bpc til det nye, viktig så animatesliding metode blir riktig
    token.boardPlaceNumber += dice;
    //gå til token og animer at spillebrikken går over brettet
    token.animateSliding(oldBoardPlaceNumber,token.boardPlaceNumber);
    console.log("du rullet " + dice + " og er nå på " + token.boardPlaceNumber);
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
    update();
}

function update() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    //draw players
    drawObject(player1.xPos,player1.yPos,90,90,"#000");
    drawObject(player2.xPos,player2.yPos,90,90,"tomato");
    //draw dice
    drawObject(diceObject.xPos,diceObject.yPos,diceObject.width,diceObject.height,"lightblue");
}
//fjern funksjon og sett opp startGame() funksjon
update();

//generell draw funksjon
function drawObject(xPos,yPos,width,height,bgcolor,img) {
    ctx.beginPath();
    if (bgcolor !== undefined) {
        ctx.fillStyle=bgcolor;
    }
    ctx.rect(xPos,yPos,width,height);
    ctx.fill();
    ctx.closePath();
}

function mousePosition(event) {
    //fjern eventlistener til players tur er over
    canvas.removeEventListener("click",canvasEventListener);
    //få tak i informasjon om canvas elementet
    let canvasInfo = canvas.getBoundingClientRect();
    //få deretter tak i informasjon om musepeker på client
    let x = event.clientX;
    let y = event.clientY;
    //regn ut posisjon av museklikk på canvas elementet
    canvasX = x - canvasInfo.left;
    canvasY = y - canvasInfo.top;
    if (canvasX > diceObject.xPos && canvasY > diceObject.yPos) {
        if (canvasX < (diceObject.xPos + diceObject.width) && canvasY < (diceObject.yPos + diceObject.width)) {
            rollDice(player1);
        }
    }
    else {
        console.log("mousePosition() fant ingenting");
    }
}
