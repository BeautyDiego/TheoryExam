<template>
  <div>
    <div class="main-container">
      <div class="subject-header">
        <Row>
          <Col span="16" class="title">
            {{subjectText}}模拟考试   &nbsp&nbsp <span>共&nbsp<span style="font-size:28px;">{{totalCount}}</span>&nbsp题，剩余<span style="font-size:28px;" >&nbsp{{totalCount-errorCount-correctCount}}&nbsp</span>题</span>
          </Col>
          <Col span="8">
            <div class="exam-time">
              <div style="float:left;">
                剩余答题时间:&nbsp&nbsp
              </div>
              <div class="error-color" style="float:left;font-size:28px;">
              <count-down v-if="!preTipModalShow&&!hasSubmitExam" @start_callback="countDownStart" @end_callback="countDownEnd" :currentTime="currentTime" :startTime="currentTime" :endTime="endTime" :tipText="'距离开始文字1'" :tipTextEnd="'距离结束文字1'" :endText="'时间到'" :dayTxt="'天'" :secondsTxt="''" ></count-down>
                <span v-if="hasSubmitExam">已交卷</span>
              </div>
            </div>
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
              <img v-if="!isVideo&&currentImgUrl" :src="currentImgUrl" alt="" style="max-height:200px;max-width:100%;">
              <video v-if="isVideo" :src="currentImgUrl" autoplay loop></video>
            </Col>
      
          </Row>
    
    
    
        </div>
        <div class="user-operate">
          <Row>
            <Col span="18">
              <Button size="large" class="operate-btn" @click="preQuestion">上一题</Button>
              <Button size="large"  style="margin-left:10px;" class="operate-btn" @click="nextQuestion">下一题</Button>
              <Button size="large"  class="operate-btn" style="background:#85dcba;margin-left:10px;" @click="handExam('handIn')">交卷</Button>
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
          <div class="detailed-explan-title" v-show="IsExplanOpen">
            <p class="answer-judgement" v-show="currentAnswer.IsAnswered">
              <span class="success-color" v-show="currentAnswer.IsCorrect">回答正确！</span>
              <span v-show="!currentAnswer.IsCorrect" class="error-color">回答错误！</span>
              <span v-show="!currentAnswer.IsCorrect">
                您的答案：<span class="error-color">{{currentAnswer.cusAnswer}}</span>  正确答案：<span class="correct-color">{{currentQuestion.Answer}}</span>
              </span></p>
            <p  class="detailed-explan" v-html="currentQuestion.Explain">
  
            </p>
          </div>
          <div class="answer-sheet-wrapper">
            <div class="answer-sheet-title">答题卡信息</div>
            <div class="answer-sheet" v-show="IsAnswerSheetOpen">
              <div v-for="(item,index) in answerList"
                   class="answer-item"
                   :class="answerItemColorFormat(index+1,item)"
                   @click="turnTo(index+1)">{{index+1}}</div>
            </div>
          </div>
         
        </div>
      </div>
    </div>
    <Modal v-model="preTipModalShow" :footer-hide="true" :closable="false" :styles="{top: '200px'}">
      <div class="preTipText">按照交管部门通知，科一考试不能修改答案，每做一题，系统自动计算错误题数，及格标准为90分，考试时间为45分钟。</div>
      <div class="preTipBtn">
        <Button size="large" class="operate-btn" @click="startAnswer">开始答题</Button>
      </div>
    </Modal>
    <Modal v-model="handExamModalShow" :footer-hide="true"  :styles="{top: '200px'}">
      <div class="examFinalText">
        <p v-if="finalScore>90" >得分：{{finalScore}}分&nbsp&nbsp <span class="correct-color">恭喜你，成功通过考试！</span></p>
        <p v-else >得分：{{finalScore}} 分&nbsp&nbsp<span class="error-color">很遗憾，您未通过本考试！</span></p>
        <p>错误：<span class="error-color">{{errorCount}}&nbsp</span>题</p>
        <p>正确：<span class="correct-color">{{correctCount}}&nbsp</span>题</p>
        <p>未答：{{totalCount-correctCount-errorCount}}&nbsp题</p>
      </div>
      <div class="preTipBtn">
        <Button size="large" class="operate-btn" @click="oneMoreTime">再考一次</Button>
        <Button size="large" class="operate-btn" @click="backToHomePage">回到首页</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import collapseTransition from './../my-components/collapseTransition'
