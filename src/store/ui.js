// stores/ui.js
import { defineStore } from 'pinia';

export const useUiStore = defineStore('ui', {
  state: () => ({
    loading: false   // estado global único
  }),
  actions: {
    setLoading(value) {
      this.loading = value;
    }
  }
});


