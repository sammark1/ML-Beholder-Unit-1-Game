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
    sanity:3,
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
        $(this).on('click',function(){userChoice(roomObj,index)})
    });
}
//ANCHOR user selection result
function userChoice(roomObj,choiceIndex){
    //console.log("user clicked button ",choiceIndex);
    const choice = roomObj.choices[choiceIndex];
    console.log(setTimeout(choice.contest,1))
    if(eval(choice.contest)){
        setTimeout(choice.resultWin,1);
        getDisplayText(choice.textResultWin);
    }
    else{
        setTimeout(choice.resultFail,1);
        getDisplayText(choice.textResultFail);
    }
    //setTimeout(roomObj.choices[choiceIndex].result,1);//stats changed
    //getDisplayText(roomObj.choices[choiceIndex].textResult);
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
            contest:'beholder.eyestalks>=2',
            resultFail:"console.log('choice 1 failed');",
            textResultFail:`${beholder.name} shoots the wall with an eye ray! unfortunately they use their petrify beam and freeze the wall in place permanantly. They have to find another way around. Happiness▼`,
            resultWin:"console.log('choice 1 win!');",
            textResultWin:`${beholder.name} shoots the wall with an eye ray! It disintegrates right before their gleeful face. Happiness▲, eyestalks▲`,

        },
        {
            text:"Politely ask the wall to move",
            contest:'beholder.sanity<=2',
            resultFail:"console.log('choice 1 failed');",
            textResultFail:`${beholder.name} politely asks the wall to move. The wall stands still. What a silly thing to do. Happiness▼`,
            resultWin:"console.log('choice 1 win!');",
            textResultWin:`${beholder.name} politely asks the wall to move. The wall takes a sweeping bow and shifts aside. ${beholder.name} is very pleased with themself. Happiness▲, sanity▼`,
        },
    ]
}
//testing
clearAll();
assembleRoom(exampleRoom);
$("#happiness").children().text(happinessIcons[4]);

//!SECTION
//=========================================================
//SECTION 5: Win/Lose Conditions
//=========================================================

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

//TODO INCLUDE DETAILS OF STAT CHANGES IN FLAVOR TEXT: A->B
