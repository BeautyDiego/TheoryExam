import {setChoosedSubjectInsessionStorage,getChoosedSubjectInsessionStorage} from '@/libs/util'
export default {
  state: {
    choosedSubject: 1,
  },
  mutations: {
    setCurrentSubject (state,choosedSubject ) {
      if (choosedSubject){
        state.choosedSubject = choosedSubject;
        setChoosedSubjectInsessionStorage(choosedSubject);
      }else{
        state.choosedSubject = getChoosedSubjectInsessionStorage();
      }
    },
  }
}
