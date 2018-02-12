/* global gameWidth, sounds, ASSET_LOADER, volume, score, ctx, gameHeight */

function enemy() { 
  this.width = 50;
  this.height = 60;
  this.xPos = Math.floor(Math.random() * ((gameWidth - this.width) - this.width)) + this.width;
  this.yPos = Math.floor(Math.random() * -(this.height*12)) -(this.height*4);
  this.points = 10;
  this.speed = 1.8;
  this.health = 1;
  this.frameIndex = 0;
  this.tickCount = 0;
  this.ticksPerFrame = 4;
  this.frames = 3;
  this.img = ASSET_LOADER.getImage("images/enemy_sprite.png");

  this.update = function(){
    if(this.yPos > gameHeight){
      // reset position
      this.xPos = Math.floor(Math.random() * ((gameWidth - this.width) - this.width)) + this.width;
      this.yPos = Math.floor(Math.random() * -420) -120;
      //console.log("Gegner hat das Spielfeld verlassen"); // DBG
    }else{
      this.yPos += this.speed;
      //console.log(this.yPos); // DBG
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

  this.draw = function (){
    ctx.drawImage(
       this.img,
       0 + (this.width * this.frameIndex),
       0,
       this.width,
       this.height,
       this.xPos,
       this.yPos,
       this.width,
       this.height
    );
    //console.log("Draw enemy"); // DBG
  };
  
  this.hit = function(){
    //console.log("Play hit sound"); // DBG
    sounds['hit'] = ASSET_LOADER.getSound("sounds/Hit_Hurt.wav");
    sounds['hit'].load();
    if(sounds['hit'].currentTime === 0 || sounds['hit'].ended) {
      sounds['hit'].play();
      sounds['hit'].volume = volume;
    }
    
    this.health--; //TODO: Mit waffen schaden verrechnen
    
    if(this.health <= 0){
      //console.log("Gegner getötet"); // DBG
      sounds['explosion'] = ASSET_LOADER.getSound("sounds/Enemy_Explosion.wav");
      sounds['explosion'].load();

      if(sounds['explosion'].currentTime === 0 || sounds['explosion'].ended) {
        sounds['explosion'].play();
        sounds['explosion'].volume = volume;
      } 
      
      //console.log("Punktzahl erhöhen"); // DBG
      score += this.points;      
    }
   
  };
}
// TODO change name
function enemy2(){
  //enemy.call(this,x,y,img);
  this.width = 58;
  this.height = 94;
  this.xPos = Math.floor(Math.random() * ((gameWidth - this.width) - this.width)) + this.width;
  this.yPos = Math.floor(Math.random() * -(this.height*4)) -(this.height*2);
  this.points = 20;
  this.speed = 2;
  this.health = 2;
  this.ticksPerFrame = 6;
  this.frames = 2;
  this.img = ASSET_LOADER.getImage("images/enemy2_sprite.png");  
  
}

enemy2.prototype = new enemy;
//enemy2.prototype.constructor = enemy2;