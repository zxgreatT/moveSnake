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
  console.log(11)
  this.snakebody = []
  this.nowToward = nowToward
  this.headMoveX = nowToward.x
  this.headMoveY = nowToward.y
  this.bgColor = bgColor
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
      // ball = createBall()
    }
    this.snakebody.push(ball)
  }
  this.init(headX, headY, nowToward, length, bgColor)
}

//创建蛇身体的小球
function createBall(x, y, text, bgColor, fgColor) {
  console.log(11)
  var ball = document.createElement("div")
  ball.classList.add("ball")
  ball.style.left = x + "px"
  ball.style.top = y + "px"
  ball.lx = x
  ball.ly = y
  ball.style.background = bgColor
  chessBoard.appendChild(ball)
}

//初始化蛇
function initSnake() {
  //初始化玩家的蛇
  var main = new Snake(80, 0, toward.RIGHT, 3, mainSnakeColor)
  mainSnake = main
  snake.push(main)
}

//页面加载完成
window.onload = function () {
  console.log(11)
  chessBoard = document.getElementById('chess_board')
  initSquareSet()
  initSnake()
}