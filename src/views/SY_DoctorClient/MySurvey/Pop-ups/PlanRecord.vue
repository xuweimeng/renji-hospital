<style lang="scss" scoped>
   /deep/.record {
  &_dialog{
    .el-dialog__body{
      padding-top: 10px;
      border-top: 1px solid #dadada;
    }
  }
  &_box {
    .el-dialog__body {
      padding-top: 0;
    }
  }
  &_header {
    position: relative;
    &_name {
      margin: 5px 0;
      color: #409eff;
      font-size: 20px;
      font-weight: 400;
      margin-bottom: 15px;
    }
    &_sexAndage {
      font-size: 12px;
      color: #666;
      margin: 0 20px;
    }
    &_param {
      margin: 10px 0;
      font-weight: 400;
      color: #f80;
      font-size: 13px;
      line-height: 20px;
    }
  }
  &_content{
      border-top: 5px solid #f1f1f1;
      margin-top: 10px;
      padding-top: 10px;
      >h4{
          color: #333;
          font-weight: 400;
          margin: 5px 0;
      }
      &_list{
          border-top: 1px solid #dedede;
          margin-top: 15px;
          >h4{
              color: #f80;
              margin: 10px 0;
              font-weight: 400;
              font-size: 16px;
              >span{
                  font-size: 12px;
                  margin: 0 10px;
              }
          }
          >span{
              margin: 0 15px 10px 0;
          }
      }
  }
} 
</style>

<template>
    <div class="record">
        <el-dialog width="900px" top="5vh" class="record_dialog" title="计划详情" :visible.sync="recordVisible" >
            <div class="record_header">
                <h3 class="record_header_name">
                    {{baseData.brxm}}
                    <span class="record_header_sexAndage">
                        {{baseData.brxb}}/{{baseData.brage}}
                    </span>
                </h3>
                <h4 class="record_header_param">
                    联系电话: {{baseData.mobile}}
                </h4>
                <h4 class="record_header_param">
                    医疗组/科室: {{baseData.departmentName||baseData.medGpName}}
                </h4>
                <h4 class="record_header_param">
                    出院时间/就诊时间: {{baseData.diagnoseTime}}
                </h4>
            </div>
           
            <div class="record_content">
                <h4 v-show="planInfo.orderList.length>0">随访方案 : {{planInfo.questionTempleName}} </h4>
                <h4 v-show="planInfo.orderList.length>0">随访次数 : 共{{planInfo.allCount}}次</h4>
                <div class="record_content_list" v-for="(item,index) in planInfo.orderList" :key="index">
                    <h4>第{{index+1}}次随访: 
                        <span>开始时间 :{{item.dateBegin}}</span>   
                        <el-tag type="warning">{{item.statusStr}}</el-tag>
                    </h4>
                    <template v-for="(ite,ins) in item.CollectionIndex.split(',')" v-show="ite" >
                        <el-tag v-if="ite" :key="ins" type="primary">{{ite}}</el-tag>
                    </template>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data(){
        return{
           recordVisible:false, 
        }
    },
    props:{
        baseData:{
            type:Object,
            default:()=>{
                return {};
            }
        },
        planInfo:{
            type:Object,
            default:()=>{
                return {
                   orderList:[] 
                };
            }
        },
    }
}
</script>

