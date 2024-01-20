<script setup>
import AssistantPanel from './AssistantPanel.vue';
import DoctorPanel from './DoctorPanel.vue';

let selection = ref(0);
const windowItems = [AssistantPanel, DoctorPanel];
let currentWindow = shallowRef(windowItems[0]);

function menu(index) {
  selection.value = index;
  currentWindow.value = windowItems[index];
}
</script>
    
<template>
  <main>
    <section class="panel panel-open">
      <button :class="{ selected: selection == 0 }" @click="menu(0)">Assistant</button>
      <button :class="{ selected: selection == 1 }" @click="menu(1)">Doctor</button>
    </section>
    <section class="container">
      <currentWindow /> 
    </section>
  </main>
</template>


<style lang="css" scoped>
main {
  display: flex;
  flex-direction: column;
  margin: auto;
  max-width: 80%;
  max-height: 90vh;
}

button {
  background-color: #7592be;
  border: none;
  border-radius: 10px 10px 0px 0px;
  padding: 0.7em;
  min-width: 10%;
  cursor: pointer;
  transition: background 0.3s linear;
}

button:hover {
  background-color: #86aadf;
}

button.selected {
  padding: 1em;
  background-color: #cadfff;
  font-weight: bold;
}

.panel {
  flex: 1;
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
}

.container {
  flex: 2;
  background-color: #cadfff;
  padding: 1em;
  border-radius: 0px 20px 20px 20px;
  box-shadow: #19024ea7 3px 7px 5px;
  min-height: 50vh;
  width: 100%;
  margin-bottom: 1em;
  overflow-y: scroll;
}

</style>