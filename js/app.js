/*TODO
--shuffle standard rooms array then run down the list
--add more rooms
--manage art
--add more art
--mute button

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
let displayRoom = 0;
const roomLayout={
    standardRoomRun:8,
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
const bossWords={
    adj:['Undying', 'Cataclysmic','Ultimate','Infinite','Demonic','Ironclad'],
    noun:['Basalisk','Black Dragon','Tarrasque','Greg','Horse','Toe','Pig','T-Rex','Troll','Giant','Aboleth'],
    suffix:['of Doom', 'from the nine Hells','Filled With Razorblades'],
}
let boss ="";
const audio = document.querySelector('#soundtrack');
//ANCHOR JQuery declarations
const $popover =$('#popover');
const $popEls={
    header:$('#poHeader'),
    content:$('#poContent'),
    input:$('#poInput'),
    button:$('#poConfirm'),
}
const $displayBhName =$('.beholderName');
const $mute =$('#mute').eq(0);
const $displayText = $('#displayText');
const $choices = $('#choices');
const $displays = {
    disRoomNum:$('.dynDisp').eq(0),
    disHP:$('.material-icons').eq(1),
    disEyestalks:$('.dynDisp').eq(2),
    disSanity:$('.dynDisp').eq(3),
    disHappiness:$('.material-icons').eq(2),
}

//!SECTION
//=========================================================
//SECTION 2:Utility functions
//=========================================================
$mute.on('click',mute);
function mute(e){
    if (audio.paused){
        soundtrack("play");
        $mute.text('volume_mute')
        return;
    }
    else{
        soundtrack("mute");
        $mute.text('volume_off')
        return;
    }
}
function soundtrack(control){
    audio.volume = 0.5;
    if (control==="play"){audio.play();}
    else{audio.pause();audio.currentTime = 0;} 
}
//ANCHOR random number
function randomNum(rangeStart,rangeEnd){
    return(Math.floor(Math.random()*rangeEnd)+rangeStart);
}
function RandomBoss(){
    boss=`${bossWords.adj[randomNum(0,bossWords.adj.length)]} ${bossWords.noun[randomNum(0,bossWords.noun.length)]} ${bossWords.suffix[randomNum(0,bossWords.suffix.length)]}`;
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
    $displays.disRoomNum.text(displayRoom);
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
    RandomBoss();
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
    soundtrack("play");
    $popover.show();
    $popEls.header.hide();
    $popEls.input.hide();
    let p1='<p>That little floating eyeball you found has turned out to be one of the most beautiful creatures in all the lands, a many eye-stalked <span id="highlight">beholder</span>.Impossibly irrational, narcicistic, and xenophobic as beholders are, your only option is to lead your little charge to the nearest dungeon and guide it along the way to becoming the dungeon boss.</p>';
    let p3='<p>Along the way you’ll need to help your beholder develop their <span id="highlight">eyestalks</span> to overcome magic challenges, keep their <span id="highlight">sanity</span> high to avoid insanity,  maintain <span id="highlight">happiness</span> to avoid despair events, and, most important, keep their <span id="highlight">HP</span> (hitpoints) above 0 to avoid death.</p>';
    let p4='<p>Help your beholder conquor (or obliterate) the dungeon and replace the end boss!</p>'
    $popEls.content.html(p1+p3+p4);
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
    displayRoom=0;
    //NOTE CHEAT OVERRIDE ON STATS
    //beholder.eyestalks=20   ;
    //beholder.sanity=beholder.maxSanity;
    //beholder.happiness=beholder.maxHappiness;
    // beholder.HP=1;
}
//ANCHOR get appropriate room
function getRoom(){
    $popover.hide();
    if(currentRoom>=roomLayout.standardRoomRun && currentRoom<roomLayout.standardRoomRun+roomLayout.bossRoomRun){
        assembleRoom(getRoomsList('bossRooms')[currentRoom-roomLayout.standardRoomRun])
        return;
    }
    else if(currentRoom>=roomLayout.bossRoomRun+roomLayout.standardRoomRun){
        gameWin();
        return;
    }
    else{
        assembleRoom(getRoomsList('standardRooms')[randomNum(0,getRoomsList('standardRooms').length)])
        return;
    }
    //NOTE CHEAT OVERRIDE ON WHICH ROOM TO VIEW
    //assembleRoom(getRoomsList('standardRooms')[10])
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
    const choice = roomObj.choices[choiceIndex];
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
    else if(beholder.sanity<beholder.minSanity){
        beholder.sanity=beholder.minSanity
        const rando=randomNum(0,3);
        if(rando===0){
            $displayText.append($(`<p>${beholder.name} sees TERRIFYING llamas out of the corner of their eye. <span id="highlight">Happiness▼</span></p>`));
            beholder.happiness--;
        }
        else if(rando===1){
            $displayText.append($(`<p>${beholder.name} tells themself everything is OK. <span id="highlight">Sanity reset</span></p>`));
            beholder.sanity=0;
        }
        else if(rando===2){
            $displayText.append($(`<p>${beholder.name}, in their insanity, Zaps off a treasonous eyestalk. <span id="highlight">Eyestalks ▼</span></p>`));
            beholder.eyestalks--;
        }
    }
    if(beholder.happiness>beholder.maxHappiness){beholder.happiness=beholder.maxHappiness;}
    else if(beholder.happiness<0){
        beholder.happiness=0;
        if(Math.floor(Math.random()*2)){
            $displayText.append($(`<p>${beholder.name} is feeling rather down in the dumps. <span id="highlight">HP▼</span></p>`));
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
    displayRoom++;
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
    $popEls.content.text(`${beholder.name} has lost all their HP and has collapsed, exhausted! What a tragedy for all aberrations!`);
    $popEls.button.text('New Game?')
    $popEls.button.on('click',newGame);
}
function gameWin(){
    updateStatDisp();
    $popover.show();
    $popEls.input.hide();
    $popEls.header.show()
    $popEls.header.text("VICTORY!")
    $popEls.content.html(`<p>${beholder.name} has made their way to the end of the dungeon and defeated the boss! They will now proudly live the rest of their days as a menace to the natural and humanoid worlds.</p><p>Credits: Mostly Sam Mark. a little help from SEIRFX 119, Gabe, Alex, Hayley, and, of course, ${beholder.name}`);
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
        {//ANCHOR ROOM 0 walls 
            textEnter:`${beholder.name} runs headlong into a wall. They HATE WALLS. Walls mock them.`,
            choices:[
                {
                    text:"Eye-ray that wall!",
                    contest:'beholder.eyestalks>=1',
                    resultFail:"beholder.happiness+=-1;",
                    textResultFail:[`${beholder.name} shoots the wall with an eye ray! unfortunately they use their petrify beam and freeze the wall in place permanantly. They have to find another way around.`,"Happiness▼"],
                    resultWin:"beholder.happiness++; beholder.eyestalks++;",
                    textResultWin:[`${beholder.name} shoots the wall with an eye ray! It disintegrates right before their gleeful face.`,'Happiness▲, Eyestalks▲'],
        
                },
                {
                    text:"Politely ask the wall to move",
                    contest:'beholder.sanity<=1',
                    resultFail:"beholder.happiness--;",
                    textResultFail:[`${beholder.name} politely asks the wall to move. The wall stands still. What a silly thing to do.`, 'Happiness▼'],
                    resultWin:"beholder.happiness++; beholder.sanity--;",
                    textResultWin:[`${beholder.name} politely asks the wall to move. The wall, respecting their sanity level, takes a sweeping bow and shifts aside. ${beholder.name} is very pleased with themself.`,'Happiness▲, sanity▼'],
                },
            ]
        },
        {//ANCHOR ROOM 1 HP danger with avoid path option
            textEnter:`${beholder.name} finds the skeleton of an old wizard. The spooky skeleton has a long gray beard and is clutching a glowing orb with something that looks like mayonaise inside. <span id="highlight">This could be dangerous.</span>`,
            choices:[
                {
                    text:"GRAB THAT MAYO ORB!",
                    contest:'beholder.sanity>=0',
                    resultFail:"beholder.HP--; beholder.Eyestalks+=-1;",
                    textResultFail:[`${beholder.name} grabs the orb without hesitation. Unfortunately it doesn't function in ${beholder.name}'s anti-magic eye and short circuits, zapping them in the eye.`,'HP▼, Eyestalks▼'],
                    resultWin:"beholder.eyestalks++;",
                    textResultWin:[`${beholder.name} grabs the orb without hesitation. It appears to contain knowledge of mayonaise based magic.`, `Eyestalks▲`],
        
                },
                {
                    text:"This is clearly a wizard trap. Wizards are always trapping orbs.",
                    contest:'true',
                    resultFail:"",
                    textResultFail:[``, 'ERROR CHECK CONSOLE LOG'],
                    resultWin:"",
                    textResultWin:[`${beholder.name} safely continues on their merry way. They don't like mayonaise anyway.`,''],
                },
                {
                    text:"Split it open like an egg, with an EYE-RAY!",
                    contest:'beholder.eyestalks>=1',
                    resultFail:"beholder.HP--; beholder.happiness--;",
                    textResultFail:[`The small sphere breaks open revealing its mayonaise goodness. Unfortunately, ${beholder.name} forgot to negate the sphere's magic while opening it and it explodes in a massive A.O.E. mayonaise ball.`, `HP▼, Happiness▼`],
                    resultWin:"beholder.happiness++; beholder.eyestalks++;",
                    textResultWin:[`the small sphere breaks open revealing its mayonaise goodness, and it turns out to be MAGIC MAYONAISE.`,`Happiness▲, Eyestalks▲`],
                },
            ]
        },
        {//ANCHOR ROOM 2 
            textEnter:`${beholder.name} enters a chamber surrounded by glyphs depicting the number 8. There are no obvious exits`,
            choices:[
                {
                    text:"8. 8. 8. 8. 8. 8. 8. 8...",
                    contest:'beholder.sanity >=2',
                    resultFail:"beholder.sanity--; beholder.happiness--;",
                    textResultFail:[`${beholder.name} takes a long look at the numbers. The word "EIGHT" repeats in their mind. EIGHT. EIGHT. EIGHT. EIGHT. EIIIIIIII... ${beholder.name} awakens in hallway, no memory of how they got there and a searing headache`, `sanity▼, Happiness▼`],
                    resultWin:"beholder.happiness++; beholder.sanity++;",
                    textResultWin:[`${beholder.name} studies the glypys and realizes they are purely decorative. They notice a door on the opposite wall, hidden by a folding screen`, `Happiness▲ Sanity▲`],
                },
                {
                    text:"Search the room for loot.",
                    contest:'beholder.eyestalks>=2',
                    resultFail:'beholder.sanity--; beholder.happiness--',
                    textResultFail:[`${beholder.name} traces the room in a figure-eight all the while burning a path in the floor to avoid getting lost. Unfortunately the path burns clean through the floor! ${beholder.name} falls their pride is quite hurt.`,'Happiness▼, Sanity▼'],
                    resultWin:'beholder.sanity++;',
                    textResultWin:[`One of ${beholder.name}'s eyestalks spies a glistening crystal skull. They pick it up and it speaks great wisdom into their mind: "DON'T TRUST THE LLAMA." ${beholder.name} decides to keep that in mind`, `Sanity▲`],
                },
            ]
        },
        {//ANCHOR ROOM 3 DANGER 
            textEnter:`Upon entering a large chamber filled with toppled pillars and a crumbling ceiling overgrown with vines, ${beholder.name} spies a HUMANOID ADVENTURER! <span id="highlight">This could be dangerous.</span>`,
            choices:[
                {
                    text:"EYE-RAYS IN EVERY DIRECTION!",
                    contest:'beholder.eyestalks>=2',
                    resultFail:'beholder.HP--;',
                    textResultFail:[`${beholder.name} sends eye-rays in every possible direction. The adventurer, however, is weilding a shield that is polished to a mirror shine, and ${beholder.name}'s disintegrate beam is reflected back. The adventurer flees in an unknown direction!`,'HP▼'],
                    resultWin:'beholder.eyestalks++; beholder.happiness++;',
                    textResultWin:[`${beholder.name} sends eye-rays in several directions. one strikes an enormous vine on the celing, bewitching it to become ${beholder.name}'s friend! The vine swats the adventurer through the celining and into an unknown other room and ${beholder.name} thanks their new vine friend.`, `Eyestalks▲, Happiness▲`],
                },
                {
                    text:`Attempt to convince the adventurer you're not a threat`,
                    contest:'beholder.sanity>=3',
                    resultFail:'beholder.HP--;',
                    textResultFail:[`${beholder.name} relays a woeful tale of a poor abandoned dream of an eldritch god, made incarnate and left to die, named ${beholder.name}. Unfortunately it seems the adventurer only speaks a regional dialect of Sylvan and can't understand a word. Judging them by appearance, the Adventurer attacks ${beholder.name} with an arrow, then runs off to a different room!`,'HP▼'],
                    resultWin:'beholder.happiness++;',
                    textResultWin:[`${beholder.name} chats the adventurer into believing they're a cursed figment of the dungeon's imagination, and the only way to restore their true form is to bring back the "Staff of Swords". Fortunately the adventurer seems to be a dingus and believes every word, galavanting off to some unknown branch of the dungeon to die.`, `Happiness▲`],
                },
                {
                    text:"Spook the adventurer with a grand illusion!",
                    contest:'beholder.eyestalks>=2',
                    resultFail:'beholder.HP--;',
                    textResultFail:[`${beholder.name} Creates the image of a grand red dragon, complete with gnashing drooling teeth, spiny tail, shiny crimson scales and the smell of sulfur. Unfortunately it has a dinky smile on its face, and the adventurer looks a little too closely at it. Realizing the illusion, the adventurer sends an arrow at ${beholder.name}`,'HP▼'],
                    resultWin:'beholder.eyestalks++;',
                    textResultWin:[`${beholder.name} invokes an image in the adventurer's mind of a pile of shimmering treasure cascading from the ceiling. The adventurer dives aside and cowers to avoid the cascade of illusory treasure as ${beholder.name} floats by undetected.`, `Eyestalks▲`],
                },
                {
                    text:"Joyously reward the adventurer for their bravery",
                    contest:'beholder.happiness>=2',
                    resultFail:'beholder.HP--; beholder.happiness--;',
                    textResultFail:[`${beholder.name} emerges to grant a reward upon the brave adventurer, but winds up floating up too high while giving a speech praising the adventurer's fashion choices. ${beholder.name} bonks their head on a stalactite and flees the room out of embarrassment.`,'HP▼ Happiness▼'],
                    resultWin:'beholder.happiness++; beholder.eyestalks++;',
                    textResultWin:[`${beholder.name} emerges to grant a reward upon the brave adventurer, launching a "good" eye-ray at them. The adventurer crumples into a friendly bony mass of goo!`, `Happiness▲, Eyestalks▲`],
                },
            ]
        },
        {//ANCHOR room 4: wacky Busby's Stat Exchange
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
                    resultFail:'',
                    textResultFail:[`error`,''],
                    resultWin:'',
                    textResultWin:[`${beholder.name} shrugs off the stat merchant and continues on, without any consequence`,],
                },
            ]
        },
        {//ANCHOR room 5: Trap puzzle
            textEnter:`${beholder.name} enters a narrow rectangular corridor covered in brambles on all sides, at the end of which, a glowing capsule emenates dark energy. <span id="highlight">This could be dangerous.</span>`,
            choices:[
                {
                    text:"Travel cautiously down the corridor",
                    contest:'beholder.eyestalks>=2',
                    resultFail:'beholder.HP--; beholder.happiness--;',
                    textResultFail:[`${beholder.name} moves into the brambles, but they immediatley constrict and restrain ${beholder.name}. Frustrated and scratched up, They launch eye-rays in all directions, destroying all the vines and, regrettably, the capsule `,'HP▼, Happiness▼'],
                    resultWin:'beholder.eyestalks++;',
                    textResultWin:[`${beholder.name} sweeps the brambles as they go, reaching the end unscathed. The glowing capsule turns out to be a capsule of hidden eyes.${beholder.name} recieves an eye upon their forehead`, `Eyestalks▲`],
                },
                {
                    text:"Investigate the corridor",
                    contest:'beholder.sanity>0',
                    resultFail:'beholder.HP--; beholder.sanity--;',
                    textResultFail:[`${beholder.name} looks carefully at the corridor, coming to the conclusion that brambles won't hurt if they float over everything. Unfortunately, the brambles sense ${beholder.name} as they float over, restraining and scratching them. ${beholder.name} furiously destroys the entire hallway before moving on.`,'HP▼, Sanity▼'],
                    resultWin:'beholder.sanity++; beholder.happiness++;',
                    textResultWin:[`${beholder.name} discoveres the corridor is trapped with Grapple-Vine! to avoid it, ${beholder.name} simply rolls it like a carpet until they can reach the capsule, which is full of EVIL COINS!`, `Sanity▲, Happiness▲`],
                },
                {
                    text:"This is clearly too dangerous",
                    contest:'true',
                    resultFail:'',
                    textResultFail:[`${beholder.name}...`,'STAT▼▲'],
                    resultWin:'',
                    textResultWin:[`${beholder.name} doesn't want to deal with this jank. They travel off in a different direction`, ``],
                },
            ]
        },
        {//ANCHOR room 6: the void
            textEnter:`${beholder.name} slides down into a chamber, the floor of which is a <span id="highlight">swirling dark void</span> pulling them in!`,
            choices:[
                {
                    text:"Surrender to the void",
                    contest:'happiness<=1',
                    resultFail:'beholder.happiness--;',
                    textResultFail:[`${beholder.name} is swallowed by the void but fights its influence. The void consumes ${beholder.name}'s happines then dumps them out in another room. What a toxic void.`,'Happiness▼'],
                    resultWin:'beholder.happiness+=2;',
                    textResultWin:[`${beholder.name} allows the darkness to swallow them, feeling unworthy to continue. However, the void shows ${beholder.name} a reflection of their greatest qualities, then plorps them out in a pleasant room full of flowers`, `Happiness▲▲`],
                },
                {
                    text:'Find a ledge to a"void" the void',
                    contest:'beholder.sanity<=0',
                    resultFail:'beholder.sanity++; beholder.happiness--;',
                    textResultFail:[`${beholder.name} HATES puns. They blast their way through a nearby door into another room.`,'Sanity▲, Happiness▲'],
                    resultWin:"beholder.sanity--; beholder.happiness++;",
                    textResultWin:[`${beholder.name} says "What a pun time we're all having" then HA-CHA-CHA's off stage.`, `Sanity▼, Happiness▲`],
                },
            ]
        },
        {//ANCHOR room 7: The Obvious room.
            textEnter:`${beholder.name} blasts through a wall and into a room with two signs, one pointing at a button that says <span id="highlight">"THIS BUTTON IS DANGEROUS,"</span> the other saying, <span id="highlight">"THIS BUTTON WILL MAKE YOU HAPPY." This could be dangerous.</span>`,
            choices:[
                {
                    text:"Push the DANGEROUS button",
                    contest:'beholder.sanity<=-1',
                    resultFail:'beholder.HP--; beholder.happiness--;',
                    textResultFail:[`${beholder.name} pushes the DANGEROUS button. A jet of sharpened ice knives fly from ports on the wall stabbing ${beholder.name}! They are irked by the situation.`,'HP▼, Happiness▼'],
                    resultWin:'beholder.happiness++;',
                    textResultWin:[`${beholder.name} pushes the DANGEROUS button. a creepy tune plays and shadows dance along the wall, but ${beholder.name} sees scarier things every night in their dreams and is unfazed.`, `Happiness▲`],
                },
                {
                    text:'Push the HAPPY button',
                    contest:'beholder.sanity>=0',
                    resultFail:'beholder.sanity--; beholder.happiness--;',
                    textResultFail:[`${beholder.name} pushes the HAPPY button. Coulrophobic distortions of humanoids in colorful wigs, facepaint and ill-fitting outfits bounce and tumble around ${beholder.name} and causes them to flee in PANIC.`,'Sanity▼, happiness▼'],
                    resultWin:"beholder.happiness++;",
                    textResultWin:[`${beholder.name} pushes the HAPPY button. A small terrarium filled with little green lizards phases into existance next to ${beholder.name} granting them great joy.`, `Happiness▲`],
                },
            ]
        },
        {//ANCHOR room 8: DANGER: glitching goblin.
            textEnter:`${beholder.name} enters a room and hides behind a pillar when they spy an unusual creature in the distance. Upon closer inspection, it's a goblin, but something isn't right. It seems to stand perfectly still, its legs together and arms oustrechted to either side like the letter T. <span id="highlight">This could be dangerous.</span>`,
            choices:[
                {
                    text:'Eye-ray the... "goblin"?',
                    contest:'beholder.eyestalks>=3',
                    resultFail:'beholder.HP--; beholder.happiness--; beholder.sanity--;',
                    textResultFail:[`${beholder.name} sends an eye-ray or two at the goblin. To ${beholder.name}'s utter terror, the goblin seems to take no damage and, still upright posing like a T, slides rapidly over the terrain to ${beholder.name} where it aggressively stands too close and stares right into their main eye causing psychic damage! ${beholder.name} flees in terror.`,'HP▼, Happiness▼, Sanity▼'],
                    resultWin:'beholder.eyestalks++;',
                    textResultWin:[`${beholder.name} fires a death ray. The goblin immediately rotates on the spot without moving its legs. It's very creepy, but fortunately the eye-ray strikes true. The sound of a goblin being defeated can be heard, though the goblin remains standing and stationary. ${beholder.name} floats past unnerved by the... "dead"? goblin.`, `Eyestalks▲`],
                },
                {
                    text:'Try to be friendly with the... "goblin"?',
                    contest:'beholder.happiness>=3',
                    resultFail:'beholder.HP--; beholder.happiness--; beholder.sanity--;',
                    textResultFail:[`${beholder.name} emerges, attempting to communicate with the goblin, which immediately turns on the spot without moving its legs. In an uncanny and unnerving motion it slides over the terrain to ${beholder.name} and stops very close to them, frozen like a statue. ${beholder.name} opens their mouth to speak but immediately takes damage, seemingly from nowhere. In terror, they flee the room`,'HP▼, Happiness▼, Sanity▼'],
                    resultWin:'beholder.happiness++;',
                    textResultWin:[`${beholder.name} emerges, attempting to communicate with the goblin, which immediately turns on the spot without moving its legs. In an uncanny and unnerving motion it slides over the terrain to ${beholder.name} and stops very close to them, frozen like a statue. Fortunately It continues to follow ${beholder.name} as they float past but doesn't do anything else. ${beholder.name} continues on, relieved to be out of that room.`, `Happiness▲`],
                },
                {
                    text:'Try to pass unnoticed by the... "goblin"?',
                    contest:'beholder.sanity>=2',
                    resultFail:'beholder.HP--; beholder.happiness--; beholder.sanity--;',
                    textResultFail:[`${beholder.name}tries to slink past the goblin, which seems to occasionally rotate on the spot or slide along the ground without moving its legs. Suddenly, the goblin turns and starts sliding over the ground straingt for ${beholder.name} and stops very close to them, frozen like a statue. ${beholder.name} takes psychic damage and flees in terror!`,'HP▼, Happiness▼, Sanity▼'],
                    resultWin:'beholder.sanity++;',
                    textResultWin:[`${beholder.name} tries to slink past the goblin, which seems to occasionally rotate on the spot or slide along the ground without moving its legs. It's completely unclear if the goblin has noticed ${beholder.name}, but they somehow manage to float into the next room without the goblin reacting.`, `Sanity▲`],
                },
                {
                    text:"Oh Nine Hells NO, not messing with that biz.",
                    contest:'true',
                    resultFail:'',
                    textResultFail:[`${beholder.name}...`,'STAT▼▲'],
                    resultWin:'',
                    textResultWin:[`As the creepy goblin rotates on the spot without moving their legs to face in their direction, ${beholder.name} closes the door to the chamber and leaves that mess behind.`, ``],
                },
            ]
        },
        {//ANCHOR room 9: The choice room.
            textEnter:`${beholder.name} makes their way into a chamber with two pedistals, each placed precariously above a large drop into an unknown abyss. Atop the right pedistal is a silver rod with golden inlay, and atop the left pedistal is a saphhire encrusted torc of woven platinum wire. Both objects eminate a strong magical presence but it seems like touching one will cause the other to drop out of reach.  `,
            choices:[
                {
                    text:"Get the Silver and Gold Rod",
                    contest:'true',
                    resultFail:'',
                    textResultFail:[`${beholder.name}...`,'STAT▼▲'],
                    resultWin:'beholder.eyestalks++;',
                    textResultWin:[`${beholder.name} floats over to the magical rod. Upon claiming it, the torc falls into the abyss and is lost for good`, `Eyestalks ▲`],
                },
                {
                    text:"Get the Ruby Platinum Torc",
                    contest:'true',
                    resultFail:'',
                    textResultFail:[`${beholder.name}...`,'STAT▼▲'],
                    resultWin:'beholder.eyestalks++;',
                    textResultWin:[`${beholder.name} floats over to the magical torc. Upon claiming it, the rod falls into the abyss and is lost for good`, `Eyestalks ▲`],
                },
                {
                    text:"Try to claim them both",
                    contest:'beholder.eyestalks>=4',
                    resultFail:'beholder.happiness--;',
                    textResultFail:[`${beholder.name} attempts to use their magic to hold both treasures in place, but in doing so, their anti-magic field sweeps both pedistals which fail to levatate, plunging both into the abyss. ${beholder.name} is quite disappointed.`,'Happiness▼'],
                    resultWin:'beholder.eyestalks+=2;',
                    textResultWin:[`${beholder.name} telekenetically pulls one magical item towards them, while using an eyestalk to hold onto the other. As both pedistals drop into the abyss, both magic items remain, and ${beholder.name} claims them both!`, `Eyestalks▲▲`],
                },
            ]
        },
        {//ANCHOR room 10: wabbit.
            textEnter:`${beholder.name} enters a room with a tall arched ceiling and decorated frescoes and reliefs on every wall and ceiling depicting various leporidae. At the center of the room is a small metal pen encircling a hideous furry creature with two long ears and enormous incisors devouring an orange root.`,
            choices:[
                {
                    text:"Disgusting! destroy it!",
                    contest:'beholder.sanity<=0',
                    resultFail:'beholder.happiness--;',
                    textResultFail:[`${beholder.name} attempts to fire a disintegrate ray, but argues with themself over the true level of evil this creature exhudes, to the point where the eye-ray is accidentally a charm ray! the hideous creature decides to follow ${beholder.name} against their wishes!`,'Happiness▼'],
                    resultWin:'beholder.eyestalks++;',
                    textResultWin:[`${beholder.name} fires a disintegrate eye-ray at the small creature, reducing it to a pile of dust`, `Eyestalks▲`],
                },
                {
                    text:"Recruit this evil being as a minion",
                    contest:'beholder.sanity>=1',
                    resultFail:'beholder.happiness--;',
                    textResultFail:[`${beholder.name} decides the creature isn't too hideous, but while attempting to pull it along on a string, it gnaws through, and escapes into an unknown part of the dungeon.`,'Happiness▼'],
                    resultWin:'beholder.happiness++;',
                    textResultWin:[`${beholder.name} decides the creature isn't too hideous to look at, and carries it along as a minion.`, `Happiness▲`],
                },
            ]
        },
        {//ANCHOR room 11: introspection
            textEnter:`${beholder.name} floats up a long chute, at the top of which, they suddenly see another beholder, eyes glowing bright and looking right at them! <span id="highlight">This could be dangerous.</span>`,
            choices:[
                {
                    text:"It's ugly! Kill it!",
                    contest:'beholder.sanity>=4 || beholder.happiness>=4',
                    resultFail:'beholder.HP--;',
                    textResultFail:[`${beholder.name} fires a number of eye-rays at the other beholder! unfortunately they realize too late that it's only a reflection in a <span id="highlight"> giant mirror</span> and the ray is reflected right back!`,'HP▼'],
                    resultWin:'beholder.happiness++;',
                    textResultWin:[`${beholder.name} realizes it's a reflection in a <span id="highlight"> giant mirror</span> and carefully aims the rays to shatter the mirror, revealing the way forward`, `Happiness▲`],
                },
                {
                    text:"It doesn't look too bad, don't kill it.",
                    contest:'beholder.sanity<=0 || beholder.happiness>=4',
                    resultFail:'beholder.HP--;',
                    textResultFail:[`${beholder.name}'s envy gets the better of them and they charge the other beholder who also charges ${beholder.name}. Too late, they realize it's actually a reflection in a <span id="highlight"> giant mirror</span> and slam into it, shattering it and cutting themself on some mirror shards!`,'HP▼'],
                    resultWin:'beholder.happiness++',
                    textResultWin:[`${beholder.name} realizes it's a reflection in a <span id="highlight"> giant mirror</span> and spends a few minutes admiring themself and their little fanglike teeth.`, `Happiness▲`],
                },
            ]
        },
        {//ANCHOR room 12: DANGER: DON'T TRUST THE LLAMA.
            textEnter:`${beholder.name} finds, amongst the rubble of a collapsed chamber that resembles a temple of some sort, an intact statue of an <span id="highlight">ancient LLAMA</span>. It speaks softly into ${beholder.name}'s mind, "I will offer you great riches if you believe in me. <span id="highlight">This could be EXTREMELY dangerous.</span>"`,
            choices:[
                {
                    text:"I don't believe you!!",
                    contest:'beholder.sanity>=-3',
                    resultFail:'beholder.HP--;',
                    textResultFail:[`${beholder.name} attempts to turn away from the statue but hears, "YOU DECIEVE YOURSELF." and suffers a searing pain and losing consciousness. They awaken in another room.`,'HP▼'],
                    resultWin:'beholder.happiness++; beholder.sanity++;',
                    textResultWin:[`${beholder.name} turns away from the statue, managing to overcome the mysterious force drawing it into service to this entity. They burn a silly moustache onto the statue.`, `Sanity▲, Happiness▲`],
                },
                {
                    text:"I do believe in you.",
                    contest:'beholder.sanity<=-4',
                    resultFail:'beholder.HP-=2; beholder.happiness--;',
                    textResultFail:[`${beholder.name}' responds with a desire to believe in the LLAMA, but they hear "YOU DECIEVE YOURSELF." and a braying sourceless laugh followed by immense pain and sorrow`,'HP▼▼ Happiness▼'],
                    resultWin:'beholder.happiness++; beholder.eyestalks+=2; beholder.HP=beholder.maxHP;',
                    textResultWin:[`${beholder.name} responds with a desire to believe in the LLAMA. They hear "MY CHAMPION, GO WITH MY BLESSING AND SPREAD THE CHAOS."`, `Happiness▲, Eyestalks▲▲, HP maxed`],
                },
            ]
        },
    ];
    const bossRooms =[
        {//ANCHOR boss room 0: anticipation
            textEnter:`${beholder.name} finds themself staring down a long corridor, at the end of which stands a looming <span id="highlight">BOSS DOOR!</span> Warning this will be <span id="highlight">very dangerous</span>`,
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
                    resultWin:'currentRoom-=4',//Option to escape the boss sequence if your stuff is too low
                    textResultWin:[`${beholder.name} backs away from the imposing door, finding their way to a different part of the dungeon`,''],
                },
            ]
        },
        {//ANCHOR boss room 1: DANGER: Engage the Boss!
            textEnter:`${beholder.name} cautiously enteres an enormous circular chamber, eyestalks at the ready. Suddenly, Dropping from the ceiling is an enormous <span id="highlight">${boss}</span> which promptly roars with fury at ${beholder.name}`,
            choices:[
                {
                    text:"Sling those eye-rays",
                    contest:'beholder.eyestalks>3',
                    resultFail:"beholder.HP--; beholder.eyestalks--ß",
                    textResultFail:[`${beholder.name} slings dozens of eye-rays at the ${boss} landing a few devastating hits, but in the proccess, ${beholder.name} is hit by a stray rebounded enervation ray!`,'HP▼, Eyestalks▼'],
                    resultWin:"beholder.eyestalks+=2",
                    textResultWin:[`${beholder.name} slings a strong telekenetic ray at the ${boss}, blasting it back into a wall of spikes!`,'Eyestalks▲▲'],
        
                },
                {
                    text:"Use your cheery beholderly gile and charm",
                    contest:'beholder.happiness>1',
                    resultFail:"beholder.HP--; beholder.sanity--; beholder.happiness--;",
                    textResultFail:[`${beholder.name} glides forward, raising their eyestalks ready to sing a glorious balad for the ${boss}. Before they can get past the first measure, the boss roars in displeasure causing a ceiling tile to strike ${beholder.name} in the noggin!`,'HP▼ Sanity▼ Happiness▼'],
                    resultWin:"beholder.sanity+=2; beholder.happiness++;",
                    textResultWin:[`${beholder.name} blinks their enormous sultry eye at the ${boss}, negating its magic and rendering its initial attacks ineffective`,'Sanity▲▲ Happiness▲'],
                },
                {
                    text:`Point out the ${boss} is not wearing clothes`,
                    contest:'beholder.sanity<-1',
                    resultFail:"beholder.HP--; beholder.happiness--;",
                    textResultFail:[`${beholder.name} glides forward loudly cackling at the ${boss}'s appearance. The boss is very body positive, and unleashes a punishing fireball!`,'HP▼, Happiness▼'],
                    resultWin:"beholder.sanity--; beholder.happiness+=2;",
                    textResultWin:[`${beholder.name} glides forward, loudly cackling at the fact that the ${boss} is not wearing clothes. The boss feels immense shame and takes psychic damage!`,'Sanity▼, Happiness▲▲'],
                },
                {
                    text:`Watch the ${boss} and learn its weaknesses`,
                    contest:'beholder.sanity>1',
                    resultFail:"beholder.HP--; beholder.sanity--; beholder.happiness--;",
                    textResultFail:[`${beholder.name} watches the ${boss}'s moves carefully. Unfortunately the boss's moves are quite hypnotic and ${beholder.name} doesn't realize they are about to step on a dangerous glyph!`,'HP▼ Sanity▼ Happiness▼'],
                    resultWin:"beholder.happiness++; beholder.sanity+=2;",
                    textResultWin:[`${beholder.name} keeps their distance and studies the ${boss}'s movements. They notice the boss telegraphs its moves!`,'Happiness▲ sanity▲▲'],
                },
            ]
        },
        {//ANCHOR boss room 2: DANGER: The Boss Attacks
            textEnter:`The ${boss} lets out an enormous roaring blast attack! It tears the floor to rubble and blasts the ceiling open as it travels straingt for ${beholder.name}`,
            choices:[
                {
                    text:"Believe in yourself and- OH SHIeld!",
                    contest:'beholder.sanity>2',
                    resultFail:"beholder.HP--; beholder.sanity--; beholder.happiness--;",
                    textResultFail:[`${beholder.name} conjures a powerful shield to defend against the boss's ultimate attack! Problem is, ${beholder.name} doesn't believe in themself enoough and takes part of the hit.`,'HP▼, Sanity▼, Happiness▼'],
                    resultWin:"beholder.sanity+=2; beholder.happiness++;",
                    textResultWin:[`${beholder.name} conjures a powerful shield to defend against the boss's ultimate attack! With enough faith in themself, ${beholder.name}'s shield returns the attack back upon the boss!`,'Sanity▲▲, Happiness▲'],
        
                },
                {
                    text:"Joyously rise above the floor avoiding the attack!",
                    contest:'beholder.happiness>3',
                    resultFail:"beholder.HP--; beholder.happiness--;",
                    textResultFail:[`${beholder.name} attempts to rise above the wave of force emenated by the ${boss}. Unfortunately, their joy is not sufficient and their pride (and main eye) is singed!`,'HP▼, Happiness▼'],
                    resultWin:"beholder.happiness+=2;",
                    textResultWin:[`${beholder.name} shoots towards the ceiling, the ultimate wave of doom passing just underneath! A profound appreciation for life washes over ${beholder.name}`,'Happiness▲▲'],
                },
                {
                    text:"If you can't see the attack it can't hurt you!",
                    contest:'beholder.sanity<-2',
                    resultFail:"beholder.HP--; beholder.sanity=0;",
                    textResultFail:[`${beholder.name} closes all their eyes and imagines the soothing sounds of screeching and gibbering. Unfortunately all they hear is the sound of a thunderous wave of force headed straight for them!`,'HP▼, Sanity reset to neutral'],
                    resultWin:"beholder.sanity=beholder.minSanity; beholder.happiness+=2;",
                    textResultWin:[`${beholder.name} closes all their eyes and imagines the soothing sounds of screeching and gibbering. when they open their eyes, the power of denial has negated the attack!`,'Sanity completely gone, Happiness▲▲'],
                },
                {
                    text:"Best defense is a good EYE-RAY BLAST!!!",
                    contest:'beholder.eyestalks>5',
                    resultFail:"beholder.HP--; beholder.eyestalks-=2;",
                    textResultFail:[`${beholder.name} cycles through all their available eye-rays, but by the time they get to the one that might work, the blast is already upon them singing several eyestalks!`,'HP▼, Eyestalks▼▼'],
                    resultWin:"beholder.eyestalks+=2; beholder.happiness++;",
                    textResultWin:[`${beholder.name} unleashes a focused death ray straight through the blast, cutting its power significantly and reducing it to a light breeze.`,'Eyestalks▲▲, Happiness▲'],
                },
            ]
        },
        {//ANCHOR boss room 3: Defeat the boss!
            textEnter:`The ${boss} takes a wide turn, showing its weariness. Now is the time to finish it!`,
            choices:[
                {
                    text:"EYE-RAY! EYE-RAY! ALL OUT EYE-RAY!",
                    contest:'beholder.eyestalks>=6 || beholder.sanity>=4 || beholder.sanity<=-5 || beholder.happiness>=4',
                    resultFail:'currentRoom=roomLayout.standardRoomRun*0.5',
                    textResultFail:[`In slow motion, ${beholder.name}'s attack concentrates upon the ${boss}, but in their weakened state, ${beholder.name} miscalculates and is knocked unconscious. They wake up hours later elsewhere in the dungeon`,''],
                    resultWin:"",
                    textResultWin:[`In slow motion, ${beholder.name} charges a powerful death ray, then, with a sinister smile, unleashes it upon the ${boss} sending it beyond the material plane!`],
        
                },
            ]
        },

    ]
    if(list==="bossRooms"){
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
