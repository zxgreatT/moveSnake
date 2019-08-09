var chessBoard //游戏场地
var squareSet //游戏场地的地砖

var mainSnake //玩家控制的蛇
var mainSnakeColor = '#6495ED'  //蛇的集合,所有的蛇都存在这里
var snake = []

var maxThingSize = 20 //允许存在的物体的数量,在核心的代码中，物体只有食物一个种类
var createThings = [] //所有生成的物体樽坊的集合

var toward = {
  DOWN:{x:0,y:1},
  LEFT:{x:-1,y:0},
  UP:{x:0, y:-1},
  RIGHT:{x:1, y:0}
}

var frame = 40 //刷新频率,1秒40次
var is3D = false
var hasAI = false
var isStart = false //是否开始
var timer //游戏刷新频率的定时器

var allowCrashSlef = true //允许穿过自身，当前为预留字段

//克隆方法 浅层克隆
function clone(obj){
    return JSON.parse(JSON.stringify(obj))
}

//初始化地板
function initSquareSet(){
  var squareSet = new Array(25)
  for(var i = 0;i < squareSet.length;i++){
    
  }
}

//页面加载完成
window.onload = function () {
  chessBoard = document.getElementById('chessBoard')
  initSquareSet()
}