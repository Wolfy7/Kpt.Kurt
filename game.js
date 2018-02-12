/* global ctx, ASSET_LOADER, bullets, sounds, p1, enemies, powerups, btn, puTest, sound, buttons, canvas */
sounds = new Array();
bullets = new Array();
buttons = new Array();
powerups = new Array();
enemies = new Array();
gameWidth = 320;
gameHeight = 480;
ASSET_LOADER = {getImage:function(){}};

Levels = {
  '1-1': {enemies: 10},
  '1-2': {enemies: 12},
  '1-3': {enemies: 14}
};

gameStates = {
  LOADING : 0,
  INIT : 1,
  RUN : 2,
  PAUSE : 3,
  GAMEOVER : 4
};
localStorage.Volume ? volume = parseFloat(localStorage.Volume) : volume = 0.1;
FPS = 60;
var requestId;

window.cancelRequestAnimFrame = ( function() {
    return window.cancelAnimationFrame          ||
        window.webkitCancelRequestAnimationFrame    ||
        window.mozCancelRequestAnimationFrame       ||
        window.oCancelRequestAnimationFrame     ||
        window.msCancelRequestAnimationFrame        ||
        clearTimeout;
} )();

window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame   ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame    ||
			window.oRequestAnimationFrame      ||
			window.msRequestAnimationFrame     ||
			function(/* function */ callback, /* DOMElement */ element){
				window.setTimeout(callback, 1000 / FPS);
			};
})();

window.addEventListener('load', function () {
    //init();
    loading();
});

function powerup(){
  this.width = 32;
  this.height = 32;
  this.xPos = Math.floor(Math.random() * ((gameWidth - this.width) - this.width)) + this.width;
  this.yPos = Math.floor(Math.random() * -400) -100;   //Math.floor((Math.random() * gameHeight/2) + 1);
  this.speed = 2;
  this.img = ASSET_LOADER.getImage("images/powerup.png");
  this.rotate = 0;

  this.update = function() {
    if(this.yPos + 20 > gameHeight){
    this.xPos = Math.floor(Math.random() * ((gameWidth - this.width) - this.width)) + this.width;
     this.yPos = Math.floor(Math.random() * -400) -100;   //Math.floor((Math.random() * gameHeight/2) + 1)
    }else{
      this.yPos += this.speed;
    }
  };

  this.draw = function (){
    // TODO rotate
    ctx.save();
    ctx.translate(this.xPos + this.width/2, this.yPos + this.height/2);
    
    if(this.rotate > 360){
      this.rotate = 0;
    }
    
    ctx.rotate(this.rotate * Math.PI / 180);
    //ctx.drawImage(this.img,this.xPos,this.yPos,this.width,this.height);
    ctx.drawImage(this.img, -this.width/2, -this.height/2,this.width,this.height);
    ctx.restore();
    
    this.rotate += 0.5;
  };
}


function button(img,x,y,width,height,onclickCallBack){
  this.width = width;
  this.height = height;
  this.xPos = x;
  this.yPos = y;
  this.img = img;
  
  this.clicked = function(){
    if(onclickCallBack !== 'undefined') onclickCallBack();
  };
  
  this.draw = function (){
    ctx.drawImage(this.img,this.xPos,this.yPos);
  };
}
/*
function bullet(x,y){
  this.width = 9;//32;//7;
  this.height = 32;//18;
  this.xPos = x;
  this.yPos = y;
  this.speed = 3;
  this.health = 1;
  //this.img = ASSET_LOADER.getImage("images/bullet.png");
  //this.img = ASSET_LOADER.getImage("images/shoot_sprite_128x32.png");
  this.img = ASSET_LOADER.getImage("images/shoot2_sprite_36x32.png");
  
  var tickCnt = 0;
  var ticksPerFrame = 2;
  var frameIndex = 0;
  var frames = 3;
  var loop = false;
  
  this.update = function(){
    if(this.yPos < -20){
      this.health = 0;
    }else{
      this.yPos -= this.speed;
    }
    
    tickCnt++;
    if(tickCnt > ticksPerFrame){
      tickCnt = 0;
      
      if(frameIndex >= frames){
        if(loop === true) frameIndex = 0;
      }else{
        frameIndex++;
      }
    }
  };
      
  this.draw = function (){
    //ctx.drawImage(this.img,this.xPos,this.yPos);
    //ctx.drawImage(this.img,32*frameIndex,0,32,32,this.xPos,this.yPos,32,32);
    
    ctx.drawImage(
       this.img,
       0 + (this.width * frameIndex),
       0,
       this.width,
       this.height,
       this.xPos,
       this.yPos,
       this.width,
       this.height
    );
    
  };
}
*/

