export function lookupComponent(application, componentName) {
  return application.__container__.lookup(`component:${componentName}`);
}
