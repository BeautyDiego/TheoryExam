<template>
  <div>
    <div class="main-container">
      <div class="subject-header">
        <Row>
          <Col span="12" class="title">
            免费试学
          </Col>
          <Col span="12">
            <p class="answer-progress">
              共&nbsp<span>{{totalCount}}</span>&nbsp题，剩余&nbsp<span>{{totalCount-correctCount-errorCount}}</span>&nbsp题目，正确&nbsp<span class="correct-color">{{correctCount}}</span>&nbsp题目，错误&nbsp<span class="error-color">{{errorCount}}</span>&nbsp题目
            </p>
          </Col>
        </Row>
      </div>
      <div class="subject-main" v-if="questionList.length>0">
        <p class="subject-type">{{currentQuestion.QuesTypeText}}题，请选择正确答案！</p>
        <p class="subject-content">{{currentQuestionIndex}}、{{currentQuestion.Question}}</p>
        <div >
          <Row>
            <Col span="14">
              <div class="answer-list">
                <ul>
                  <li><p :class="answerOptionClass('A')" @click="ChooseAnswer('A')">A.{{currentQuestion.Option1}}</p></li>
                  <li><p :class="answerOptionClass('B')" @click="ChooseAnswer('B')">B.{{currentQuestion.Option2}}</p></li>
                  <li v-show="currentQuestion.QuesType!==3"><p :class="answerOptionClass('C')" @click="ChooseAnswer('C')">C.{{currentQuestion.Option3}}</p></li>
                  <li v-show="currentQuestion.QuesType!==3"><p :class="answerOptionClass('D')" @click="ChooseAnswer('D')">D.{{currentQuestion.Option4}}</p></li>
                </ul>
                <div class="multiple-choices">
                  <Button size="media" v-show="currentQuestion.QuesTypeText==='多选'" type="primary" @click="submitAnswers">提交多选</Button>
                </div>
              </div>
            </Col>
            <Col span="10">
              <img v-if="!isVideo&&currentImgUrl" :src="currentImgUrl" alt=""  style="max-height:200px;max-width:100%;">
              <video v-if="isVideo" :src="currentImgUrl" autoplay loop></video>
            </Col>
      
          </Row>
        </div>
        <div class="user-operate">
          <Row>
            <Col span="18">
              <Button size="large"  class="operate-btn" @click="preQuestion">上一题</Button>
              <Button size="large"  style="margin-left:10px;" class="operate-btn" @click="nextQuestion">下一题</Button>
              <Button size="large"  style="margin-left:50px;" @click="toggleAnswerSheet">{{IsAnswerSheetOpen?'收起答题卡':'展开答题卡'}}</Button>
              <Button size="large" style="margin-left:10px;" @click="toggleExplan">详细讲解</Button>
              <vue-audio v-if="currentQuestion.ExpAudio" :source="mediaURL+currentQuestion.ExpAudio"
                         :mode="mode"
                         @timeupdate="timeupdate"
                         @playing="playing"
                         @pause="pause"
                         @ended="ended"
                         @waiting="waiting"
                         @error="error"
                         style="top:15px"
                         ref="audio">
                <div class="player">
                  <svg class="progress" :width="svgOptions.width" :height="svgOptions.height">
                    <path :fill="svgOptions.fill" :stroke="svgOptions.stroke" :stroke-width="svgOptions.strokeWidth"></path>
                  </svg>
                  <a class="play" href="javascript:void(0)">
                  </a>
                </div>
              </vue-audio>
            </Col>
            <Col span="6">
            
            </Col>
          </Row>
        </div>
        <div class="subject-explanation">
          <collapse-transition>
            <div class="collapse-wrap"
                 v-show="IsAnswerSheetOpen">
              <!-- @slot default -->
              <slot>
                <div class="answer-sheet-wrapper">
                  <div class="answer-sheet" v-show="IsAnswerSheetOpen">
                    <div v-for="(item,index) in answerList"
                         class="answer-item"
                         :class="answerItemColorFormat(index+1,item)"
                         @click="turnTo(index+1)">{{index+1}}</div>
                  </div>
                </div>
        
              </slot>
            </div>
          </collapse-transition>
          <collapse-transition>
            <div class="collapse-wrap"
                 v-show="IsExplanOpen">
              <!-- @slot default -->
              <slot>
                <div class="detailed-explan-title">
                  <div>讲解</div>
                </div>
                <p  class="detailed-explan" v-html="currentQuestion.Explain">
          
                </p>
              </slot>
            </div>
          </collapse-transition>
        </div>
      </div>
      </div>
    </div>
  </div>
