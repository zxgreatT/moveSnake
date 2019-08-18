var chessBoard //游戏场地
var squareSet //游戏场地的地砖

var mainSnake //玩家控制的蛇
var mainSnakeColor = '#6495ED'
var snake = [] //蛇的集合,所有的蛇都存在这里

var maxThingSize = 20 //允许存在的物体的数量,在核心的代码中，物体只有食物一个种类
var createThings = [] //所有生成的物体樽坊的集合
//朝向
var toward = {
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  UP: { x: 0, y: -1 },
  RIGHT: { x: 1, y: 0 }
}


var frame = 40 //刷新频率,1秒40次
var is3D = false
var hasAI = false
var isStart = false //是否开始
var timer //游戏刷新频率的定时器

var allowCrashSlef = true //允许穿过自身，当前为预留字段
var maxThings = 10
var things = []

//克隆方法 浅层克隆
function clone(obj) {
  return JSON.parse(JSON.stringify(obj))
}

//初始化地板
function initSquareSet() {      
  squareSet = new Array(25)
  for (var i = 0; i < squareSet.length; i++) {
    squareSet[i] = new Array(25)
    for (var j = 0; j < squareSet[0].length; j++) {
      squareSet[i][j] = document.createElement('div')
      squareSet[i][j].classList.add('square')
      chessBoard.appendChild(squareSet[i][j])
    }
  }
}
//构建蛇的模型
function Snake(headX, headY, nowToward, length, bgColor) {
  
  this.snakebody = []
  this.nowToward = nowToward
  this.headMoveX = nowToward.x
  this.headMoveY = nowToward.y
  this.bgColor = bgColor
  this.changeToward = null
  this.init = function(headX, headY, nowToward, length, bgcolor) {
    for(var i = 0;i < length;i++){
      this.grow(headX, headY, bgColor)
    }
  }
  this.grow = function(headX, headY, bgColor) {
    var ball
    if(this.snakebody.length == 0){
      ball = createBall(headX, headY, '&nbsp;', bgColor)
    } else {
      var lastbody = this.snakebody[this.snakebody.length - 1]
      ball = createBall(lastbody.lx + (-1) * this.nowToward.x * 20, lastbody.ly + (-1) * this.nowToward.y,
      '&nbsp;', bgColor)
    }
    this.snakebody.push(ball)
  }
  this.turnDown = function() {
    this.nowToward = toward.UP
    change(this, 0, 1)
  }
  this.turnLeft = function() {
    this.nowToward = toward.LEFT
    change(this, -1, 0)
  }
  this.turnRight = function () {
    this.nowToward = toward.RIGHT
    change(this, 1, 0)
  }
  this.turnUP = function () {
    this.nowToward = toward.UP
    change(this, 0 ,-1)
  }
  this.init(headX, headY, nowToward, length, bgColor)
}

function change(nowSnake, x, y) {
  var lastX = nowSnake.snakebody[0].lx
  var lastY = nowSnake.snakebody[0].ly
  var speedX = nowSnake.headMoveX
  var speedY = nowSnake.headMoveY
  for(var i =1;i < nowSnake.snakebody.length;i++){
    nowSnake.snakebody[i].point.push({
      x:lastX,
      y:lastY,
      speedX,
      speedY
    })
  }
  nowSnake.headMoveX = x
  nowSnake.headMoveY = y
}
//创建蛇身体的小球
function createBall(x, y, text, bgColor, fgColor) {
  
  var ball = document.createElement("div")
  ball.classList.add("ball")
  ball.style.left = x + "px"
  ball.style.top = y + "px"
  ball.lx = x
  ball.ly = y
  ball.innerHTML = text
  ball.point = []
  ball.style.background = bgColor
  ball.style.color = fgColor
  chessBoard.appendChild(ball)
  return ball
}

