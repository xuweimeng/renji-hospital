// 审核不通过原因
const formatNotpassReason = (data) => {
  data.forEach(item => {
    if(item.notPassReason === '1') {
      item.notPassReason = '患者已死亡'
    } else if(item.notPassReason === '2') {
      item.notPassReason =  '患者不接受随访'
    } else if(item.notPassReason === '3') {
      item.notPassReason =  '随访方案重复'
    } else if(item.notPassReason === '4') {
      item.notPassReason =  '方案不匹配'
    }else {
      item.notPassReason =  '其他'
    }
  })
}

export default formatNotpassReason;