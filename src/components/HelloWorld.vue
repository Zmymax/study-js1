<template>
  <div>
   <van-button type="default" @click="onClick">新增记账</van-button>
         <!-- 类型数字转换成对应的中文在vant-ui里使用v-if做不到，在element-ui里告诉你使用过两种方式的,另一种是filter,回去参考下，这个可以最后完成，先把基础的列表学会使用 -->
   <!-- list使用举例 -->
  <!--  <van-list>
      <van-cell
        v-for="(item,index) in sampleList"
        :key="index"
        :title='"类型:"+item.type' 
        :label='"日期:"+item.date'
        :value='"￥"+item.amount'
      />
    </van-list> -->

   <van-dialog
    v-model="show"
    :before-close="onDialogClose"
    show-cancel-button
    confirmButtonText="保存"
    >
      <van-cell value="消费金额" />
      <van-cell-group>
      <van-field type="number" v-model="money" placeholder="请输入金额" />
      </van-cell-group>
      <van-cell value="消费类型" />
      <van-radio-group v-model="radio" >
      <van-radio v-model="radio" name="1">餐饮</van-radio>
      <van-radio v-model="radio" name="2">生活用品</van-radio>
      <van-radio v-model="radio" name="3">交通</van-radio>
      <van-radio v-model="radio" name="4">通讯费</van-radio>
      <van-radio v-model="radio" name="5">零食</van-radio>
      <van-radio v-model="radio" name="6">水果</van-radio>
      
      </van-radio-group>
      
  </van-dialog>
  
   
   <van-field 
   v-model="startValue" 
   placeholder="开始日期"
   readonly
   label="开始日期"
   @click="showStartTime()" />

   <van-field 
   v-model="endValue" 
   placeholder="结束日期"
   readonly
   label="结束日期"
   @click="showEndTime()" />
 
   <van-popup v-model="showStart"
    position="bottom"
    :style="{height:'40%'}">
      <van-datetime-picker
      v-model="startDate"
      type="date"
      :max-date="currentTime"
      @cancel="cancelFn()"
      @confirm="confirmStartFn()" />
    </van-popup>

    <van-popup v-model="showEnd"
    position="bottom"
    :style="{height:'40%'}">
      <van-datetime-picker
      v-model="endDate"
      type="date"
      :min-date="startDate"
      :max-date="currentTime"
      @cancel="cancelFn()"
      @confirm="confirmEndFn()" />
    </van-popup>
    <van-button @click="query">查询</van-button>
  
    
    <!-- 在vant-ui中如果没有表格，寻找另外的组件显示记账列表，例如list  https://youzan.github.io/vant/#/zh-CN/list 和https://youzan.github.io/vant/#/zh-CN/cell -->

    <!-- el-tag也是element-ui才有的组件，vant-ui没有，不能使用 -->
    <!-- scope.row这种写法是element-ui表格里的方式，在vant-ui里是不能使用的 -->
    <!-- 
      <van-row>
        <van-col span="8">消费类型</van-col>
           <template slot-scope="scope">
              
              <el-tag v-if="scope.row.type===1">餐饮</el-tag>
              <el-tag v-if="scope.row.type===2" type="success">交通</el-tag>
              <el-tag v-if="scope.row.type===3" type="info">生活用品</el-tag>
              <el-tag v-if="scope.row.type===4" type="warning">通讯费</el-tag>
              <el-tag v-if="scope.row.type===5" type="danger">零食</el-tag>
              <el-tag v-if="scope.row.type===6" type="danger">水果</el-tag>
            </template>
        <van-col span="8">消费金额</van-col>
        <van-col span="8">创建时间</van-col>
      </van-row>
      -->
    <van-list>
       <van-cell
        v-for="(item,index) in List"
        :key="index"
        :title='"类型:"+item.type'
        :label='"日期:"+item.date'
        :value='"￥"+item.amount'
      />
    </van-list>
    

       </div>
</template>

<script>

export default {
   data() {
    return {
      startValue:'',
      endValue:'',
      currentTime:new Date(),
      startDate:new Date(),
      endDate:new Date(),
      showStart:false,
      showEnd:false,
   
      money:'',
      show:false,
      radio:1,
      allData:[],
      sampleList:[
        {amount:100,type:1,date:"2019-08-01"},
        {amount:101,type:2,date:"2019-09-01"},
        {amount:102,type:3,date:"2019-10-01"},
        {amount:103,type:1,date:"2019-11-01"},
        {amount:104,type:2,date:"2019-12-01"},
      ],
      List:[]

    }
  },
created: function () {
      var records=localStorage.getItem('allRecord')
      this.List=JSON.parse(records)
    },

  methods: {
     onClick(){
       this.show=true;
     },
     showStartTime(){
      this.showStart=true;
     },
     showEndTime(){
      this.showEnd=true;
     },
     confirmStartFn(){
      this.startValue=this.timeFormat(this.startDate);
      this.showStart=false;
     },
     confirmEndFn(){
      this.endValue=this.timeFormat(this.endDate);
      this.showEnd=false;
     },
     cancelFn(){
      this.showStart=false;
     },
     timeFormat(time){
      let year=time.getFullYear();
      let month=time.getMonth()+1;
      let day=time.getDate();
      return year+'年'+month+'月'+day+'日'
     },
     onDialogClose(action, done){
        
        //时间选择器还存在问题，自己解决掉。
        if (action==='confirm') {//action===confirm表示点击了确定
          //在此处保存记账
          var exists=JSON.parse(localStorage.getItem('allRecord'))
          //有可能查询出来数据是空，如果是空的先初始化数组，避免报错
          if (exists===null) {
            exists=[]
          }
          var record={timestamp:new Date().getTime(),type:parseInt(this.radio),
          amount:parseInt(this.money)}
          exists.push(record)
                  //保存  你来写 看不下去了
          localStorage.setItem('allRecord',JSON.stringify(exists))

                         //保存记账完成后反馈给用户
          
           done() 
           this.$notify({
            message: '恭喜你，保存成功',
            type: 'success'
          });
        }else{//其它方式关闭dialog,例如点击了取消按钮等
          console.log()
          done()
        }
        //调用done()函数，可正常关闭dialog，调用done(false),dialog将不会被关闭，参加vant-ui文档
        
     },
     query(){
      
        var emptylist=[]
        var sT=this.startDate.getTime()
        var eT=this.endDate.getTime()

        var records=JSON.parse(localStorage.getItem('allRecord'))
        console.log(records)
        //报错是length,于是查找与length相关的地址，先打印日志看看.
        //日志看到records的值是null,说明查询出来的值是空的，此时去调试界面检查数据是否确实为空
        //检查发现数据确实为空，说明你的保存数据存在问题，检查保存数据的代码
        for(var i=0;i<records.length;i++){
          var item=records[i]
          if(item.timestamp>sT&&item.timestamp<eT){
            emptylist.push(item)
          }
        }
        this.List=emptylist
       }
       
   },
   mounted(){
    this.timeFormat(new Date());
   }
   }


</script>

<style lang="less">

</style>