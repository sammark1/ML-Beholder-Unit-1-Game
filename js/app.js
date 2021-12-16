//=========================================================
//SECTION 1:Global Delcarations
//=========================================================
//ANCHOR JS variables
let beholder ={
    name:"",
    pronoun:{},
    maxHP:6,
    maxSanity:5,
    minSanity:-5,
    maxHappiness:5,
    HP:6,
    eyestalks:0,
    sanity:0,
    happiness:2,
};
let currentRoom = 0;
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
const $popover =$('#popover');
const $popEls={
    header:$('#poHeader'),
    content:$('#poContent'),
    input:$('#poInput'),
    button:$('#poConfirm'),
}
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
//SECTION 2:Utility functions
//=========================================================
//ANCHOR random number
function randomNum(rangeStart,rangeEnd){
    return(Math.floor(Math.random()*rangeEnd)+rangeStart);
}
//!SECTION
//=========================================================
//SECTION 3:Display control functions
//=========================================================
//ANCHOR clear all
function clearAll(){
    $choices.empty();
    $displayText.text('');
}
//ANCHOR update status displays
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
//SECTION 4: Gameflow functions
//=========================================================
//ANCHOR new game
function newGame(){
    clearAll();
    console.log('newGame');
    $popover.show();
    $popEls.header.show();
    $popEls.header.text('My Little Beholder');
    $popEls.content.show();
    $popEls.content.text('Name your new friend!');
    $popEls.input.show();
    $popEls.button.show();
    $popEls.button.text("Send 'em into the dungeon!");
    $popEls.button.on('click',function(){
        beholder.name=$popEls.input.val();
        clearAll();
        updateStatDisp();
        getRoom();
    });

}
//ANCHOR get appropriate room
function getRoom(){
    $popover.hide();
    assembleRoom(standardRooms[randomNum(0,standardRooms.length)])
}
//ANCHOR assemble room
function assembleRoom(roomObj){
    updateStatDisp();
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
    console.log("marker")
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
    if(beholder.HP>beholder.maxHP){console.log("HP: ",beholder.HP); beholder.HP=beholder.maxHP;}
    console.log(beholder.HP);
    //lose conditional
    updateStatDisp();
    if(beholder.HP<=0){gameOver(); return;}
    addChoice(0,"Continue");
    $choices.children('button').on('click',nextRoom)
}
//ANCHOR wrapping choice and continuing to next room
function nextRoom(){
    clearAll();
    console.log("you clicked continue");
    getRoom();
}

