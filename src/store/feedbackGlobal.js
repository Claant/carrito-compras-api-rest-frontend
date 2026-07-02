// src/store/feedbackGlobal.js
import { defineStore } from "pinia";

export const useFeedbackGlobalStore = defineStore("feedbackGlobal", {
  state: () => ({
    feedback: null,
    _feedbackTimeout: null
  }),
  actions: {
    showFeedback(type, text) {
      this.feedback = { type, text };
      clearTimeout(this._feedbackTimeout);
      this._feedbackTimeout = setTimeout(() => {
        this.feedback = null;
      }, 3000);
    },
    clearFeedback() {
      this.feedback = null;
      clearTimeout(this._feedbackTimeout);
    }
  }
});
