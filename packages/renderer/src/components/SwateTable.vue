<script lang="ts" setup>

import { reactive, h } from 'vue';

export interface Props {
  table: Object
};
const props = defineProps<Props>();

const getColumns = table=>{
  if(!Object.keys(table).length) return [];
  const columns = [];
  let cIdx = 0;
  for(let c of table.Columns){
    let name = c.Header.toString();
    columns.push( { idx:cIdx, label: name, field: cIdx, align: 'left', headerStyle: "font-weight: bold", header:c.Header, table: table} );
    cIdx++;
  }
  return columns;
};

const getRows = table=>{
  if(!Object.keys(table).length) return [];
  const rows = [];
  for(let rIdx=0; rIdx<table.RowCount; rIdx++){
    const row = table.GetRow(rIdx);
    row.id = rIdx;
    rows.push(row);
  }
  return rows;
};

</script>

<template>
  <q-table
    class='q-ma-sm swate'
    :columns="getColumns(props.table)"
    :rows="getRows(props.table)"
    row-key="id"
    :rows-per-page-options='[0]'
    separator="cell"
    dense
    hide-bottom
  >
    <template v-slot:header-cell="cell_props">
      <q-th :props="cell_props">{{cell_props.col.label}}</q-th>
    </template>

    <template v-slot:body-cell="cell_props">
      <q-td :props="cell_props">{{cell_props.value}}</q-td>
    </template>
  </q-table>
</template>

<style>
.swate td {
  border:0.1em solid #eee !important;
}
.swate th {
  border:0.1em solid #eee !important;
  background-color: #eee !important;
}
.swate th:first-child {
  border-radius: 1em 0 0 0;
}
.swate th:last-child {
  border-radius: 0 1em 0 0;
}

.swate {
  padding: 0em 2em;
  border-collapse: collapse;
}

</style>