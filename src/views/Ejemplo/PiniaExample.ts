import { computed } from 'vue';
import { useExampleStore } from 'src/stores/example';

export const useExample = () => {
  const store = useExampleStore();

  const count = computed(() => store.count);

  const increment = () => store.increment();

  return {
    count,
    increment,
  };
};