function player() {
    this.width = 75;
    this.height = 55;
    this.lives = 3;
    this.xPos = (gameWidth / 2) - (this.width / 2);
    this.yPos = (gameHeight - this.height) - 30;
    this.speed = 4;
    this.img = ASSET_LOADER.getImage("images/player.png");
    this.moveLeft = false;
    this.moveRight = false;
    this.isShooting = false;
    this.tickCount = 0; 
    this.weapon = new laser(); 
    this.spawn = true;
    this.dies = false;
    this.dieCount = 0;
    this.ticksPerFrame = 10;
    this.frameIndex = 0;
    this.frames = 5;

    this.update = function(){
      if(this.dies){
        if(this.dieCount > this.ticksPerFrame){
          if(this.frameIndex < this.frames){
            this.frameIndex += 1;
          }else{
            this.frameIndex = 0;
            this.dies = false;
            
            if(this.lives <= 0){
              gameOver();
            }else{
              this.spawn = true; 
            }
          }
          this.dieCount = 0;
        }else{
          this.dieCount++;
        }
      }else{
        
        if(this.moveLeft)  if(this.xPos > 5) this.xPos -= this.speed;
        if(this.moveRight)  if(this.xPos < gameWidth - 70) this.xPos += this.speed;
        
        if(!this.spawn){
          if(this.weapon.shoot_delay >= this.tickCount){
            this.tickCount++;
          }else{  
            if(this.isShooting){
              this.weapon.shoot(this.xPos + (this.width/2)-4, this.yPos - (this.height/2));
              this.tickCount = 0;
            }
          }
        }
        
      }
      
    };

    this.draw = function (){
      
      if(this.dies){
        ctx.drawImage(
           ASSET_LOADER.getImage("images/player_die_sprite_300x55.png"),
           0 + (this.width * this.frameIndex),
           0,
           this.width,
           this.height,
           this.xPos,
           this.yPos,
           this.width,
           this.height);        
      }else if(this.spawn){
        var frequency = 200;
        if ( Math.floor(Date.now() / frequency) % 2) {
          ctx.drawImage(this.img,this.xPos, this.yPos);
        }
        setTimeout(function(){ p1.spawn = false; }, 2000);
      }else{
        ctx.drawImage(this.img,this.xPos, this.yPos);  
      }      
    };
    
    this.getHited = function(){
      if(this.dies || this.spawn){
        return false;
      }
      window.navigator.vibrate(400); // For mobile
      this.lives--;
      this.dies = true;
      return true;
    };
    
    /*
    this.shoot = function (){
      
      bullets[bullets.length] = new bullet(this.xPos + (this.width/2)-4, this.yPos - (this.height/2));
      this.shoot_delay = 20; // TODO depend on wepaon
      
      // TODO
      // play shoot sound
      sounds['laser'] = ASSET_LOADER.getSound("sounds/Laser_Shoot.wav");       
      sounds['laser'].load();

      if(sounds['laser'].currentTime === 0 || sounds['laser'].ended) {
        sounds['laser'].play();  
        sounds['laser'].volume = volume;
      }        
      
    };
    */
}
/* in enemies.js ausgelagert
function enemy() {
    this.width = 50;
    this.height = 60;
    this.xPos = Math.floor(Math.random() * ((gameWidth - this.width) - this.width)) + this.width;
    this.yPos = Math.floor(Math.random() * -420) -120;
    this.points = 10;
    this.speed = 2;
    this.health = 1;
    this.frameIndex = 0;
    this.tickCount = 0;
    this.ticksPerFrame = 4;
    this.frames = 3;
    
    this.color = Math.floor((Math.random() * 3) + 1);
    
    switch(this.color){
      case 1:
        this.img = ASSET_LOADER.getImage("images/enemy_g.png");
      break;
      case 2:
        this.img = ASSET_LOADER.getImage("images/enemy_y.png");
      break;
      case 3:
        this.img = ASSET_LOADER.getImage("images/enemy_r.png");
      break;
      
    }
    this.img = ASSET_LOADER.getImage("images/enemy_sprite.png");

    this.draw = function (){
      //ctx.drawImage(this.img,this.xPos,this.yPos,this.width,this.height);
      
      ctx.drawImage(
         this.img,
         0 + (this.width * this.frameIndex),
         0,
         this.width,
         this.height,
         this.xPos,
         this.yPos,
         this.width,
         this.height);
    };
    
    this.update = function () { 
      if(this.yPos > gameHeight){
        // reset position
        this.xPos = Math.floor(Math.random() * ((gameWidth - this.width) - this.width)) + this.width;
        this.yPos = Math.floor(Math.random() * -420) -120;
        
      }else{
        this.yPos += this.speed;
      }
      
      if(this.tickCount > this.ticksPerFrame){
        if(this.frameIndex < this.frames){
          this.frameIndex += 1;
        }else{
          this.frameIndex = 0;
        }
        this.tickCount = 0;
      }else{
        this.tickCount++;
      }
    };
    
    
    this.hit = function(){

      sounds['hit'] = ASSET_LOADER.getSound("sounds/Hit_Hurt.wav");
      sounds['hit'].load();
  
      if(sounds['hit'].currentTime === 0 || sounds['hit'].ended) {
        sounds['hit'].play();
        sounds['hit'].volume = volume;
      }
  
      this.health -= 1;
      if(this.health <= 0){
        
        sounds['explosion'] = ASSET_LOADER.getSound("sounds/Enemy_Explosion.wav");
        sounds['explosion'].load();
    
        if(sounds['explosion'].currentTime === 0 || sounds['explosion'].ended) {
          sounds['explosion'].play();
          sounds['explosion'].volume = volume;
        }  

        score += this.points;      
      }
    };
   
}
*/

