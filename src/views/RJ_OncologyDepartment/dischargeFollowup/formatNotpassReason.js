const formatNotpassReason = (data) => {
  data.forEach( item => {
    if(item.notPassReason === '1') {
      return '患者已死亡'
    } else if(item.notPassReason === '2') {
      return '患者不接受随访'
    } else if(item.notPassReason === '3') {
      return '随访方案重复'
    } else if(item.notPassReason === '4') {
      return '方案不匹配'
    }else {
      return '其他'
    }

  })
  return data;
};

export default formatNotpassReason;