import CountDown from './../my-components/count-down.vue'
import {getExamQuestions,handInExam} from '@/api/questions'
import {timestampToTime} from '@/libs/util'
import {mediaURL} from '@/config'
import vueAudio from './../my-components/vue-audio.vue'
import * as constant from './../my-components/constant'
export default {
  name: 'mock-exam',
  components:{
    collapseTransition,
    CountDown,
    vueAudio
  },
  data () {
    return {
      questionType:'exercise',
      questionList:[],
      totalCount:0,
      correctCount:0, //回答正确题目数
      errorCount:0, //回答错误题目数
      answerList:[], //答案列表
      currentQuestion:{},
      currentQuestionIndex:1,
      IsAnswerSheetOpen:true,
      IsExplanOpen:false,
      preTipModalShow:true,
      currentTime:'',
      endTime:'',
      handExamModalShow:false,
      ExamMinute:0,
      hasSubmitExam:false,//是否提交了试卷
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
    //所选的科目
    ...mapState({
      'choosedSubject': state => state.app.choosedSubject
    }),
    finalScore:function () {
      if (this.totalCount>0){
       return (this.correctCount/this.totalCount)*100;
      }else{
        return 0;
      }
    },
    subjectText:function () {
      if (this.choosedSubject===1){
        return '科目一'
      }else{
        return '科目四'
      }
    
    },
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
    },
    
  },
  mounted () {
    this.getQuestionsPagedList();
  },
  methods:{
    countDownStart:function(a){
      console.log('callBack--'+a+'--开始倒计时结束回调');
    },
    countDownEnd(end){
      alert('答题结束')
      let handleTime;
      if (this.choosedSubject===1){ //科目一45 分钟  科目四 30分钟
        handleTime=this.currentTime + 1000*60*45;
      }else{
        handleTime=this.currentTime + 1000*60*30;
      }
      this.handExam(handleTime);
    },
    toggleAnswerSheet(){
      this.IsAnswerSheetOpen=!this.IsAnswerSheetOpen;
    },
    toggleExplan(){
      this.IsExplanOpen=!this.IsExplanOpen;
    },
    async getQuestionsPagedList(){
      const params= {s_Subject:this.choosedSubject};
      const res= await getExamQuestions(params);
      this.questionList=res.data;
      this.totalCount =  this.questionList.length;
      for (let j=0;j< this.totalCount;j++){
        this.answerList.push({subIndex:j,cusAnswer:'',IsAnswered:false,IsCorrect:true});
      }
      this.currentQuestion =   this.currentQuestion=this.questionList[this.currentQuestionIndex-1];
    },
    preQuestion(){
      if (this.currentQuestionIndex>1){
        this.currentQuestionIndex--;
        this.currentQuestion =   this.currentQuestion=this.questionList[this.currentQuestionIndex-1];
        this.resetAudioToPause();//重置音频播放按钮
      }
    },
    nextQuestion(){
      if (this.currentQuestionIndex!==this.totalCount){
        this.currentQuestionIndex++;
        this.currentQuestion =   this.currentQuestion=this.questionList[this.currentQuestionIndex-1];
        this.resetAudioToPause();//重置音频播放按钮
      }
    },
    turnTo(index){
      if (index!==this.currentQuestionIndex){
        this.currentQuestionIndex=index;
        this.currentQuestion =   this.currentQuestion=this.questionList[this.currentQuestionIndex-1];
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
      if(this.currentQuestion.QuesTypeText==='多选'){
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
    startAnswer:function () {

      let nowTime = new Date();
      this.currentTime = new Date().getTime();
      if (this.choosedSubject===1){ //科目一45 分钟  科目四 30分钟
        nowTime.setMinutes (nowTime.getMinutes () + 45);
      }else{
        nowTime.setMinutes (nowTime.getMinutes () + 30);
      }
   
      this.endTime = nowTime.getTime();
      this.preTipModalShow  = false;
  
    },
    //交卷
    async handExam(handExamTime){
      if (handExamTime==='handIn'){
        handExamTime=new Date().getTime();
      }
      this.ExamMinute = Math.round((handExamTime- this.currentTime)/1000/60)
      let params = {
        Correct:this.correctCount,
        Wrong:this.errorCount,
        Score:this.finalScore,
        Subject:this.choosedSubject,
        StartTime:timestampToTime(this.currentTime),
        EndTime:timestampToTime(handExamTime),
        ExamMinute: this.ExamMinute
      };
      let res = await handInExam(params);
      if (res.status===0){
        this.$Message.success('提交成功!');
        this.handExamModalShow=true;
        this.hasSubmitExam=true;
      }
    },
    oneMoreTime(){
      this.$router.go(0)
    },
    backToHomePage(){
      this.$router.push({
        name: 'home'
      })
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
    span{
      font-size: 20px;
      color: #747274;
    }
  }
  .exam-time{
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
      border-top: 1px solid #e9e9e9;
      .answer-sheet-title{
        padding:20px 28px 15px;
        text-align:left;
        font-size:20px;
        color: #868486;
      }
      .answer-sheet{
        border-left: 1px solid #e9e9e9;
        border-top: 1px solid #e9e9e9;
        width:900px;
        margin-left:28px;
        overflow: hidden;
        color:#464446;
        .answer-item{
          display:inline-block;
          width: 4%;
          line-height: 30px;
          border-right: 1px solid #e9e9e9;
          border-bottom: 1px solid #e9e9e9;
          cursor:pointer;
          font-size:16px;
        }
      }
    }

    .detailed-explan-title{
       border-top: 1px solid #e9e9e9;
       margin-top:10px;
       text-align:left;
       .answer-judgement{
         padding:20px;
         font-size: 20px;
         color:#747274;
    
       }
      .detailed-explan{
        padding:20px;
        font-size: 20px;
        line-height: 22px;
        color: #bc6518;
      }
    }
   
  }
}
  .preTipText{
    padding:15px 30px 0;
    text-align:left;
    font-size:18px;
    color: #868486;
    line-height:32px;
  }
  .preTipBtn{
    text-align: center;
    padding:20px;
  }
  .examFinalText{
    padding:20px 30px 0;
    text-align:center;
    font-size:18px;
    color: #868486;
    line-height:35px;
  }
</style>
