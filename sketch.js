    var PLAY = 1;
    var END = 0;
    var gameState = PLAY;

    var trex, trex_running, trex_collided;
    var ground, invisibleGround, groundImage;

    var cloudsGroup, cloudImage;
    var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

    var score=0;

    var gameOver, restart;
    var jumpSound , checkPointSound, dieSound;
    var coin, coinImg;

    var points=0;

    localStorage["HighestScore"] = 0;

    function preload(){
      bgImg=loadImage("desert2.jpg");

      trex_running =   loadAnimation("trex1.png","trex3.png","trex4.png");
      trex_collided = loadAnimation("trex_collided.png");
      
      groundImage = loadImage("ground2.png");
      
      cloudImage = loadImage("cloud final.png");
      
      obstacle1 = loadImage("obstacle1.png");
      obstacle2 = loadImage("obstacle2.png");
      obstacle3 = loadImage("obstacle3.png");
      obstacle4 = loadImage("obstacle4.png");
      obstacle5 = loadImage("obstacle5.png");
      obstacle6 = loadImage("obstacle6.png");
      
      gameOverImg = loadImage("gameOver.png");
      restartImg = loadImage("restart.png");

      coinImg=loadImage("bitcoin.jpg");

      jumpSound = loadSound("jump.mp3");
      dieSound = loadSound("die.mp3");
      checkPointSound = loadSound("checkPoint.mp3");
    }

    function setup() {
      createCanvas(windowWidth , windowHeight);

     // background1=createSprite(700,330,windowWidth,windowHeight);
      //background1.addImage("bg",bgImg);
      //background1.velocityX=-(12 + 3*score/300);
      
      trex = createSprite(50,500,20,50);
      trex.x=width/2;
      
      trex.addAnimation("running", trex_running);
      trex.addAnimation("collided", trex_collided);
      trex.scale = 0.6;
      
      ground = createSprite(200,600,windowWidth,20);
      ground.addImage("ground",groundImage);
      ground.x = ground.width/2;
      ground.velocityX = -(12 + 3*score/300);
      
      gameOver = createSprite(windowWidth/2,windowHeight/2-100);
      gameOver.addImage(gameOverImg);
      
      restart = createSprite(windowWidth/2,windowHeight/2-40);
      restart.addImage(restartImg);
      
      gameOver.scale = 1;
      restart.scale = 1;

      gameOver.visible = false;
      restart.visible = false;
      
      invisibleGround = createSprite(200,610,1000,10);
      invisibleGround.visible = false;
      
      cloudsGroup = new Group();
      obstaclesGroup = new Group();
      coinGroup = new Group();

      if(!localStorage["HighestScore"]){
        localStorage["HighestScore"]=0;
      }
      
      score = 0;
    }

    function draw() {
      //trex.debug = true;
      background(bgImg);

      fill("black")
      textSize(20)
      text("Score: "+ score, windowWidth/2+camera.position.x-200,80);
      text("Highest score: " + localStorage["HighestScore"],windowWidth/2+camera.position.x-200,100);

      fill("green");
      textSize(20);
      text("Points:" + points,windowWidth/2,60);

      if (gameState===PLAY){
        score = score + Math.round(getFrameRate()/60);
        ground.velocityX = -(6 + 3*score/100);
      
        if(keyDown("space") && trex.y >= 515) {
          trex.velocityY = -12;
          jumpSound.play();
        }

        trex.velocityY = trex.velocityY + 0.9;

        if(score>0 && score%100 === 0){
          checkPointSound.play() 
      }
            
        if (ground.x < 0){
          ground.x = ground.width/2;
        }
      
        trex.collide(invisibleGround);
        spawnClouds();
        spawnObstacles();
        createcoins();
      
        if(obstaclesGroup.isTouching(trex)){
          jumpSound.play();
          gameState = END;
          dieSound.play();      
        }

        if(coinGroup.isTouching(trex)){
          points=points+500;
          coinGroup.destroyEach();
        }

        camera.position.x=trex.x;
      }
      else if (gameState === END) {
        gameOver.visible = true;
        restart.visible = true;

        if(score>0 && score%100 === 0){
          checkPointSound.play() 
      }
        
        //set velcity of each game object to 0
        ground.velocityX = 0;
        trex.velocityY = 0;
        obstaclesGroup.setVelocityXEach(0);
        cloudsGroup.setVelocityXEach(0);
        coinGroup.setVelocityXEach(0);
        
        //change the trex animation
        trex.changeAnimation("collided",trex_collided);
        
        //set lifetime of the game objects so that they are never destroyed
        obstaclesGroup.setLifetimeEach(-1);
        cloudsGroup.setLifetimeEach(-1);
        coinGroup.setLifetimeEach(-1);
        
        if(mousePressedOver(restart)) {
          reset();
        }
      }

      drawSprites();
    }

    function spawnClouds() {
      //write code here to spawn the clouds
      if (frameCount % 30 === 0) {
        var cloud = createSprite(windowWidth/2+camera.position.x-60,200,40,10);
        cloud.y = Math.round(random(150,200));
        cloud.addImage(cloudImage);
        cloud.scale = 0.1;
        cloud.velocityX = -(12 + 3*score/300);
        
        //assign lifetime to the variable
        cloud.lifetime = 220;
        
        //adjust the depth
        cloud.depth = gameOver.depth;
        gameOver.depth = gameOver.depth + 1;
        
        //add each cloud to the group
        cloudsGroup.add(cloud);
      }
      
    }

    function spawnObstacles() {
      if(frameCount % 60 === 0) {
        var obstacle = createSprite(windowWidth/2+camera.position.x-50,585,10,40);
        //obstacle.debug = true;
        obstacle.velocityX = -(12 + 3*score/300);
        
        //generate random obstacles
        var s = Math.round(random(1,6));
        switch(s) {
          case 1: obstacle.addImage(obstacle1);
                  break;
          case 2: obstacle.addImage(obstacle2);
                  break;
          case 3: obstacle.addImage(obstacle3);
                  break;
          case 4: obstacle.addImage(obstacle4);
                  break;
          case 5: obstacle.addImage(obstacle5);
                  break;
          case 6: obstacle.addImage(obstacle6);
                  break;
          default: break;
        }
        
        //assign scale and lifetime to the obstacle           
        obstacle.scale = 0.6;
        obstacle.lifetime = 300;
        //add each obstacle to the group
        obstaclesGroup.add(obstacle);
      }
    }

    function createcoins(){
      if(frameCount % 60 === 0){
      coin=createSprite(windowWidth+10,200,20,20);
      coin.y=Math.round(random(350,480));
      coin.addImage("coin",coinImg);
      coin.scale=0.06;
      coin.velocityX=-(12 + 3*score/300);

      //add lifetime
      coin.lifetime=200;

      // add coin to group
      coinGroup.add(coin);
      }
    }

    function reset(){
      gameState = PLAY;
      gameOver.visible = false;
      restart.visible = false;
      
      obstaclesGroup.destroyEach();
      cloudsGroup.destroyEach();
      coinGroup.destroyEach();
      
      trex.changeAnimation("running",trex_running);
      
      if(localStorage["HighestScore"]<score){
        localStorage["HighestScore"] = score;
      }

      console.log(localStorage["HighestScore"]);
      
      score = 0;
      
    }