function keyDownHandler(e){
  //console.log(e);
  // Enter
  if ( e.keyCode === 13 ) {
    startGame();
  }
  
  // P
  if ( e.keyCode === 80 ) {
    pauseGame();
  }
  
  // Leertaste
  if ( e.keyCode === 32 || e.keyCode === 38 ) {
    p1.isShooting = true;
  }

  // A
  if ( e.keyCode === 65 || e.keyCode === 37 ) {
    p1.moveLeft = true;
    //if(p1.xPos > 5) p1.xPos -= p1.speed;
  }
  // D
  if ( e.keyCode === 68 || e.keyCode === 39 ) {
    p1.moveRight = true;
    //if(p1.xPos < gameWidth - 70) p1.xPos += p1.speed;
  }
}

function keyUpHandler(e){
  //console.log(e);
  // Leertaste
  if ( e.keyCode === 32 || e.keyCode === 38 ) {
    p1.isShooting = false;
  }

  // A
  if ( e.keyCode === 65 || e.keyCode === 37 ) {
    p1.moveLeft = false;
  }
  // D
  if ( e.keyCode === 68 || e.keyCode === 39 ) {
    p1.moveRight = false;
  }
}

function addLeadingZeros(number, length) {
    var num = '' + number;
    while (num.length < length) num = '0' + num;
    return num;
}

function checkCollision(){
  
  for (var i = 0; i < powerups.length; i++){
    // Spieler/Powerup Kollision
    if(p1.xPos < powerups[i].xPos + powerups[i].width && p1.xPos + p1.width > powerups[i].xPos &&
        p1.yPos < powerups[i].yPos + powerups[i].height && p1.yPos + p1.height > powerups[i].yPos){
          //console.log("Player hits Powerup");  
        }
  }

  for (var i = 0; i < enemies.length; i++){
  
    // Spieler/Gegner Kollision
    if(p1.xPos < enemies[i].xPos + enemies[i].width && p1.xPos + p1.width > enemies[i].xPos &&
        p1.yPos < enemies[i].yPos + enemies[i].height && p1.yPos + p1.height > enemies[i].yPos){

      // DEBUG
      //console.log("Spieler/Gegner Kollision");
      if(p1.getHited()){
        enemies[i].hit();
      }
      //hitEnemie(i); // TODO:
      
    } 
    
    // Kugel/Gegner Kollision
    for (var j = 0; j < bullets.length; j++)
    {
      if(enemies[i]){
        if(enemies[i].xPos < bullets[j].xPos + bullets[j].width && enemies[i].xPos + enemies[i].width > bullets[j].xPos &&
            enemies[i].yPos < bullets[j].yPos + bullets[j].height && enemies[i].yPos + enemies[i].height > bullets[j].yPos){

          // DEBUG
          //console.log("Kugel/Gegner Kollision");

          if(bullets[j].health > 0){
            bullets[j].health--;
          }else{
            bullets.splice(j, 1);
          }
          
          //bullets.splice(j, 1);
          //itEnemie(i);
          enemies[i].hit();

        }
      }
    } 
         
  }
  
}

