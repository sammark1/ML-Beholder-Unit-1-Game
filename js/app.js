//=========================================================
//SECTION 1:Global Delcarations
//=========================================================
//ANCHOR JS variables
let beholder ={
    name:"Hpaj'litz",
    pronoun:{},
    maxHP:10,
    maxEyestalks:10,
    maxSanity:10,
    maxHappiness:5,
    HP:0,
    eyestalks:0,
    sanity:0,
    happiness:0,
};
let currentRoom = 0;
//ANCHOR Referential objects and arrays
const happinessIcons=[
    'sentiment_very_dissatisfied',
    'sentiment_dissatisfied',
    'sentiment_neutral',
    'sentiment_satisfied',
    'sentiment_very_satisfied',
];
//ANCHOR JQuery declarations
const $displayRoom = $('header').eq(1);
const $displayBhName =$('.beholderName');
const $displayText = $('#displayText');
const $choices = $('#choices');

//!SECTION
//=========================================================
//SECTION 2:Display control functions
//=========================================================
//ANCHOR clear all
function clearAll(){
    $choices.empty();
    $displayText.text('');
}
//ANCHOR update status displays
function updateStatDisp(){
    $displayBhName.text(beholder.name);
}
//ANCHOR get displayText
function getDisplayText(target){
    $displayText.text(target);
}
//ANCHOR add choice
function addChoice(text, target){
    $choices.append(`<button type="button">${text}</button>`);
}

//!SECTION
//=========================================================
//SECTION 3: Gameflow functions
//=========================================================

//ANCHOR assemble room
function assembleRoom(roomObj){
    updateStatDisp();
    //get a random room from a list excluding previous explored rooms
    getDisplayText(roomObj.textEnter);
    for(i=0;i<roomObj.choices.length;i++){
        addChoice(roomObj.choices[i].text)//include the target texthere?
    }
}

//!SECTION
//=========================================================
//SECTION 4: Global Gameflow Object Declarations
//=========================================================
const exampleRoom = {
    textEnter:`${beholder.name} runs headlong into a wall. They HATE WALLS. Walls mock them.`,
    choices:[
        {
            text:"Eye Ray!",
            result:"here goes gameflow function call to be executed using setTimeout()"
        },
        {
            text:"Politely ask the wall to move",
            result:"here goes gameflow function call to be executed using setTimeout()"
        },
        {
            text:"Hello Gorgeous",
            result:"console.log('smooth like butter');"
        }
    ]
}
//testing
clearAll();
assembleRoom(exampleRoom);
$("#happiness").children().text(happinessIcons[4]);

//!SECTION
//=========================================================
//SECTION X:Secret Function
//=========================================================
function secret(e){
    console.log(e.code)
    if(e.code !== "KeyB"){
        return;
    }
    $('#style')[0].href="css/trueStyle.css"
    console.log($('#style')[0].href);
}
document.addEventListener('keypress', secret);