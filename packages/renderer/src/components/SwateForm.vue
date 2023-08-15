<script lang="ts" setup>

import { onMounted, ref, reactive, watch } from 'vue';

import ViewItem from '../components/ViewItem.vue';

import AppProperties from '../AppProperties.ts';
import ArcControlService from '../ArcControlService.ts';

import TermDialog from '../dialogs/TermDialog.vue';
import HeaderDialog from '../dialogs/HeaderDialog.vue';
import { useQuasar } from 'quasar'
const $q = useQuasar();

import {CompositeCell} from '../../../../lib/ARCC/ISA/ISA/ArcTypes/CompositeCell.js';
import {CompositeHeader} from '../../../../lib/ARCC/ISA/ISA/ArcTypes/CompositeHeader.js';

export interface Props {
  group: String
};
const props = defineProps<Props>();

const cell_input = ref(null);

const iProps = reactive({
  sheets: [],
  active_sheet: null,
  rows: [],
  columns: [],
  edit_rIdx0: -1,
  edit_rIdx1: -1,
  edit_cIdx: -1,
  selecting: false
});

const init = async ()=>{
  iProps.assay = ArcControlService.props.arc.ISA.TryFindAssay(AppProperties.active_assay);
  if(!iProps.assay)
    return;

  iProps.sheets = iProps.assay.Tables.map(t=>t.Name);
  iProps.active_sheet = iProps.assay.Tables[0].Name;
  updateTable();
};
onMounted( init );
watch( ()=>AppProperties.active_assay, init );

const updateTable = async ()=>{
  console.log('updateTable')
  const table = iProps.assay.GetTable(iProps.active_sheet);
  console.log(table)

  const columns_ = [];
  let cIdx = 0;
  for(let c of table.Columns){
    let name = c.Header.toString();
    c.Header.cIdx = cIdx;
    columns_.push( { idx:cIdx, label: name, field: cIdx, align: 'left', headerStyle: "font-weight: bold", header:c.Header } );
    cIdx++;
  }
  iProps.columns = columns_;

  const rows_ = [];
  for(let rIdx=0; rIdx<table.RowCount; rIdx++){
    const row = table.GetRow(rIdx);
    const row_ = {id:rIdx};
    for(let cIdx=0; cIdx<row.length; cIdx++){
      const cell = row[cIdx];
      cell.rIdx = rIdx;
      cell.cIdx = cIdx;
      row_[cIdx] = cell;
    }
    rows_.push(row_);
  }
  iProps.rows = rows_;
    // for(let r of table.Columns){

    //   iProps.rows.push({ id:c.Header.toLocaleString() , align: 'center', label: c.Header.name, field: c.Header.name });
    // }

};

watch( ()=>iProps.active_sheet, updateTable );

const onReset = async ()=>{
  await ArcControlService.readARC();
  init();
};

const onSubmit = async ()=>{
  await ArcControlService.writeARC(ArcControlService.props.arc_root,['ISA_Assay']);
  await ArcControlService.readARC();
  init();
};

watch(cell_input, ()=>{
  if(cell_input.value)
    cell_input.value.focus();
});

const editFreeForm = (v,c)=>{
  console.log(v)
  const newCell = CompositeCell.createFreeText(v);
  const table = iProps.assay.GetTable(iProps.active_sheet);
  table.UpdateCellAt(c.cIdx,c.rIdx,newCell);
};

const selectionStart = cell=>{
  iProps.selecting = true;
  iProps.edit_rIdx0 = cell.rIdx;
  iProps.edit_rIdx1 = cell.rIdx;
  iProps.edit_cIdx = cell.cIdx;
  // console.log('s',cell.rIdx + " " +cell.cIdx)
}

const selectionIntermediate = cell=>{

  if(!iProps.selecting || cell.cIdx!==iProps.edit_cIdx) return;
  iProps.edit_rIdx1 = cell.rIdx;
  // console.log('ii',cell.rIdx + " " +cell.cIdx)
};

const selectionEnd = cell=>{
  iProps.selecting = false;

  if(!cell || cell.cIdx!==iProps.edit_cIdx) return;
  iProps.edit_rIdx1 = cell.rIdx;
  // console.log('e',cell.rIdx + " " +cell.cIdx)
}