function updateGame(){
  
  // player
  p1.update();
  
  // enemies
  for (var i = 0; i < enemies.length; i++)
  {
    enemies[i].update();  
  }
  
  /*
  for (var i = enemies.length; i < maxEnemies; i++)
  {
    /*
    // TODO
    if(Math.floor(Math.random() * 2) + 1 == 1){
      enemies[i] = new enemy2();
    }else{
      enemies[i] = new enemy();  
    }
    
    enemies[i] = new enemy();
    
  }
  */
  
  if(enemies.length < maxEnemies) enemies[enemies.length] = new enemy();
  
  // bullets
  for (var i = 0; i < bullets.length; i++)
  {
    bullets[i].update();
  }
  
  checkCollision();
}

function renderGame(){
  // background
  vy += 1;
  ctx.drawImage(ASSET_LOADER.getImage("images/space2.png"),0,vy,gameWidth,gameHeight);
  ctx.drawImage(ASSET_LOADER.getImage("images/space2.png"),0,vy - gameHeight,gameWidth,gameHeight);
  if(vy >= gameHeight){
    vy = 0;
  }
  
  // player
  p1.draw();
  
  // enemies
  for (var i = 0; i < enemies.length; i++)
  {
    if(enemies[i].health > 0){
      enemies[i].draw();      
    }else{
      enemies.splice(i, 1);
    }
  }
  
  // bullets
  for (var i = 0; i < bullets.length; i++)
  {
    if(bullets[i].health > 0){
      bullets[i].draw();
    }else{
      bullets.splice(i, 1);
    }
  }
  
  // time and score
  ctx.font = "14px '8-BIT'";
  ctx.fillStyle = "white";
  //ctx.textAlign = "center";
  ctx.fillText("Score "+addLeadingZeros(score,4), gameWidth-80, 20);
  ctx.fillText("Time "+addLeadingZeros(time,4), 70, 20);
  
  // lives
  ctx.fillText("Lives ", 50, gameHeight-20);
  for(i=0; i< p1.lives; i++){
    ctx.drawImage(p1.img, 90+(i*30), gameHeight-35, 25,25);
  }
  
}

function gameLoop(){
  requestId = requestAnimFrame(gameLoop);
  // clear Canvas
  ctx.clearRect(0,0,gameWidth,gameHeight);
  
  switch(gameState){
    case gameStates.INIT:
      drawStartScreen();
    break;
    case gameStates.RUN:
      updateGame();
      renderGame();
    break;
    case gameStates.PAUSE:
      renderGame();
      // Show Pause
      ctx.font = "60px '8-BIT'";
      ctx.fillStyle = "RED";
      ctx.textAlign = "center";
      ctx.fillText("PAUSE", gameWidth/2, gameHeight/2);
    break;
    case gameStates.GAMEOVER:
      renderGame();
      // Show Game Over
      ctx.font = "60px '8-BIT'";
      ctx.fillStyle = "RED";
      ctx.textAlign = "center";
      ctx.fillText("GAME OVER", gameWidth/2, gameHeight/2);
      ctx.font = "30px '8-BIT'";
      ctx.fillStyle = "RED";
      ctx.textAlign = "center";
      ctx.fillText("Press Enter to restart", gameWidth/2, gameHeight/2+60);
      
      //canvas.style.backgroundColor = "red";
    break;
  }  
  
  // TODO
  // draw buttons
  for (btn in buttons)
  {
    buttons[btn].draw();
  }
}

function pauseGame(){  
  if(gameState === gameStates.RUN){
    gameState = gameStates.PAUSE;
    clearIntervals();     
  }else if(gameState === gameStates.PAUSE){
    gameState = gameStates.RUN;
    initIntervals();
  }
}

