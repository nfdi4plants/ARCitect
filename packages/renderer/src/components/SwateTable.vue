<script lang="ts" setup>

import { reactive, h, watch } from 'vue';

import {OntologyAnnotation} from '@nfdi4plants/arctrl/ISA/ISA/JsonTypes/OntologyAnnotation.js';
import {CompositeHeader,IOType} from '@nfdi4plants/arctrl/ISA/ISA/ArcTypes/CompositeHeader.js';

import SwateCell from '../components/SwateCell.vue';

import HeaderDialog from '../dialogs/HeaderDialog.vue';
import { useQuasar } from 'quasar'
const $q = useQuasar();

export interface Props {
  table: Object,
  search_by_parent_term: Boolean
};
const props = defineProps<Props>();

const iProbs = reactive({
  rows: [],
  cols: [],
  rowWatcher: ()=>{},
  refresh_hack: 0
});

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

const editHeader = async (idx,insertHeader) => {
  const header = insertHeader ? new CompositeHeader(3,[OntologyAnnotation.fromString('')]) : props.table.Headers[idx];

  $q.dialog({
    component: HeaderDialog,
    componentProps: {header:header, insertHeader: insertHeader}
  }).onOk( async operation => {
    if(operation.delete){
      props.table.RemoveColumn(idx);
    } else {
      const tag = operation.column_types.indexOf(operation.column_type);

      let new_header=null;
      if(tag<0){ // free text
        new_header = new CompositeHeader(13, [operation.column_type]);
      } else if(tag<4) { // term columns
        new_header = new CompositeHeader(tag,[operation.term]);
      } else if(tag<11){ // headers that do not require arguments
        new_header = new CompositeHeader(tag);
      } else if(tag<13){ // io type headers
        const io_tag = operation.io_types.indexOf(operation.io_type);
        const io = io_tag<0
          ? new IOType(6, [operation.io_type])
          : new IOType(io_tag);
        new_header = new CompositeHeader(tag, [io]);
      }
      if(insertHeader){
        props.table.AddColumn(new_header, null, idx, false);
      } else {
        props.table.UpdateHeader(idx, new_header, true);
      }
    }
  });
};

import ContextMenu from '@imengyu/vue3-context-menu'

const refresh_hack = ()=>{
  iProbs.refresh_hack = !iProbs.refresh_hack;
};

const onHeaderContextMenu = (e,cell) => {
  e.preventDefault();

  ContextMenu.showContextMenu({
    x: e.x,
    y: e.y,
    theme: 'flat',
    items: [
      {
        label: "Add Row",
        icon: h(
          'i',
          {
            class: 'q-icon on-left notranslate material-icons',
            role:'img',
            style:{fontSize: '1.5em',color:'#333'}
          },
          ['vertical_align_bottom']
        ),
        onClick: ()=>{
          props.table.AddRowsEmpty(1,0)
          refresh_hack();
        }
          ,
        divided: true,
      },
      {
        label: "Add Header Before",
        icon: h(
          'i',
          {
            class: 'q-icon on-left notranslate material-icons',
            role:'img',
            style:{fontSize: '1.5em',color:'#333',transform:'rotate(180deg)'}
          },
          ['keyboard_tab']
        ),
        onClick: () =>editHeader(cell.col.idx,true)
      },
      {
        label: "Add Header After",
        icon: h(
          'i',
          {
            class: 'q-icon on-left notranslate material-icons',
            role:'img',
            style:{fontSize: '1.5em',color:'#333'}
          },
          ['keyboard_tab']
        ),
        onClick: () =>editHeader(cell.col.idx+1,true)
      },
    ]
  });
};

const onCellContextMenu = (e,cell) => {
  e.preventDefault();

  ContextMenu.showContextMenu({
    x: e.x,
    y: e.y,
    theme: 'flat',
    items: [
      {
        label: "Add Row Above",
        icon: h(
          'i',
          {
            class: 'q-icon on-left notranslate material-icons',
            role:'img',
            style:{fontSize: '1.5em',color:'#333'}
          },
          ['vertical_align_top']
        ),
        onClick: ()=>{props.table.AddRowsEmpty(1,cell.rowIndex);refresh_hack()}
      },
      {
        label: "Add Row Below",
        icon: h(
          'i',
          {
            class: 'q-icon on-left notranslate material-icons',
            role:'img',
            style:{fontSize: '1.5em',color:'#333'}
          },
          ['vertical_align_bottom']
        ),
        onClick: ()=>{props.table.AddRowsEmpty(1,cell.rowIndex+1);refresh_hack()},
        divided: true,
      },
      {
        label: "Delete Row",
        icon: h(
          'i',
          {
            class: 'q-icon on-left notranslate material-icons',
            role:'img',
            style:{fontSize: '1.5em',color:'#333'}
          },
          ['delete']
        ),
        onClick: () =>{props.table.RemoveRow(cell.rowIndex);refresh_hack();}
      },
    ]
  });
};

</script>

<template>
  <q-table
    :virtual-scroll-slice-size="iProbs.refresh_hack"
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
      <q-th
        class='swate_th'
        :props="cell_props"
        @contextmenu='e=>onHeaderContextMenu(e,cell_props)'
      >
        <div style="position:relative;">
          <div style="padding:0 0.5em;" @dblclick='editHeader(cell_props.col.idx)'>
            {{cell_props.col.label}}
          </div>
          <!--<q-icon v-if='cell_props.col.idx<cell_props.col.table.ColumnCount-1' size='2em' name='add_circle' class='add_column_icon' color='secondary' @click='editHeader(cell_props.col.idx+1,true)'></q-icon>-->
        </div>
      </q-th>
    </template>

    <template v-slot:body-cell="cell_props">
      <q-td
        :props="cell_props"
        @contextmenu='e=>onCellContextMenu(e,cell_props)'
      >
        <SwateCell
          :table='props.table || {}'
          :cell='cell_props.value'
          :rIdx='cell_props.rowIndex'
          :cIdx='cell_props.col.idx'
          :search_by_parent_term='props.search_by_parent_term'
        />
      </q-td>
    </template>
  </q-table>
</template>

<style>

  .swate tr td {
    margin: 0 !important;
    padding: 0 !important;
  }

  .add_column_icon {
    opacity: 0.0000001;
    position:absolute !important;
    right:-0.85em;
    top:-0.1em;
  }
  .add_column_icon:hover {
    opacity: 1;
  }
</style>
