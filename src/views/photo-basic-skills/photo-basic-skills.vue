<template>
  <div>
    <div class="main-container">
      <div class="photo-basic-skills"  v-for="(item,index) in basicSkillList">
        <div class="item">
          <div class="title">
            {{index+1}}、{{item.BasicName}}
            <!--<audio :src="baseURL+item.ExpAudio" controls="controls"></audio>-->
            <vue-audio :source="mediaURL+item.ExpAudio"
                       :mode="mode"
                       @timeupdate="timeupdate"
                       @playing="playing"
                       @pause="pause"
                       @ended="ended"
                       @waiting="waiting"
                       @error="error"
                       >
              <div class="player">
                <svg class="progress" :width="svgOptions.width" :height="svgOptions.height">
                  <path :fill="svgOptions.fill" :stroke="svgOptions.stroke" :stroke-width="svgOptions.strokeWidth"></path>
                </svg>
                <a class="play" href="javascript:void(0)">
                </a>
              </div>
            </vue-audio>
          </div>
          <div class="photos">
            <Row>
              <Col span="6">
                <img :src="mediaURL+item.Pic1" alt="">
              </Col>
              <Col span="6">
                <img :src="mediaURL+item.Pic2" alt="">
              </Col>
              <Col span="6">
                <img :src="mediaURL+item.Pic3" alt="">
              </Col>
              <Col span="6">
                <img :src="mediaURL+item.Pic4" alt="">
              </Col>
            </Row>
  
          </div>
          <div class="explain">
            {{item.Explain}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {basicSkills} from '@/api/questions'
import {mediaURL} from '@/config'
import vueAudio from './../my-components/vue-audio.vue'
import * as constant from './../my-components/constant'
export default {
  name: 'photo-basic-skills',
  components:{
    vueAudio
  },
  data () {
    return {
      questionType:'exercise',
      basicSkillList:[{
        BasicName: "禁止标志",
        ExpAudio: "/Files/ExpAudio/131806882806917228.1.mp3",
        Explain: "红色图标代表禁止，图一，禁止停车，图二，可以临时停车，禁止长时间停车，图三停车让行，图四，减速让行",
        Pic1: "/Files/ExpImage/131806794490000598.846400.jpg",
        Pic2: "/Files/ExpImage/131806794490020130.846500.jpg",
        Pic3: "/Files/ExpImage/131806794490020130.845000.jpg",
        Pic4: "/Files/ExpImage/131806794490029896.845100.jpg"
      }],
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

  },
  mounted () {
    this.getBasicSkills();
  },
  methods:{
    async getBasicSkills(){
      this.$Spin.show();
      const res= await basicSkills({});
      this.basicSkillList = res.data;
      setTimeout(() => {
        this.$Spin.hide();
      }, 600);
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
.photo-basic-skills{
  padding:20px;
  .item{
    .title{
      line-height:90px;
      text-align:left;
      font-size:30px;
      color: #747274;
    }
    .photos{
      img{
       height:150px;
      }
    
    }
    .explain{
      padding:20px 0;
      text-align: left;
      font-size:18px;
      color:#bc6518;
    }
  }
  
}

</style>