const test = data=>{

  // if(!data){
  //   iProps.edit_rIdx = -1;
  //   iProps.edit_cIdx = -1;
  //   return;
  // }

  // const rIdx = data.rowIndex;
  // const cIdx = data.col.idx;

  // iProps.edit_rIdx = rIdx;
  // iProps.edit_cIdx = cIdx;






  // console.log(parent,input);


  // console.log(data);
  // const table = iProps.assay.GetTable(iProps.active_sheet);

  // const rIdx = data.rowIndex;
  // const cIdx = data.col.idx;

  // const header = table.Headers[cIdx];
  // const cell = table.GetRow(rIdx)[cIdx];

  // if(cell.isFreeText){
  //   const newValue = 'xxxxxxxxxx';
  //   const newCell = CompositeCell.createFreeText(newValue);
  //   table.UpdateCellAt(cIdx,rIdx,newCell);
  // } else if(cell.isUnitized) {

  // } else if(cell.isTerm) {

  // }
  // updateTable();

  // if(header.IsSingleColumn){
  //   const newValue = 'xxxxxxxxxx';
  //   const newCell = CompositeCell.createFreeText(newValue);
  //   table.UpdateCellAt(cIdx,rIdx,newCell);
  // } else if(header.IsTerm){
  //   if(cell.isUnitized){

  //   } else if(cell.isTerm) {

  //   }
  //   // unit vs term
  //   // const newCell = CompositeCell.createTerm(ontology_anno);
  //   // const newCell = CompositeCell.createTermFromString( termName, ts_ref, ta_number);

  // }
};

const editCell = cell => {
  if(cell.isFreeText) return;

  const table = iProps.assay.GetTable(iProps.active_sheet);

  $q.dialog({
    component: TermDialog,
    componentProps: {cell: cell, header:table.GetColumn(cell.cIdx).Header}
  }).onOk( async new_cell => {
    table.UpdateCellAt(cell.cIdx,cell.rIdx,new_cell);
    updateTable();
  });
};

const editHeader = header => {
  const table = iProps.assay.GetTable(iProps.active_sheet);
  const column = table.GetColumn(header.cIdx);

  $q.dialog({
    component: HeaderDialog,
    componentProps: {header:header, column:column}
  }).onOk( async operation => {
    if(operation.delete){
      table.RemoveColumn(header.cIdx);
    } else {

      for(const cell of column.Cells)
        console.log(cell);

      // cells
      const new_cells = [];
      if(column.Cells.length){
        const has_unit = column.Cells[0].isUnitized;
        if(operation.has_unit && !has_unit){
          console.log('add unit')
          for(const cell of column.Cells){
            console.log(cell);
            const new_cell = cell.ToUnitizedCell();
            // new_cell.fields[0] = cell.toString() || 0;
            new_cell.fields[0] = 0;
            new_cell.fields[1] = operation.unit;
            new_cells.push(new_cell);
          }
        } else if(operation.has_unit && has_unit){
          console.log('update unit')
          for(const cell of column.Cells){
            const new_cell = cell.ToUnitizedCell();
            new_cell.fields[1] = operation.unit;
            new_cells.push(new_cell);
          }
        } else if(!operation.has_unit && !has_unit){
          console.log('update no unit')
          for(const cell of column.Cells){
            new_cells.push(cell);
          }
        } else if(!operation.has_unit && has_unit){
          console.log('remove unit')
          for(const cell of column.Cells){
            new_cells.push(cell.ToTermCell());
          }
        }
      }

      // header
      console.log(operation.term_column);
      const new_header = new CompositeHeader(
        header.cases().indexOf(operation.term_column),
        [operation.name]
      );
      table.UpdateColumn(header.cIdx, new_header, new_cells);
      // if(operation.term_column==='Free Text'){
      //   header =
      // } else {
      //   header =
      // }
          // table.UpdateColumn(
          //   header.cIdx,
          //   // new CompositeHeader(3, [OntologyAnnotation.fromString("centrifugation time", "MS", "MS:0000042")])
          // );

      // console.log(operation.term_column);
      // const new_header =
    }
    updateTable();
  });
};

const isSelected = cell=>{
  return iProps.edit_cIdx===cell.cIdx
    && Math.min(iProps.edit_rIdx0,iProps.edit_rIdx1)<=cell.rIdx
    && Math.max(iProps.edit_rIdx0,iProps.edit_rIdx1)>=cell.rIdx
  ;
}
const isValid = cell=>{
  return (!cell.isTerm && !cell.isUnitized) || (cell.isTerm && cell.AsTerm.TermAccessionNumber) || (cell.isUnitized && cell.AsUnitized[1].TermAccessionNumber);
}
const isValidHeader = header=>{
  return !header.IsTermColumn || header.fields[0].TermAccessionNumber;
}

