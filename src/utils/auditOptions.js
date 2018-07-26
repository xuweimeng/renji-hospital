/** 审核不通过原因选项 */
const auditOptions = [
  {
    value: '',
    label: '请选择'
  },
  {
    //审核不通过options
    value: '1',
    label: '患者已死亡'
  },
  {
    value: '2',
    label: '患者不接受随访'
  },
  {
    value: '3',
    label: '随访方案重复'
  },
  {
    value: '4',
    label: '方案不匹配'
  }
]
export default auditOptions