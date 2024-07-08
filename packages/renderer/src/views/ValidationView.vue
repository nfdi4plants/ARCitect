<script lang="ts" setup>

import { reactive, watch, onMounted, onUnmounted} from 'vue';

import ViewItem from '../components/ViewItem.vue';
import a_select from '../components/a_select.vue';
import a_btn from '../components/a_btn.vue';
import a_checkbox from '../components/a_checkbox.vue';
import AppProperties from '../AppProperties.ts';
import ArcControlService from '../ArcControlService.ts';

const iProps = reactive({
  core_pairs: [],
  core_names: [],
  core_versions: {},

  package_pairs: [], // [ [name,version] ]
  package_versions: {}, // name -> [versions]
  package_names: [],
});

const init = async ()=>{

  iProps.core_names = ['arc_specification'];
  iProps.core_versions = {'arc_specification': ['2.0.0-draft']};

  const raw_packages = await window.ipc.invoke(
    'InternetService.getWebPageAsJson',
    {
      host: 'avpr.nfdi4plants.org',
      port: 443,
      path: '/api/v1/packages',
      method: 'GET',
      headers: {
        'accept':       'application/json',
        'Content-Type': 'application/json',
        'user-agent':   'node.js'
      }
    }
  );
  const package_versions = {};
  for(let p of raw_packages){
    if(p.Name==='test') continue;
    if(!package_versions.hasOwnProperty(p.Name))
      package_versions[p.Name] = []
    package_versions[p.Name].push([p.MajorVersion,p.MinorVersion,p.PatchVersion,p.PreReleaseVersionSuffix,p.BuildMetadataVersionSuffix]);
  }
  for(let name in package_versions){
    package_versions[name].sort((a,b)=> a[0]===b[0] ? (a[1]===b[1] ? b[2]-a[2] : b[1]-a[1]) : b[0]-a[0]);
    package_versions[name] = package_versions[name].map(a=>a.slice(0,3).join('.') + (a[3]?`-${a[3]}`:'') + (a[4]?`+${a[4]}`:''));
  }

  iProps.package_names = Object.keys(package_versions);
  iProps.package_versions = package_versions;

  const yaml = await window.ipc.invoke(
    'LocalFileSystemService.readFile',
    ArcControlService.props.arc_root + '/.arc/validation_packages.yml'
  );

  parse(yaml);
};

const removePair = i => {
  iProps.package_pairs.splice(i,1);
};

const save = async ()=>{
  // arc_specification: 2.0.0-draft
  // validation_packages:
  //   - name: package1
  //     version: 1.0.0
  //   - name: package2
  //     version: 2.0.0
  //   - name: package3
  let yml = '';

  let yml_core = '';
  for(let pair of iProps.core_pairs){
    if(!pair[0] || !pair[1] || !pair[2]) continue;
      yml_core += `${pair[0]}: ${pair[1]}\n`;
  }
  if(yml_core.length>0)
    yml += yml_core;

  let yml_packages = '';
  for(let pair of iProps.package_pairs){
    if(!pair[0] || !pair[1] || !pair[2]) continue;
    yml_packages += `  - name: ${pair[0]}\n`;
    yml_packages += `    version: ${pair[1]}\n`;
  }
  if(yml_packages.length>0)
    yml += `validation_packages:\n${yml_packages}`;

  await window.ipc.invoke(
    'LocalFileSystemService.writeFile',
    [
      ArcControlService.props.arc_root + '/.arc/validation_packages.yml',
      yml
    ]
  );
};

const parse = async yml=>{
  if(!yml){

    iProps.core_pairs = [[iProps.core_names[0],iProps.core_versions[iProps.core_names[0]],true,iProps.core_names,iProps.core_versions[iProps.core_names[0]]]];
    iProps.package_pairs = [['','',true,iProps.package_names,[]]];
    return;
  }
  iProps.package_pairs = [];

  const lines = yml.split('\n');
  const n = lines.length;

  for(let i=0; i<n; i++){
    const line = lines[i];
    const words = line.split(':');
    if(line.startsWith('  - name:') && i<n-1 && lines[i+1].startsWith('    version:')){
      const name = words[1].trim();
      const version = lines[i+1].split(':')[1].trim();
      iProps.package_pairs.push([
        name,
        version,
        true,
        iProps.package_names,
        name in iProps.package_versions ? iProps.package_versions[name] : []
      ]);
      i++;
    } else if(words[0]==='validation_packages') {
    } else if(words.length>1) {
      const name = words[0].trim();
      const version = words[1].trim();
      iProps.core_pairs.push([
        name,
        version,
        true,
        iProps.core_names,
        name in iProps.core_versions ? iProps.core_versions[name] : []
      ]);
    }
  }

  if(iProps.package_pairs.length<1)
    iProps.package_pairs = [['','',true,iProps.package_names,[]]];

  for(let name of iProps.core_names){
    let found = false;
    for(let p of iProps.core_pairs)
      if(p[0]===name)
        found = true;
    if(!found)
      iProps.core_pairs.push([
        name,
        iProps.core_versions[name][0],
        true, // use
        iProps.core_names, // name suggestions
        iProps.core_versions[name] // version suggestions
      ]);
  }
};

