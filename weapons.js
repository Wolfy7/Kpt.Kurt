function bullet(w,h,x,y,s,d,health,img,f,tf,loop){
  this.width = w;
  this.height = h;
  this.xPos = x;
  this.yPos = y;
  this.speed = s;
  this.damage = d;
  this.health = health;
  this.img = img;
  this.frames = f;
  this.ticksPerFrame = tf;
  this.loop = loop;
  
  this.tickCnt = 0;
  this.frameIndex = 0;

  
  this.update = function(){
    if(this.yPos < -this.height){
      this.health = 0;
    }else{
      this.yPos -= this.speed;
    }
    
    this.tickCnt++;
    if(this.tickCnt > this.ticksPerFrame){
      this.tickCnt = 0;
      
      if(this.frameIndex >= this.frames){
        if(this.loop === true) this.frameIndex = 0;
      }else{
        this.frameIndex++;
      }
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
  };
}

function laser(){
  this.shoot_delay = 20;
  this.damage = 1;
  this.level = 1;
  
  this.shoot = function(x,y){
    // create bullet               
    
    switch (this.level){
      case 1:
                                            //w,h,x,y,s,d,health,img,f,tf,loop
        bullets[bullets.length] = new bullet(9,32,x,y,3,1,1,ASSET_LOADER.getImage("images/shoot2_sprite_36x32.png"),3,2,false);
        break;
      case 2:
        bullets[bullets.length] = new bullet(9,32,x-16,y,3,1,1,ASSET_LOADER.getImage("images/shoot2_sprite_36x32.png"),3,2,false);
        bullets[bullets.length] = new bullet(9,32,x+16,y,3,1,1,ASSET_LOADER.getImage("images/shoot2_sprite_36x32.png"),3,2,false);
        break;
      case 3:
        bullets[bullets.length] = new bullet(9,32,x-16,y,3,1,1,ASSET_LOADER.getImage("images/shoot2_sprite_36x32.png"),3,2,false);
        bullets[bullets.length] = new bullet(9,32,x,y-8,3,1,1,ASSET_LOADER.getImage("images/shoot2_sprite_36x32.png"),3,2,false);
        bullets[bullets.length] = new bullet(9,32,x+16,y,3,1,1,ASSET_LOADER.getImage("images/shoot2_sprite_36x32.png"),3,2,false);
        break;
    }
      
    // play shoot sound
    sounds['laser'] = ASSET_LOADER.getSound("sounds/Laser_Shoot.wav");       
    sounds['laser'].load();

    if(sounds['laser'].currentTime === 0 || sounds['laser'].ended) {
      sounds['laser'].play();  
      sounds['laser'].volume = volume;
    } 
  }; 
}

function blaster(){
  this.shoot_delay = 36;
  this.damage = 2;
  this.level = 1;
  
  this.shoot = function(x,y){
    // create bullet                 
                                        //w,h,x,y,s,d,health,img,f,tf,loop
    bullets[bullets.length] = new bullet(32,32,x,y,2,2,1,ASSET_LOADER.getImage("images/shoot_sprite_128x32.png"),3,4,true);
    
    // play shoot sound
    sounds['laser'] = ASSET_LOADER.getSound("sounds/Blaster_Shoot.wav");       
    sounds['laser'].load();

    if(sounds['laser'].currentTime === 0 || sounds['laser'].ended) {
      sounds['laser'].play();  
      sounds['laser'].volume = volume;
    } 

  }; 
}