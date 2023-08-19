<script lang="ts" setup>

import { onMounted, ref, reactive, watch } from 'vue';

import ViewItem from '../components/ViewItem.vue';

import AppProperties from '../AppProperties.ts';
import ArcControlService from '../ArcControlService.ts';

import TermDialog from '../dialogs/TermDialog.vue';
import StringDialog from '../dialogs/StringDialog.vue';
import HeaderDialog from '../dialogs/HeaderDialog.vue';
import { useQuasar } from 'quasar'
const $q = useQuasar();

import {CompositeCell} from '../../../../lib/ARCC/ISA/ISA/ArcTypes/CompositeCell.js';
import {CompositeHeader} from '../../../../lib/ARCC/ISA/ISA/ArcTypes/CompositeHeader.js';
import {ArcTable} from '../../../../lib/ARCC/ISA/ISA/ArcTypes/ArcTable.js';

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
  edit_cIdx0: -1,
  edit_cIdx1: -1
});

const init = async ()=>{
  iProps.assay = ArcControlService.props.arc.ISA.TryFindAssay(AppProperties.active_assay);
  if(!iProps.assay)
    return;

  iProps.sheets = iProps.assay.Tables.map(t=>t.Name);
  iProps.active_sheet = iProps.assay.Tables.length ? iProps.assay.Tables[0].Name : null;
  updateTable();
};
onMounted( init );
watch( ()=>AppProperties.active_assay, init );

const updateTable = async old_active_sheet =>{
  console.log(iProps.assay);

  if(iProps.active_sheet===null){
    iProps.columns = [];
    iProps.rows = [];
    return;
  }

  if(iProps.active_sheet === '@AddTable@'){
    $q.dialog({
      component: StringDialog,
      componentProps: {
        title: 'Add Process',
        property: 'Process Name',
        icon: 'add_box'
      }
    }).onOk( async data => {
      const table = iProps.assay.InitTable(data,iProps.assay.Tables.length);
      for(const title of ['Input','Output'])
        table.AddColumn(
          new CompositeHeader(13,[title]),
          [CompositeCell.createFreeText('')]
        );
      iProps.sheets = iProps.assay.Tables.map(t=>t.Name);
      iProps.active_sheet = iProps.assay.Tables.length ? iProps.assay.Tables[0].Name : null;
    });
    return;
  }

  if(iProps.active_sheet === '@RemoveTable@'){
    iProps.assay.RemoveTable(old_active_sheet);
    iProps.sheets = iProps.assay.Tables.map(t=>t.Name);
    iProps.active_sheet = iProps.assay.Tables.length ? iProps.assay.Tables[0].Name : null;
    return;
  }

  const table = iProps.assay.GetTable(iProps.active_sheet);
  console.log('updateTable', table)

  const columns_ = [];
  let cIdx = 0;
  for(let c of table.Columns){
    let name = c.Header.toString();
    c.Header.cIdx = cIdx;
    columns_.push( { idx:cIdx, label: name, field: cIdx, align: 'left', headerStyle: "font-weight: bold", header:c.Header, table: table} );
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

watch( ()=>iProps.active_sheet, (new_value,old_value)=>updateTable(old_value) );

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
  const newCell = CompositeCell.createFreeText(v);
  const table = iProps.assay.GetTable(iProps.active_sheet);
  table.UpdateCellAt(c.cIdx,c.rIdx,newCell);
};

const selectionStart = cell=>{
  iProps.edit_rIdx0 = cell.rIdx;
  iProps.edit_cIdx0 = cell.cIdx;
  iProps.edit_rIdx1 = cell.rIdx;
  iProps.edit_cIdx1 = cell.cIdx;
}

const selectionEnd = cell=>{

  const r0 = Math.min(iProps.edit_rIdx0, cell.rIdx);
  const r1 = Math.max(iProps.edit_rIdx0, cell.rIdx);
  const c0 = Math.min(iProps.edit_cIdx0, cell.cIdx);
  const c1 = Math.max(iProps.edit_cIdx0, cell.cIdx);

  iProps.edit_rIdx0 = r0;
  iProps.edit_cIdx0 = c0;
  iProps.edit_rIdx1 = r1;
  iProps.edit_cIdx1 = c1;
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

      // header
      const new_header = new CompositeHeader(
        header.cases().indexOf(operation.term_column),
        [operation.term_column==='FreeText' ? operation.name.NameText : operation.name]
      );

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
            new_cells.push( new_header.IsSingleColumn ? cell.ToFreeTextCell() : cell.ToTermCell() );
          }
        } else if(!operation.has_unit && has_unit){
          console.log('remove unit')
          for(const cell of column.Cells){
            new_cells.push(cell.ToTermCell());
          }
        }
      }

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
  return iProps.edit_rIdx0 <= cell.rIdx && cell.rIdx <= iProps.edit_rIdx1
    && iProps.edit_cIdx0 <= cell.cIdx && cell.cIdx <= iProps.edit_cIdx1;
};
const isValid = cell=>{
  return (!cell.isTerm && !cell.isUnitized) || (cell.isTerm && cell.AsTerm.TermAccessionNumber) || (cell.isUnitized && cell.AsUnitized[1].TermAccessionNumber);
};
const isValidHeader = header=>{
  return !header.IsTermColumn || header.fields[0].TermAccessionNumber;
};

