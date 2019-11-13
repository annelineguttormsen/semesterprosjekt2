const canvas = document.getElementById("boardgame");
const ctx = canvas.getContext("2d");

let boardPlaceNumber = 1;
let tokenXPos;
let tokenYPos;
let YPosRow;

function calculatePosition(boardPlaceNumber) {
    //regn ut hvor Y er ut fra 6 mulige y posisjoner
    YPosRow = Math.trunc((boardPlaceNumber/6)-0.1);
    tokenYPos = YPosRow*75;
    //X pos varierer om den skal gå til høyre eller venstre
    //sjekk y pos for om det er heltall om den skal gå til venstre
    if (YPosRow%2==0) {
        if (boardPlaceNumber%6 == 0) {
            tokenXPos = 520;
        } else {
            tokenXPos = (((boardPlaceNumber%6)-1)*100+20);
        }
    }
    //hvis y er et deltall skal x posisjon gå til høyre
    if (YPosRow%2==1) {
        if (boardPlaceNumber%6 == 0) {
            tokenXPos = 20;
        } else {
            tokenXPos = 620-((boardPlaceNumber%6)*100);
        }
    }
    console.log("X posisjon er: " + tokenXPos + " og Y posisjon er: " + tokenYPos);
    console.log("Regnet ut row: " + (YPosRow + 1));
    update();
}
function update() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    updateToken();
}
function updateToken() {
    ctx.beginPath();
    ctx.fillStyle="#000000";
    ctx.rect(tokenXPos,tokenYPos,100,75);
    ctx.fill();
    ctx.closePath();
}