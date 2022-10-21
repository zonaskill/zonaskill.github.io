export default function(str) {
  const hiddenInput = document.createElement('input');
  hiddenInput.setAttribute('style', 'visibility: inherit;height: 1px;z-index: -1000;position: absolute;top: 0;');
  hiddenInput.setAttribute('class', 'needsclick');
  hiddenInput.contentEditable = true;
  hiddenInput.value = str;
  document.body.appendChild(hiddenInput);
  if (hiddenInput.select) {
    hiddenInput.select();
  }
  if (hiddenInput.setSelectionRange) {
    hiddenInput.setSelectionRange(0, hiddenInput.value.length);
  }
  const result = document.execCommand('copy');
  hiddenInput.remove();

  if (!result) {
    prompt('请手动复制以下内容', str); // eslint-disable-line no-alert
    return false;
  }

  return true;
}