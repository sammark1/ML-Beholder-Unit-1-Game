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
    HP:6,
    eyestalks:0,
    sanity:3,
    happiness:0,
};
let currentRoom = 5;
//ANCHOR Referential objects and arrays
const happinessIcons=[
    'mood_bad',
    'sentiment_very_dissatisfied',
    'sentiment_dissatisfied',
    'sentiment_neutral',
    'sentiment_satisfied',
    'sentiment_very_satisfied',
];
const hpIcons =[
    'favorite',
    'favorite_border',
]
//ANCHOR JQuery declarations
const $displayBhName =$('.beholderName');
const $displayText = $('#displayText');
const $choices = $('#choices');
const $displays = {
    disRoomNum:$('.dynDisp').eq(0),
    disHP:$('.material-icons').eq(0),
    disEyestalks:$('.dynDisp').eq(2),
    disSanity:$('.dynDisp').eq(3),
    disHappiness:$('.material-icons').eq(1),
}

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
//NOTE DO THIS FUNCTION NEXT PLZ.
function updateStatDisp(){
    $displayBhName.text(beholder.name);
    $displays.disRoomNum.text(currentRoom);
    //hp translation
    {
        let hearts = '';
        for(i=0;i<beholder.HP;i++){
            hearts+=`${hpIcons[0]} `;
        }
        for(i=0;i<(6-beholder.HP);i++){
            hearts+=`${hpIcons[1]} `;
        }
        $displays.disHP.text(hearts);
    }   
    $displays.disEyestalks.text(beholder.eyestalks);
    $displays.disSanity.text(beholder.sanity);
    $displays.disHappiness.text(happinessIcons[beholder.happiness])
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
//("#happiness").children().text(happinessIcons[5]);

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
        $('#style')[0].href="css/style.css"
        return;
    }
    $('#style')[0].href="css/trueStyle.css"
    console.log($('#style')[0].href);
}
document.addEventListener('keypress', secret);

//TODO INCLUDE DETAILS OF STAT CHANGES IN FLAVOR TEXT: A->B