//!SECTION
//=========================================================
//SECTION 5: Win/Lose functions
//=========================================================
//ANCHOR HP ZERO
function gameOver(){
    updateStatDisp();
    $popover.show();
    $popEls.input.hide();
    $popEls.header.text("GAME OVER")
    $popEls.content.text(`${beholder.name} has lost all their HP!`);
    $popEls.button.text('New Game?')
    $popEls.button.on('click',newGame);
}
//!SECTION
//=========================================================
//SECTION 6: Global Gameflow Object Declarations
//=========================================================
const standardRooms =[
    {//ANCHOR ROOM 1 happiness 
        textEnter:`${beholder.name} runs headlong into a wall. They HATE WALLS. Walls mock them.`,
        choices:[
            {
                text:"Eye Ray!",
                contest:'beholder.eyestalks>=2',
                resultFail:"console.log('fail'); beholder.happiness+=-1;",
                textResultFail:[`${beholder.name} shoots the wall with an eye ray! unfortunately they use their petrify beam and freeze the wall in place permanantly. They have to find another way around.`,"Happiness▼"],
                resultWin:"console.log('win'); beholder.happiness++; beholder.eyestalks++;",
                textResultWin:[`${beholder.name} shoots the wall with an eye ray! It disintegrates right before their gleeful face.`,'Happiness▲, Eyestalks▲'],
    
            },
            {
                text:"Politely ask the wall to move",
                contest:'beholder.sanity<=2',
                resultFail:"beholder.happiness--;",
                textResultFail:[`${beholder.name} politely asks the wall to move. The wall stands still. What a silly thing to do.`, 'Happiness▼'],
                resultWin:"beholder.happiness++; beholder.sanity--;",
                textResultWin:[`${beholder.name} politely asks the wall to move. The wall takes a sweeping bow and shifts aside. ${beholder.name} is very pleased with themself.`,'Happiness▲, sanity▼'],
            },
        ]
    },
    {//ANCHOR ROOM 2 HP danger with avoid path option
        textEnter:`${beholder.name} find the skeleton of an old wizard. The spooky skeleton has a long gray beard and is clutching a glowing orb with something that looks like mayonaise inside.`,
        choices:[
            {
                text:"GRAB THAT MAYO ORB!",
                contest:'beholder.sanity>=0',
                resultFail:"beholder.HP+=-1;",
                textResultFail:[`${beholder.name} grabs the orb without hesitation. Unfortunately it doesn't function in ${beholder.name}'s anti-magic eye and short circuits, zapping them in the mouth.`,'HP▼'],
                resultWin:"beholder.eyestalks++;",
                textResultWin:[`${beholder.name} grabs the orb without hesitation. It appears to contain knowledge of mayonaise based magic.`, `Eyestalks▲`],
    
            },
            {
                text:"This is clearly a wizard trap. Wizards are always trapping orbs.",
                contest:'true',
                resultFail:"console.log('error: LINE 215')",
                textResultFail:[``, 'ERROR CHECK CONSOLE LOG'],
                resultWin:"",
                textResultWin:[`${beholder.name} happily continues on their merry way. They don't like mayonaise anyway.`,''],
            },
            {
                text:"Split it open like an egg, with an EYE RAY!",
                contest:'beholder.eyestalks > 4',
                resultFail:"beholder.happiness--;",
                textResultFail:[`The small sphere breaks open revealing its mayonaise goodness. Unfortunately, ${beholder.name} forgot to negate the sphere's magic while opening it and it explodes in a massive A.O.E. mayonaise ball.`, `HP▼`],
                resultWin:"beholder.happiness++; beholder.HP++;",
                textResultWin:[`the small sphere breaks open revealing its mayonaise goodness, and it turns out to be MAGIC MAYONAISE.`,`HP▲ Happiness▲`],
            },
        ]
    },
    {//ANCHOR ROOM 3 
        textEnter:`${beholder.name} does something interesting`,
        choices:[
            {
                text:"choice 1",
                contest:'beholder.sanity>=0',
                resultFail:"beholder.HP+=-1;",
                textResultFail:[`${beholder.name} grabs the orb without hesitation. Unfortunately it doesn't function in ${beholder.name}'s anti-magic eye and short circuits, zapping them in the mouth.`,'HP▼'],
                resultWin:"beholder.HP+=-1;;",
                textResultWin:[`${beholder.name} grabs the orb without hesitation. It appears to contain knowledge of mayonaise based magic.`, `Eyestalks▲`],
    
            },
            {
                text:"choice 2",
                contest:'true',
                resultFail:"console.log('error: LINE 215')",
                textResultFail:[``, 'ERROR CHECK CONSOLE LOG'],
                resultWin:"",
                textResultWin:[`${beholder.name} happily continues on their merry way. They don't like mayonaise anyway.`,''],
            },
            {
                text:"choice 3",
                contest:'beholder.eyestalks > 4',
                resultFail:"beholder.HP+=-1;;",
                textResultFail:[`The small sphere breaks open revealing its mayonaise goodness. Unfortunately, ${beholder.name} forgot to negate the sphere's magic while opening it and it explodes in a massive A.O.E. mayonaise ball.`, `HP▼`],
                resultWin:"beholder.HP+=-1;",
                textResultWin:[`the small sphere breaks open revealing its mayonaise goodness, and it turns out to be MAGIC MAYONAISE.`,`HP▲ Happiness▲`],
            },
        ]
    },
]
//testing
newGame();
//assembleRoom(standardRooms[2]);
//("#happiness").children().text(happinessIcons[5]);

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
