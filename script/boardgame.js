const canvas = document.getElementById("boardgame");
const ctx = canvas.getContext("2d");

let dice;

let oldBoardPlaceNumber;

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
            //300 sekunder lengre enn forrige
            (function(oBPC) {
                setTimeout(function(){calculatePosition(thisObject,oBPC)},300*i);
                i++;
            }(oBPC));
        }
        console.log("Nytt nummer for dette objektet er " + this.boardPlaceNumber);
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
let traps = new Array();

for (var i = 0;i<5;i++) {
    traps.push(Math.ceil(Math.random()*30));
}
console.log(traps);

function rollDice(token) {
    dice = Math.floor(Math.random()*6)+1;
    oldBoardPlaceNumber = token.boardPlaceNumber;
    //endre token sitt bpc til det nye, viktig så animatesliding metode blir riktig
    token.boardPlaceNumber += dice;
    //gå til token og animer at spillebrikken går over brettet
    token.animateSliding(oldBoardPlaceNumber,token.boardPlaceNumber);
    console.warn("du rullet " + dice + " og er nå på " + token.boardPlaceNumber);
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
    let canvasInfo = canvas.getBoundingClientRect();
    let x = event.clientX;
    let y = event.clientY;
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