//初始化蛇
function initSnake() {
  //初始化玩家的蛇
  var main = new Snake(80, 0, toward.RIGHT, 5, mainSnakeColor)
  mainSnake = main
  snake.push(main)
}
//重绘
function repaint() {
  for(var i = 0;i < snake.length;i++){
    for(var j = 0;j < snake[i].snakebody.length;j++){
      snake[i].snakebody[j].style.left = snake[i].snakebody[j].lx + 'px'
      snake[i].snakebody[j].style.top = snake[i].snakebody[j].ly + 'px'
    }
    snake[i].snakebody[0].innerHTML = '囧'
  }
}

//蛇的移动
function move() {
  for(var i = 0;i < snake.length;i++){
    for(var j = 0;j < snake[i].snakebody.length;j++){
      if(snake[i].snakebody[j].point.length > 0){
        // console.log(snake[i].snakebody[j].point)
        snake[i].snakebody[j].lx += snake[i].snakebody[j].point[0].speedX
        snake[i].snakebody[j].ly += snake[i].snakebody[j].point[0].speedY
          if(snake[i].snakebody[j].lx == snake[i].snakebody[j].point[0].x && snake[i].snakebody[j].ly == snake[i].snakebody[j].point[0].y){
            snake[i].snakebody[j].point.shift() 
          }
      }else{
        // console.log(snake[i].snakebody[j].point.length)
      snake[i].snakebody[j].lx += snake[i].headMoveX
      snake[i].snakebody[j].ly += snake[i].headMoveY
      }
    }
  }
  repaint()
} 
//改变方向
function tryChangeToward() {
  for(var i = 0;i < snake.length;i++){
    if(snake[i].changeToward && snake[i].changeToward.change != snake[i].nowToward){
      if(snake[i].changeToward.change.x + snake[i].nowToward.x != 0 || snake[i].changeToward.change.y + snake[i].nowToward.y != 0){
        snake[i].nowToward = snake[i].changeToward.change
        snake[i].changeToward.act.call(snake[i])
      }
    }
  }
}

//创建工厂
var thingFactory = {
  autoGenerateTimer:null,
  typeEnums:{
    food:{
      name:'food',
      value: 2,
      text:'+',
      bgColor:'#228b22',
      fgColor:'black',
      act:function(origin){
        origin.grow(null,null,origin.bgColor)
      }
    }
  },
  createThing : function (x, y, type) {
    var temp = createBall(x, y, type.text, type.bgColor, type.fgColor)
    temp.value = type.value
    temp.act = type.act
    things.push(temp)
    return temp
  },
  ramdomGenerate: function () {
    var x = parseInt(Math.random() * 480)
    var y = parseInt(Math.random() * 480)
    var temp = createBall(x, y, this.typeEnums.food.text, this.typeEnums.food.bgColor, this.typeEnums.food.fgColor)
    temp.act = this.typeEnums.food.act;
    things.push(temp)
  },
  autoGenerate: function () {
    this.autoGenerateTimer = setInterval(function() {
      if (things.length < maxThingSize) {
          thingFactory.ramdomGenerate()
      }
    }, 1000) 
      
  }
}
//开始
function start() {
  timer = setInterval(() => {
    tryChangeToward()
    move()
  }, 1000 / frame)
  thingFactory.autoGenerate()
  document.onkeydown = function(e) {
    if(e.keyCode == 38){
      mainSnake.changeToward = {
        change : toward.UP, 
        act: mainSnake.turnUP
      }
      console.log('向上')
    }else if(e.keyCode == 40){
      mainSnake.changeToward = {
          change: toward.DOWN,
          act: mainSnake.turnDown
      }
      console.log('向下')
    }else if(e.keyCode == 39){
      mainSnake.changeToward = {
          change: toward.RIGHT,
          act: mainSnake.turnRight
      }
      console.log('向右')
    }else if(e.keyCode == 37){
      mainSnake.changeToward = {
          change: toward.LEFT,
          act: mainSnake.turnLeft
      }
      console.log('向左')
    }
  }
}
//页面加载完成
window.onload = function () {
  
  chessBoard = document.getElementById('chess_board')
  initSquareSet()
  initSnake()
}