function startGame(){
  if(gameState === gameStates.INIT || gameState === gameStates.GAMEOVER){
  
    time = 0;
    score = 0;
    vy = 0;
    maxEnemies = 16;
    enemies = new Array();
    bullets = new Array();
    powerups = new Array();

    p1 = new player();

    initIntervals();
    gameState = gameStates.RUN;
  }
}

function gameOver(){
  clearIntervals();
  gameState = gameStates.GAMEOVER;  
}

function drawStartScreen(){
  // Draw Start-Screen
  // draw background and start text
  canvas.style.backgroundColor = "white";
  ctx.drawImage(ASSET_LOADER.getImage("images/space2.png"),0,0,gameWidth,gameHeight);
  logoWidth = gameWidth * 0.7; // 70%
  logoHeight = gameHeight * 0.6; // 60%
  ctx.drawImage(ASSET_LOADER.getImage("images/kptkurt.png"), gameWidth/2 -logoWidth/2 ,gameHeight/3 - logoHeight/2, logoWidth, logoHeight);
  px = 32;
  ctx.font = px+"px '8-BIT'";
  ctx.fillStyle = "White";
  ctx.textAlign = "center";
  
  var metrics = ctx.measureText("Press Enter to Start");
  while(metrics.width > gameWidth){
    px -= 2;
    ctx.font = px+"px '8-BIT'";
    metrics = ctx.measureText("Press Enter to Start");
  }
  
  var frequency = 500;
  if ( Math.floor(Date.now() / frequency) % 2) {
    ctx.fillText("Press Enter to Start", gameWidth/2, gameHeight/1.4);
  }
  //ctx.fillText("Press Enter to Start", gameWidth/2, gameHeight/1.4);
}

function clearIntervals(){
  clearInterval(OneSecondInterval);
}

function initIntervals(){
  OneSecondInterval = setInterval(OneSecondContainer, 1000);
}

function OneSecondContainer(){
  // Update Time
  time++; 
  
  // increase the maxEnemies every 15 seconds
  if((time % 15) == 0) maxEnemies++;
}

function printDebugInfo(){

  //window.screen.lockOrientation('portrait');
  orientation = window.screen.orientation;

  //ratio = window.devicePixelRatio;
  //var t1 = window.innerWidth * window.devicePixelRatio;

  debuginfo = "<p>screenWidth = "+screenWidth+"</p>"
              +"<p>screenHeight = "+screenHeight+"</p>"
              +"<p>gameState = "+gameState+"</p>"
              +"<p>orientation = "+orientation+"</p>";

  
  
  document.getElementById('debug_info').innerHTML = debuginfo;
}

function updateProgress(progress){
  //console.log(progress);
  document.getElementById('progress_bar').value = progress;
  document.getElementById('progress_text').innerHTML = progress.toFixed(0)+"%";
}

function init(){
  gameState = gameStates.INIT;
  document.getElementById('progress_box').style.display = "none";
   
  canvas = document.getElementById('gameboard');
  canvas.focus();
  ctx = canvas.getContext('2d');
  
  console.log(canvas);
  // register event listener
  window.addEventListener("keydown",keyDownHandler, false);
  window.addEventListener("keyup",keyUpHandler, false);
  canvas.addEventListener("touchstart", touchStart, false);
  canvas.addEventListener("touchend", touchEnd, false);
  canvas.addEventListener("mousemove", mouseMoveHandler, false);
  canvas.addEventListener("click", clickHandler, false);
  window.addEventListener("resize", resizeGame, false);
  window.addEventListener('deviceorientation', orientationHandler, false);

  resizeGame();
  if(requestId) cancelRequestAnimFrame(requestId);
  gameLoop();
  
  // TODO
  sounds['bg'] = ASSET_LOADER.getSound("sounds/Background.mp3");
  sounds['bg'].load();
  sounds['bg'].loop = true;
  sounds['bg'].play();
  sounds['bg'].volume = volume;

}