// @mousedown='selectionStart(props.value)'
//               @mouseover='selectionIntermediate(props.value)'
//               @mouseup='selectionEnd(props.value)'

</script>

<template>
  <ViewItem
    icon="newspaper"
    label="Data"
    caption="Process Information"
    :group="props.group"
    :fullWidth="true"
  >
    <q-card flat>
      <q-form
        @submit="onSubmit"
        @reset="onReset"
      >
        <q-tabs
          v-model="iProps.active_sheet"
          class="text-secondary text-bold"
          dense
          outside-arrows
          mobile-arrows
          shrink
        >
          <q-tab v-for='s of iProps.sheets' :name="s" :label='s' ripple/>
        </q-tabs>
        <br>
        <q-table
          title=""
          class='q-ma-sm swate'
          :columns="iProps.columns"
          :rows="iProps.rows"
          row-key="id"
          :rows-per-page-options='[0]'
          separator="cell"
          dense
          hide-bottom
        >
          <template v-slot:header-cell="props">
            <q-th
              class='swate_th'
              :props="props"
              @click='editHeader(props.col.header)'
            >
              <div v-if='props.col.header.IsSingleColumn'>
                {{props.col.label}}
              </div>
              <table v-else class='cell_table'>
                <tr>
                  <td>{{props.col.label}}</td>
                  <td style="text-align:right;">
                    <q-icon :name="isValidHeader(props.col.header) ? 'check_circle' : 'help'" :color='"grey-6"' size='1.3em'>
                      <q-tooltip class='text-body2'>
                        {{ isValidHeader(props.col.header) ? 'Verified Ontology Term: ' + props.col.header.fields[0].TermAccessionNumber : 'Unverified Ontology Term'}}
                      </q-tooltip>
                    </q-icon>
                  </td>
                </tr>
              </table>
            </q-th>
          </template>

          <template v-slot:body-cell="props">
            <q-td :props="props"
              @focusin="selectionStart(props.value);selectionEnd(props.value)"
              :class='"cell "+(isSelected(props.value) ? "cell_selected " : isValid(props.value) ? "cell_valid" : "cell_invalid")'
            >
                <div v-if='props.value.isTerm || props.value.isUnitized'
                  @click="editCell(props.value);"
                >
                  <table class='cell_table'>
                    <tr>
                      <td>{{props.value.toString()}}</td>
                      <td style="text-align:right;">
                        <q-icon :name="isValid(props.value) ? 'check_circle' : 'help'" :color='"grey-6"' size='1.3em'>
                          <q-tooltip class='text-body2'>
                            {{ isValid(props.value) ? 'Verified Ontology Term: ' + props.value.fields.slice(-1)[0].TermAccessionNumber : 'Unverified Ontology Term'}}
                          </q-tooltip>
                        </q-icon>
                      </td>
                    </tr>
                  </table>
                </div>
                <div v-else
                  @input="e=>editFreeForm(e.target.innerText,props.value)"
                  :contenteditable='props.value.isFreeText'
                >
                  {{props.value.toString()}}
                </div>
            </q-td>
          </template>
        </q-table>

        <q-card-actions align='right' style="padding:2.1em;">
          <q-btn label="Update" type="submit" icon='check_circle' color="secondary"/>
          <q-btn label="Reset" type="reset" icon='change_circle' color="secondary" class="q-ml-sm"/>
        </q-card-actions>
      </q-form>
    </q-card>

  </ViewItem>
</template>

<style>

  .swate td {
    margin: 0 !important;
  }

  .swate_th {
    background-color: #ebebeb !important;
  }

  .cell {
    padding:0.2em 0.8em !important;
  }

  .cell div {
    outline:0;
  }

  .cell_selected {
    background-color: #dbfffc !important;
  }

  .cell_invalid {
    background-color: #ffecd3 !important;
  }

  .cell_input {
    border:0;
    margin:0;
    padding:0.5em 0.8em;
    width:100%;
    outline:0;
    background-color: transparent;
  }

  .cell_table {
    width:100%;
  }

  .cell_table td {
    border:0 !important;
  }

</style>
