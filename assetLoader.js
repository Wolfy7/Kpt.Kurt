function AssetLoader(){
  this.assetsCount = 0;
  this.assetsLoaded = 0;
  this.soundsQueue = [];
  this.sounds = {};
  this.soundSuccesCount = 0;
  this.soundErrorCount = 0;
  
  this.imagesQueue = [];
  this.images = {};
  this.imgageSuccesCount = 0;
  this.imageErrorCount = 0;
}

// Sounds
AssetLoader.prototype.addSound = function(path){
  this.assetsCount++;
  this.soundsQueue.push(path);
};

AssetLoader.prototype.getSound = function(path){
  return this.sounds[path];
};

AssetLoader.prototype.getSounds = function(){
  return this.sounds;
};

AssetLoader.prototype.loadSounds = function(loadCallBack, progressBarCallBack,loadImagesAfter){
  //console.log("Lade Sounds.");
  loadImagesAfter = (typeof loadImagesAfter === 'undefined') ? false : loadImagesAfter;
  if(this.soundsQueue.length === 0){
    if(loadImagesAfter === true){
      that.loadImages(loadCallBack, progressBarCallBack);
    }else{
      loadCallBack();
    }
  }
  
  var prozent = this.assetsCount / 100;
  
  for(i=0; i < this.soundsQueue.length; i++){
    var path = this.soundsQueue[i];
    var aud = new Audio();
    var that = this;
    aud.addEventListener("canplaythrough", function(){
      // Debug
      //console.log("Sound geladen.");
      that.soundSuccesCount++;
      that.assetsLoaded++;
      
      progressBarCallBack(that.assetsLoaded / prozent);
      
      if(that.soundsLoaded()){
        if(loadImagesAfter === true){
          that.loadImages(loadCallBack, progressBarCallBack);
        }else{
          loadCallBack();
        }
      }
    }, false);
    aud.addEventListener("error", function(){
      // Debug
      //console.log("Fehler beim Sound laden.");
      that.soundErrorCount++;
      that.assetsLoaded++;
      if(that.soundsLoaded()){
        if(loadImagesAfter === true){
          that.loadImages(loadCallBack, progressBarCallBack);
        }else{
          loadCallBack();
        }
      }
    }, false);
    aud.src = path;
    this.sounds[path] = aud;
  }
};

AssetLoader.prototype.soundsLoaded = function(){
  return (this.soundsQueue.length === this.soundSuccesCount + this.soundErrorCount);
};

// Images
AssetLoader.prototype.addImage = function(path){
  this.assetsCount++;
  this.imagesQueue.push(path);
};

AssetLoader.prototype.getImage = function(path){
  return this.images[path];
};

AssetLoader.prototype.getImages = function(){
  return this.images;
};

AssetLoader.prototype.loadImages = function(loadCallBack,progressBarCallBack,loadSoundsAfter){
  //console.log("Lade Images.");
  loadSoundsAfter = (typeof loadSoundsAfter === 'undefined') ? false : loadSoundsAfter;
  if(this.imagesQueue.length === 0){
    if(loadSoundsAfter === true){
      that.loadSounds(loadCallBack, progressBarCallBack);
    }else{
      loadCallBack();
    }
  }
  
  var prozent = this.assetsCount / 100;
  
  for(i=0; i < this.imagesQueue.length; i++){
    var path = this.imagesQueue[i];
    var img = new Image();
    var that = this;
    img.addEventListener("load", function(){
      // Debug
      //console.log("Image geladen.");
      that.imgageSuccesCount++;
      that.assetsLoaded++;
      
      progressBarCallBack(that.assetsLoaded / prozent);
      
      if(that.imagesLoaded()){
        if(loadSoundsAfter === true){
          that.loadSounds(loadCallBack, progressBarCallBack);
        }else{
          loadCallBack();
        }
      }
    }, false);
    img.addEventListener("error", function(){
      // Debug
      //console.log("Fehler beim Image laden.");
      that.imageErrorCount++;
      that.assetsLoaded++;
      if(that.imagesLoaded()){
        if(loadSoundsAfter === true){
          that.loadSounds(loadCallBack, progressBarCallBack);
        }else{
          loadCallBack();
        }
      }
    }, false);
    img.src = path;
    this.images[path] = img;
  }
};

AssetLoader.prototype.imagesLoaded = function(){
  return (this.imagesQueue.length === this.imgageSuccesCount + this.imageErrorCount);
};


AssetLoader.prototype.loadAll = function(loadCallBack, progressBarCallBack){
  this.loadSounds(loadCallBack, progressBarCallBack,true);
};