const deleteRow = async idx => {
  const table = iProps.assay.GetTable(iProps.active_sheet);
  table.RemoveRow(idx);
  updateTable();
};

const processClick = (e,props)=>{
  if(e.shiftKey){
    selectionEnd(props.value);
  } else {
    selectionStart(props.value);
  }
};

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
        >
          <q-tab name="@RemoveTable@" label='' icon='remove_circle' class='add_table_icon' ripple/>
          <q-tab v-for='s of iProps.sheets' :name="s" :label='s' ripple/>
          <q-tab name="@AddTable@" label='' icon='add_circle' class='add_table_icon' ripple/>
        </q-tabs>

        <br>
        ({{iProps.edit_rIdx0}},{{iProps.edit_cIdx0}}): ({{iProps.edit_rIdx1}},{{iProps.edit_cIdx1}})

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
          selection="single"
        >
          <template v-slot:header-cell="props">
            <q-th
              class='swate_th'
              :props="props"
            >
              <div style="position:relative;">
                <table class='cell_table' @dblclick='editHeader(props.col.header)'>
                  <tr>
                    <td>{{props.col.label}}</td>
                    <td style="text-align:right;" v-if='!props.col.header.IsSingleColumn && !isValidHeader(props.col.header)'>
                      <q-icon name="help" color='grey-6' size='1.3em'>
                        <q-tooltip class='text-body2'>
                          {{ isValidHeader(props.col.header) ? 'Verified Ontology Term: ' + props.col.header.fields[0].TermAccessionNumber : 'Unverified Ontology Term'}}
                        </q-tooltip>
                      </q-icon>
                    </td>
                  </tr>
                </table>
                <q-icon v-if='props.col.idx<props.col.table.ColumnCount-1' size='2em' name='add_circle' class='add_column_icon' color='secondary'></q-icon>
              </div>
            </q-th>
          </template>

          <template v-slot:body-cell="props">
            <q-td :props="props"
              @click="e=>processClick(e,props)"
              :class='isSelected(props.value) ? "cell_selected" : isValid(props.value) ? "cell_valid" : "cell_invalid"'
            >
                <div v-if='props.value.isTerm || props.value.isUnitized'
                  @dblclick="editCell(props.value);"
                >
                  {{props.value.toString()}}
                  <!--<table class='cell_table'>-->
                  <!--  <tr>-->
                  <!--    <td></td>-->
                  <!--    <td style="text-align:right;" v-if='!isValid(props.value)'>-->
                  <!--      <q-icon :name="isValid(props.value) ? 'check_circle' : 'help'" :color='"grey-6"' size='1.3em'>-->
                  <!--        <q-tooltip class='text-body2'>-->
                  <!--          {{ isValid(props.value) ? 'Verified Ontology Term: ' + props.value.fields.slice(-1)[0].TermAccessionNumber : 'Unverified Ontology Term'}}-->
                  <!--        </q-tooltip>-->
                  <!--      </q-icon>-->
                  <!--    </td>-->
                  <!--  </tr>-->
                  <!--</table>-->
                </div>
                <div v-else
                  @input="e=>editFreeForm(e.target.innerText,props.value)"
                  :contenteditable='props.value.isFreeText'
                >
                  {{props.value.toString()}}
                </div>
            </q-td>
          </template>

          <template v-slot:body-selection="scope">
            <div class='cell_axis'></div>
            <!--<q-icon size='2em' name='indeterminate_check_box' color='secondary' style="cursor:pointer;margin-left:-8px;" @click='deleteRow(scope.key)'></q-icon>-->
          </template>

          <!--<template v-slot:bottom-row>-->
          <!--  <tr>-->
          <!--    <td>-->
                <!--<q-icon size='2em' name='add_box' color='secondary' style="cursor:pointer;margin-left:-8px;" @click='appendRow()'></q-icon>-->
          <!--    </td>-->
          <!--    <td colspan='100'></td>-->
          <!--  </tr>-->
          <!--</template>-->
        </q-table>
        <q-card-actions align='right' style="padding:2.1em;">
          <q-btn label="Apply Template" icon='table_chart' color="secondary"/>
          <q-btn label="Update" type="submit" icon='check_circle' color="secondary"/>
          <q-btn label="Reset" type="reset" icon='change_circle' color="secondary" class="q-ml-sm"/>
        </q-card-actions>
      </q-form>
    </q-card>

  </ViewItem>
</template>

<style>

  .swate tr td {
    margin: 0 !important;
    padding: 0 !important;
    background-color: #ebebeb !important;
  }

  .swate th {
    background-color: #ebebeb !important;
  }

  .swate tr td > div {
    outline:0;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.2em 0.5em;
  }

  .cell_axis {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .swate .cell_valid {
    background-color: #fff !important;
  }

  .swate .cell_selected {
    background-color: #dbfffc !important;
  }

  .swate .cell_invalid {
    background-color: #ffecd3 !important;
  }

  .add_column_icon {
    opacity: 0.0000001;
    position:absolute !important;
    right:-0.85em;
    top:0.15em;
  }
  .add_column_icon:hover {
    opacity: 1;
  }

</style>
