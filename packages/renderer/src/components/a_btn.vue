<template>
  <q-btn v-bind="$attrs" color="teal" style="font-weight:bold">
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps || {}"></slot>
    </template>
  </q-btn>
</template>
