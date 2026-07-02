<template>
  <div v-if="feedbackStore.feedback" class="feedback-container">
    <transition name="fade" mode="out-in">
      <div
        class="feedback"
        role="alert"
        :class="{
          'bg-success text-white': feedbackStore.feedback.type === 'success',
          'bg-danger text-white': feedbackStore.feedback.type === 'error',
          'bg-info text-dark': feedbackStore.feedback.type === 'info'
        }"
      >
        {{ feedbackStore.feedback.text }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import { useFeedbackGlobalStore } from "../store/feedbackGlobal.js";
const feedbackStore = useFeedbackGlobalStore();
</script>

<style scoped>
.feedback-container {
  position: fixed;
  top: 70px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1050;
}
.feedback {
  padding: 10px 20px;
  border-radius: 5px;
}
</style>