const filter = (source, target, target_idx, val, update, abort)=>{

  update(() => {
    const needle = val.toLocaleLowerCase();
    target[target_idx] = source.filter(v => v.toLocaleLowerCase().indexOf(needle) > -1);
  });
}

const setName = (pair,source,v)=>{
  pair[0] = v;
  pair[1] = v in source ? source[v][0] : '';
};

onMounted(init);

</script>

<template>
  <q-list>
    <ViewItem
      icon="verified"
      label="Validation"
      caption="Validate ARC against Specifications"
      group='mgroup'
      defaultOpened
    >
      <q-card flat>

        <q-card-section>
          <table class='key_value_table'>
            <tr v-for='(pair,i) in iProps.core_pairs'>
              <td>
                <a_checkbox v-model='pair[2]' />
              </td>
              <td>
                <a_select
                  v-model='pair[0]'
                  :options='pair[3]'
                  use-input
                  hide-selected
                  fill-input
                  input-debounce="0"
                  @filter="(val, update, abort)=>filter(iProps.core_names, pair, 3, val, update, abort)"
                  @input-value="v=>setName(pair,iProps.core_versions,v)"
                />
              </td>
              <td>
                <a_select
                  v-model='pair[1]'
                  :options='pair[4]'
                  use-input
                  hide-selected
                  fill-input
                  input-debounce="0"
                  @filter="(val, update, abort)=>filter(pair[0] in iProps.core_versions ? iProps.core_versions[pair[0]] : [], pair, 4, val, update, abort)"
                  @input-value="v=>pair[1]=v"
                />
              </td>
            </tr>
            <tr>
              <td colspan="3" style="padding-top:2em">&nbsp;</td>
            </tr>
            <tr>
              <td class='thh' colspan="3">Custom Validation Packages</td>
            </tr>
            <tr>
              <td style="width:3em;">&nbsp;</td>
              <th>Name</th>
              <th>Version</th>
            </tr>
            <tr v-for='(pair,i) in iProps.package_pairs'>
              <td>
                <q-btn icon='do_not_disturb_on' color='grey-6' flat dense @click='()=>removePair(i)' />
              </td>
              <td>
                <a_select
                  v-model='pair[0]'
                  :options='pair[3]'
                  use-input
                  hide-selected
                  fill-input
                  input-debounce="0"
                  @filter="(val, update, abort)=>filter(iProps.package_names, pair, 3, val, update, abort)"
                  @input-value="v=>setName(pair,iProps.package_versions,v)"
                />
              </td>
              <td>
                <a_select
                  v-model='pair[1]'
                  :options='pair[4]'
                  use-input
                  hide-selected
                  fill-input
                  input-debounce="0"
                  @filter="(val, update, abort)=>filter(pair[0] in iProps.package_versions ? iProps.package_versions[pair[0]] : [], pair, 4, val, update, abort)"
                  @input-value="v=>pair[1]=v"
                />
              </td>
            </tr>
            <tr>
              <td>
                <q-btn icon='add_circle' color='grey-6' flat dense @click='()=>iProps.package_pairs.push(["","",true,iProps.package_names,[]])' />
              </td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <th></th>
              <th colspan="2">
                <a_btn label="Save" icon='verified' @click='save' />
              </th>
            </tr>
          </table>
        </q-card-section>

        <q-card-actions align='center' style="padding:0 2.1em 1em 2.1em;">
        </q-card-actions>
      </q-card>
    </ViewItem>
  </q-list>
</template>

<style>

  .key_value_table {
    width: 100%;
  }

  .key_value_table th {
    text-align: center;
    font-weight: normal;
  }

  .key_value_table td {
    text-align: center;
  }

  .key_value_table .thh{
    font-weight: bold;
    font-size: 1.1em;
  }
</style>