</template>

<script>
import collapseTransition from './../my-components/collapseTransition'
import {getFreeQuestions} from '@/api/questions'
import {mediaURL} from '@/config'
import vueAudio from './../my-components/vue-audio.vue'
import * as constant from './../my-components/constant'
export default {
  name: 'free-questions',
  components:{
    collapseTransition,
    vueAudio
  },
  data () {
    return {
      questionType:'exercise',
      choosedSubject:1, //所选择的科目
      questionList:[],
      totalCount:0,
      correctCount:0, //回答正确题目数
      errorCount:0, //回答错误题目数
      answerList:[], //答案列表
      currentQuestion:{},
      currentQuestionIndex:1,
      IsAnswerSheetOpen:true,
      IsExplanOpen:false,
      mediaURL:mediaURL,
      mode: constant.SINGLE,
      single_mode: constant.SINGLE,
      loop_mode: constant.LOOP,
      order_mode: constant.ORDER,
      circulation_mode: constant.CIRCULATION,
      random_mode: constant.RANDOM,
      svgOptions: {
        width: 40,
        height: 40,
        fill: 'none',
        stroke: '#007aff',
        strokeWidth: 2
      }
    }
  },
  computed:{
    currentImgUrl:function () {
      if (this.currentQuestion.QuesImage){
        return mediaURL+this.currentQuestion.QuesImage;
      }else{
        return ''
      }
    },
    isVideo:function () {
      const reg = /.+.mp4/;
      return reg.test(this.currentImgUrl)
    },
    answerOptionClass:function () {
      return function (option) {
        let className='answer-option';
        if (this.currentQuestion.QuesTypeText==='多选'){
          if (this.currentAnswer.IsAnswered){ //已经提交答案
            if (this.currentQuestion.Answer.includes(option)&&this.currentAnswer.cusAnswer.includes(option)){ //答案里有这个选项 且 选择了这个选项
              className = 'answer-true-right'
            }else if (this.currentQuestion.Answer.includes(option)&&!this.currentAnswer.cusAnswer.includes(option)){ //答案里有  但  没选
              className = 'answer-right'
            }else if (!this.currentQuestion.Answer.includes(option)&&this.currentAnswer.cusAnswer.includes(option)){ //答案里没有 但 选了
              className = 'answer-error'
            }
          }else{ //没有提交答案的如果选过
            if (this.currentAnswer.cusAnswer.includes(option)){
              className = 'answer-right'
            }
          }
        }else{
          if (this.currentAnswer.IsAnswered){
            if (this.currentQuestion.Answer.includes(option)){
              className = 'answer-right'
            }else if (!this.currentQuestion.Answer.includes(option)&&this.currentAnswer.cusAnswer.includes(option)){
              className = 'answer-error'
            }
          }
        }
        return className
      }
      
      
    },
    currentAnswer:function () {
      if (this.answerList.length>0){
        return  this.answerList[this.currentQuestionIndex-1]
      }else{
        return  {subIndex:0,cusAnswer:'',IsAnswered:false,IsCorrect:true}
      }
    }
  },
  mounted () {
    this.choosedSubject=this.$route.query.choosedSubject?this.$route.query.choosedSubject:1;
    this.getQuestionsPagedList();
  },
  methods:{
    toggleAnswerSheet(){
      this.IsAnswerSheetOpen=!this.IsAnswerSheetOpen;
    },
    toggleExplan(){
      this.IsExplanOpen=!this.IsExplanOpen;
    },
    async getQuestionsPagedList(){
      this.$Spin.show();
      const params= {s_Subject:this.choosedSubject};
      const res= await getFreeQuestions(params);
      this.questionList=res.data;
      this.totalCount =  this.questionList.length;
      for (let j=0;j< this.totalCount;j++){
        this.answerList.push({subIndex:j,cusAnswer:'',IsAnswered:false,IsCorrect:true});
      }
       this.currentQuestion=this.questionList[this.currentQuestionIndex-1];
      setTimeout(() => {
        this.$Spin.hide();
      }, 600);
    },
    preQuestion(){
      if (this.currentQuestionIndex>1){
        this.currentQuestionIndex--;
         this.currentQuestion=this.questionList[this.currentQuestionIndex-1];
        this.resetAudioToPause();//重置音频播放按钮
      }
    },
    nextQuestion(){
      if (this.currentQuestionIndex!==this.totalCount){
        this.currentQuestionIndex++;
          this.currentQuestion=this.questionList[this.currentQuestionIndex-1];
        this.resetAudioToPause();//重置音频播放按钮
      }
    },
    turnTo(index){
      if (index!==this.currentQuestionIndex){
        this.currentQuestionIndex=index;
     this.currentQuestion=this.questionList[this.currentQuestionIndex-1];
        this.resetAudioToPause();//重置音频播放按钮
      }
    },
    //选择答案
    ChooseAnswer(option){
      //没有回答
      if (!this.currentAnswer.IsAnswered){
        if(this.currentQuestion.QuesTypeText!=='多选'){
          this.answerList[this.currentQuestionIndex-1].cusAnswer = option;
          this.answerList[this.currentQuestionIndex-1].IsCorrect = this.currentQuestion.Answer === option;
          this.answerList[this.currentQuestionIndex-1].IsAnswered = true;
          //回答以后的统计
          this.currentQuestion.Answer === option?this.correctCount++:this.errorCount++
          if(this.currentQuestion.Answer === option){ //回答正确到下一题
            let vm=this;
            setTimeout(function () {
              vm.nextQuestion();
            },500)
          }
         
        }else{
          this.answerList[this.currentQuestionIndex-1].cusAnswer += option+",";
        }
      
      }
    },
    //提交多选的答案
    submitAnswers(){
      if(this.currentQuestion.QuesTypeText==='多选'&&!this.currentAnswer.IsAnswered){
        let cusAnswer=this.currentAnswer.cusAnswer.substring(0,this.currentAnswer.cusAnswer.length - 1).split(',');
        let subjectAnswer = this.currentQuestion.Answer.split(',');
        this.answerList[this.currentQuestionIndex-1].IsCorrect = cusAnswer.sort().toString() === subjectAnswer.sort().toString();
        this.answerList[this.currentQuestionIndex-1].IsAnswered = true;
        //回答以后的统计
        this.answerList[this.currentQuestionIndex-1].IsCorrect?this.correctCount++:this.errorCount++
        if( this.answerList[this.currentQuestionIndex-1].IsCorrect){ //回答正确到下一题
          let vm=this;
          setTimeout(function () {
            vm.nextQuestion();
          },500)
        }
      }
    },
    answerItemColorFormat(index,answer){
      let bgColorClass='';
      if (answer.IsAnswered){
        answer.IsCorrect?bgColorClass='answer-correct-color':bgColorClass='answer-error-color';
      }
      if (this.currentQuestionIndex===index){
        bgColorClass = 'current-subject-color';
      }
      return bgColorClass;
    },
    //重置音频播放按钮
    resetAudioToPause(){
      this.$refs.audio.$el.querySelector('a').className = constant.PAUSE_CLASS
    },
    timeupdate (e) {
      let target = e.target
      let currentTime = target.currentTime
      let duration = target.duration
      let percent = (100 / duration * currentTime).toFixed(1)
      if (isNaN(percent) || percent === '0.0') {
        percent = 0
      }
      let svg = target.parentNode.querySelector('svg')
      if (percent > 100) {
        percent = 100
      }
      let centerX = this.svgOptions.width / 2
      let centerY = this.svgOptions.height / 2
      let radius = centerX - this.svgOptions.strokeWidth / 2
      let startX = centerX
      let startY = centerY - radius
      let xAxisRotation = 0
      let sweepFlag = 1
      let circ = Math.PI * 2
      let largeArcFlag = 0
      if (percent * circ / 100 >= Math.PI) {
        largeArcFlag = 1
      }
      let endX = centerX + radius * Math.sin(circ * percent / 100)
      let endY = centerY - radius * Math.cos(circ * percent / 100)
      let d = 'M' + startX + ',' + startY + ' ' + 'A' + radius + ',' + radius + ' ' + xAxisRotation + ' ' + largeArcFlag + ' ' + sweepFlag + ' ' + endX + ',' + endY
      let path = svg.querySelector('path')
      path.setAttribute('d', d)
    },
    playing (e) {
      let ele = e.path ? e.path[1] : e.target.parentElement
      ele.querySelector('a').className = constant.PLAY_CLASS
    },
    pause (e) {
      let ele = e.path ? e.path[1] : e.target.parentElement
      ele.querySelector('a').className = constant.PAUSE_CLASS
    },
    ended (e) {
      let ele = e.path ? e.path[1] : e.target.parentElement
      ele.querySelector('a').className = constant.PAUSE_CLASS
    },
    waiting (e) {
      let ele = e.path ? e.path[1] : e.target.parentElement
      ele.querySelector('a').className = constant.LOAD_CLASS
    },
    error (e) {
      console.log(e)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import "./../../assets/styles/common";
.error-color{
  color:@error-color
}
.correct-color{
  color:@success-color
}
.current-subject-color{
  background-color:@purple-color ;
  color:#fff;
}
.answer-error-color{
  background-color:@error-color ;
  color:#fff;
}
.answer-correct-color{
  background-color:@success-color ;
  color:#fff;
}
.subject-header{
  height:50px;
  margin-top:50px;
  .title{
    height:50px;
    line-height: 50px;
    text-align: left;
    border-left: 10px solid @purple-color;
    font-size:30px;
    color:@purple-color;
    padding-left:20px;
  }
  .answer-progress{
    font-size: 18px;
    line-height: 50px;
    letter-spacing: 1px;
    color:@subject-color;
    span{
      font-size: 24px;
    }
  }
}
.subject-main{
  .subject-type{
    text-align: left;
    margin-top:16px;
    padding-left:28px;
    font-size: 16px;
    line-height:25px;
    letter-spacing: 1px;
    color: #6f6e6e;
  }
  .subject-content{
    padding: 0 28px;
    text-align: left;
    font-size: 20px;
    color:@subject-color;
    line-height: 55px;
    background-color: #eeeeee;
  }
  .answer-list{
    height: auto;
    padding-bottom:10px;
    ul{
      list-style:none;
      padding: 20px 28px 10px;
      li{
        text-align: left;
        padding:5px 0;
        font-size: 18px;
        color: #656464;
        p{
          line-height: 30px;
          padding-left: 30px;
          cursor: pointer;
        }
      }
    }
    .multiple-choices{
      text-align: left;
      padding-left:28px;
    }
  }
  .user-operate{
    text-align: left;
    padding: 0 28px;
  }
  .subject-explanation{
    padding:30px 0;
    .answer-sheet-wrapper{
      overflow-y: scroll;
      width:900px;
      max-height:200px;
      margin-left:28px;
      border-top: 1px solid #e9e9e9;
      border-bottom: 1px solid #e9e9e9;
    }
    .answer-sheet{
      border-left: 1px solid #e9e9e9;
      border-top: 1px solid #e9e9e9;
      color:#464446;
      .answer-item{
        display:inline-block;
        width: 4%;
        line-height: 30px;
        border-right: 1px solid #e9e9e9;
        border-bottom: 1px solid #e9e9e9;
        cursor:pointer;
        float:left;
      }
    }
    .detailed-explan-title{
      border-top: 1px solid #e9e9e9;
      margin-top:10px;
      div{
        width: 83px;
        line-height: 21px;
        margin:0 auto;
        background-color: #bcbcbc;
        border-radius: 0 0 10px 10px;
        color: #ffffff;
        cursor:pointer;
      }
    }
    .detailed-explan{
      padding:20px;
      font-size: 20px;
      line-height: 22px;
      color: #bc6518;
    }
  }
}
</style>
