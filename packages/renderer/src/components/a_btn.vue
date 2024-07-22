<template>
  <q-btn v-bind="$attrs" color="secondary">
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps || {}"></slot>
    </template>
  </q-btn>
</template>
