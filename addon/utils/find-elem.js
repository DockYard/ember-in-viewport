export default function(context) {
  let elem;
  if (
    context.nodeType === Node.ELEMENT_NODE ||
    context.nodeType === Node.DOCUMENT_NODE ||
    context instanceof Window
  ) {
    elem = context
  } else {
    elem = document.querySelector(context);
  }

  return elem;
}
