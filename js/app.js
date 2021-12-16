//=========================================================
//SECTION 1:Global Delcarations
//=========================================================
//ANCHOR JS variables
let beholder ={
    name:"Hpaj'litz",
    pronoun:{},
    maxHP:10,
    maxSanity:5,
    minSanity:-5,
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
function getDisplayText(target,appendix){
    let previous=$displayText.text();
    $displayText.text(previous+target);
    if(appendix){
        $displayText.append($(`<span id=highlight> ${appendix}</span>`));
    }
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
    clearAll()
    //console.log("user clicked button ",choiceIndex);
    const choice = roomObj.choices[choiceIndex];
    //console.log(setTimeout(choice.contest,1))
    if(eval(choice.contest)){
        setTimeout(choice.resultWin,1);
        getDisplayText(choice.textResultWin[0],choice.textResultWin[1]);
    }
    else{
        setTimeout(choice.resultFail,1);
        getDisplayText(choice.textResultFail[0],choice.textResultFail[1]);
    }
    setTimeout('choiceResults()',1);
}
//ANCHOR logic resulting from the choice
function choiceResults(){
    //resolve stat ranges and conditions
    if(beholder.HP>beholder.maxHP){beholder.HP=beholder.maxHP}
    else if(beholder.HP<0){console.log("lose condition function")}
    if(beholder.eyestalks<0){beholder.eyestalks=0}
    if(beholder.sanity>beholder.maxSanity){beholder.sanity=beholder.maxSanity}
    else if(beholder.sanity<beholder.minSanity){beholder.sanity=beholder.minSanity}
    if(beholder.happiness>beholder.maxHappiness){beholder.happiness=beholder.maxHappiness;}
    else if(beholder.happiness<0){
        beholder.happiness=0;
        if(true/*Math.floor(Math.random()*2)*/){
            const $subDisplayText =$(`<p>${beholder.name} is feeling rather down in the dumps. <span id="highlight">HP▼</span></p>`);
            $displayText.append($subDisplayText);
            beholder.HP--;
        }
    }
    updateStatDisp();
    addChoice(0,"Continue");
    $choices.children('button').on('click',doThing)
}
function doThing(){
    console.log("you clicked continue");
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
            resultFail:"console.log('fail'); beholder.happiness+=-1;",
            textResultFail:[`${beholder.name} shoots the wall with an eye ray! unfortunately they use their petrify beam and freeze the wall in place permanantly. They have to find another way around.`,"Happiness▼"],
            resultWin:"console.log('win'); beholder.happiness++; beholder.eyestalks++;",
            textResultWin:`${beholder.name} shoots the wall with an eye ray! It disintegrates right before their gleeful face. Happiness▲, eyestalks▲`,

        },
        {
            text:"Politely ask the wall to move",
            contest:'beholder.sanity<=2',
            resultFail:"beholder.happiness--;",
            textResultFail:`${beholder.name} politely asks the wall to move. The wall stands still. What a silly thing to do. Happiness▼`,
            resultWin:"beholder.happiness++; beholder.sanity--;",
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
    if(e.code !== "KeyB"){
        $('#style')[0].href="css/style.css"
        return;
    }
    $('#style')[0].href="css/trueStyle.css"
}
document.addEventListener('keypress', secret);

//TODO INCLUDE DETAILS OF STAT CHANGES IN FLAVOR TEXT: A->B
