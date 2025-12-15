<script lang="ts" setup>

import { reactive, watch, onMounted, onUnmounted, ref, onErrorCaptured} from 'vue';

import ViewItem from '../components/ViewItem.vue';
import a_input from '../components/a_input.vue';
import ConfirmationDialog from '../dialogs/ConfirmationDialog.vue';
import AppProperties from '../AppProperties.ts';
import ArcControlService from '../ArcControlService.ts';

import { VMarkdownEditor } from 'vue3-markdown';
import 'vue3-markdown/dist/vue3-markdown.css';

import { useQuasar } from 'quasar'
const $q = useQuasar();

const editor = ref();
let observer = null;
const iProps = reactive({
  path: '',
  text: '',
  initialized: false,
  base64Images: new Map(),
  container: null,
  link_listener: null
});

const insertText = text=>{
  const textarea = editor.value.editor;
  const position = textarea.selectionStart;
  const before = textarea.value.substring(0, position);
  const after = textarea.value.substring(position, textarea.value.length);
  textarea.value = before + text + after;
  textarea.selectionStart = textarea.selectionEnd = position + text.length;
  iProps.text = textarea.value;
};

const addImages = async ()=>{
  const images = await window.ipc.invoke('LocalFileSystemService.selectAnyFiles');

  if(images.filter(x=>!x.startsWith(ArcControlService.props.arc_root)).length)
    return $q.dialog({
      component: ConfirmationDialog,
      componentProps: {
          title: 'Error',
          msg: 'Images bust be located inside ARC'
      }
    });

  for(let path of images){
    const relPath = getRelativePath(iProps.path,path);
    insertText(`![${relPath.split('/').pop().split('.')[0]}](${relPath})`);
  }
};

const getRelativePath = (a, b)=> {

  const fromParts = a.split('/');
  const toParts = b.split('/');
  fromParts.pop();
  const filename = toParts.pop();
  const length = Math.min(fromParts.length, toParts.length);
  let samePartsLength = length;
  for(let i = 0; i < length; i++)
    if(fromParts[i] !== toParts[i]){
      samePartsLength = i;
      break;
    }

  let outputParts = [];
  for (let i = samePartsLength; i < fromParts.length; i++)
    outputParts.push('..');

  outputParts = outputParts.concat(toParts.slice(samePartsLength));
  return outputParts.concat([filename]).join('/');
};

const replaceLocalImageWithBase64 = async img => {
  if(!img.src.includes('localhost:'))
    return;
  const src = ArcControlService.props.arc_root+'/'+(new URL(img.src)).pathname;
  let base64Image = iProps.base64Images.get(src);
  if(!base64Image){
    base64Image = await window.ipc.invoke('LocalFileSystemService.readImage', src);
    iProps.base64Images.set(src,base64Image);
  }
  img.src = base64Image;
};

const replaceAllLocalImagesWithBase64 = async () => {
  const container = editor.value.box.getElementsByClassName('vmd-view')[0];
  const imgs = container.getElementsByTagName('img');
  for(let img of imgs)
    replaceLocalImageWithBase64(img);
};

const handleNewImages = (mutationsList) => {
  for (const mutation of mutationsList) {
    if (mutation.type === 'childList') {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === 1) { // Element node
          if (node.tagName === 'IMG') {
            replaceLocalImageWithBase64(node)
          } else if (node.querySelectorAll) {
            const imgs = node.querySelectorAll('img');
            imgs.forEach(async img => {
              replaceLocalImageWithBase64(img);
            });
          }
        }
      });
    }
  }
};

const createButton = (icon,callback)=>{
  const iconElement = document.createElement('i');
  iconElement.classList.add('q-icon', 'notranslate', 'material-icons', 'q-item--clickable');
  iconElement.setAttribute('aria-hidden', 'true');
  iconElement.style['font-size'] = '1.4em';
  iconElement.style.cursor = 'pointer';
  iconElement.style.color = '#777';
  iconElement.textContent = icon;
  iconElement.onclick = callback;

  const button = document.createElement('div');
  button.classList.add('vmd-trigger');
  button.appendChild(iconElement);

  return button;
};

const init = async ()=>{
  iProps.path = AppProperties.active_markdown;
  iProps.text = await window.ipc.invoke('LocalFileSystemService.readFile', iProps.path);

  replaceAllLocalImagesWithBase64();

  if(iProps.initialized) return;

  // add custom image upload button
  const menu = editor.value.box.getElementsByClassName('vmd-toolbar')[0];
  const imageButton = menu.children[28];
  const newImageButton = createButton('image',addImages);
  menu.insertBefore(newImageButton,imageButton);
  menu.removeChild(imageButton);

  menu.prepend(createButton('refresh',init));
  menu.prepend(createButton('save',save));

  // add image listener
  iProps.container = editor.value.box.getElementsByClassName('vmd-view')[0];
  observer = new MutationObserver(handleNewImages);
  observer.observe(iProps.container, {
    childList: true,
    subtree: true,
  });

  iProps.initialized = true;
};

const save = async ()=>{
  await window.ipc.invoke('LocalFileSystemService.writeFile', [iProps.path,iProps.text || ' ']);
  init();
};

onErrorCaptured(err=>{
  iProps.container.innerHTML = err;
  return false;
})

onMounted(async ()=>{
  await init();
  iProps.link_listener = e=>{
    if(e.target.tagName.toLowerCase()!=='a') return;
    e.preventDefault();
    window.ipc.invoke('InternetService.openExternalURL', e.target.href);
  };

  iProps.container.addEventListener("click", iProps.link_listener);
});
onUnmounted(async ()=>{
  observer.disconnect();
  iProps.container.removeEventListener("click", iProps.link_listener);
  const fileExists = await window.ipc.invoke('LocalFileSystemService.exists', iProps.path);
  if(fileExists)
    await window.ipc.invoke('LocalFileSystemService.writeFile', [iProps.path,iProps.text || ' ']);
});
watch(() => AppProperties.active_markdown, async (newPath, oldPath) => {
  const fileExists = await window.ipc.invoke('LocalFileSystemService.exists', oldPath);
  if(fileExists)
    await window.ipc.invoke('LocalFileSystemService.writeFile', [oldPath, iProps.text || ' ']);
  await init(); // Load new file
});

</script>

<template>
  <div class='fit markdown_container'>
    <div>
      <ViewItem
        icon="edit_note"
        label="Markdown Editor"
        :caption="iProps.path"
      >
      </ViewItem>
    </div>

    <div class='markdown_container_div'>
      <VMarkdownEditor
        ref='editor'
        v-model="iProps.text"
        locale="en"
      />
    </div>
    <div>&nbsp;</div>
  </div>
</template>

<style>
  .markdown_container {
    display: block;
    display:flex;
    flex-direction: column;
  }

  .markdown_container_div {
    flex-grow:1;
    overflow: hidden;
  }

  .vmd-view {
    border-left: 1px solid #ccc;
  }

  .vmd-view span[aria-hidden="true"] {
    display:none;
  }

</style>
