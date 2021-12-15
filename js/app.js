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
function addChoice(choicesIndex,text){
    //let $button =$(`<button type="button" id="button${choicesIndex}">${text}</button>`);
    let $button =$(`<button type="button" id="button">${text}</button>`);
    $choices.append($button);
    return($button)
}

//!SECTION
//=========================================================
//SECTION 3: Gameflow functions
//=========================================================

//ANCHOR assemble room
function assembleRoom(roomObj){
    updateStatDisp();
    //REVIEW get a random room from a list excluding previous explored rooms
    getDisplayText(roomObj.textEnter);
    //create buttons loop
    for(i=0;i<roomObj.choices.length;i++){
        addChoice(i,roomObj.choices[i].text);//include the target texthere?
    };
    //add event listeners to buttons
    $choices.children('button').each(function(index){
        $(this).on('click',function(){userChoice(index)})
    });
}
//ANCHOR user selection result
function userChoice(choiceIndex){
    console.log("user clicked button ",choiceIndex);
    setTimeout(exampleRoom.choices[choiceIndex].result,1);
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
            result:"console.log('choice 1 is wacky');"
        },
        {
            text:"Politely ask the wall to move",
            result:"console.log('choice 2 is wackier');"
        },
        {
            text:"Hello buttface",
            result:"console.log('choice 3 oh really.');"
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