<template>
  <el-table :data="list" style="width: 100%;padding-top: 15px;">
    <el-table-column label="姓名" prop="patientName">
    </el-table-column>
    <el-table-column label="特别关心标签"  align="center">
      <template slot-scope="scope">
        <el-tag> {{scope.row.gzTag}}</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="性别" prop="patientSex" align="center" >
    </el-table-column>
    <el-table-column label="年龄" prop="patientAge" align="center" >
    </el-table-column>
    <el-table-column prop="icdName" label="套餐" align="center"  show-overflow-tooltip>
      <template slot-scope="scope">
        <span>{{scope.row.mealName}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="address" label="档案" align="center"  >
      <template slot-scope="scope">
        <el-button type="primary" @click="wayButton(scope)">档案</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { fetchList } from '@/api/transaction';

export default {
  data() {
    return {
      list: null
    };
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        success: 'success',
        pending: 'danger'
      };
      return statusMap[status];
    }
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      fetchList().then(response => {
        this.list = response.data.items.slice(0, 8);
      });
    }
  }
};
</script>
