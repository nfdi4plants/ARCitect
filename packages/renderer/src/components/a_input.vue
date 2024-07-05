<template>
  <q-input v-bind="$attrs" dense filled style="padding:0.4em;" hide-bottom-space>
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps || {}"></slot>
    </template>
  </q-input>
</template>
