<template>
  <div>

    </style>
    <div class="top-banner">
      <div style="width:1200px;height:180px;margin:0 auto;align-items:center;justify-content:center;display:flex;">

        <img
          src="./../../images/xc_l.png"
          style="width:300px;"
        >
        <img
          src="./../../images/logo_r.png"
          style="width:150px;margin:15px 0px 10px 450px;"
        >
      </div>
    </div>
    <div class="main-container">
      <Row class="subject-choose">
        <Col
          span="12"
          class="subject-item"
          :class="choosedSubject==1&&'choosed'"
        >
        <div @click="changeSubject(1)">
          科目一
        </div>
        </Col>
        <Col
          span="12"
          class="subject-item"
          :class="choosedSubject==4&&'choosed'"
        >
        <div @click="changeSubject(4)">
          科目四
        </div>
        </Col>
      </Row>
      <Row>
        <Col
          span="6"
          v-for="(item,index) in subList"
          :key="index"
          class="subject-warapper"
        >
        <subject-item
          :bgClass="item.bgClass"
          :subjectName="item.subjectName"
          :choosedSubject="choosedSubject"
        ></subject-item>
        </Col>
      </Row>
    </div>
    <div class="footer">
      <div class="copyright">版权所有 ICP证：粤ICP备18145529号-1</div>
      <div> <a
          target="_blank"
          href="http://www.beian.gov.cn/portal/registerSystemInfo?spm=5176.8087400.631162.108.31fe15c96UGiFY&recordcode=44150202000124"
          style="display:inline-block;text-decoration:none;height:20px;line-height:20px;"
        ><img
            style="float: left; width: 20px;"
            src='./../../images/police.png'
          > <span style="float:left;height:20px;line-height:20px;margin: 0px 0px 0px 5px; color:#e6e5e5;font-size:14px;">广公网安备44150202000124号</span></a></div>

    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import subjectItem from "./../my-components/subject-item.vue";
export default {
  name: "home",
  components: {
    subjectItem
  },
  data() {
    return {
      subjectList: [
        {
          bgClass: "free-trial",
          subjectName: "免费试学"
        },
        {
          bgClass: "photo-basic",
          subjectName: "图片基础知识"
        },
        {
          bgClass: "judge",
          subjectName: "判断题"
        },
        {
          bgClass: "single-choice",
          subjectName: "单选题"
        },
        {
          bgClass: "technique",
          subjectName: "答题技巧"
        },
        {
          bgClass: "simplify",
          subjectName: "精简题"
        },
        {
          bgClass: "normal-exercise",
          subjectName: "常规练习"
        },
        {
          bgClass: "mock-exam",
          subjectName: "模拟考试"
        }
      ],
      subjectList2: [
        {
          bgClass: "free-trial",
          subjectName: "免费试学"
        },
        {
          bgClass: "multi-choice",
          subjectName: "多选题"
        },
        {
          bgClass: "judge",
          subjectName: "判断题"
        },
        {
          bgClass: "single-choice",
          subjectName: "单选题"
        },
        {
          bgClass: "technique",
          subjectName: "答题技巧"
        },
        {
          bgClass: "simplify",
          subjectName: "精简题"
        },
        {
          bgClass: "normal-exercise",
          subjectName: "常规练习"
        },
        {
          bgClass: "mock-exam",
          subjectName: "模拟考试"
        }
      ]
    };
  },
  computed: {
    ...mapState({
      choosedSubject: state => state.app.choosedSubject
    }),
    subList: function() {
      if (this.choosedSubject == 1) return this.subjectList;
      else if (this.choosedSubject == 4) return this.subjectList2;
    }
  },
  mounted() {},
  methods: {
    changeSubject(subjectIndex) {
      this.$store.commit("setCurrentSubject", subjectIndex);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.top-banner {
  background-color: #a8b5ef;
}
.subject-choose {
  top: -5px;
  margin: 15px 25px 0;
  font-size: 24px;
  line-height: 50px;
  color: #7088ef;
  border: 1px solid #f5f9ff;
  .choosed {
    background-color: #e5e9fd;
    color: #323233;
  }
  .subject-item {
    cursor: pointer;
  }
}
.subject-warapper {
  text-align: center;
  text-align: -webkit-center;
  text-align: -moz-center;
  padding-top: 40px;
}
.footer {
  margin-top: 100px;
  min-height:182px;
  padding:60px 0 50px;
  background-color: #373d41;
  .copyright {
    color: #9fa7ad;
    font-size: 14px;
    margin-top: 10px;
  }
}
</style>
