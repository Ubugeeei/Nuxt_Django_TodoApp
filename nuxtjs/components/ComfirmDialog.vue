<template lang="pug">
  v-dialog.confirm-dialog(:value="isOpened" width="306px" persistent)
    v-sheet
      //- ダイアログのヘッダ
      v-toolbar(dense flat)
        //- タイトル
        span.font-weight-bold(v-text="'caution!'")
        v-spacer
        //- 閉じるボタン
        v-btn(text icon @click.stop="$emit('close', false)")
          v-icon mdi-close
      v-divider.mx-4
      //- 内容表示部
      div.pa-4
        slot
          p(v-text="'delete task?'")
      //- ボタン
      v-card-actions
        v-spacer
        v-btn.attention--text.font-weight-bold(text color="primary" v-text="'OK'" @click="$emit('ok')")
        v-btn.attention--text.font-weight-bold(text color="red" v-text="'cancel'" @click="$emit('cancel');$emit('close', false)")


</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'ConfirmDialog',

  model: {
    prop: 'isOpened',
    event: 'close'
  },

  props: {
    isOpened: {
      type: Boolean,
      default: false
    },
  },
})
</script>