function loading(){
  //setInterval(printDebugInfo, 500);
  
  gameState = gameStates.LOADING;
  ASSET_LOADER = new AssetLoader();

  ASSET_LOADER.addImage("images/kptkurt.png");
  ASSET_LOADER.addImage("images/space2.png");
  ASSET_LOADER.addImage("images/player.png");
  ASSET_LOADER.addImage("images/player_die_sprite_300x55.png");
  ASSET_LOADER.addImage("images/bullet.png");
  ASSET_LOADER.addImage("images/shoot_sprite_128x32.png");
  ASSET_LOADER.addImage("images/shoot2_sprite_36x32.png");
  ASSET_LOADER.addImage("images/powerup.png");
  ASSET_LOADER.addImage("images/enemy_sprite.png");
  ASSET_LOADER.addImage("images/enemy2_sprite.png");
  ASSET_LOADER.addImage("images/settings.png");
  ASSET_LOADER.addImage("images/soundon.png");
  ASSET_LOADER.addImage("images/soundoff.png");
  ASSET_LOADER.addSound("sounds/Laser_Shoot.wav");
  ASSET_LOADER.addSound("sounds/Blaster_Shoot.wav");
  ASSET_LOADER.addSound("sounds/Enemy_Explosion.wav");
  ASSET_LOADER.addSound("sounds/Background.mp3");
  ASSET_LOADER.addSound("sounds/Hit_Hurt.wav");

  ASSET_LOADER.loadAll(init, updateProgress);
    
}

function touchStart(e){
/*
  console.log("Toch:" + e);
  console.log(e.touches[0].pageX);
*/
  if(gameState == gameStates.INIT || gameState === gameStates.GAMEOVER) startGame();
  if(gameState == gameStates.RUN) p1.isShooting = true;
  
}

function touchEnd(e){
  if(gameState == gameStates.RUN) p1.isShooting = false;

}

function orientationHandler(e) {
  gamma = event.gamma;

  if(gameState == gameStates.RUN){
    if(gamma <= -6){
      p1.moveLeft = true;
    }else{
      p1.moveLeft = false;
    }
    if(gamma >= 6){
      p1.moveRight = true;
    }else{
      p1.moveRight = false;
    }
  }
}

function clickHandler(e){
  //console.log(e);
  for (btn in buttons){
    // Button clicked
    if((e.pageX-canvas.offsetLeft) < buttons[btn].xPos + buttons[btn].width && (e.pageX-canvas.offsetLeft) > buttons[btn].xPos &&
        e.pageY < buttons[btn].yPos + buttons[btn].height && e.pageY > buttons[btn].yPos){
          //console.log("Button clicked"); 
          buttons[btn].clicked();
        }
  }
}

function mouseMoveHandler(e){
  //console.log(e);
  for (btn in buttons){
    // Button clicked
    if((e.pageX-canvas.offsetLeft) < buttons[btn].xPos + buttons[btn].width && (e.pageX-canvas.offsetLeft) > buttons[btn].xPos &&
        e.pageY < buttons[btn].yPos + buttons[btn].height && e.pageY > buttons[btn].yPos){
          canvas.style.cursor = "pointer";
    }else{
          canvas.style.cursor = "default";
    }
  }
}

function toogleSound(){
  console.log("toogleSound");
  
  if(volume !== 0){
    buttons['sound'].img = ASSET_LOADER.getImage("images/soundoff.png");
    volume = 0;
    localStorage.Volume = 0;
  }else{
    buttons['sound'].img = ASSET_LOADER.getImage("images/soundon.png");
    volume = 0.1; 
    localStorage.Volume = 0.1;   
  }
    
  for (sound in sounds){
    sounds[sound].volume = volume;
  }

  canvas.focus();  
}


function resizeGame(){
  //console.log("resizeGame");
  if(gameState > gameStates.LOADING){
    canvas = document.getElementById('gameboard');
    var widthToHeight = 2/3;//4/3;
                      // FF, Chrome        IE                                      IE
    screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    var newWidthToHeight = screenWidth / screenHeight;

    if(newWidthToHeight > widthToHeight){
      gameWidth = screenHeight * widthToHeight;
      gameHeight = screenHeight;
    }else{
      //gameHeight = screenWidth / widthToHeight;
    }
    
    //gameWidth = screenWidth;
    //gameHeight = screenHeight;
    canvas.width = gameWidth;
    canvas.height = gameHeight;    
    scale = gameWidth / gameHeight;
    
    buttons['sound'] = new button(((volume>0)?ASSET_LOADER.getImage("images/soundon.png"):ASSET_LOADER.getImage("images/soundoff.png")),gameWidth-62,gameHeight-40,28,28, toogleSound);
    //buttons[buttons.length] = new button(ASSET_LOADER.getImage("images/settings.png"),gameWidth-30,gameHeight-40,28,28);

    //console.log(gameWidth + " " + gameHeight + " " + scale);
  }
}
