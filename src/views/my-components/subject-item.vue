<template>
  <div class="subject-btn" :class="bgClass" @click ="routeTo">
    <h3>{{subjectName}}</h3>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
export default {
  name: 'subject-item',
  props:{
    bgClass: {
      type:String,
      default:'',
    },
    subjectName:{
      type:String,
      default:'',
    },
    choosedSubject:{
      type:Number,
      default:1,
    }
  },
  data () {
    return {

    }
  },
  mounted(){

  },
  methods:{
    routeTo(){
      if (this.bgClass==='free-trial'){
        console.log(sessionStorage)
        this.$router.push({path:'/free-questions',query:{choosedSubject:this.choosedSubject}});
      }else if (this.bgClass==='photo-basic'){
        
        this.$router.push({path:'/photo-basic-skills'});
      }else if (this.bgClass==='mock-exam'){
        this.$router.push({path:'/mock-exam',query:{choosedSubject:this.choosedSubject}});
      }else{
        this.$router.push({path:'/common-subjects',query:{choosedSubject:this.choosedSubject,questionType:this.bgClass,questionTypeName:this.subjectName}});
      }
      
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.subject-btn{
  width: 150px;
  height: 150px;
  background-color: #f5f9ff;
  border-radius: 10px;
  cursor:pointer;
  box-shadow: 0 1px 6px rgba(0,0,0,.2);
  background-repeat:no-repeat;
  background-position: center;
  &:hover{
    background-color: #f1f1f1;
  }
  h3{
    font-size: 20px;
    font-weight: bold;
    font-stretch: normal;
    line-height: 64px;
    color: #323233;
    position:relative;
    top:-48px;
  }
}
.photo-basic{
  background-image:url(./../../images/photo-basic.png);
background-repeat:no-repeat; background-size:100% 77%;
}
.keyword{
  background-image:url(./../../images/keyword.png);
}
.technique{
  background-image:url(./../../images/technique.png);
}
.normal-exercise{
  background-image:url(./../../images/normal-exercise.png);
}
.mock-exam{
  background-image:url(./../../images/mock-exam.png);
}
.deepen-memory{
  background-image:url(./../../images/deepen-memory.png);
}
.simplify{
  background-image:url(./../../images/simplify.png);
}
.free-trial{
  background-image:url(./../../images/free-trial.png);
}
.single-choice{
  background-image:url(./../../images/single-choice.png);
}
.multi-choice{
  background-image:url(./../../images/multi-choice.png);
}
.judge{
  background-image:url(./../../images/judge.png);
}

</style>
