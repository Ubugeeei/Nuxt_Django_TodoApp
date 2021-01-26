import { reactive } from '@nuxtjs/composition-api'

interface ConfirmDialog {
  isOpened: boolean
  onOk: () => any
  onCancel: () => any
}

export const use = () => {
  // OKボタン押下時のデフォルトの処理
  const DEFAULT_ON_OK = () => {}

  // キャンセルボタン押下時のデフォルトの処理
  const DEFAULT_ON_CANCEL = () => {
    confirmDialog.isOpened = false
  }

  /**
   * 確認ダイアログの開閉フラグと、ボタン押下時の処理を持つReactiveオブジェクト
   */
  const confirmDialog = reactive<ConfirmDialog>({
    isOpened: false,
    onOk: DEFAULT_ON_OK,
    onCancel: DEFAULT_ON_CANCEL
  })

  /**
   * 確認ダイアログの開閉フラグをtrueにする。
   * 引数として、OK/キャンセルボタン押下時の処理を受け取る。
   * @param onOk ダイアログのOK押下時に実行する関数
   * @param onCancel ダイアログのキャンセル押下時に実行する関数
   */
  const openConfirmDialog = ( onOk: () => any, onCancel: () => any = DEFAULT_ON_CANCEL) => {
    confirmDialog.onOk = onOk
    confirmDialog.onCancel = onCancel
    confirmDialog.isOpened = true
  }

  /**
   * 確認ダイアログのを閉じる。
   * ボタン押下時に実行する関数をクリアする。
   */
  const closeConfirmDialog = () => {
    confirmDialog.isOpened = false
    confirmDialog.onOk = DEFAULT_ON_OK
    confirmDialog.onCancel = DEFAULT_ON_CANCEL
  }

  return {
    confirmDialog,
    openConfirmDialog,
    closeConfirmDialog
  }
}
