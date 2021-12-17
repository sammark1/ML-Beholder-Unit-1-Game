/*TODO
--add boss rooms
--add/fix results for bottomed stats
--shuffle standard rooms array then run down the list
--add more rooms
--manage art
--add more art

HP doesn't often increase and is more likely to decrease in clearly dangerous situations. only ever decrease by 1 at a time
eyestalks is like exp and increases with success. every room should have at least one option to increase eyestalks.
sanity is a chaotic element. low sanity results in counterintuitive results, while high sanity results in straightforward results
    if sanity is at its minimum, possibly provide an unusual and dangerous encounter
happiness is a safeguard against many dangers from within the mind of the beholder.
    when happiness is at minimum, each event can have a random effect
        HP++ because beholder feels sorry for themselves
        HP-- becasue beholder's eyestalks are angry with eachother
        sanity-- because beholder is down in the dumps
        eyestalks-- because beholder doesn't trust one of them
    unusual encounter of unhappiness
*/
//=========================================================
//SECTION 1:Global Delcarations
//=========================================================
//ANCHOR JS variable stats
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
const roomLayout={
    standardRoomRun:6,
    bossRoomRun:4
}
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
function getDisplayText(text,appendix){
    let previous=$displayText.html();
    $displayText.html(previous+text);
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
    $popover.show();
    $popEls.header.show();
    $popEls.header.text('My Little Beholder');
    $popEls.content.show();
    $popEls.content.text('Name your new friend!');
    $popEls.input.show();
    $popEls.button.show();
    $popEls.button.text("Send 'em into the dungeon!");
    $popEls.button.on('click',function(){
        resetAll();
        beholder.name=$popEls.input.val();
        clearAll();
        updateStatDisp();
        showIntro1();
        //getRoom();
    });

}
//ANCHOR show intro
function showIntro1(){
    $popover.show();
    $popEls.header.hide();
    $popEls.input.hide();
    let p1='<p>That little floating eyeball you found has turned out to be one of the most beautiful creatures in all the lands, a many eye-stalked <span id="highlight">beholder</span>.Impossibly irrational, narcicistic, and xenophobic as beholders are, your only option is to lead your little charge to the nearest dungeon and guide it along the way to becoming the dungeon boss.</p>';
    let p3='<p>Along the way you’ll need to help your beholder develop their <span id="highlight">eyestalks</span>, keep their <span id="highlight">sanity</span> high,  maintain <span id="highlight">happiness</span>, and, most important, keep their <span id="highlight">HP</span> (hitpoints) above 0 to avoid death.</p>';
    let p4='<p>Help your beholder conquor (or obliterate) the dungeon and replace the end boss!</p>'
    $popEls.content.html(p1+p3+p4);
    //$popEls.content.html('That little floating eyeball you found has turned out to be one of the most beautiful creatures in all the lands, a many eye-stalked <span id="highlight">beholder</span>. Impossibly irrational, narcicistic, and xenophobic as beholders are, your only option is to lead your little charge to the nearest dungeon and guide it along the way to becoming the dungeon boss. \nAlong the way you’ll need to help your beholder develop their <span id="highlight">eyestalks</span>, keep their <span id="highlight">sanity</span> high,  maintain <span id="highlight">happiness</span>, and, most important, keep their <span id="highlight">HP</span> (hitpoints) above 0 to avoid death.');
    $popEls.button.on('click',function(){
        getRoom();
    });
}
//ANCHOR reset all stats
function resetAll(){
    beholder.name="";
    beholder.HP=6;
    beholder.eyestalks=0;
    beholder.sanity=0;
    beholder.happiness=2;
    currentRoom=0;
    //NOTE CHEAT OVERRIDE ON STATS
    // beholder.eyestalks=0   ;
    // beholder.sanity=beholder.maxSanity;
    // beholder.happiness=beholder.maxHappiness;
    // beholder.HP=1;
}
//ANCHOR get appropriate room
function getRoom(){
    $popover.hide();
    if(currentRoom>=roomLayout.standardRoomRun && currentRoom<roomLayout.standardRoomRun+roomLayout.bossRoomRun){
        //console.log("room > 6");
        assembleRoom(getRoomsList('bossRooms')[currentRoom-roomLayout.standardRoomRun])
    }
    else if(currentRoom>=roomLayout.bossRoomRun+roomLayout.standardRoomRun){
        gameWin();
    }
    else{
        assembleRoom(getRoomsList('standardRooms')[randomNum(0,getRoomsList('standardRooms').length)])
    }
    //NOTE CHEAT OVERRIDE ON WHICH ROOM TO VIEW
    // assembleRoom(getRoomsList()[4])
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
    if(beholder.eyestalks<0){beholder.eyestalks=0}
    if(beholder.sanity>beholder.maxSanity){beholder.sanity=beholder.maxSanity}
    else if(beholder.sanity<beholder.minSanity){beholder.sanity=beholder.minSanity}
    if(beholder.happiness>beholder.maxHappiness){beholder.happiness=beholder.maxHappiness;}
    else if(beholder.happiness<0){
        beholder.happiness=0;
        if(Math.floor(Math.random()*2)){
            const $subDisplayText =$(`<p>${beholder.name} is feeling rather down in the dumps. <span id="highlight">HP▼</span></p>`);
            $displayText.append($subDisplayText);
            beholder.HP--;
        }
    }
    if(beholder.HP>beholder.maxHP){beholder.HP=beholder.maxHP;}
    //lose conditional
    updateStatDisp();
    if(beholder.HP<=0){gameOver(); return;}
    addChoice(0,"Continue");
    $choices.children('button').on('click',nextRoom)
}
//ANCHOR wrapping choice and continuing to next room
function nextRoom(){
    clearAll();
    currentRoom++;
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
    $popEls.header.show()
    $popEls.header.text("GAME OVER")
    $popEls.content.text(`${beholder.name} has lost all their HP!`);
    $popEls.button.text('New Game?')
    $popEls.button.on('click',newGame);
}
function gameWin(){
    updateStatDisp();
    $popover.show();
    $popEls.input.hide();
    $popEls.header.show()
    $popEls.header.text("VICTORY!")
    $popEls.content.html(`<p>${beholder.name} has made their way to the end of the dungeon and defeated the boss! They will now proudly live the rest of their days as a menace to the natural and humanoid worlds.</p><p>Credits: Mostly Sam Mark. a little help from Gabe, Alex, and, of course, ${beholder.name}`);
    $popEls.button.text('New Game?')
    $popEls.button.on('click',newGame);
}
//!SECTION
//=========================================================
//SECTION 6: Global Gameflow Object Declarations
//=========================================================
function getRoomsList(list, index){
    //choice format:
    /*
    {
        text:"choice x",
        contest:'',
        resultFail:'',
        textResultFail:[`${beholder.name}...`,'STAT▼▲'],
        resultWin:'',
        textResultWin:[`${beholder.name}...`, `STAT▼▲`],
    },
                    */
    const standardRooms =[
        {//ANCHOR ROOM 1 happiness 
            textEnter:`${beholder.name} runs headlong into a wall. They HATE WALLS. Walls mock them.`,
            choices:[
                {
                    text:"Eye-ray that wall!",
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
            textEnter:`${beholder.name} finds the skeleton of an old wizard. The spooky skeleton has a long gray beard and is clutching a glowing orb with something that looks like mayonaise inside.`,
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
                    resultFail:"console.log('error: check ROOM 2 choice[1]')",
                    textResultFail:[``, 'ERROR CHECK CONSOLE LOG'],
                    resultWin:"",
                    textResultWin:[`${beholder.name} happily continues on their merry way. They don't like mayonaise anyway.`,''],
                },
                {
                    text:"Split it open like an egg, with an EYE-RAY!",
                    contest:'beholder.eyestalks > 4',
                    resultFail:"beholder.happiness--;",
                    textResultFail:[`The small sphere breaks open revealing its mayonaise goodness. Unfortunately, ${beholder.name} forgot to negate the sphere's magic while opening it and it explodes in a massive A.O.E. mayonaise ball.`, `HP▼`],
                    resultWin:"beholder.happiness++; beholder.HP++;",
                    textResultWin:[`the small sphere breaks open revealing its mayonaise goodness, and it turns out to be MAGIC MAYONAISE.`,`HP▲ Happiness▲`],
                },
            ]
        },
        {//ANCHOR ROOM 3 
            textEnter:`${beholder.name} enters a chamber surrounded by glyphs depicting the number 8. There are no obvious exits`,
            choices:[
                {
                    text:"8. 8. 8. 8. 8. 8. 8. 8...",
                    contest:'beholder.sanity > 2',
                    resultFail:"beholder.sanity--; beholder.happiness--;",
                    textResultFail:[`${beholder.name} takes a long look at the numbers. The word "EIGHT" repeats in their mind. EIGHT. EIGHT. EIGHT. EIGHT. EIIIIIIII... ${beholder.name} awakens in hallway, no memory of how they got there and a searing headache`, `sanity▼, Happiness▼`],
                    resultWin:"beholder.happiness++; beholder.sanity++;",
                    textResultWin:[`${beholder.name} studies the glypys and realizes they are purely decorative. They notice a door on the opposite wall, hidden by a folding screen`, `Happiness▲ Sanity▲`],
                },
                {
                    text:"Search the room for loot.",
                    contest:'beholder.eyestalks>2',
                    resultFail:'beholder.sanity--; beholder.happiness--',
                    textResultFail:[`${beholder.name} traces the room in a figure-eight all the while burning a path in the floor to avoid getting lost. Unfortunately the path burns clean through the floor! ${beholder.name} falls their pride is quite hurt.`,'Happiness▼, Sanity▼'],
                    resultWin:'beholder.sanity++;',
                    textResultWin:[`One of ${beholder.name}'s eyestalks spies a glistening crystal skull. They pick it up and it speaks great wisdom into their mind: "DON'T TRUST THE EMU." ${beholder.name} decides to keep that in mind`, `sanity▲`],
                },
            ]
        },
        {//ANCHOR ROOM 4 DANGER 
            textEnter:`Upon entering a large chamber filled with toppled pillars and a crumbling ceiling overgrown with vines, ${beholder.name} spies a HUMANOID ADVENTURER! This could be dangerous.`,
            choices:[
                {
                    text:"EYE-RAYS IN EVERY DIRECTION!",
                    contest:'beholder.eyestalks>1',
                    resultFail:'beholder.HP--;',
                    textResultFail:[`${beholder.name} sends eye-rays in every possible direction. The adventurer, however, is weilding a shield that is polished to a mirror shine, and ${beholder.name}'s disintegrate beam is reflected back. The adventurer flees in an unknown direction!`,'HP▼'],
                    resultWin:'beholder.eyestalks++; beholder.happiness++',
                    textResultWin:[`${beholder.name} sends eye-rays in several directions. one strikes an enormous vine on the celing, bewitching it to become ${beholder.name}'s friend! The vine swats the adventurer through the celining and into an unknown other room and ${beholder.name} thanks their new vine friend.'`, `Eyestalks▲, Happiness▲`],
                },
                {
                    text:`Attempt to convince the adventurer you're not a threat`,
                    contest:'beholder.sanity>2',
                    resultFail:'beholder.HP--;',
                    textResultFail:[`${beholder.name} relays a woeful tale of a poor abandoned dream of an eldritch god, made incarnate and left to die, named ${beholder.name}. Unfortunately it seems the adventurer only speaks a regional dialect of Sylvan and can't understand a word. Judging them by appearance, the Adventurer attacks ${beholder.name} with an arrow, then runs off to a different room!`,'HP▼'],
                    resultWin:'beholder.happiness++;',
                    textResultWin:[`${beholder.name} chats the adventurer into believing they're a cursed figment of the dungeon's imagination, and the only way to restore their true form is to bring back the "Staff of Swords". Fortunately the adventurer seems to be a dingus and believes every word, galavanting off to some unknown branch of the dungeon to die.`, `Happiness▲`],
                },
                {
                    text:"Spook the adventurer with a grand illusion!",
                    contest:'beholder.eyestalks>0',
                    resultFail:'beholder.HP--;',
                    textResultFail:[`${beholder.name} Creates the image of a grand red dragon, complete with gnashing drooling teeth, spiny tail, shiny crimson scales and the smell of sulfur. Unfortunately it has a dinky smile on its face, and the adventurer looks a little too closely at it. Realizing the illusion, the adventurer sends an arrow at ${beholder.name}`,'HP▼'],
                    resultWin:'beholder.eyestalks++;',
                    textResultWin:[`${beholder.name} invokes an image in the adventurer's mind of a pile of shimmering treasure cascading from the ceiling. The adventurer dives aside and cowers to avoid the cascade of illusory treasure as ${beholder.name} floats by undetected.`, `Eyestalks▲`],
                },
                {
                    text:"Reward the adventurer for their bravery",
                    contest:'beholder.happiness>2',
                    resultFail:'beholder.HP--; beholder.happiness--;',
                    textResultFail:[`${beholder.name} emerges to grant a reward upon the brave adventurer, but winds up floating up too high while giving a speech praising the adventurer's fashion choices. ${beholder.name} bonks their head on a stalactite and flees the room out of embarrassment.`,'HP▼ Happiness▼'],
                    resultWin:'beholder.happiness++; beholder.eyestalks++;',
                    textResultWin:[`${beholder.name} emerges to grant a reward upon the brave adventurer, launching a "good" eye-ray at them. The adventurer crumples into a friendly bony mass of goo!`, `Happiness▲, Eyestalks▲`],
                },
            ]
        },
        {//ANCHOR room 5: wacky Busby's Stat Exchange
            textEnter:`${beholder.name} floats down a cooridor and into a well furnished room filled with bits and baubles. They all sit haphazardly clustered around a spindly old man wearing an unusually clean bowler hat, which he tips in ${beholder.name}'s direction. "G'day, night, or other referential time frame, my good friend. I wonder If I could interest you in a small stat exchage. No buybacks and only one per customer." he says with a crooked smile.`,
            choices:[
                {
                    text:"Exchange 2 happiness for 1 HP",
                    contest:'beholder.happiness>1 && beholder.HP<beholder.maxHP',
                    resultFail:'',
                    textResultFail:[`The man says "Listen, I'm sure you mean well, but I can't mess with your stats if they're already at their limit." Then he, and all his stuff, vanish into thin air`,''],
                    resultWin:'beholder.HP++; beholder.happiness-=2;',
                    textResultWin:[`As the man waves a small glass orb around them, ${beholder.name} feels a wave of sadness, but feels healtheir`, `Happiness▼▼, HP▲`],
                },
                {
                    text:"Exchange 2 sanity for 1 eyestalk",
                    contest:'beholder.sanity>beholder.minSanity',
                    resultFail:'',
                    textResultFail:[`The man says "Listen, I'm sure you mean well, but I can't mess with your stats if they're already at their limit." Then he, and all his stuff, vanish into thin air`,''],
                    resultWin:'beholder.eyestalks++; beholder.sanity-=2;',
                    textResultWin:[`As the man waves a small wooden cube around them, ${beholder.name} feels reality slip a bit, but a new eyestalk sprouts!`, `Sanity▼▼, Eyestalks▲`],
                },
                {
                    text:"Exchange 1 happiness for 1 eyestalk",
                    contest:'beholder.happiness>0',
                    resultFail:'',
                    textResultFail:[`The man says "Listen, I'm sure you mean well, but I can't mess with your stats if they're already at their limit." Then he, and all his stuff, vanish into thin air`,''],
                    resultWin:'beholder.eyestalks++; beholder.happiness--;',
                    textResultWin:[`As the man waves a small metal container around them, ${beholder.name} feels a bit saddened, but a new eyestalk sprouts!`, `Happiness▼, Eyestalks▲`],
                },
                {
                    text:"Sacrifice an eyestalk for the happiness of a friend",
                    contest:'beholder.eyestalks>0 && beholder.happiness<beholder.maxHappiness',
                    resultFail:'',
                    textResultFail:[`The man says "Listen, I'm sure you mean well, but I can't mess with your stats if they're already at their limit." Then he, and all his stuff, vanish into thin air`,''],
                    resultWin:'beholder.eyestalks--; beholder.happiness=beholder.maxHappiness;',
                    textResultWin:[`As ${beholder.name}'s sacrifice is completed, the man hands them a small glass terrarium containing a single painted turtle. ${beholder.name} is absolutely overjoyed`, `Eyestalks▼, Happiness maxed, Got a tiny friend`],
                },
                {
                    text:"Not interested, thank.",
                    contest:'true',
                    resultFail:'console.log(Error: check room 5 choice[3])',
                    textResultFail:[`error`,''],
                    resultWin:'',
                    textResultWin:[`${beholder.name} shrugs off the stat merchant and continues on, without any consequence`,],
                },
            ]
        },

        //ANCHOR room 6: Smasher trap puzzle
        //ANCHOR room 7: portal to sideways tower
        //ANCHOR room 8: DANGER: glitching goblin.
        //ANCHOR room 9: Slippery Squid game
        //ANCHOR room 10: What is a Cheeseburger?
        //ANCHOR room 11: Ford the river
        //ANCHOR room 12: DANGER: DON'T TRUST THE EMU.
        //ANCHOR room 13: The Obvious room.
    ]
    const insaneRooms=[
        //ANCHOR insane room 1: The walls also have eyes
    ]
    const deathtrapRooms=[
        //ANCHOR deathtrap room 1: 
    ]
    const bossRooms =[
        {//ANCHOR boss room 0: anticipation
            textEnter:`${beholder.name} finds themself staring down a long corridor, at the end of which stands a looming <span id="highlight">BOSS DOOR</span>`,
            choices:[
                {
                    text:"Open the door and Continue",
                    contest:'true',
                    resultFail:"",
                    textResultFail:['',''],
                    resultWin:"",
                    textResultWin:[`${beholder.name} slowly opens the door...`],
        
                },
                {
                    text:"Turn Back and seek another room",
                    contest:'true',
                    resultFail:"",
                    textResultFail:['',''],
                    resultWin:"roomSet=bossRooms;",
                    textResultWin:[`${beholder.name} backs away from the imposing door, finding their way to a different part of the dungeon`,''],
                },
            ]
        },
        {//ANCHOR boss room 1: DANGER: Engage the Boss!
            textEnter:`BOSS ROOM 1.`,
            choices:[
                {
                    text:"Open the door and Continue",
                    contest:'true',
                    resultFail:"",
                    textResultFail:['',''],
                    resultWin:"",
                    textResultWin:[`${beholder.name} slowly opens the door...`],
        
                },
                {
                    text:"Turn Back and seek another room",
                    contest:'true',
                    resultFail:"",
                    textResultFail:['',''],
                    resultWin:"roomSet=bossRooms;",
                    textResultWin:[`${beholder.name} backs away from the imposing door, finding their way to a different part of the dungeon`,''],
                },
            ]
        },
        {//ANCHOR boss room 2: DANGER: The Boss Attacks
            textEnter:`BOSS ROOM 2.`,
            choices:[
                {
                    text:"Open the door and Continue",
                    contest:'true',
                    resultFail:"",
                    textResultFail:['',''],
                    resultWin:"",
                    textResultWin:[`${beholder.name} slowly opens the door...`],
        
                },
                {
                    text:"Turn Back and seek another room",
                    contest:'true',
                    resultFail:"",
                    textResultFail:['',''],
                    resultWin:"roomSet=bossRooms;",
                    textResultWin:[`${beholder.name} backs away from the imposing door, finding their way to a different part of the dungeon`,''],
                },
            ]
        },
        {//ANCHOR boss room 3: Defeat the boss!
            textEnter:`BOSS ROOM 3`,
            choices:[
                {
                    text:"Open the door and Continue",
                    contest:'true',
                    resultFail:"",
                    textResultFail:['',''],
                    resultWin:"",
                    textResultWin:[`${beholder.name} slowly opens the door...`],
        
                },
                {
                    text:"Turn Back and seek another room",
                    contest:'true',
                    resultFail:"",
                    textResultFail:['',''],
                    resultWin:"roomSet=bossRooms;",
                    textResultWin:[`${beholder.name} backs away from the imposing door, finding their way to a different part of the dungeon`,''],
                },
            ]
        },

    ]
    if(list==="bossRooms"){
        console.log("bossRooms")
        return(bossRooms);
    }
    else{
        return(standardRooms);
    }
}
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
