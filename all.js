const app = new Vue ({
  el: '#app',
  data: {
    title: {}, //標題
    description: '', //測驗簡介
    degree: {}, //分數
    traits: [], //特質
    problemList: {}, //各類型未分開資料
    questionList: [], //各類型分類資料
    questions: [], //所有問題列表
    questionIndex: 0,
    resultList: [],
    result: false,
    isDisabled: true,
    isCheck: false,
    resultIndex: 0,
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      const api = 'https://raw.githubusercontent.com/hexschool/js-training-task/master/api/BigFive.json';
      axios.get(api)
        .then( res => {
          const { name, description, degree, traits, problemList} = res.data;
          this.title = name;
          this.description = description;
          this.degree = degree;
          this.traits = traits;
          this.problemList = problemList;
          for(index in this.problemList) {
            this.questionList.push ({
              category: index,
              categoryZH: this.problemList[index].name,
              description: this.problemList[index].description,
              score: [0, 0],
            });
            this.problemList[index].problems.forEach( item => {
              this.questions.push({
                id: item.id,
                category: item.category,
                problem: item.problem,
                options: item.options,
              });
            });
          };
          // 把選項排序反轉
          this.questions.forEach(item => {
            item.options.reverse();
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    nextPage(id) {
      this.isDisabled = true;
      const check = document.querySelector(`[name="${id}"]:checked`);
      if (check) {
        this.isCheck = true;
        this.questionIndex += 1;
      };
    },
    showResult(id) {
      this.isDisabled = true;
      const check = document.querySelector(`[name="${id}"]:checked`);
      if (check) {
        this.isCheck = true;
        this.result = true;
        for (index in this.questionList) {
          const data = this.questionList[index];
          const scoreTotal = data.score.reduce((pre, cur) => pre + cur, 0);
          if (scoreTotal <= 5 ) {
            this.resultList.push({
              score: scoreTotal,
              degree: '低',
              category: data.categoryZH,
              categoryEN: data.category,
              description: data.description,
            });
          } else if (scoreTotal == 6) {
            this.resultList.push({
              score: scoreTotal,
              degree: '中',
              category: data.categoryZH,
              categoryEN: data.category,
              description: data.description,
            });
          } else {
            this.resultList.push({
              score: scoreTotal,
              degree: '高',
              category: data.categoryZH,
              categoryEN: data.category,
              description: data.description,
            });
          };
        };
      } else {
        this.isCheck = false;
        return alert('請選擇一個項目');
      };
    },
    nextResult() {
      if (this.resultIndex === 4) {
        const result = confirm('是否重新開始測驗？');
        if (result) {
          this.reset();
        };
      } else {
        this.resultIndex += 1;
      };
    },
    reset() {
      this.result = false;
      this.resultIndex = 0;
      this.questionIndex = 0;
      this.resultList = [];
      this.questionList = [];
      this.getData();
    },
    isDisabledBtn() {
      this.isDisabled = false;
    },
    closeList() {
      $('.navbar-collapse').collapse('hide');
    }
  },
});