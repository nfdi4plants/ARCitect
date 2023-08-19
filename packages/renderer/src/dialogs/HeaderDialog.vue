<script lang="ts" setup>
import { useDialogPluginComponent } from 'quasar';
import { reactive, onMounted, watch } from 'vue';

import FormInput from '../components/FormInput.vue';
import Property from '../Property.ts';
import {OntologyAnnotation} from '../../../../lib/ARCC/ISA/ISA/JsonTypes/OntologyAnnotation.js';
import {CompositeCell} from '../../../../lib/ARCC/ISA/ISA/ArcTypes/CompositeCell.js';
import {CompositeHeader} from '../../../../lib/ARCC/ISA/ISA/ArcTypes/CompositeHeader.js';

export interface Props {
  header: Object,
  column: Object
};
const props = defineProps<Props>();

const getType = header=>{
  if(header.IsIOType) return 'IOType';
  if(header.isFactor) return 'Factor';
  if(header.isComponent) return 'Component';
  if(header.isCharacteristic) return 'Characteristic';
  if(header.isParameter) return 'Parameter';
  if(header.isProtocolREF) return 'ProtocolREF';
  return 'Unspecified';
};

const make_optionsFn = tryParentTerm=>{
  return async val => {
    if(val.length<1)
      return [];

    let res = null;
    if(tryParentTerm && iProps.parentTerm.TermAccessionNumber){
      res = await window.ipc.invoke('InternetService.callSwateAPI', {
        method: 'getTermSuggestionsByParentTerm',
        payload: [{
          'n': 5,
          'query': val,
          'parent_term': {
            'Name': iProps.parentTerm.NameText,
            'TermAccession': iProps.parentTerm.TermAccessionNumber
          }
        }]
      });
    } else {
      res = await window.ipc.invoke('InternetService.callSwateAPI', {
        method: 'getTermSuggestions',
        payload: [{
          'n': 5,
          'query': val
        }]
      });
    }

    if(!Array.isArray(res) || res.length<1)
      return [];

    return res.map(i=>OntologyAnnotation.fromString(i.Name,i.FK_Ontology,i.Accession));
  };
};

const iProps = reactive({
  form: [[]],
  term_column_types: [],
  term_column: null,
  name: null,
  unit: null,
  unit_prop: null,
  has_unit: false
});

const init = async ()=>{

  iProps.term_column_types = props.header.cases();
  iProps.term_column = iProps.term_column_types[ props.header.tag ];

  const name = props.header.ToTerm();
  iProps.name = OntologyAnnotation.fromString(name.NameText,name.TermSourceREF,name.TermAccessionNumber);

  let unit_cell = props.column.Cells.length && props.column.Cells[0].isUnitized ? props.column.Cells[0] : null;
  iProps.has_unit = unit_cell!==null;

  iProps.unit = OntologyAnnotation.fromString(
    unit_cell ? unit_cell.fields[1].NameText : '',
    unit_cell ? unit_cell.fields[1].TermSourceREF : '',
    unit_cell ? unit_cell.fields[1].TermAccessionNumber : ''
  );
  iProps.unit_prop = Property(iProps, 'unit', {
    label: 'Unit',
    type: 'ontology',
    optionsFn: make_optionsFn(false),
    disabled: !iProps.has_unit
  });

  iProps.form = [
    [
      Property(iProps, 'term_column', {label:'Column Type', type:'select',options:iProps.term_column_types}),
      Property(iProps, 'name', {
        label: 'Column Name',
        type: 'ontology',
        optionsFn: make_optionsFn(false)
      })
    ],
    [
      Property(iProps, 'has_unit', {label:'Has Unit', type:'checkbox'}),
      iProps.unit_prop,
    ],
  ];
};

watch( ()=>iProps.has_unit, async()=>{iProps.unit_prop.disabled=!iProps.has_unit;} );

onMounted( init );

defineEmits([
  ...useDialogPluginComponent.emits
]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

const onSubmit = async () => {
  onDialogOK(iProps);
};

</script>

<template>
  <q-form
    @submit="onSubmit"
  >
    <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
      <q-card class="q-dialog-plugin" style="min-width:45em;">
        <q-card-section>
          <div class="text-h6">Edit Column</div>
        </q-card-section>

        <q-card-section>
          <div class='row' v-for="(row,i) in iProps.form">
            <div class='col' v-for="(property,j) in row">
              <FormInput :property='property'></FormInput>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" style="margin:0 1.5em 1.5em;">
          <q-btn color="red-8" icon='delete' label="Delete" @click="onDialogOK({delete:true})" class='text-weight-bold'/>
          <q-btn color="secondary" icon='edit' label="Update" type='submit' class='text-weight-bold' />
          <q-btn color="secondary" icon='cancel' label="Cancel" @click="onDialogCancel" class='text-weight-bold'/>
        </q-card-actions>
      </q-card>

    </q-dialog>
  </q-form>
</template>
