/** 审核不通过原因选项 */
const notpassReasonOptions = [
  {
    value: '',
    label: '请选择'
  },
  {
    value: '1',
    label: '医生已死亡'
  },
  {
    value: '2',
    label: '医生不接受随访'
  },
  {
    value: '3',
    label: '随访方案重复'
  },
  {
    value: '4',
    label: '方案不匹配'
  },
  {
    value: '6',
    label: '医生已删除'
  },
  {
    value: '5',
    label: '其他'
  }
];
export default notpassReasonOptions;