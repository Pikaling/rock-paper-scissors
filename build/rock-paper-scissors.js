/*! rock-paper-scissors 2014-10-13 */
function ComputerPlayer(a){this.model=a,this.gestures=this.model.getGestures(),this.currentGesture="",this.score=0,this.opponentGestureHistory=[],this.maxPatternLength=4}function Game(){var a=new GameModel,b=new GameView,c=new GameController(a,b);b.init(),b.setController(c),a.setView(b)}function GameController(a,b){this.model=a,this.view=b}function GameModel(){this.gestures={rock:{beats:"scissors"},paper:{beats:"rock"},scissors:{beats:"paper"}},this.scoreNeeded=0,this.hasHumanPlayer=!1}function GameView(){this.viewScaler=new ViewScaler,this.hasHumanPlayer=!1,this.states=[],this.currentState=0,this.player1Score=0,this.player2Score=0,this.winningMessage=" is the winner!",this.gameOver=!1}function HumanPlayer(a){this.model=a,this.gestures=this.model.getGestures(),this.currentGesture="",this.score=0}function abstractMethod(){throw"This is an abstract method. Subclasses must provide their own definition"}function PlayerModel(){throw"You cannot instantiate abstract classes"}function Template(a){this.templateElement=document.getElementById(a)}function ViewScaler(){}ComputerPlayer.prototype=Object.create(PlayerModel.prototype),ComputerPlayer.prototype.constructor=ComputerPlayer,ComputerPlayer.prototype.playTurn=function(){var a;if(this.opponentGestureHistory.length>1){var b,c,d,e=this.getPatternLength();do b=this.opponentGestureHistory.slice(-e),c=this.matchPattern(b,this.opponentGestureHistory),c.length&&(d=this.getMostFrequentItems(c)),e--;while(e>0&&!d);d||(d=this.getMostFrequentItems(this.opponentGestureHistory)),a=d.length>1?d[Math.floor(Math.random()*d.length)]:this.getBeatingGesture(d[0]),this.currentGesture=a}else{var f=Object.keys(this.gestures);a=Math.floor(Math.random()*f.length),this.currentGesture=f[a]}},ComputerPlayer.prototype.addOpponentPreviousGesture=function(a){this.opponentGestureHistory.push(a)},ComputerPlayer.prototype.getPatternLength=function(){return this.maxPatternLength>this.opponentGestureHistory.length-1?this.opponentGestureHistory.length-1:this.maxPatternLength},ComputerPlayer.prototype.matchPattern=function(a,b){for(var c=[],d=!1,e=b.length-1;e>=0;e--){for(var f=a.length-1;f>=0&&(d=b[e-(a.length-1-f)]===a[f],d);f--);d&&e+1<b.length&&c.push(b[e+1])}return c},ComputerPlayer.prototype.getMostFrequentItems=function(a){for(var b,c={},d=0,e=[],f=0;f<a.length;f++)c.hasOwnProperty(a[f])?c[a[f]]++:c[a[f]]=1;b=Object.keys(c);for(var g=0;g<b.length;g++)c[b[g]]>d?(d=c[b[g]],e=[b[g]]):c[b[g]]===d&&e.push(b[g]);return e},ComputerPlayer.prototype.getBeatingGesture=function(a){for(var b=Object.keys(this.gestures),c=0;c<b.length;c++)if(this.gestures[b[c]].beats===a)return b[c]},GameController.prototype.startGame=function(){for(var a,b,c=document.getElementById("bestOf").value,d=document.getElementsByName("playerType"),e=0;e<d.length;e++)d[e].checked&&(a=d[e].value);b="human"===a;try{this.view.setHasHumanPlayer(b),this.model.init(c,b),this.view.startGame(),b||this.model.play()}catch(f){this.view.displayErrorMessage(f)}},GameController.prototype.processPlayerInput=function(a){this.model.playTurn(a.value),this.view.disablePlayerInput()},GameModel.prototype.setView=function(a){this.view=a},GameModel.prototype.init=function(a,b){if(this.hasHumanPlayer=b,a%2!==1)throw"'Best of' must be an odd number";this.calculateScoreNeeded(a),this.createPlayers(),this.initState(a),this.view.update(this.state)},GameModel.prototype.calculateScoreNeeded=function(a){this.scoreNeeded=Math.ceil(a/2)},GameModel.prototype.createPlayers=function(){this.player1=this.hasHumanPlayer?new HumanPlayer(this):new ComputerPlayer(this),this.player2=new ComputerPlayer(this)},GameModel.prototype.initState=function(a){this.state={player1:{currentGesture:this.player1.getCurrentGesture(),score:this.player1.getScore()},player2:{currentGesture:this.player2.getCurrentGesture(),score:this.player2.getScore()},turnOutcome:"",bestOf:a}},GameModel.prototype.updateState=function(a){this.state.player1.currentGesture=this.player1.getCurrentGesture(),this.state.player1.score=this.player1.getScore(),this.state.player2.currentGesture=this.player2.getCurrentGesture(),this.state.player2.score=this.player2.getScore(),this.state.turnOutcome=a},GameModel.prototype.getGestures=function(){return this.gestures},GameModel.prototype.getPlayer1=function(){return this.player1},GameModel.prototype.getPlayer2=function(){return this.player2},GameModel.prototype.getNumWinsNeeded=function(){return this.scoreNeeded},GameModel.prototype.compareGestures=function(a,b){if(this.gestures.hasOwnProperty(a)&&this.gestures.hasOwnProperty(b)){if(this.gestures[b].beats===a)return-1;if(this.gestures[a].beats===b)return 1}return 0},GameModel.prototype.playTurn=function(a){this.player1.playTurn(a),this.player2.playTurn();var b=this.scoreTurn();this.updateState(b),this.view.update(this.state),this.player2.addOpponentPreviousGesture(this.player1.getCurrentGesture()),this.hasHumanPlayer?this.checkForWinner():this.player1.addOpponentPreviousGesture(this.player2.getCurrentGesture())},GameModel.prototype.scoreTurn=function(){var a="",b=this.player1.getCurrentGesture(),c=this.player2.getCurrentGesture(),d=this.compareGestures(b,c);switch(d){case 1:this.player1.incrementScore(),a=this.hasHumanPlayer?"You win!":"Player 1 wins!";break;case-1:this.player2.incrementScore(),a=this.hasHumanPlayer?"You lose!":"Player 2 wins!";break;default:a="It's a draw!"}return a},GameModel.prototype.checkForWinner=function(){this.player1.getScore()===this.scoreNeeded&&this.view.endGame("Player 1"),this.player2.getScore()===this.scoreNeeded&&this.view.endGame("Player 2")},GameModel.prototype.play=function(){for(;this.player1.getScore()<this.scoreNeeded&&this.player2.getScore()<this.scoreNeeded;)this.playTurn();this.checkForWinner()},GameView.prototype.setController=function(a){this.controller=a},GameView.prototype.setHasHumanPlayer=function(a){this.hasHumanPlayer=a},GameView.prototype.init=function(){this.viewScaler.init();var a=document.getElementById("canvas");this.context=a.getContext("2d"),this.audio=document.getElementById("gameSound"),this.source=document.getElementById("soundEffect");var b=document.getElementById("toggleMuteButton");b.addEventListener("click",this.toggleMute(),!1),this.loadImages()},GameView.prototype.loadImages=function(){this.images={},this.loadedImages=0,this.sources={background:"../img/playground.gif",human1:"../img/player1.gif",computer1:"../img/computer1.gif",computer2:"../img/computer2.gif",rock:"../img/rock.gif",paper:"../img/paper.gif",scissors:"../img/scissors.gif",rockPaperScissors:"../img/rock-paper-scissors.gif"},this.imageKeys=Object.keys(this.sources);for(var a=0;a<this.imageKeys.length;a++)this.images[this.imageKeys[a]]=new Image,this.images[this.imageKeys[a]].onload=this.loadImage(),this.images[this.imageKeys[a]].src=this.sources[this.imageKeys[a]]},GameView.prototype.loadImage=function(){return function(){++this.loadedImages>=this.imageKeys.length&&this.drawStartScreen()}.bind(this)},GameView.prototype.startGame=function(){this.newGameFormTemplate.removeFrom("rockPaperScissors"),this.hasHumanPlayer&&this.addGameControls(),this.drawBackground()},GameView.prototype.update=function(a){var b=JSON.parse(JSON.stringify(a));this.states.push(b),(this.hasHumanPlayer||this.states.length-1===this.currentState)&&(this.hasHumanPlayer&&(this.currentState=this.states.length-1),this.drawState()),this.hasHumanPlayer||1!==this.states.length||0!==this.currentState||setTimeout(function(){this.currentState++,this.drawState()}.bind(this),1e3)},GameView.prototype.endGame=function(a){this.winningMessage=a+this.winningMessage,this.gameOver=!0},GameView.prototype.addNewGameForm=function(){this.newGameFormTemplate=new Template("newGameFormTemplate"),this.newGameFormTemplate.appendTo("rockPaperScissors"),this.newGameFormTemplate.setContent("newGame");var a=this.newGameFormTemplate.getContentDimensions();this.newGameFormTemplate.positionElement({bottom:(this.viewScaler.scale(this.viewScaler.MAX_HEIGHT-275)-a.height)/2+"px",left:(this.viewScaler.scale(this.viewScaler.MAX_WIDTH)-a.width)/2+"px"}),this.newGameFormTemplate.addEventListenerToElement("newGameForm","submit",this.controller,"startGame")},GameView.prototype.addGameControls=function(){this.gameControlsTemplate=new Template("gameControlsTemplate"),this.gameControlsTemplate.appendTo("rockPaperScissors"),this.gameControlsTemplate.setContent("gameControlsForm"),this.gameControlsTemplate.positionElement({bottom:this.viewScaler.scale(10)+"px",left:this.viewScaler.scale(275)+"px"}),this.gameControlsTemplate.addEventListenersToElements("gameControlsForm","click",this.controller,"processPlayerInput")},GameView.prototype.disablePlayerInput=function(){this.gameControlsTemplate.disableElements("gameControlsForm")},GameView.prototype.enablePlayerInput=function(){this.gameControlsTemplate.enableElements("gameControlsForm")},GameView.prototype.addResetGameForm=function(){this.gameControlsTemplate.removeFrom("rockPaperScissors"),this.resetGameTemplate=new Template("resetGameTemplate"),this.resetGameTemplate.appendTo("rockPaperScissors"),this.resetGameTemplate.setContent("resetGameForm");var a=this.resetGameTemplate.getContentDimensions();this.resetGameTemplate.positionElement({bottom:this.viewScaler.scale(100)+"px",left:(this.viewScaler.scale(this.viewScaler.MAX_WIDTH)-a.width)/2+"px"}),this.resetGameTemplate.addEventListenerToElement("resetGame","submit",this,"drawStartScreen")},GameView.prototype.toggleMute=function(){return function(){this.audio.muted=!this.audio.muted;var a=document.getElementById("toggleMuteButton").firstElementChild,b=a.getAttribute("title"),c=a.getAttribute("alt"),d=a.getAttribute("src");a.setAttribute("title",a.dataset.title),a.setAttribute("alt",a.dataset.alt),a.setAttribute("src",a.dataset.src),a.dataset.title=b,a.dataset.alt=c,a.dataset.src=d}.bind(this)},GameView.prototype.displayErrorMessage=function(a){var b=document.getElementById("bestOfError");b.innerText=a,b.style.display="block"},GameView.prototype.drawStartScreen=function(){this.drawBackground(),this.context.fillStyle="rgba(0, 0, 0, 0.3)",this.viewScaler.rect(this.context,0,0,this.viewScaler.MAX_WIDTH,this.viewScaler.MAX_HEIGHT),this.context.fill(),this.viewScaler.drawImage(this.context,this.images.rockPaperScissors,50,50,700,225),this.addNewGameForm()},GameView.prototype.drawBackground=function(){if(this.viewScaler.drawImage(this.context,this.images.background,0,0,this.viewScaler.MAX_WIDTH,this.viewScaler.MAX_HEIGHT),this.hasHumanPlayer?this.viewScaler.drawImage(this.context,this.images.human1,50,200,200,397):this.viewScaler.drawImage(this.context,this.images.computer1,50,200,200,397),this.viewScaler.drawImage(this.context,this.images.computer2,550,200,200,397),this.states.length){this.context.fillStyle="black";var a=this.viewScaler.scale(48);this.context.font=a+"px Arial",this.context.textAlign="center",this.viewScaler.fillText(this.context,"Best of "+this.states[0].bestOf,400,60)}this.drawScores()},GameView.prototype.drawScores=function(){this.context.fillStyle="#C4DEF8",this.context.beginPath(),this.viewScaler.rect(this.context,50,105,210,30),this.context.fill(),this.context.beginPath(),this.viewScaler.rect(this.context,550,105,210,30),this.context.fill(),this.context.fillStyle="black";var a=this.viewScaler.scale(24);this.context.font=a+"px Arial",this.context.textAlign="left",this.viewScaler.fillText(this.context,"Player 1 score: "+this.player1Score,50,130),this.context.textAlign="right",this.viewScaler.fillText(this.context,"Player 2 score: "+this.player2Score,750,130)},GameView.prototype.drawState=function(){this.currentState>0?(this.source.src="../sound/countdown.wav",this.audio.load(),this.audio.play(),this.countDown(3)):this.drawBackground()},GameView.prototype.countDown=function(a){if(this.drawBackground(),a>0){this.context.fillStyle="black";var b=this.viewScaler.scale(48);this.context.font=b+"px Arial",this.context.textAlign="center",this.viewScaler.fillText(this.context,a,400,340),setTimeout(function(){this.countDown(--a)}.bind(this),1e3)}else this.drawGestures(0,0)},GameView.prototype.drawGestures=function(a,b){var c=(100-a)/2,d=(163-b)/2;this.drawBackground(),this.viewScaler.drawImage(this.context,this.images[this.states[this.currentState].player1.currentGesture],c+275,d+250,a,b),this.viewScaler.drawImage(this.context,this.images[this.states[this.currentState].player2.currentGesture],c+425,d+250,a,b),100>a&&163>b?(a+=100/60,b+=163/60,requestAnimationFrame(function(){this.drawGestures(a,b)}.bind(this))):this.drawOutcome()},GameView.prototype.drawOutcome=function(){this.source.src="../sound/MAGIC.WAV",this.audio.load(),this.audio.play(),this.drawOutcomeText(this.states[this.currentState].turnOutcome),this.player1Score=this.states[this.currentState].player1.score,this.player2Score=this.states[this.currentState].player2.score,this.drawScores(),this.hasHumanPlayer?this.gameOver?setTimeout(function(){this.drawWinningMessage()}.bind(this),2e3):this.enablePlayerInput():setTimeout(function(){++this.currentState<this.states.length?this.drawState():this.drawWinningMessage()}.bind(this),2e3)},GameView.prototype.drawOutcomeText=function(a){this.context.fillStyle="white",this.context.strokeStyle="black";var b=this.viewScaler.scale(40);this.context.font="bold "+b+"px Arial",this.context.textAlign="center",this.viewScaler.fillText(this.context,a,400,340),this.viewScaler.strokeText(this.context,a,400,340)},GameView.prototype.drawWinningMessage=function(){this.source.src="../sound/BONUS7.WAV",this.audio.load(),this.audio.play(),this.drawBackground(),this.drawOutcomeText(this.winningMessage),this.addResetGameForm()},HumanPlayer.prototype=Object.create(PlayerModel.prototype),HumanPlayer.prototype.constructor=HumanPlayer,HumanPlayer.prototype.playTurn=function(a){this.currentGesture=a},PlayerModel.prototype.playTurn=abstractMethod,PlayerModel.prototype.getCurrentGesture=function(){return this.currentGesture},PlayerModel.prototype.incrementScore=function(){++this.score},PlayerModel.prototype.getScore=function(){return this.score},Template.prototype.setContent=function(a){this.templateContent=document.getElementById(a)},Template.prototype.appendTo=function(a){var b=document.getElementById(a),c=document.importNode(this.templateElement.content,!0);b.appendChild(c)},Template.prototype.removeFrom=function(a){var b=document.getElementById(a);b.removeChild(document.getElementById(this.templateContent.id))},Template.prototype.getContentDimensions=function(){return{width:this.templateContent.offsetWidth,height:this.templateContent.offsetHeight}},Template.prototype.positionElement=function(a){for(var b=Object.keys(a),c=0;c<b.length;c++)this.templateContent.style[b[c]]=a[b[c]]},Template.prototype.addEventListenersToElements=function(a,b,c,d){for(var e=document.getElementById(a),f=0;f<e.length;f++)this.addEventListenerToElement(e[f].id,b,c,d)},Template.prototype.addEventListenerToElement=function(a,b,c,d){var e=document.getElementById(a);e.addEventListener(b,function(a){c[d](e),a.preventDefault(),a.stopPropagation()}.bind(c))},Template.prototype.disableElements=function(a){for(var b=document.getElementById(a),c=0;c<b.length;c++)b[c].disabled=!0},Template.prototype.enableElements=function(a){for(var b=document.getElementById(a),c=0;c<b.length;c++)b[c].disabled=!1},ViewScaler.prototype.init=function(){this.MAX_WIDTH=800,this.MIN_WIDTH=480,this.MAX_HEIGHT=600,this.MIN_HEIGHT=360,this.scaleFactor=1;var a=this.MAX_WIDTH,b=this.MAX_HEIGHT,c=Math.max(document.documentElement.clientWidth,window.innerWidth||0),d=Math.max(document.documentElement.clientHeight,window.innerHeight||0);c<this.MAX_WIDTH&&(a=c<this.MIN_WIDTH?this.MIN_WIDTH:c),d<this.MAX_HEIGHT&&(b=d<this.MIN_HEIGHT?this.MIN_HEIGHT:d),this.scaleFactor=a>b/.75?b/this.MAX_HEIGHT:a/this.MAX_WIDTH;var e=document.getElementById("wrapper"),f=document.getElementById("rockPaperScissors"),g=document.getElementById("canvas");e.style.width=a+"px",f.style.width=a+"px",f.style.height=b+"px",g.width=a,g.height=b},ViewScaler.prototype.scale=function(a){return a*this.scaleFactor},ViewScaler.prototype.drawImage=function(a,b,c,d,e,f){a.drawImage(b,c*this.scaleFactor,d*this.scaleFactor,e*this.scaleFactor,f*this.scaleFactor)},ViewScaler.prototype.fillText=function(a,b,c,d){a.fillText(b,c*this.scaleFactor,d*this.scaleFactor)},ViewScaler.prototype.strokeText=function(a,b,c,d){a.strokeText(b,c*this.scaleFactor,d*this.scaleFactor)},ViewScaler.prototype.rect=function(a,b,c,d,e){a.rect(b*this.scaleFactor,c*this.scaleFactor,d*this.scaleFactor,e*this.scaleFactor)};